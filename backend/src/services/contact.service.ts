import { prisma } from "../utils/prisma.js";

export async function createContactMessage(data: {
  name: string;
  email: string;
  phone?: string | null;
  subject: string;
  message: string;
}) {
  return await prisma.contactMessage.create({
    data: {
      name: data.name,
      email: data.email,
      phone: data.phone || null,
      subject: data.subject,
      message: data.message,
    },
  });
}

export async function getContactMessages(filters: { read?: boolean }) {
  const where: Record<string, any> = {};

  if (filters.read !== undefined) {
    where.read = filters.read;
  }

  return await prisma.contactMessage.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });
}
