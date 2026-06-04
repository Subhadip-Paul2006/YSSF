import { prisma } from "../utils/prisma.js";
import { NotFoundError } from "../utils/errors.js";

const userSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  roleLevel: true,
  phone: true,
  location: true,
  skills: true,
  availability: true,
  panTaxId: true,
  orgName: true,
  regNumber: true,
  website: true,
  address: true,
  mission: true,
  preferredCauses: true,
  emergencyName: true,
  emergencyPhone: true,
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

export async function deleteUser(userId: string) {
  return await prisma.$transaction(async (tx) => {
    // 1. Delete verifications
    await tx.verification.deleteMany({ where: { userId } });
    
    // 2. Set userId: null for event registrations
    await tx.eventRegistration.updateMany({
      where: { userId },
      data: { userId: null },
    });
    
    // 3. Set userId: null for donations
    await tx.donation.updateMany({
      where: { userId },
      data: { userId: null },
    });
    
    // 4. Delete user
    return await tx.user.delete({ where: { id: userId } });
  });
}

export async function verifyNgo(userId: string, status: string) {
  return await prisma.user.update({
    where: { id: userId },
    data: { roleLevel: status },
    select: { id: true, name: true, email: true, role: true, roleLevel: true },
  });
}

export async function updateCampaignStatus(campaignId: string, status: string) {
  return await prisma.campaign.update({
    where: { id: campaignId },
    data: { status },
  });
}

export async function updateBlogStatus(postId: string, published: boolean) {
  return await prisma.blogPost.update({
    where: { id: postId },
    data: { published },
  });
}

export async function updateUserProfile(userId: string, data: any) {
  const allowedFields = [
    "name",
    "phone",
    "location",
    "skills",
    "availability",
    "emergencyName",
    "emergencyPhone",
    "panTaxId",
    "orgName",
    "regNumber",
    "website",
    "address",
    "mission",
    "preferredCauses",
  ];

  const updateData: Record<string, any> = {};
  for (const key of allowedFields) {
    if (data[key] !== undefined) {
      updateData[key] = data[key];
    }
  }

  return await prisma.user.update({
    where: { id: userId },
    data: updateData,
    select: userSelect,
  });
}


