import "dotenv/config";
import { z } from "zod";

const isProduction = process.env.NODE_ENV === "production";

const envSchema = z.object({
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  // HS256 requires at least 32 bytes of entropy. Enforce in production.
  JWT_SECRET: isProduction
    ? z.string().min(32, "JWT_SECRET must be at least 32 characters in production (HS256 requires strong entropy).")
    : z.string().min(8, "JWT_SECRET must be at least 8 characters long"),
  FRONTEND_URL: z.string().url().default("http://localhost:3000"),
  PORT: z.string().default("3001").transform((v) => Number(v)),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),

  // Email settings (optional, but typed)
  EMAIL_HOST: z.string().optional(),
  EMAIL_PORT: z.string().optional().transform((v) => v ? Number(v) : undefined),
  EMAIL_HOST_USER: z.string().optional(),
  EMAIL_HOST_PASSWORD: z.string().optional(),
  DEFAULT_FROM_EMAIL: z.string().optional(),

  // API Email Keys
  RESEND_API_KEY: z.string().optional(),
  BREVO_API_KEY: z.string().optional(),

  // Supabase OAuth (server-side verification of user sessions)
  SUPABASE_URL: z.string().url().optional(),
  SUPABASE_ANON_KEY: z.string().optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("❌ Invalid environment variables:", parsed.error.format());
  process.exit(1);
}

// In production, require Supabase env if we are using the Supabase auth flow.
if (isProduction && (parsed.data.FRONTEND_URL || "").includes("yssfd") && !parsed.data.SUPABASE_URL) {
  console.warn(
    "⚠️  SUPABASE_URL is not set. /api/auth/google-supabase will reject all requests until it is configured."
  );
}

export const env = parsed.data;
