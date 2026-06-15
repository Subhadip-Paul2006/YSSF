import type { NextConfig } from "next";

const isProduction = process.env.NODE_ENV === "production";

const csp = [
  "default-src 'self'",
  // Inline scripts are needed by Next.js (next/script, hydration). Add a
  // nonce in production via middleware to allow only nonce-tagged inline
  // scripts; in development we keep 'unsafe-inline' / 'unsafe-eval' so the
  // dev server works.
  isProduction
    ? "script-src 'self' 'nonce-{NONCE}' https://js.supabase.com"
    : "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.supabase.com",
  "style-src 'self' 'unsafe-inline'",
  // Allow images from the same origin, Supabase storage, and the seeded
  // local Asset folder. Do NOT add wildcards.
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  // Allow the backend API and Supabase REST endpoints only.
  "connect-src 'self'" +
    (isProduction ? " https://yssfd.vercel.app" : " http://localhost:3001 ws://localhost:3000") +
    " https://*.supabase.co wss://*.supabase.co",
  "frame-ancestors 'none'",
  "form-action 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "upgrade-insecure-requests",
].join("; ");

const nextConfig: NextConfig = {
  output: "standalone",
  async headers() {
    const securityHeaders = [
      { key: "X-Frame-Options", value: "DENY" },
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
      { key: "Content-Security-Policy", value: csp },
      // Cross-origin isolation / Spectre mitigations
      { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
      { key: "Cross-Origin-Resource-Policy", value: "same-site" },
      { key: "Cross-Origin-Embedder-Policy", value: "credentialless" },
    ];

    if (isProduction) {
      securityHeaders.push({
        key: "Strict-Transport-Security",
        value: "max-age=31536000; includeSubDomains; preload",
      });
    }

    return [
      { source: "/(.*)", headers: securityHeaders },
    ];
  },
};

export default nextConfig;
