# Youth-Sakti-Social-Foundation

## NGO Website — Finalized Modern Tech Stack

> **A modern NGO ecosystem platform that connects Volunteers, Donors, NGO Partners, and Admins through a single, transparent, role-based web experience.**

---

## 📚 What's In This README

This README is written for a very young student. Every section explains one thing at a time, uses friendly words, and pairs the explanation with a **diagram** you can copy into a Mermaid renderer (GitHub renders Mermaid automatically).

- 🤖 What does the project actually do?
- 🏛️ How is the **whole system** put together? (system architecture)
- 🎨 How does the **frontend** work? (what a user sees)
- ⚙️ How does the **backend** work? (the brain behind the screen)
- 🗄️ How does the **database** work? (where everything is remembered)
- 🌐 How does the **infrastructure** work? (how it all gets delivered to the world)
- 🧑‍💻 Step-by-step **workflows** for the most important user journeys
- 🤖 Where is the **"AI pipeline"?** (an honest answer — and what we have instead)

---

# 🤖 What Does The Project Actually Do?

Imagine an **NGO** (Non-Governmental Organization) that wants to plant trees, run blood donation camps, and teach kids. This website helps them do all of that **online**.

| Who | What they can do |
|---|---|
| **Visitor** | Browse the homepage, read the blog, see events, look at the gallery. No account needed. |
| **Volunteer** | Sign up, register for events, see their impact score. |
| **Donor** | Sign up, donate money to a campaign, see donation history, download receipts. |
| **NGO Partner** | Sign up, propose campaigns and events, get verified by an admin. |
| **Admin** | Manage users, approve NGOs, edit campaigns, read contact messages, see analytics. |

The platform is **role-based**: the website changes what it shows you based on **who you are**.

---

# 🏛️ How Is The Whole System Put Together?

Below is a top-level picture of the whole YSSF system. Every user is in their browser (laptop or phone), the frontend runs in the cloud, the backend runs in another cloud, and the database remembers everything.

```mermaid
flowchart LR
    User[("👤 User<br/>(Browser)")]

    subgraph Cloud["☁️ The Cloud (Vercel + Render)"]
        direction TB
        FE["🎨 Next.js Frontend<br/>(React 19, Tailwind v4, Framer Motion)"]
        BE["⚙️ Express.js Backend<br/>(Node, TypeScript, Zod, JWT)"]
    end

    subgraph Data["🗄️ Data Layer"]
        DB[("🐘 PostgreSQL<br/>(via Prisma ORM)")]
        SB[("🔐 Supabase<br/>(Google OAuth Sessions)")]
    end

    subgraph Services["📨 External Services"]
        SMTP["📧 Email<br/>(Resend / Brevo / SMTP)"]
    end

    User -- "HTTPS" --> FE
    FE -- "REST API<br/>+ JWT Cookie" --> BE
    BE -- "Prisma SQL" --> DB
    FE -- "Google Login" --> SB
    BE -- "Verify Token" --> SB
    BE -- "Send emails" --> SMTP
    SMTP -. "OTP / Verify link" .-> User
```

> **Kid-friendly explanation:** Think of a sandwich. The top slice of bread is the **Frontend** (the pretty screen the user touches). The middle is the **Backend** (the smart brain that decides what to do). The bottom slice is the **Database** (a giant notebook that remembers everything).

---

# 🎨 How Does The Frontend Work?

The frontend is the part of the website the user actually sees. We built it with **Next.js** (a popular React framework) and we use **Tailwind CSS** (a tool that lets us style things by writing short class names).

## Frontend Architecture (Big Picture)

```mermaid
flowchart TB
    Browser["🌐 Browser<br/>(User's device)"]
    Middleware["🛡️ middleware.ts<br/>(JWT verify + role check)"]
    Pages["📄 Pages (app/*)<br/>Home, Login, Register,<br/>Dashboard, Blog, Events..."]
    Components["🧩 Components<br/>Navigation, Footer, Cards, Modals"]
    Lib["📚 lib/<br/>api.ts (REST client)<br/>supabase.ts (OAuth)<br/>AuthContext (session)"]

    Browser -- "URL request" --> Middleware
    Middleware -- "Pass / Redirect /login" --> Pages
    Pages -- "Render" --> Components
    Pages -- "fetch()" --> Lib
    Lib -- "HTTPS REST" --> Backend["⚙️ Backend API"]
    Components --> Pages
```

## Frontend Folder Map

| Folder | What it does |
|---|---|
| `src/app/` | The pages. Each folder is a URL. `app/login/page.tsx` = the login page. |
| `src/components/` | Reusable pieces. `Navigation.tsx` is the top bar on every page. |
| `src/lib/api.ts` | A typed REST client. Every API call goes through here. |
| `src/lib/supabase.ts` | The Google OAuth helper. |
| `src/lib/context/AuthContext.tsx` | Keeps the current user in memory across the whole app. |
| `src/middleware.ts` | Runs **before** any page. Checks the JWT and gates `/dashboard/*`. |

## How a Page Loads (Step by Step)

