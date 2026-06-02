import { z } from "zod";

export const PUBLIC_ROLES = ["volunteer", "donor", "ngo_partner"] as const;

export const registerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email format"),
  phone: z.string().optional().nullable(),
  role: z.enum(PUBLIC_ROLES).default("volunteer"),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
});

export const verifyEmailSchema = z.object({
  email: z.string().email("Invalid email format"),
  code: z.string().length(6, "OTP must be 6 digits"),
});

export const registerFullSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email format"),
  phone: z.string().optional().nullable(),
  role: z.enum(PUBLIC_ROLES),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  dob: z.string().optional().nullable(),
  location: z.string().optional().nullable(),
  skills: z.string().optional().nullable(),
  availability: z.string().optional().nullable(),
  emergencyName: z.string().optional().nullable(),
  emergencyPhone: z.string().optional().nullable(),
  panTaxId: z.string().optional().nullable(),
  preferredCauses: z.string().optional().nullable(),
  orgName: z.string().optional().nullable(),
  regNumber: z.string().optional().nullable(),
  website: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  mission: z.string().optional().nullable(),
  employeeId: z.string().optional().nullable(),
  roleLevel: z.string().optional().nullable(),
});
