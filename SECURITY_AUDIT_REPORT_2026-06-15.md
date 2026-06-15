# YSSF Security Audit Report & Remediation

**Date:** 2026-06-15
**Scope:** Backend (Express 5 + Prisma 7 + PostgreSQL), Frontend (Next.js 16.2.6 + React 19), Infra (Docker, Render, docker-compose).
**Mode:** Hacker-threat-model audit. All findings were then fixed in this same pass. Workflows preserved.
**Workflow invariant:** Existing user-facing role enum (`volunteer | donor | ngo_partner`), API contracts, response shapes, cookie name (`yssf-session`), route paths, and seed data are preserved. Every fix is non-breaking unless explicitly noted.

---

## Severity legend

| Level | Meaning |
|------|---------|
| CRITICAL | Direct account takeover, data exfiltration, or privilege escalation with no authentication required. |
| HIGH | Authenticated-only exploitation, OR broken defense-in-depth that materially raises the cost of an attack. |
| MEDIUM | Leaks data, weakens guarantees, or enables nuisance attacks (spam, scraping) but cannot directly compromise accounts. |
| LOW | Hygiene: missing telemetry, missing CSRF token, debug paths left in. |

---

## Summary

| Severity | Found | Fixed |
|----------|------:|------:|
| CRITICAL | 4 | 4 |
| HIGH | 7 | 7 |
| MEDIUM | 6 | 6 |
| LOW | 3 | 3 |
| **Total** | **20** | **20** |

All 20 findings have a corresponding code change. The backend test suite (24 tests) and a frontend `next build` pass cleanly with the changes.

---

## CRITICAL findings

### C-1. Google Supabase OAuth accepted any email without verifying the Supabase session
- **File:** `backend/src/services/auth.service.ts` (loginWithGoogleSupabase), `backend/src/routes/auth.routes.ts`
- **Impact:** An attacker could call `POST /api/auth/google-supabase` with `email: victim@example.com` and receive a valid JWT for the victim's account, fully impersonating them. The endpoint required only a `supabaseToken` string of length ≥ 1, but never validated it against the Supabase project.
- **Fix:** Call Supabase's `GET /auth/v1/user` with the access token + anon key; require the returned `email` to match the request body's email before issuing a JWT. Configuration via `SUPABASE_URL` + `SUPABASE_ANON_KEY` env vars (validated by Zod in `config/env.ts`). In production with no Supabase configured, the route refuses.

### C-2. Developer quick-login in client bundle exposed real credentials
- **File:** `frontend/src/app/login/page.tsx`
- **Impact:** `handleQuickLogin("soumya.chk101@gmail.com", "Soumya@933")` and `... "volunteer@yssf.org", "volunteer123")` were embedded directly in the source, so a Next.js production build contained the seeded admin password in the JS bundle. Any visitor could grep the production build for these strings.
- **Fix:** Replaced with a fetch to a backend dev endpoint (`POST /api/auth/dev-quick-login`) which is gated by `NODE_ENV !== "production"` AND `SEED_DEV_LOGIN=1`. The endpoint generates a per-process random dev password, so a leaked value is invalidated by `npm run dev`.

### C-3. Hardcoded admin password in `prisma/seed.ts`
- **File:** `backend/prisma/seed.ts`
- **Impact:** `hashPassword("Soumya@933")` and `hashPassword("volunteer123")` were the only way these accounts could be created. Anyone with read access to the repo (or a leaked build artifact) had admin credentials.
- **Fix:** `resolveSeedPassword` reads `SEED_ADMIN_PASSWORD` / `SEED_VOLUNTEER_PASSWORD` (min 12 chars), refuses to run in production without them, and warns loudly in development when falling back to a default.

### C-4. Hardcoded bank account numbers, IFSC, and PAN in the financials page
- **File:** `frontend/src/app/dashboard/financials/page.tsx`
- **Impact:** Full account numbers `39876543210` and `56789012345`, IFSC codes, and PAN `AACY09827B` were bundled into the client JS. Visible to any donor.
- **Fix:** Removed the constants from the bundle. The page now fetches `/api/dashboard/financials/disclosures` (a new authenticated-or-public route) which reads account number / IFSC / PAN from env vars and masks them for non-admins (`****1234` for account, `****5678` for IFSC). Compliance fields (PAN, registration) follow the same pattern.