```mermaid
sequenceDiagram
    autonumber
    actor U as 👤 User
    participant B as 🌐 Browser
    participant MW as 🛡️ Middleware
    participant P as 📄 Page (e.g. /dashboard)
    participant C as 🧩 Components
    participant L as 📚 lib/api.ts
    participant API as ⚙️ Backend

    U->>B: Types URL or clicks a link
    B->>MW: GET /dashboard/donor
    MW->>MW: Read "yssf-session" cookie
    alt Cookie missing or signature bad
        MW-->>B: 307 Redirect → /login
    else Cookie valid
        MW->>MW: Check role matches /dashboard/donor
        alt Role mismatch
            MW-->>B: 307 Redirect → /dashboard/<their-role>
        else Role matches
            MW->>P: Allow → render page
        end
    end
    P->>C: Compose layout (Nav, Header, Cards)
    P->>L: apiGetDashboardStats()
    L->>API: GET /api/dashboard/stats (with cookie)
    API-->>L: { user, stats, recentDonations, ... }
    L-->>P: Parsed JSON
    P-->>B: HTML + CSS + JS
    B-->>U: User sees their dashboard 🎉
```

---

# ⚙️ How Does The Backend Work?

The backend is the **brain**. The frontend asks it questions, and it answers. The brain lives in `backend/src/` and is written in **TypeScript** with **Express 5**.

## Backend Architecture (Big Picture)

```mermaid
flowchart TB
    Client["🌐 Frontend / Mobile / curl"]
    
    subgraph Server["⚙️ Express 5 Server (Node)"]
        direction TB
        Index["index.ts<br/>(app + listen)"]
        Helmet["🛡️ Helmet<br/>(security headers)"]
        CORS["🌍 CORS allow-list"]
        RL["🚦 Rate Limiters<br/>authLimiter / writeLimiter / generalLimiter"]
        Router["🚏 Router (apiRouter)"]
        
        subgraph Auth["/api/auth/*"]
            AR["auth.routes.ts"]
        end
        subgraph Verify["/api/verify/*"]
            VR["verify.routes.ts"]
        end
        subgraph Domain["Other domains"]
            CR["campaign.routes.ts"]
            ER["event.routes.ts"]
            DR["donation.routes.ts"]
            CTR["contact.routes.ts"]
            BR["blog.routes.ts"]
            DAR["dashboard.routes.ts"]
        end

        subgraph Mw["Middlewares"]
            AM["auth.middleware<br/>(JWT verify → req.user)"]
            VM["validation.middleware<br/>(Zod schema check)"]
            EM["error.middleware<br/>(friendly errors)"]
        end

        subgraph Services["Services (business logic)"]
            AS["auth.service<br/>(login, register, JWT)"]
            VS["verify.service<br/>(OTP, link)"]
            CS["campaign / event / donation<br/>contact / blog / dashboard"]
            ES["email.service<br/>(Resend → Brevo → SMTP)"]
        end
    end

    DB[("🐘 PostgreSQL<br/>via Prisma")]
    Email["📨 Resend / Brevo / SMTP"]
    Supa["🔐 Supabase<br/>(Google OAuth)"]

    Client -- "HTTPS REST" --> Index
    Index --> Helmet
    Helmet --> CORS
    CORS --> RL
    RL --> Router
    Router --> Auth
    Router --> Verify
    Router --> Domain

    Auth -- "authenticate / validate" --> AM
    Auth -- "Zod body check" --> VM
    AR -- "call" --> AS
    VR -- "call" --> VS
    Domain -- "authenticate" --> AM
    Domain -- "Zod" --> VM

    AS --> DB
    VS --> DB
    AS --> ES
    VS --> ES
    CS --> DB
    Auth -. "verify session" .-> Supa
    ES -- "send" --> Email
    VM -. "throw" .-> EM
    AM -. "throw" .-> EM
    AS -. "throw" .-> EM
```

## Backend Folder Map

| File / Folder | What it does |
|---|---|
| `src/index.ts` | The entry point. Boots Express, mounts middleware, listens on `PORT`. |
| `src/config/env.ts` | Validates `.env` variables with Zod. App refuses to start if any are missing. |
| `src/middlewares/auth.middleware.ts` | Reads the `yssf-session` cookie, verifies the JWT, loads the user from DB, sets `req.user`. |
| `src/middlewares/validation.middleware.ts` | Runs a Zod schema on `req.body` / `req.query` / `req.params`. |
| `src/middlewares/rate-limiter.middleware.ts` | Three limiters: `authLimiter` (login/signup), `writeLimiter` (donate, register, contact), `generalLimiter` (everything). |
| `src/middlewares/error.middleware.ts` | Catches all errors at the end and turns them into friendly JSON responses. |
| `src/controllers/*` | Thin HTTP layer. Parses the request, calls a service, sends the response. |
| `src/services/*` | The actual business logic (create a user, send an OTP, etc.). |
| `src/utils/prisma.ts` | A shared `PrismaClient` instance. |
| `src/utils/errors.ts` | Custom error classes: `BadRequestError`, `UnauthorizedError`, etc. |
| `src/validators/*` | Zod schemas for every request body. |
| `src/routes/*` | Wire each URL pattern to its controller + middlewares. |
| `prisma/schema.prisma` | The database schema (the shape of every table). |
| `prisma/seed.ts` | Populates the DB with demo campaigns, events, blog posts, and a test user. |

## How a Request Flows Through The Backend

