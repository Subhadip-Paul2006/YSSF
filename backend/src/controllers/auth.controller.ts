import type { Request, Response, NextFunction } from "express";
import * as authService from "../services/auth.service.js";
import { env } from "../config/env.js";
import { BadRequestError, NotFoundError, UnauthorizedError } from "../utils/errors.js";
import { prisma } from "../utils/prisma.js";

const SESSION_COOKIE = "yssf-session";
const SESSION_MAX_AGE_MS = 2 * 60 * 60 * 1000; // 2 hours

/**
 * Set the session cookie as HttpOnly + SameSite=Strict + Secure (in
 * production). The token is ALSO returned in the response body so the
 * frontend can use it for non-browser callers (e.g. the auth/callback page
 * which still needs to set the cookie cross-origin). HttpOnly is the
 * primary defense: even if a JS bundle later becomes vulnerable to XSS,
 * the cookie value is not reachable from `document.cookie`.
 */
function setSessionCookie(res: Response, token: string) {
  res.cookie(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "strict",
    secure: env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE_MS,
  });
}

function clearSessionCookie(res: Response) {
  res.clearCookie(SESSION_COOKIE, {
    httpOnly: true,
    sameSite: "strict",
    secure: env.NODE_ENV === "production",
    path: "/",
  });
}

export async function register(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const result = await authService.registerUser(req.body);
    setSessionCookie(res, result.token);
    res.status(201).json({
      success: true,
      user: result.user,
      token: result.token,
      verificationRequired: result.verificationRequired,
      message: "Verification link sent to your email. Please verify to continue.",
    });
  } catch (error) {
    next(error);
  }
}

export async function sendVerification(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) {
      throw new UnauthorizedError("Unauthorized");
    }
    await authService.sendVerificationLink(req.user.id, req.user.email, req.user.emailVerified);
    res.json({ success: true, message: "Verification link sent to your email" });
  } catch (error) {
    next(error);
  }
}

export async function verifyEmail(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { email, code } = req.body;
    const result = await authService.verifyEmailOTP(email, code);
    setSessionCookie(res, result.token);
    res.json({
      success: true,
      message: "Email verified successfully",
      user: result.user,
      token: result.token,
    });
  } catch (error) {
    next(error);
  }
}

export async function resendVerification(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { email } = req.body;
    const result = await authService.resendVerificationToken(email);
    res.json(result);
  } catch (error) {
    next(error);
  }
}

export async function login(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { email, password } = req.body;
    const result = await authService.loginUser(email, password);
    setSessionCookie(res, result.token);
    res.json(result);
  } catch (error) {
    next(error);
  }
}

export async function me(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) {
      res.json({ user: null });
      return;
    }
    const user = await authService.getUserById(req.user.id);
    res.json({ user });
  } catch {
    res.json({ user: null });
  }
}

export async function registerFull(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const result = await authService.registerFullUser(req.body);
    setSessionCookie(res, result.token);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}

export async function googleMock(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (env.NODE_ENV === "production") {
      res.status(404).json({ error: "Not found" });
      return;
    }
    const result = await authService.loginWithGoogleMock();
    setSessionCookie(res, result.token);
    res.json({
      success: true,
      user: result.user,
      token: result.token,
    });
  } catch (error) {
    next(error);
  }
}

export async function googleSupabase(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { supabaseToken, email, name, avatarUrl } = req.body;
    const result = await authService.loginWithGoogleSupabase({ supabaseToken, email, name, avatarUrl });
    setSessionCookie(res, result.token);
    res.json({
      success: true,
      user: result.user,
      token: result.token,
    });
  } catch (error) {
    next(error);
  }
}

export function signout(_req: Request, res: Response): void {
  clearSessionCookie(res);
  res.json({ success: true });
}

// Dev-only helper that returns a seeded login's email + a per-process random
// password so dev quick-login buttons in the frontend never need to embed
// credentials in the client bundle. The dev password is regenerated on every
// server restart, so a leaked value is invalidated by `npm run dev`.
//
// Hard requirements:
//   - NODE_ENV !== "production"
//   - SEED_DEV_LOGIN=1 (operators opt in)
//
// In production this route returns 404 and the frontend button is also hidden.
export async function devQuickLogin(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (env.NODE_ENV === "production" || process.env.SEED_DEV_LOGIN !== "1") {
      res.status(404).json({ error: "Not found" });
      return;
    }

    const role = (req.body?.role || "").toLowerCase();
    if (role !== "admin" && role !== "volunteer") {
      throw new BadRequestError("role must be 'admin' or 'volunteer'");
    }

    const email = role === "admin" ? "soumya.chk101@gmail.com" : "volunteer@yssf.org";
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new NotFoundError(`Seeded ${role} user not found; run prisma db seed`);
    }

    // Generate a per-process random dev password. The frontend only sees this
    // value; the operator can also pre-set SEED_ADMIN_PASSWORD /
    // SEED_VOLUNTEER_PASSWORD in dev to a known value.
    const devPassword = process.env.SEED_DEV_LOGIN_PASSWORD || generateRandomDevPassword();

    res.json({
      success: true,
      email,
      password: devPassword,
    });
  } catch (error) {
    next(error);
  }
}

function generateRandomDevPassword(): string {
  // 16 chars, mixed case + digits. Not used in production.
  const chars = "ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
  let out = "Dev@";
  for (let i = 0; i < 12; i++) {
    out += chars[Math.floor(Math.random() * chars.length)];
  }
  return out;
}
