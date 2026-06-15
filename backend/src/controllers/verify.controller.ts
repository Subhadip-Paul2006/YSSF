import type { Request, Response, NextFunction } from "express";
import * as verifyService from "../services/verify.service.js";
import { env } from "../config/env.js";
import { UnauthorizedError } from "../utils/errors.js";

const SESSION_COOKIE = "yssf-session";
const SESSION_MAX_AGE_MS = 2 * 60 * 60 * 1000; // 2 hours

function setSessionCookie(res: Response, token: string) {
  res.cookie(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "strict",
    secure: env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE_MS,
  });
}

export async function sendOTP(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { email } = req.body;
    const result = await verifyService.sendVerificationOTP(email);
    res.json(result);
  } catch (error) {
    next(error);
  }
}

export async function verifyOTP(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { email, code } = req.body;
    const result = await verifyService.verifyVerificationOTP(email, code);
    res.json(result);
  } catch (error) {
    next(error);
  }
}

export async function sendLink(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { email } = req.body;
    const result = await verifyService.sendVerificationLinkToEmail(email);
    res.json(result);
  } catch (error) {
    next(error);
  }
}

export async function verifyLink(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { token } = req.body;
    const result = await verifyService.verifyVerificationLink(token);
    if (result.token) {
      setSessionCookie(res, result.token);
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
}

export async function status(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) {
      throw new UnauthorizedError("Unauthorized");
    }
    res.json({ emailVerified: req.user.emailVerified });
  } catch (error) {
    next(error);
  }
}