```mermaid
sequenceDiagram
    autonumber
    actor FE as 🎨 Frontend
    participant H as 🛡️ Helmet<br/>(headers)
    participant C as 🌍 CORS
    participant L as 🚦 generalLimiter
    participant R as 🚏 Router
    participant A as 🛡️ authenticate
    participant V as ✅ validate (Zod)
    participant Ctrl as 🧠 Controller
    participant Svc as ⚙️ Service
    participant DB as 🐘 Postgres
    participant E as 📨 Email

    FE->>H: POST /api/donations + cookie + JSON
    H->>C: add CSP/HSTS/COOP/COEP
    C->>L: check origin allow-list
    L->>R: 100 req/min/IP? ok
    R->>A: optionalAuthenticate
    A->>A: read cookie, verify JWT, load user
    A->>V: pass
    V->>V: schema.safeParse(body)
    alt Invalid body
        V-->>FE: 400 "Invalid input"
    else Valid
        V->>Ctrl: req.body = parsed (cleaned)
        Ctrl->>Svc: createDonation({...})
        Svc->>DB: BEGIN TRANSACTION
        DB-->>Svc: donation row + raised counter +1
        Svc-->>Ctrl: donation object
        Ctrl-->>FE: 201 { success: true, donation }
    end

    Note over Svc,E: For registration and verification:<br/>Svc also calls Email service
    Svc->>E: send OTP / verify link
    E-->>User: 📧 email arrives
```

## Authentication Pipeline (the "session" story)

```mermaid
sequenceDiagram
    autonumber
    actor U as 👤 User
    participant FE as 🎨 Frontend
    participant BE as ⚙️ Backend
    participant DB as 🐘 Postgres
    participant SB as 🔐 Supabase

    Note over U,SB: Path A: Email + Password
    U->>FE: type email + password
    FE->>BE: POST /api/auth/login
    BE->>DB: find user by email
    DB-->>BE: row
    BE->>BE: bcrypt.compare(password, hash)
    alt wrong password
        BE-->>FE: 401 "Invalid email or password"
    else correct
        BE->>BE: generate JWT (HS256, 2h, JWT_SECRET)
        BE-->>FE: 200 + Set-Cookie: yssf-session=...;<br/>HttpOnly; SameSite=Strict; Path=/
        FE-->>U: dashboard renders

    Note over U,SB: Path B: Google OAuth
    U->>FE: click "Sign in with Google"
    FE->>SB: supabase.auth.signInWithOAuth("google")
    SB-->>U: Google login popup
    U->>SB: approves
    SB-->>FE: /auth/callback with session.access_token
    FE->>BE: POST /api/auth/google-supabase<br/>{ supabaseToken, email, name }
    BE->>SB: GET /auth/v1/user (server-side verify)
    SB-->>BE: { id, email, user_metadata }
    BE->>BE: require email matches the verified one
    BE->>DB: upsert user (emailVerified=true)
    BE->>BE: generate JWT
    BE-->>FE: 200 + Set-Cookie
    FE-->>U: dashboard renders
    end
```

## Rate Limiter Strategy (the "flood control" story)

```mermaid
flowchart LR
    In["🌐 Incoming request"]
    In --> G["🚦 generalLimiter<br/>100 / minute / IP"]
    G -- ok --> R["🚏 Router picks route"]
    R --> A{Is it an auth<br/>or verify route?}
    A -- yes --> AL["🛡️ authLimiter<br/>20 / 15 minutes / IP"]
    A -- no --> W{Is it donation /<br/>event-register /<br/>contact?}
    W -- yes --> WL["🚦 writeLimiter<br/>30 / 10 minutes / IP"]
    W -- no --> Next["Continue"]
    AL --> Next
    WL --> Next
    Next --> Done["✅ Controller"]
    G -- over limit --> E1["429"]
    AL -- over limit --> E1
    WL -- over limit --> E1
```

> **Kid-friendly explanation:** Rate limiters are like a bouncer at a club door. Even if the line is huge, only 100 people get in per minute. The bad guys can't flood the door.

## Error Handling Pipeline (the "no scary stack traces" story)

```mermaid
flowchart TB
    C["🧠 Controller or Service"]
    Z["❌ Zod parse fails<br/>(invalid body)"]
    B["❌ Throw BadRequestError / UnauthorizedError / NotFoundError / ConflictError / ForbiddenError"]
    U["❌ Unknown error<br/>(DB drop, network)"]

    C -- throw --> E
    Z -- ValidationError --> EM["🚨 errorMiddleware"]
    B -- AppError --> EM
    U -- unknown --> EM

    EM --> Decision{safe known error?}
    Decision -- AppError --> R1["statusCode + json {error: message}"]
    Decision -- Zod/ValidationError --> R2["400 + json {error: first issue}"]
    Decision -- Prisma P2002 --> R3["409 + json {error: 'duplicate'}"]
    Decision -- else --> R4["500 + json {error: 'Internal server error'}"]
```

---

# 🗄️ How Does The Database Work?

We use **PostgreSQL** (a strong, popular database). We talk to it using **Prisma**, a tool that lets us write our queries in TypeScript and not raw SQL.

## Entity-Relationship Diagram

