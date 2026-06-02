import { prisma } from "../utils/prisma.js";
import { NotFoundError } from "../utils/errors.js";

export async function getDonations({
  user,
  campaignId,
}: {
  user: { id: string; role: string };
  campaignId?: string;
}) {
  const where: Record<string, any> = {};

  if (user.role.toUpperCase() === "ADMIN") {
    if (campaignId) {
      where.campaignId = campaignId;
    }
  } else {
    where.userId = user.id;
  }

  return await prisma.donation.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: { campaign: true },
  });
}

export async function createDonation({
  amount,
  donorName,
  donorEmail,
  campaignId,
  userId,
}: {
  amount: number;
  donorName: string;
  donorEmail: string;
  campaignId: string;
  userId: string | null;
}) {
  const campaign = await prisma.campaign.findUnique({
    where: { id: campaignId },
  });

  if (!campaign) {
    throw new NotFoundError("Campaign not found");
  }

  return await prisma.donation.create({
    data: {
      amount,
      donorName,
      donorEmail,
      campaignId,
      userId,
      paymentRef: `PENDING-${Date.now()}`,
    },
    include: { campaign: true },
  });
}
