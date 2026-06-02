import { Router } from "express";
import * as verifyController from "../controllers/verify.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validation.middleware.js";
import { authLimiter } from "../middlewares/rate-limiter.middleware.js";
import {
  sendOTPSchema,
  verifyOTPSchema,
  verifyLinkSchema,
} from "../validators/verify.schema.js";

export const verifyRouter = Router();

verifyRouter.post(
  "/send-otp",
  authLimiter,
  validate(sendOTPSchema, "body", "Invalid input"),
  verifyController.sendOTP
);

verifyRouter.post(
  "/verify-otp",
  authLimiter,
  validate(verifyOTPSchema, "body", "Invalid input"),
  verifyController.verifyOTP
);

verifyRouter.post(
  "/send-link",
  authLimiter,
  validate(sendOTPSchema, "body", "Invalid input"),
  verifyController.sendLink
);

verifyRouter.post(
  "/verify-link",
  authLimiter,
  validate(verifyLinkSchema, "body", "Invalid input"),
  verifyController.verifyLink
);

verifyRouter.get(
  "/status",
  authenticate,
  verifyController.status
);