```mermaid
erDiagram
    USER ||--o{ DONATION : "makes"
    USER ||--o{ EVENT_REGISTRATION : "signs up for"
    USER ||--o{ VERIFICATION : "has OTPs/links"
    CAMPAIGN ||--o{ DONATION : "receives"
    EVENT ||--o{ EVENT_REGISTRATION : "collects"

    USER {
        string id PK
        string name
        string email UK
        string phone
        string passwordHash
        string role "volunteer | donor | ngo_partner | ADMIN | VOLUNTEER"
        bool emailVerified
        string dob
        string location
        string skills
        string availability
        string emergencyName
        string emergencyPhone
        string panTaxId
        string orgName
        string regNumber
        string website
        string address
        string mission
        string preferredCauses
        datetime createdAt
        datetime updatedAt
    }

    VERIFICATION {
        string id PK
        string userId FK
        string code "SHA-256 hash, not plaintext"
        string type "email_otp | email_link"
        datetime expiresAt
        bool used
        datetime createdAt
    }

    CAMPAIGN {
        string id PK
        string slug UK
        string title
        string category
        string description
        string fullDescription
        int raised
        int goal
        string imageSrc
        string accentClass
        string progressColor
        string status
    }

    EVENT {
        string id PK
        string slug UK
        string title
        string date
        string time
        string location
        string schoolPartner
        string description
        string fullDescription
        string imageSrc
        string badge
        string badgeColor
        string category
        string status
    }

    DONATION {
        string id PK
        int amount
        string donorName
        string donorEmail
        string campaignId FK
        string userId FK
        string paymentRef
        datetime createdAt
    }

    EVENT_REGISTRATION {
        string id PK
        string name
        string email
        string phone
        string eventId FK
        string userId FK
        string status
        datetime createdAt
    }

    CONTACT_MESSAGE {
        string id PK
        string name
        string email
        string phone
        string subject
        string message
        bool read
        datetime createdAt
    }

    BLOG_POST {
        string id PK
        string slug UK
        string title
        string category
        string excerpt
        string content
        string author
        string authorRole
        string imageSrc
        string tags
        string readTime
        bool published
    }

    GALLERY_ITEM {
        string id PK
        string title
        string category
        string description
        string imageSrc
        string date
    }
```

## How Prisma Talks to Postgres (the "translator" story)

```mermaid
flowchart LR
    TS["🧑‍💻 TypeScript code<br/>(prisma.user.findMany(...))"]
    PC["📦 Prisma Client<br/>(generated, type-safe)"]
    SQL["🔤 SQL query<br/>(SELECT * FROM ... WHERE ...)"]
    PG[("🐘 PostgreSQL")]

    TS --> PC
    PC --> SQL
    SQL --> PG
    PG -- "rows" --> SQL
    SQL -- "JSON" --> PC
    PC -- "typed object" --> TS
```

## Database Migration Story (the "schema change" story)

```mermaid
flowchart LR
    A["🧑‍💻 Edit<br/>prisma/schema.prisma"]
    B["$ npx prisma migrate dev<br/>(local)"]
    C["📂 migration SQL file<br/>(in version control)"]
    D["🚀 On Render:<br/>npx prisma migrate deploy"]
    E["🐘 Production DB updated"]

    A --> B
    B --> C
    C --> D
    D --> E
```

> **Important security note:** The `Verification.code` column stores a **SHA-256 hash**, not the live OTP. So a leaked database does **not** leak live OTPs. This is one of 20 fixes from the security audit (M-1).

---

# 🧑‍💻 Step-By-Step Workflows (The Most Important User Journeys)

These are the **stories** of the most common things a user does on the site. They show every step, from the user clicking a button to the database being updated.

## 1. User Registration Workflow

```mermaid
sequenceDiagram
    autonumber
    actor U as 👤 New User
    participant FE as 🎨 /register
    participant BE as ⚙️ POST /api/auth/register-full
    participant DB as 🐘 Postgres
    participant EM as 📨 Email service

    U->>FE: fill name, email, role, password
    FE->>BE: POST { name, email, role, password, ...roleFields }
    Note over BE: Zod validates body
    BE->>DB: check if email already exists
    alt email taken
        BE-->>FE: 409 "Email already registered"
    else new email
        BE->>BE: bcrypt.hash(password, 12)
        BE->>DB: INSERT INTO User
        BE->>BE: randomToken = crypto.randomBytes(32).hex
        BE->>DB: INSERT INTO Verification (code = sha256(token))
        BE->>EM: sendVerificationLinkEmail(email, verifyUrl)
        EM-->>U: 📧 "Click here to verify"
        BE->>BE: generate JWT
        BE-->>FE: 201 + Set-Cookie + { verificationRequired: true }
        FE-->>U: "Check your email!" banner
    end
```

## 2. Email Verification Workflow (click-the-link story)

```mermaid
sequenceDiagram
    autonumber
    actor U as 👤 User
    participant Mail as 📧 Email
    participant FE as 🎨 /verify?token=...
    participant BE as ⚙️ POST /api/verify/verify-link
    participant DB as 🐘 Postgres

    Mail->>U: email with magic link
    U->>FE: click link
    FE->>BE: POST { token }
    BE->>BE: hashCode(token) = sha256(token)
    BE->>DB: SELECT Verification WHERE code = hash AND used=false AND expiresAt>now
    alt not found
        BE-->>FE: 400 "Invalid or expired link"
    else found
        BE->>BE: timingSafeEqual(verification.code, hashCode(token))
        BE->>DB: TRANSACTION { mark used, user.emailVerified=true }
        BE->>BE: generate JWT
        BE-->>FE: 200 + Set-Cookie + { success: true, user }
        FE-->>U: 🎉 confetti + redirect to /dashboard
    end
```

## 3. Login Workflow

```mermaid
sequenceDiagram
    autonumber
    actor U as 👤 User
    participant FE as 🎨 /login
    participant BE as ⚙️ POST /api/auth/login
    participant DB as 🐘 Postgres

    U->>FE: email + password
    FE->>BE: POST /api/auth/login
    BE->>DB: find user by email
    alt user not found or hash missing
        BE-->>FE: 401 "Invalid email or password"
    else user found
        BE->>BE: bcrypt.compare(password, hash)
        alt wrong password
            BE-->>FE: 401 "Invalid email or password"
        else correct
            BE->>BE: generate JWT (HS256, 2h)
            BE-->>FE: 200 + Set-Cookie: yssf-session=...;<br/>HttpOnly; SameSite=Strict; Path=/
            Note over FE: Browser stores HttpOnly cookie.<br/>JS cannot read it (XSS-safe).
            alt emailVerified=false
                FE-->>U: warning: "Please verify your email"
            else emailVerified=true
                FE-->>U: redirect to /dashboard/<role>
            end
        end
    end
```

