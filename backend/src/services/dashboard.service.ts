import { prisma } from "../utils/prisma.js";
import { NotFoundError } from "../utils/errors.js";

const userSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  phone: true,
  location: true,
  skills: true,
  availability: true,
  createdAt: true,
};

export async function getUserStats(userId: string) {
  const dbUser = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      ...userSelect,
      donations: { include: { campaign: true }, orderBy: { createdAt: "desc" } },
      eventRegistrations: { include: { event: true } },
    },
  });

  if (!dbUser) {
    throw new NotFoundError("User not found");
  }

  const totalDonated = dbUser.donations.reduce((sum, d) => sum + d.amount, 0);
  const eventsAttended = dbUser.eventRegistrations.length;

  return {
    user: dbUser,
    stats: {
      totalDonated,
      eventsAttended,
      volunteerHours: eventsAttended * 6,
      impactScore: Math.min(100, eventsAttended * 10 + Math.floor(totalDonated / 1000)),
    },
    recentDonations: dbUser.donations.slice(0, 5),
    recentRegistrations: dbUser.eventRegistrations.slice(0, 5),
  };
}

export async function getUserDonationHistory(userId: string) {
  return await prisma.donation.findMany({
    where: { userId },
    include: { campaign: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function getAdminStats() {
  const [totalUsers, totalDonations, activeCampaigns, pendingVerifications] = await Promise.all([
    prisma.user.count(),
    prisma.donation.aggregate({ _sum: { amount: true } }),
    prisma.campaign.count({ where: { status: "active" } }),
    prisma.eventRegistration.count({ where: { status: "pending" } }),
  ]);

  const recentDonations = await prisma.donation.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: { campaign: true },
  });

  const recentUsers = await prisma.user.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    select: userSelect,
  });

  return {
    totalUsers,
    totalDonations: totalDonations._sum.amount || 0,
    activeCampaigns,
    pendingVerifications,
    recentDonations,
    recentUsers,
  };
}

export async function getAllUsers(filters: { role?: string; search?: string }) {
  const { role, search } = filters;
  const where: Record<string, any> = {};

  if (role) {
    where.role = role;
  }

  if (search) {
    where.OR = [
      { name: { contains: search } },
      { email: { contains: search } },
    ];
  }

  return await prisma.user.findMany({
    where,
    orderBy: { createdAt: "desc" },
    select: userSelect,
  });
}

export async function getGalleryItems(category?: string) {
  const where: Record<string, any> = {};
  if (category) {
    where.category = category;
  }

  return await prisma.galleryItem.findMany({
    where,
    orderBy: { date: "desc" },
  });
}
