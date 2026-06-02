import { prisma } from "../utils/prisma.js";
import { NotFoundError } from "../utils/errors.js";

export async function getAllCampaigns(filters: { category?: string; search?: string }) {
  const { category, search } = filters;
  const where: Record<string, any> = {};

  if (category) {
    where.category = category;
  }

  if (search) {
    where.OR = [
      { title: { contains: search } },
      { description: { contains: search } },
    ];
  }

  return await prisma.campaign.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });
}

export async function getCampaignBySlug(slug: string) {
  const campaign = await prisma.campaign.findUnique({
    where: { slug },
    include: {
      donations: {
        select: { amount: true, createdAt: true },
      },
    },
  });

  if (!campaign) {
    throw new NotFoundError("Campaign not found");
  }

  return campaign;
}