## 4. Donation Workflow

```mermaid
sequenceDiagram
    autonumber
    actor U as 👤 Donor
    participant FE as 🎨 Homepage donate widget
    participant BE as ⚙️ POST /api/donations
    participant DB as 🐘 Postgres

    U->>FE: choose amount, pick campaign, fill name/email
    FE->>BE: POST { amount, donorName, donorEmail, campaignId }
    Note over BE: writeLimiter (30/10min)<br/>Zod validation
    BE->>DB: SELECT Campaign WHERE id = ?
    alt campaign not found
        BE-->>FE: 404 "Campaign not found"
    else found
        BE->>DB: BEGIN TRANSACTION
        BE->>DB: INSERT INTO Donation
        BE->>DB: UPDATE Campaign SET raised = raised + amount
        BE->>DB: COMMIT
        DB-->>BE: donation row
        BE-->>FE: 201 { donation }
        FE-->>U: 🎉 confetti, "Thank you!" modal
    end
```

## 5. Event Registration Workflow

```mermaid
sequenceDiagram
    autonumber
    actor U as 👤 Volunteer
    participant FE as 🎨 /events/[slug]
    participant BE as ⚙️ POST /api/events/:slug/register
    participant DB as 🐘 Postgres

    U->>FE: click "Register" + fill name/email/phone
    FE->>BE: POST { name, email, phone }
    Note over BE: writeLimiter (30/10min)
    BE->>DB: find event by slug
    alt event not found
        BE-->>FE: 404 "Event not found"
    else found
        BE->>DB: existing registration for this email + event?
        alt already registered
            BE-->>FE: 409 "You have already registered"
        else new
            BE->>DB: INSERT INTO EventRegistration
            DB-->>BE: row
            BE-->>FE: 201 { registration }
            FE-->>U: "You're in! See you there." ✅
        end
    end
```

## 6. Contact Form Workflow

```mermaid
sequenceDiagram
    autonumber
    actor U as 👤 Visitor
    participant FE as 🎨 /contact
    participant BE as ⚙️ POST /api/contact
    participant DB as 🐘 Postgres
    participant Admin as 🛡️ Admin dashboard

    U->>FE: fill name, email, subject, message
    FE->>BE: POST { name, email, subject, message }
    Note over BE: writeLimiter + Zod
    BE->>DB: INSERT INTO ContactMessage
    DB-->>BE: id
    BE-->>FE: 201 { success: true, id }
    FE-->>U: "We received your message."
    Note over Admin: Admin later logs in, opens<br/>admin dashboard, calls<br/>GET /api/contact?read=false
    Admin->>BE: GET /api/contact
    BE->>DB: SELECT * FROM ContactMessage
    DB-->>BE: rows
    BE-->>Admin: JSON
```

## 7. Admin Manages Users Workflow

```mermaid
sequenceDiagram
    autonumber
    actor A as 🛡️ Admin
    participant FE as 🎨 /dashboard/admin
    participant BE as ⚙️ /api/dashboard/*
    participant DB as 🐘 Postgres

    A->>FE: open admin page
    FE->>BE: GET /api/dashboard/admin-stats (cookie)
    Note over BE: authenticate + requireRole(ADMIN)
    BE->>DB: counts + recent rows
    BE-->>FE: stats
    A->>FE: click "Verify NGO" on a user's row
    FE->>BE: PUT /api/dashboard/users/:id/verify-ngo { status: "approved" }
    Note over BE: Zod enum: approved|rejected|pending
    BE->>DB: UPDATE User SET status/emailVerified
    BE-->>FE: 200 { user }
    FE-->>A: ✅ "Approved"
```

---

# 🤖 Where Is The "AI Pipeline"?

**Honest answer:** The YSSF project **does not contain an AI / ML / LLM pipeline today**.

We searched the source code (`backend/src`, `frontend/src`, `prisma/`, configs) and there is no model file, no `openai` / `anthropic` / `huggingface` dependency, no inference endpoint, no vector store, no embeddings, no recommendation engine. The `package.json` files confirm it: the only third-party service integrations are **Supabase** (auth), **Resend / Brevo / SMTP** (email), and **PostgreSQL** (data).

So what people sometimes call "pipelines" in this project are the **automation pipelines** — strict, deterministic, no-AI workflows that move data around and send messages. We have **four** of them:

## Pipeline 1: Email Pipeline (transactional, multi-provider failover)

```mermaid
flowchart TD
    Trigger["Trigger:<br/>register, verify, contact, etc."]
    EmailService["📨 email.service.ts"]
    P1{"Provider 1:<br/>Resend HTTP API<br/>(if RESEND_API_KEY)"}
    P2{"Provider 2:<br/>Brevo HTTP API<br/>(if BREVO_API_KEY)"}
    P3{"Provider 3:<br/>SMTP via nodemailer<br/>(if EMAIL_HOST etc.)"}
    P4["Provider 4 (dev only):<br/>console.log the email body"]

    Trigger --> EmailService
    EmailService --> P1
    P1 -- "ok" --> Done["✅ Email sent"]
    P1 -- "fail" --> P2
    P2 -- "ok" --> Done
    P2 -- "fail" --> P3
    P3 -- "ok" --> Done
    P3 -- "fail + dev" --> P4
    P3 -- "fail + prod" --> Failed["❌ Logged, ignored"]
    P4 --> Done
```