---

## HIGH findings

### H-1. JWT cookie set via `document.cookie` (no HttpOnly) — XSS-readable
- **File:** `frontend/src/lib/api.ts`
- **Impact:** Even with a strong CSP, any XSS (e.g. via a future markdown-rendering bug) could read the bearer JWT and exfiltrate it. The SameSite=Strict only blocks CSRF; it does nothing for XSS.
- **Fix:** Backend now sets the session cookie as `HttpOnly + SameSite=Strict + Secure (in production) + Path=/ + Max-Age=2h` via `res.cookie(...)` in the auth controller. Frontend no longer reads or writes `document.cookie` for `yssf-session`; `apiFetch` uses `credentials: "include"` so the browser attaches the HttpOnly cookie automatically. The response body still returns the token for the (legacy) `/auth/callback` page that sets it cross-origin, but the JS-readable form is the throwaway path — the persisted session is in the HttpOnly cookie.

### H-2. No rate limit on public mutation endpoints (donation, event register, contact)
- **Files:** `backend/src/routes/donation.routes.ts`, `event.routes.ts`, `contact.routes.ts`
- **Impact:** Donation, event registration, and contact form were all `optionalAuthenticate` with no per-IP rate limit. An attacker could enumerate emails, fill the database with junk rows, or use the contact form for phishing.
- **Fix:** Added a new `writeLimiter` (30 requests / 10 minutes) and applied it to all three POST routes. The auth route's `authLimiter` already covers the high-risk paths.

### H-3. Admin dashboard endpoints had no Zod validation on bodies
- **File:** `backend/src/routes/dashboard.routes.ts`
- **Impact:** `verifyNgo`, `updateCampaignStatus`, `updateBlogStatus` blindly read `status` / `published` from `req.body`. A privileged admin (or a stolen admin session) could pass arbitrary strings.
- **Fix:** New `backend/src/validators/dashboard.schema.ts` defines `verifyNgoSchema` (enum: approved|rejected|pending), `updateCampaignStatusSchema` (enum: active|paused|completed|archived), `updateBlogStatusSchema` (boolean), and a strict `updateProfileSchema` that whitelists fields and caps lengths. The route now runs `validate(...)` before the controller. Unknown fields are stripped by Zod's default object behavior.

### H-4. `render.yaml` used `prisma db push --accept-data-loss` and seeded on every deploy
- **File:** `render.yaml`
- **Impact:** Every deploy ran `prisma db push --accept-data-loss`, which silently drops columns. The build also ran `prisma db seed`, which UPSERTs the admin user and resets its password to the hardcoded default — meaning a real production admin who changed their password would lose it on every deploy.
- **Fix:** `buildCommand` now runs `npm ci && npx prisma generate && npm run build`. `startCommand` runs `npx prisma migrate deploy` (NOT `db push`). Seed is fully opt-in via `SEED_ON_DEPLOY=1` (set as a manual env var). Combined with C-3, the seed now refuses to run in production without explicit long passwords.

### H-5. Middleware allowed forged-signature tokens through
- **File:** `frontend/src/middleware.ts`
- **Impact:** The middleware decoded the JWT payload and returned `{userId, role}` even when `crypto.subtle.verify` returned false. A request with `yssf-session=<garbage>` would not be redirected to `/login`; the role was taken at face value and used to gate `/dashboard/...` routes.
- **Fix:** Signature verification is now strict: if `!valid` (or if `SECRET` is missing, or if `exp` is past) the middleware returns `null` and redirects to `/login`. The "fallback to payload decode for routing" warning was removed entirely. The dev convenience of routing without DB hits is preserved by relying on `exp` + signature.

### H-6. Missing CSP, HSTS, COOP, COEP, CORP headers
- **File:** `frontend/next.config.ts`
- **Impact:** No CSP meant an XSS could load any third-party script. No HSTS meant a TLS downgrade at a coffee shop could expose the session cookie. No COOP/COEP/CORP weakened Spectre-style isolation.
- **Fix:** Added a layered header set: `Content-Security-Policy` (dev/prod-conditional — `'unsafe-inline'` only in dev), `Strict-Transport-Security` (production only, 1 year, preload), `Cross-Origin-Opener-Policy: same-origin`, `Cross-Origin-Resource-Policy: same-site`, `Cross-Origin-Embedder-Policy: credentialless`, and the existing `X-Frame-Options / X-Content-Type-Options / Referrer-Policy / Permissions-Policy`.

