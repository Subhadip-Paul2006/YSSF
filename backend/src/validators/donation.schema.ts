import { z } from "zod";

export const createDonationSchema = z.object({
  amount: z.union([
    z.number().positive("Amount must be positive").max(10000000),
    z.string()
      .transform((v) => Number(v))
      .pipe(z.number().positive("Amount must be positive").max(10000000)),
  ]),
  donorName: z.string().min(1, "Donor name is required"),
  donorEmail: z.string().email("Invalid email format"),
  campaignId: z.string().min(1, "Campaign ID is required"),
});
