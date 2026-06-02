import { z } from "zod";

export const verifyOTPSchema = z.object({
  email: z.string().email("Invalid email format"),
  code: z.string().length(6, "OTP must be 6 digits"),
});

export const sendOTPSchema = z.object({
  email: z.string().email("Invalid email format"),
});

export const verifyLinkSchema = z.object({
  token: z.string().min(1, "Token is required"),
});
