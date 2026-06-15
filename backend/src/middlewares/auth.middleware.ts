import type { Request, Response, NextFunction } from "express";
import { jwtVerify } from "jose";
import { env } from "../config/env.js";
import { prisma } from "../utils/prisma.js";
import { UnauthorizedError, ForbiddenError } from "../utils/errors.js";

export const SECRET = new TextEncoder().encode(env.JWT_SECRET);

// Extend Express Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        name: string;
        email: string;
        role: string;
        emailVerified: boolean;
      };
    }
  }
}

const SESSION_COOKIE = "yssf-session";

function extractToken(req: Request): string | null {
  // 1. Bearer token in Authorization header (preferred for non-browser callers)
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.slice(7);
  }
  // 2. HttpOnly session cookie set by the backend on login/register
  // (express's cookie parser is configured globally as a JSON body only;
  // we read the cookie via the signed/unsigned Cookie header here).
  const cookieHeader = req.headers.cookie;
  if (cookieHeader) {
    const parts = cookieHeader.split(/;\s*/);
    for (const part of parts) {
      const eq = part.indexOf("=");
      if (eq < 0) continue;
      const name = part.slice(0, eq).trim();
      if (name === SESSION_COOKIE) {
        return decodeURIComponent(part.slice(eq + 1).trim());
      }
    }
  }
  return null;
}

export async function getUserFromRequest(req: Request) {
  const token = extractToken(req);
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, SECRET);
    const userId = payload.userId as string;
    if (!userId) return null;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        emailVerified: true,
      },
    });
    return user;
  } catch {
    return null;
  }
}

export async function authenticate(
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const user = await getUserFromRequest(req);
    if (!user) {
      throw new UnauthorizedError("Authentication required");
    }
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
}

export async function optionalAuthenticate(
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const user = await getUserFromRequest(req);
    if (user) {
      req.user = user;
    }
    next();
  } catch {
    next();
  }
}

export function requireRole(roles: string[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw new UnauthorizedError("Authentication required");
    }

    const hasRole = roles.map(r => r.toUpperCase()).includes(req.user.role.toUpperCase());
    if (!hasRole) {
      throw new ForbiddenError("Access denied: insufficient permissions");
    }
    next();
  };
}
