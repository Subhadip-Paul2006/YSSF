import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  JWT_SECRET: z.string().min(8, "JWT_SECRET must be at least 8 characters long"),
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
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("❌ Invalid environment variables:", parsed.error.format());
  process.exit(1);
}

export const env = parsed.data;
