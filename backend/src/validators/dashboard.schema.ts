import { z } from "zod";

export const updateProfileSchema = z.object({
  name: z.string().min(1).max(120).optional(),
  phone: z.string().min(5).max(20).optional().nullable(),
  location: z.string().max(200).optional().nullable(),
  skills: z.string().max(1000).optional().nullable(),
  availability: z.string().max(200).optional().nullable(),
  emergencyName: z.string().max(120).optional().nullable(),
  emergencyPhone: z.string().min(5).max(20).optional().nullable(),
  panTaxId: z.string().max(20).optional().nullable(),
  orgName: z.string().max(200).optional().nullable(),
  regNumber: z.string().max(80).optional().nullable(),
  website: z.string().url().max(300).optional().nullable().or(z.literal("")),
  address: z.string().max(500).optional().nullable(),
  mission: z.string().max(2000).optional().nullable(),
  preferredCauses: z.string().max(500).optional().nullable(),
});

export const verifyNgoSchema = z.object({
  status: z.enum(["approved", "rejected", "pending"]),
});

export const updateCampaignStatusSchema = z.object({
  status: z.enum(["active", "paused", "completed", "archived"]),
});

export const updateBlogStatusSchema = z.object({
  published: z.boolean(),
});

export const deleteUserParamsSchema = z.object({
  id: z.string().min(1, "id is required"),
});
