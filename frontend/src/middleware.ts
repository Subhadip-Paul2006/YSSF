import { NextResponse, type NextRequest } from "next/server";

const SECRET = process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET || "yssf-dev-secret-change-in-production";

function base64UrlToBytes(value: string) {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(value.length / 4) * 4, "=");
  const binary = atob(base64);
  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
}

async function verifyHs256Token(token: string) {
  const [header, payload, signature] = token.split(".");
  if (!header || !payload || !signature) return false;

  const parsedHeader = JSON.parse(new TextDecoder().decode(base64UrlToBytes(header))) as { alg?: string };
  if (parsedHeader.alg !== "HS256") return false;

  const parsedPayload = JSON.parse(new TextDecoder().decode(base64UrlToBytes(payload))) as { exp?: number };
  if (parsedPayload.exp && parsedPayload.exp * 1000 < Date.now()) return false;

  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["verify"]
  );

  return crypto.subtle.verify(
    "HMAC",
    key,
    base64UrlToBytes(signature),
    new TextEncoder().encode(`${header}.${payload}`)
  );
}

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("yssf-session")?.value;

  if (request.nextUrl.pathname.startsWith("/dashboard")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    try {
      const validToken = await verifyHs256Token(token);
      if (validToken) return NextResponse.next();
      return NextResponse.redirect(new URL("/login", request.url));
    } catch {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