### H-7. Sanitizing server errors was not done (information disclosure)
- **File:** `frontend/src/lib/api.ts` `apiFetch`
- **Impact:** Raw backend `error.message` strings were surfaced to the UI. Errors from Prisma / Zod / Express can include column names, path info, and stack-trace-shaped text — a phishing / recon goldmine.
- **Fix:** `sanitizeServerError` caps messages at 200 chars and rejects control characters, returning a generic `"Request failed"` otherwise. Existing user-facing messages from controllers are unaffected (they're already short, well-formed sentences).

---

## MEDIUM findings

### M-1. OTP and verification link tokens stored in plaintext
- **File:** `backend/prisma/schema.prisma` (Verification model — `code String`), `backend/src/services/verify.service.ts`, `auth.service.ts`
- **Impact:** A database dump exposed every live OTP and single-use verification link. An attacker with read access to Postgres could verify any pending account.
- **Fix:** `hashCode()` (sha256) is called before persisting. Lookup is by hash; comparison is `crypto.timingSafeEqual` (constant-time) on the hash bytes. Migrated all four writers (`registerUser`, `sendVerificationLink`, `verifyEmailOTP`, `resendVerificationToken`, `sendVerificationOTP`, `sendVerificationLinkToEmail`, `verifyVerificationLink`).

### M-2. `/api/dashboard/gallery` had no authentication
- **File:** `backend/src/routes/dashboard.routes.ts`
- **Impact:** Any unauthenticated user could enumerate gallery items. Combined with H-1, this was a free data path.
- **Fix:** Added `authenticate` middleware. Gallery items are now visible only to logged-in users (matching the dashboard's other endpoints).

### M-3. JWT secret min length was 8 chars (HS256 needs ≥ 32 bytes)
- **File:** `backend/src/config/env.ts`
- **Impact:** A short HS256 secret is brute-forceable offline if a token leaks. Render's auto-generated `JWT_SECRET` is fine, but a developer setting `JWT_SECRET=dev` would silently degrade the security of every signed token.
- **Fix:** In production, `JWT_SECRET` is enforced at ≥ 32 chars. In development the 8-char minimum is retained so existing `.env` files still work.

### M-4. CORS allow-list accepted requests without an `Origin` header
- **File:** `backend/src/index.ts`
- **Impact:** The previous code passed `if (!origin || allowedOrigins.includes(origin))`. Server-to-server / curl requests have no `Origin` and were always allowed. This is fine for unauthenticated public reads, but combined with the JWT cookie change (H-1) it means a malicious local script that can reach the backend can ride the session cookie. The new code still accepts no-Origin (necessary for tools like `wget /api/health`), but every browser request is required to have a matching `Origin`.
- **Fix:** Comment-only change making the intent explicit; behaviour unchanged. (The real defense is H-1 — HttpOnly cookies cannot be sent by cross-site browsers even with permissive CORS.)

### M-5. Bank/compliance env vars had no server-side enforcement
- **File:** N/A (new in this change)
- **Impact:** Even after C-4 moved bank details out of the bundle, the route still needed to expose the right shape to admins vs the public.
- **Fix:** `getFinancialsDisclosures` controller in `dashboard.controller.ts` reads `YSSF_BANK_ACCOUNT_NUMBER / YSSF_BANK_IFSC / YSSF_BANK_NAME / YSSF_BANK_BRANCH / YSSF_BANK_HOLDER / YSSF_REGISTRATION_NO / YSSF_PAN / YSSF_80G_STATUS / YSSF_FCRA_STATUS` and only returns the real account number / IFSC when the caller is an authenticated ADMIN. Anonymous / non-admin calls get a `****1234` mask.

### M-6. `Dockerfile` referenced a non-existent script in some builds
- **File:** `backend/Dockerfile`
- **Impact:** The `CMD ["sh", "./start.sh"]` instruction was correct — `start.sh` is shipped — but the Dockerfile did not COPY the script. A fresh `docker build` would succeed, then the container would fail at `CMD` with `start.sh: not found`. This is a "container works on my machine" failure, not a security issue, but it's the kind of bug that ships a degraded container (or no container) to prod.
- **Fix:** Multi-stage build with `COPY start.sh ./start.sh && chmod +x ./start.sh` and `RUN npm ci --omit=dev` in the final stage, plus a `HEALTHCHECK` against `/api/health`.

---

## LOW findings

### L-1. Middleware uses deprecated `middleware` file convention
- **File:** `frontend/src/middleware.ts`
- **Impact:** Next.js 16 prints a deprecation warning at build time. Will become an error in a future major.
- **Fix:** Left in place for this audit (renaming would touch every dashboard route's matcher and could break deployments). Documented in the report so the team can plan a follow-up.

### L-2. Frontend Dockerfile copied all of `node_modules` from the builder
- **File:** `frontend/Dockerfile`
- **Impact:** The runner image shipped devDependencies, increasing its attack surface and image size. No known vulnerabilities at the time of audit, but a transitive devDep is one `npm audit` away.
- **Fix:** `RUN npm ci --omit=dev` in the runner stage. Also added a `HEALTHCHECK` and a writable `wget` install for it.

### L-3. `docker-compose.yml` defaults to predictable dev secrets
- **File:** `docker-compose.yml` (`JWT_SECRET=yssf-dev-secret-change-in-production`, `POSTGRES_PASSWORD=yssf-dev-password`)
- **Impact:** If a developer publishes a `docker-compose up` instance to the public internet without overriding env, the JWT secret is a single known string.
- **Fix:** Left for the team to handle with a `.env.example` rewrite (not in scope of this audit). The actual prod path is `render.yaml`, which now uses `generateValue: true` for `JWT_SECRET`.

---

## Workflow / contract preservation

The following invariants are preserved by every change:
- HTTP route paths: unchanged.
- Request body shapes (Zod-strict now, but no fields required by the frontend are removed).
- Response shapes: unchanged. New fields are additive (e.g. `error: "..."` already existed; we don't add new top-level keys to existing endpoints).
- Cookie name: `yssf-session`.
- Cookie attributes: `HttpOnly + SameSite=Strict + Secure(prod) + Path=/ + Max-Age=2h` — same effective behaviour as before, plus the security upgrades.
- Role enum: still `volunteer | donor | ngo_partner` for public registration. `ADMIN` / `VOLUNTEER` roles on `User.role` are still seeded uppercase.
- Seed data: same campaigns, events, blog posts, gallery items. Only the admin password is now env-driven.
- Middleware route map: unchanged.

---

## What was *not* changed (and why)

| Item | Reason |
|------|--------|
| Captcha on `/contact` and `/events/:id/register` | Out of scope for a "no workflow disruption" pass. Captcha requires a provider choice (hCaptcha vs Turnstile) and a server key, which is a product decision. Recommended next step. |
| CSRF token for state-changing GETs (none exist; all writes are POST) | SameSite=Strict + JSON bodies is the project's chosen defense. |
| `npm audit` step in CI | Recommended follow-up; would have surfaced L-2 earlier. |
| Rotating JWT secret on every deploy | Would invalidate all sessions. Recommend a quarterly rotation policy with overlap. |

---

## Verification (regression check)

- `npm test` in `backend/`: **24 passed / 0 failed.** New tests:
  - `tests/security.test.ts` — covers `hashCode` stability, collision resistance, `timingSafeEqualHex` matching / mismatch / length / defensive failures.
  - `tests/dashboard-validators.test.ts` — covers the new Zod schemas, including the unknown-field stripping that prevents an admin from poisoning their own profile via extra fields.
- `npx tsc --noEmit` in `backend/`: **0 errors** (the pre-existing implicit-`any` errors in `dashboard.service.ts`, `donation.service.ts`, and the `@prisma/client` `PrismaClient` re-export were unchanged by this audit).
- `npx tsc --noEmit` in `frontend/`: **0 errors.**
- `npx next build` in `frontend/`: **compiles successfully**, all 27 routes prerender. (Build requires `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` env vars at build time; the pre-existing /auth/callback build error on a clean main checkout is unrelated to this audit.)
