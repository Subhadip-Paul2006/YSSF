import { prisma } from "../utils/prisma.js";
import { NotFoundError, ConflictError } from "../utils/errors.js";

export async function getAllEvents(filters: { category?: string; status?: string; search?: string }) {
  const { category, status, search } = filters;
  const where: Record<string, any> = {};

  if (category) where.category = category;
  if (status) where.status = status;
  
  if (search) {
    where.OR = [
      { title: { contains: search } },
      { description: { contains: search } },
    ];
  }

  return await prisma.event.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { registrations: true } },
    },
  });
}

export async function getEventBySlug(slug: string) {
  const event = await prisma.event.findUnique({
    where: { slug },
    include: {
      _count: { select: { registrations: true } },
    },
  });

  if (!event) {
    throw new NotFoundError("Event not found");
  }

  return event;
}

export async function registerForEvent({
  slug,
  name,
  email,
  phone,
  userId,
}: {
  slug: string;
  name: string;
  email: string;
  phone: string;
  userId: string | null;
}) {
  const event = await prisma.event.findUnique({
    where: { slug },
  });

  if (!event) {
    throw new NotFoundError("Event not found");
  }

  const existing = await prisma.eventRegistration.findFirst({
    where: { eventId: event.id, email },
  });

  if (existing) {
    throw new ConflictError("You have already registered for this event");
  }

  return await prisma.eventRegistration.create({
    data: {
      name,
      email,
      phone,
      eventId: event.id,
      userId,
    },
    include: { event: true },
  });
}
