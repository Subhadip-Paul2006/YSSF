import type { Request, Response, NextFunction } from "express";
import * as authService from "../services/auth.service.js";
import { env } from "../config/env.js";
import { UnauthorizedError } from "../utils/errors.js";

export async function register(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const result = await authService.registerUser(req.body);
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
    const { email, name, avatarUrl } = req.body;
    const result = await authService.loginWithGoogleSupabase({ email, name, avatarUrl });
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
  res.json({ success: true });
}