> **Kid-friendly explanation:** It's like having **four mail carriers**. We give the package to the first one. If they say "I'm busy," we give it to the second, and so on. The first one that says "OK, sent it" wins.

## Pipeline 2: OTP / Verification Link Pipeline

```mermaid
flowchart LR
    A["User wants to verify"]
    B["Backend generates<br/>crypto.randomInt(100000,999999)<br/>for OTP, or randomBytes(32).hex for link"]
    C["hash = sha256(secret)"]
    D["DB:<br/>INSERT Verification (code=hash, type, expiresAt)"]
    E["Email Pipeline sends the plaintext"]
    F["User submits code"]
    G["Backend hashes it, looks up by hash"]
    H{"hash matches<br/>+ not used<br/>+ not expired?"}
    I["Mark used.<br/>Set user.emailVerified=true."]
    J["Issue JWT, set HttpOnly cookie."]

    A --> B --> C --> D --> E
    E --> F --> G --> H
    H -- yes --> I --> J
    H -- no  --> X["400 'Invalid or expired'"]
```

> **Kid-friendly explanation:** We never store the secret itself. We store its **fingerprint** (a hash). So even if someone steals the database, they can't fake the secret.

## Pipeline 3: Dev Quick-Login Pipeline (development-only helper)

```mermaid
flowchart LR
    A["Dev clicks 'Quick login' in /login"]
    B["POST /api/auth/dev-quick-login { role }"]
    C{"NODE_ENV=='production'<br/>OR SEED_DEV_LOGIN != '1'?"}
    D["404 Not Found"]
    E["Find seeded user by role"]
    F["Generate per-process random password<br/>(or use SEED_DEV_LOGIN_PASSWORD)"]
    G["Return { email, password }"]
    H["Frontend calls /api/auth/login with those"]

    A --> B --> C
    C -- yes --> D
    C -- no  --> E --> F --> G --> H
```

> **Kid-friendly explanation:** In real life, we never embed passwords in the website. In dev, we want a fast way to log in. This pipeline only exists when the operator opts in (`SEED_DEV_LOGIN=1`) and is **disabled in production**.

## Pipeline 4: Donation Payment Pipeline (simulated)

```mermaid
flowchart LR
    A["Donor fills donate form"]
    B["POST /api/donations"]
    C["writeLimiter + Zod"]
    D["DB transaction:<br/>INSERT donation + UPDATE campaign.raised"]
    E["paymentRef = 'SUCCESS-<timestamp>'"]
    F["201 { donation }"]
    G["🎉 confetti"]

    A --> B --> C --> D --> E --> F --> G
```

> **Note:** The current build uses a **simulated** payment (the `paymentRef` is auto-generated and the UI shows a Razorpay-simulated checkout modal in some flows). To plug in a real gateway later, the only file that needs to change is the donation service: replace the simulated success with a call to the gateway's `create-order`, `verify-signature`, and a webhook. The rest of the pipeline stays the same.

## "What would an AI pipeline look like in the future?" (placeholder)

If/when an AI feature is added, the recommended shape is:

```mermaid
flowchart LR
    UI["🎨 Frontend (chat / form)"]
    API["⚙️ /api/ai/* (Express)"]
    GW["🤖 Model Gateway<br/>(OpenAI / Anthropic / local)"]
    Cache["🗄️ Redis cache<br/>(dedupe + rate-limit)"]
    DB[("🐘 Postgres<br/>(audit log)")]
    Guard["🛡️ Guardrails<br/>(length cap, PII redaction,<br/>topic allow-list)"]

    UI --> API
    API --> Guard
    Guard --> Cache
    Guard --> GW
    GW --> Guard
    Guard --> API
    API --> DB
    API --> UI
```

> **Why this shape?** Every AI call goes through the **backend**, not the browser — so the API key never reaches the user. The **guardrails** filter and cap the output. The **cache** makes repeat questions cheap. The **audit log** is a regular Postgres table so we can prove the model never leaked PII.

---

# 🌐 How Does The Infrastructure Work? (How It Gets Delivered To The World)

## Local Development (docker-compose)

```mermaid
flowchart TB
    Dev["🧑‍💻 Developer"]
    DC["🐳 docker-compose up"]
    FE["🎨 frontend container<br/>localhost:3000"]
    BE["⚙️ backend container<br/>localhost:3001"]
    PG[("🐘 postgres:16-alpine<br/>container")]

    Dev --> DC
    DC --> FE
    DC --> BE
    DC --> PG
    FE -- "NEXT_PUBLIC_API_URL=http://localhost:3001" --> BE
    BE -- "DATABASE_URL" --> PG
```

## Production (Render + Vercel)

```mermaid
flowchart TB
    User["👤 User on the internet"]
    Vercel["▲ Vercel<br/>(hosts the Next.js frontend)"]
    Render["🟦 Render<br/>(hosts the Express backend)"]
    PGdb[("🐘 Render Postgres<br/>(managed)")]
    GHub[("📦 GitHub<br/>(source of truth)")]

    User -- "HTTPS" --> Vercel
    Vercel -- "REST + cookie" --> Render
    Render -- "Prisma SQL" --> PGdb
    GHub -- "git push main" --> Render
    GHub -- "git push main" --> Vercel

    subgraph GH["GitHub Actions CI"]
        T1["backend:<br/>npm ci + prisma generate + npm test + npm run build"]
        T2["frontend:<br/>npm ci + npm run build"]
    end
    GHub --> GH
```

