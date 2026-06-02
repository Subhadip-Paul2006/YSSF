import type { Request, Response, NextFunction } from "express";
import * as verifyService from "../services/verify.service.js";
import { UnauthorizedError } from "../utils/errors.js";

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
