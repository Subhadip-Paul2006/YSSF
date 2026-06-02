import { Router } from "express";
import { z } from "zod";
import * as authController from "../controllers/auth.controller.js";
import { authenticate, optionalAuthenticate } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validation.middleware.js";
import { authLimiter } from "../middlewares/rate-limiter.middleware.js";
import {
  registerSchema,
  loginSchema,
  verifyEmailSchema,
  registerFullSchema,
} from "../validators/auth.schema.js";

export const authRouter = Router();

authRouter.post(
  "/register",
  authLimiter,
  validate(registerSchema, "body", "Invalid input"),
  authController.register
);

authRouter.post(
  "/send-verification",
  authenticate,
  authController.sendVerification
);

authRouter.post(
  "/verify-email",
  authLimiter,
  validate(verifyEmailSchema, "body", "Invalid input"),
  authController.verifyEmail
);

authRouter.post(
  "/resend-verification",
  authLimiter,
  validate(z.object({ email: z.string().email() }), "body"),
  authController.resendVerification
);

authRouter.post(
  "/login",
  authLimiter,
  validate(loginSchema, "body", "Invalid input"),
  authController.login
);

authRouter.get(
  "/me",
  optionalAuthenticate,
  authController.me
);

authRouter.post(
  "/register-full",
  authLimiter,
  validate(registerFullSchema, "body", "Invalid input"),
  authController.registerFull
);

authRouter.post(
  "/google-mock",
  authController.googleMock
);

authRouter.post(
  "/google-supabase",
  validate(
    z.object({
      supabaseToken: z.string().min(1),
      email: z.string().email(),
      name: z.string().min(1),
      avatarUrl: z.string().optional().nullable(),
    }),
    "body"
  ),
  authController.googleSupabase
);

authRouter.post(
  "/signout",
  authController.signout
);
