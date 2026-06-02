import bcrypt from "bcryptjs";
import crypto from "crypto";
import { SignJWT } from "jose";
import { prisma } from "../utils/prisma.js";
import { env } from "../config/env.js";
import {
  ConflictError,
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} from "../utils/errors.js";
import { sendVerificationLinkEmail } from "./email.service.js";

const SECRET = new TextEncoder().encode(env.JWT_SECRET);

export async function generateToken(userId: string, role: string): Promise<string> {
  return await new SignJWT({ userId, role })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("2h")
    .sign(SECRET);
}

export async function registerUser({
  name,
  email,
  phone,
  role,
  password,
}: any) {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw new ConflictError("Email already registered");
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      phone: phone || null,
      role,
      dob: "",
      location: "",
      passwordHash: hashedPassword,
    },
  });

  // Generate and send Verification Link
  const verificationToken = crypto.randomBytes(32).toString("hex");
  await prisma.verification.create({
    data: {
      userId: user.id,
      code: verificationToken,
      type: "email_link",
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
    },
  });

  // Send Verification email in background
  const verifyUrl = `${env.FRONTEND_URL}/verify?token=${verificationToken}`;
  sendVerificationLinkEmail(email, verifyUrl).catch((err) =>
    console.error("Error sending verification email:", err)
  );

  const token = await generateToken(user.id, user.role);

  return {
    user: { id: user.id, name: user.name, role: user.role },
    token,
    verificationRequired: true,
  };
}

export async function sendVerificationLink(userId: string, userEmail: string, emailVerified: boolean) {
  if (emailVerified) {
    throw new BadRequestError("Email already verified");
  }

  // Invalidate any existing verification links
  await prisma.verification.updateMany({
    where: { userId, type: "email_link", used: false },
    data: { used: true },
  });

  const verificationToken = crypto.randomBytes(32).toString("hex");
  await prisma.verification.create({
    data: {
      userId,
      code: verificationToken,
      type: "email_link",
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    },
  });

  const verifyUrl = `${env.FRONTEND_URL}/verify?token=${verificationToken}`;
  sendVerificationLinkEmail(userEmail, verifyUrl).catch((err) =>
    console.error("Error sending verification email:", err)
  );
}

export async function verifyEmailOTP(email: string, code: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new NotFoundError("User not found");
  }

  if (user.emailVerified) {
    throw new BadRequestError("Email already verified");
  }

  const verification = await prisma.verification.findFirst({
    where: {
      userId: user.id,
      code,
      type: "email_otp",
      used: false,
      expiresAt: { gt: new Date() },
    },
    orderBy: { createdAt: "desc" },
  });

  if (!verification) {
    throw new BadRequestError("Invalid or expired OTP");
  }

  // Mark verification as used and user as verified
  await prisma.$transaction([
    prisma.verification.update({
      where: { id: verification.id },
      data: { used: true },
    }),
    prisma.user.update({
      where: { id: user.id },
      data: { emailVerified: true },
    }),
  ]);

  const token = await generateToken(user.id, user.role);

  return {
    user: { id: user.id, name: user.name, role: user.role },
    token,
  };
}

export async function resendVerificationToken(email: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    // Return same standard response to prevent user enumeration
    return { success: true, message: "If an account exists, OTP has been sent" };
  }

  if (user.emailVerified) {
    throw new BadRequestError("Email already verified");
  }

  // Invalidate existing verification links
  await prisma.verification.updateMany({
    where: { userId: user.id, type: "email_link", used: false },
    data: { used: true },
  });

  const verificationToken = crypto.randomBytes(32).toString("hex");
  await prisma.verification.create({
    data: {
      userId: user.id,
      code: verificationToken,
      type: "email_link",
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    },
  });

  const verifyUrl = `${env.FRONTEND_URL}/verify?token=${verificationToken}`;
  sendVerificationLinkEmail(email, verifyUrl).catch((err) =>
    console.error("Error sending verification email:", err)
  );

  return { success: true, message: "If an account exists, verification link has been sent" };
}

export async function loginUser(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !user.passwordHash) {
    throw new UnauthorizedError("Invalid email or password");
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.passwordHash);
  if (!isPasswordCorrect) {
    throw new UnauthorizedError("Invalid email or password");
  }

  const token = await generateToken(user.id, user.role);

  if (!user.emailVerified) {
    return {
      user: { id: user.id, name: user.name, role: user.role },
      token,
      emailVerified: false,
      message: "Please verify your email to access all features.",
    };
  }

  return {
    user: { id: user.id, name: user.name, role: user.role },
    token,
    emailVerified: true,
  };
}

export async function getUserById(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, email: true, role: true, emailVerified: true },
  });
  if (!user) {
    throw new NotFoundError("User not found");
  }
  return user;
}

export async function registerFullUser({
  name,
  email,
  phone,
  role,
  password,
  ...otherFields
}: any) {
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new ConflictError("A user with this email already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const userData: Record<string, any> = {
    name,
    email,
    phone: phone || null,
    role,
    passwordHash: hashedPassword,
  };

  const roleFields: Record<string, string[]> = {
    volunteer: ["dob", "location", "skills", "availability", "emergencyName", "emergencyPhone"],
    donor: ["panTaxId", "preferredCauses"],
    ngo_partner: ["orgName", "regNumber", "website", "address", "mission", "preferredCauses"],
  };

  const allowedFields = roleFields[role] || [];
  for (const field of allowedFields) {
    const val = (otherFields as Record<string, any>)[field];
    if (val !== undefined) {
      userData[field] = val;
    }
  }

  const user = await prisma.user.create({ data: userData as any });

  // Generate and send Verification Link
  const verificationToken = crypto.randomBytes(32).toString("hex");
  await prisma.verification.create({
    data: {
      userId: user.id,
      code: verificationToken,
      type: "email_link",
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    },
  });

  const verifyUrl = `${env.FRONTEND_URL}/verify?token=${verificationToken}`;
  sendVerificationLinkEmail(email, verifyUrl).catch((err) =>
    console.error("Error sending verification email:", err)
  );

  const token = await generateToken(user.id, user.role);

  return {
    user: { id: user.id, name: user.name, role: user.role },
    token,
    verificationRequired: true,
    message: "Verification link sent to your email. Please verify to continue.",
  };
}

export async function loginWithGoogleMock() {
  const email = "google-volunteer@yssf.org";
  let user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    user = await prisma.user.create({
      data: {
        id: "google-volunteer-001",
        name: "Google Volunteer",
        email,
        role: "volunteer",
        phone: "9999999999",
        dob: "2000-01-01",
        location: "Kolkata, WB",
        skills: "Environment, Community Services",
        availability: "Weekends",
        passwordHash: "",
      },
    });
  }

  const token = await generateToken(user.id, user.role);

  return {
    user: { id: user.id, name: user.name, role: user.role },
    token,
  };
}

export async function loginWithGoogleSupabase({ email, name, avatarUrl }: any) {
  let user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    user = await prisma.user.create({
      data: {
        name,
        email,
        role: "volunteer",
        emailVerified: true, // Google-verified emails are trusted
        passwordHash: "", // No password for OAuth users
      },
    });
  } else if (!user.emailVerified) {
    user = await prisma.user.update({
      where: { id: user.id },
      data: { emailVerified: true },
    });
  }

  const token = await generateToken(user.id, user.role);

  return {
    user: { id: user.id, name: user.name, role: user.role },
    token,
  };
}