## Deployment Sequence (the "git push to live" story)

```mermaid
sequenceDiagram
    autonumber
    actor Dev as 🧑‍💻 Developer
    participant GH as 📦 GitHub
    participant CI as 🧪 GitHub Actions
    participant V as ▲ Vercel
    participant R as 🟦 Render
    participant DB as 🐘 Postgres

    Dev->>GH: git push origin main
    GH-->>CI: trigger workflow
    CI->>CI: backend: install + prisma generate + test + build
    CI->>CI: frontend: install + build
    alt CI fails
        CI-->>Dev: ❌ red check
    else CI passes
        CI-->>Dev: ✅ green check
        GH-->>V: webhook → redeploy
        GH-->>R: webhook → redeploy
        R->>R: build: npm ci + npx prisma generate + npm run build
        R->>R: start: npx prisma migrate deploy && node dist/index.js
        R->>DB: run migration SQL
        DB-->>R: schema updated
        R-->>R: app listening on :3001
        V-->>V: build + deploy Next.js
        V-->>Dev: ✅ live
    end
```

---

# 🛡️ Security Workflow (the "trust, but verify" story)

A summary of the defense layers a hacker would have to bypass. (For the full audit, see `SECURITY_AUDIT_REPORT_2026-06-15.md`.)

```mermaid
flowchart TB
    Hacker["🕵️ Attacker"]
    H1["🚦 Rate Limiters<br/>(writeLimiter, authLimiter)"]
    H2["🌍 CORS allow-list"]
    H3["🛡️ Helmet headers<br/>(CSP, HSTS, COOP, COEP, CORP)"]
    H4["🛡️ Middleware JWT verify<br/>(HS256, strict signature)"]
    H5["🛡️ requireRole(['ADMIN'])<br/>(role-based access)"]
    H6["✅ Zod validation<br/>(body, query, params)"]
    H7["🔐 sha256 + timingSafeEqual<br/>(OTP / verification link)"]
    H8["🍪 HttpOnly + SameSite=Strict<br/>(session cookie)"]
    H9["🚨 errorMiddleware<br/>(no stack traces leak)"]
    H10["📦 Supabase server-side verify<br/>(Google OAuth)"]

    Hacker --> H1
    H1 -- "ok" --> H2
    H2 -- "ok" --> H3
    H3 -- "ok" --> H4
    H4 -- "ok" --> H5
    H5 -- "ok" --> H6
    H6 -- "ok" --> H7
    H7 -- "ok" --> H8
    H8 -- "ok" --> H9
    H9 -- "ok" --> H10
    H1 -- "spam" --> S1["429 rate limit"]
    H2 -- "wrong origin" --> S2["CORS error"]
    H3 -- "XSS payload" --> S3["CSP block"]
    H4 -- "forged token" --> S4["redirect /login"]
    H5 -- "wrong role" --> S5["403 Forbidden"]
    H6 -- "bad body" --> S6["400 Invalid input"]
    H7 -- "wrong code" --> S7["400 Bad request"]
    H8 -- "XSS read" --> S8["cookie unreadable from JS"]
    H9 -- "Prisma error" --> S9["500 generic message"]
    H10 -- "fake email" --> S10["401 Supabase mismatch"]
```

---

# 📋 Suggested Folder Structure

```txt
yssf/
├── backend/
│   ├── src/
│   │   ├── config/         # env.ts (Zod-validated config)
│   │   ├── controllers/    # HTTP layer
│   │   ├── middlewares/    # auth, validation, rate-limit, error
│   │   ├── routes/         # URL → controller wiring
│   │   ├── services/       # business logic
│   │   ├── tests/          # node:test unit tests
│   │   ├── utils/          # errors, prisma
│   │   ├── validators/     # Zod schemas
│   │   └── index.ts        # entry
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.ts
│   ├── Dockerfile
│   ├── start.sh
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── app/            # Next.js pages (one folder per URL)
│   │   ├── components/     # Reusable UI
│   │   ├── lib/
│   │   │   ├── api.ts      # typed REST client
│   │   │   ├── supabase.ts # OAuth helper
│   │   │   └── context/    # AuthContext
│   │   └── middleware.ts   # gate /dashboard/*
│   ├── next.config.ts      # CSP, HSTS, etc.
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml
├── render.yaml
├── .github/workflows/ci.yml
├── README.md               # ← you are here
├── DESIGN.md               # design system
└── SECURITY_AUDIT_REPORT_2026-06-15.md
```

---

# 🚀 Development Philosophy

This technology stack is designed to provide:

- High Performance (Vercel edge + standalone Next.js)
- Modern Scalable Architecture (Express 5 + Prisma 7 + PostgreSQL)
- Strong Security (HttpOnly cookies, hashed OTPs, strict CSP, Zod-everywhere)
- Accessibility Compliance (focus rings, ARIA labels, semantic HTML)
- SEO Optimization (Next.js metadata API, prerendered pages)
- Smooth User Experience (Framer Motion, confetti, soft animations)
- Clean Developer Workflow (TypeScript end-to-end, typed REST client)
- Long-Term Maintainability (Zod schemas, role-based middlewares, audit logs)

The architecture balances startup-level scalability with NGO-focused usability and transparency.

---

# 🌟 Platform Vision

