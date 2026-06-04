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

  return await prisma.$transaction(async (tx) => {
    // Create the donation record
    const donation = await tx.donation.create({
      data: {
        amount,
        donorName,
        donorEmail,
        campaignId,
        userId,
        paymentRef: `SUCCESS-${Date.now()}`,
      },
      include: { campaign: true },
    });

    // Increment campaign's raised total
    await tx.campaign.update({
      where: { id: campaignId },
      data: {
        raised: {
          increment: amount,
        },
      },
    });

    return donation;
  });
}