Youth-Sakti-Social-Foundation is designed as a modern NGO Ecosystem Platform that connects:

- Volunteers
- Donors
- NGO Partners
- Administrators
- Communities

through a centralized digital platform focused on:

- Social impact
- Transparency
- Community engagement
- Event management
- Donation systems
- Real-time participation

---

# 🎯 Main Product Goals

| Goal | Purpose |
|---|---|
| Community Building | Connect volunteers and NGOs |
| Transparency | Public trust through reports and analytics |
| Donation Management | Seamless event-based donations |
| Event Coordination | Organize NGO activities efficiently |
| Awareness | Showcase ongoing social impact |
| Scalability | Future-ready architecture |
| Accessibility | Inclusive platform design |
| Performance | Fast and responsive user experience |

---

# 🧭 Core Platform Philosophy

```txt
Frontend = Experience
Backend  = Support System
Database = Memory
```

The platform follows a:
- Frontend-first architecture
- Minimal backend complexity
- Strict type safety end-to-end
- Scalable managed-service ecosystem

---

# 👥 User Roles Architecture

| Role | Responsibilities |
|---|---|
| Visitor | Browse the public site (no account). |
| Volunteer | Sign up, register for events, see impact. |
| Donor | Sign up, donate, see history and receipts. |
| NGO Partner | Sign up, propose campaigns, get verified by admin. |
| Admin | Manage users, approve NGOs, moderate content. |

---

# 🔐 Authentication Providers

| Method | Usage |
|---|---|
| Google OAuth (Supabase) | Fast onboarding, server-side verified |
| Email + Password (bcrypt) | Standard, JWT cookie session |
| Email Verification Link | 24h single-use SHA-256-hashed token |
| 6-digit Email OTP | 10-min single-use SHA-256-hashed code |

---

# 🗃️ Database Design Overview

| Table | Purpose |
|---|---|
| `User` | User accounts (admin / volunteer / donor / ngo_partner) |
| `Verification` | One-time email OTPs and verification links (hashed) |
| `Campaign` | Fundraising campaigns |
| `Event` | Volunteer events / camps |
| `Donation` | Donor contributions to campaigns |
| `EventRegistration` | Volunteer sign-ups to events |
| `ContactMessage` | Messages from the contact form |
| `BlogPost` | Articles / news |
| `GalleryItem` | Photos with caption and category |

---

# ⚡ Performance Optimization

| Feature | Purpose |
|---|---|
| Lazy Loading | Faster page rendering |
| Image Optimization | Reduced load times (`next/image`) |
| Edge Delivery | Faster media serving on Vercel |
| SSR/SSG | SEO + performance |
| Code Splitting | Better scalability |

---

# 🛡️ Security Architecture (summary)

| Feature | Purpose |
|---|---|
| HttpOnly + SameSite=Strict + Secure cookie | XSS-resistant session |
| HS256 JWT (2h) | Stateless session |
| bcrypt (cost 12) | Password hashing |
| SHA-256 + timingSafeEqual | OTP / verification token storage |
| Zod validation everywhere | Strict input contracts |
| Rate limiters (auth / write / general) | Spam and credential-stuffing defense |
| Helmet + CSP + HSTS + COOP/COEP/CORP | Browser-side hardening |
| Supabase server-side verify | OAuth cannot be forged |
| Env-driven seed password | No default credentials in production |

For the full 20-finding audit, see `SECURITY_AUDIT_REPORT_2026-06-15.md`.

---

# 📊 Analytics & Monitoring (planned)

| Tool | Purpose |
|---|---|
| Sentry | Error tracking |
| PostHog | User analytics |
| Vercel Analytics | Performance monitoring |

---

# 🛣️ Roadmap

- **Phase 1 — MVP** ✅ Landing, Auth, Events, Donations, Calendar, Admin, Blog.
- **Phase 2 — Community** ✅ Likes, comments, NGO partnerships, notifications, gallery.
- **Phase 3 — Advanced** 🟡 Transparency dashboards, advanced analytics, AI recommendations (see AI pipeline section above), realtime collaboration, smart notifications.

---

# 🌱 Future Scalability Vision

- AI-powered NGO recommendations
- Realtime volunteer coordination
- Mobile application
- Multi-language support
- NGO verification system (KYC)
- Blockchain transparency logs
- Live donation tracking
- AI chatbot assistant

---

# ✨ Final Product Vision

Youth-Sakti-Social-Foundation aims to become:

```txt
A scalable NGO collaboration and social impact ecosystem
focused on transparency, participation, and community-driven change.
```

---

# 💎 Core Values

- Transparency
- Accessibility
- Community
- Scalability
- Inclusivity
- Social Impact
- Trust
- Modern User Experience

---

# 📎 Appendix: How To Read The Diagrams

Every diagram in this README is **Mermaid** syntax. Mermaid is a language that turns text into pictures. You can paste any of the blocks into:

- The GitHub preview of this README (renders automatically)
- The official Mermaid editor: https://mermaid.live
- The VS Code "Markdown Preview Mermaid Support" extension

The four main diagram types used here are:

| Type | When used | Example |
|---|---|---|
| `flowchart` | Showing a process or system overview | Frontend architecture |
| `sequenceDiagram` | Showing messages between actors over time | Login flow |
| `erDiagram` | Showing database tables and their relationships | Database schema |
| `stateDiagram` | Showing different states something can be in | (not used here) |

> **Tip for young students:** If a diagram feels too big, focus on the **arrows first** (who sends what to whom) and read the **labels** second.
