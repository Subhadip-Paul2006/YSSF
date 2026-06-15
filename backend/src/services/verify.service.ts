import crypto from "crypto";
import { prisma } from "../utils/prisma.js";
import { env } from "../config/env.js";
import { BadRequestError, NotFoundError } from "../utils/errors.js";
import { sendOTPEmail, sendVerificationLinkEmail } from "./email.service.js";
import { generateToken } from "./auth.service.js";

// We store verification codes as a SHA-256 hash so a database dump doesn't
// leak live OTPs/tokens. Inputs are compared with timingSafeEqual to avoid
// leaking prefix matches through response timing.
function hashCode(code: string): string {
  return crypto.createHash("sha256").update(code, "utf8").digest("hex");
}

function timingSafeEqualHex(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  try {
    return crypto.timingSafeEqual(Buffer.from(a, "hex"), Buffer.from(b, "hex"));
  } catch {
    return false;
  }
}

function generateSecureOTP(): string {
  return crypto.randomInt(100000, 999999).toString();
}

function generateSecureLinkToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

export async function sendVerificationOTP(email: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return { success: true, message: "If an account exists, OTP has been sent" };
  }

  if (user.emailVerified) {
    return { success: true, message: "Email is already verified" };
  }

  // Invalidate existing OTPs
  await prisma.verification.updateMany({
    where: { userId: user.id, type: "email_otp", used: false },
    data: { used: true },
  });

  const otp = generateSecureOTP();
  await prisma.verification.create({
    data: {
      userId: user.id,
      code: hashCode(otp),
      type: "email_otp",
      expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
    },
  });

  // Send OTP email (plaintext OTP — only the recipient sees it)
  sendOTPEmail(email, otp).catch((err) =>
    console.error("Error sending OTP email:", err)
  );

  return { success: true, message: "If an account exists, OTP has been sent" };
}

export async function verifyVerificationOTP(email: string, code: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new BadRequestError("Invalid or expired OTP");
  }

  if (user.emailVerified) {
    return { success: true, message: "Email already verified" };
  }

  // Look up by hash of the candidate code.
  const verification = await prisma.verification.findFirst({
    where: {
      userId: user.id,
      code: hashCode(code),
      type: "email_otp",
      used: false,
      expiresAt: { gt: new Date() },
    },
    orderBy: { createdAt: "desc" },
  });

  if (!verification) {
    throw new BadRequestError("Invalid or expired OTP");
  }

  // Constant-time compare as defense-in-depth (in case DB collation is
  // case-insensitive or we ever index by partial prefix).
  if (!timingSafeEqualHex(verification.code, hashCode(code))) {
    throw new BadRequestError("Invalid or expired OTP");
  }

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

  return { success: true, message: "Email verified successfully" };
}

export async function sendVerificationLinkToEmail(email: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return { success: true, message: "If an account exists, a verification link has been sent" };
  }

  if (user.emailVerified) {
    return { success: true, message: "Email is already verified" };
  }

  // Invalidate existing links
  await prisma.verification.updateMany({
    where: { userId: user.id, type: "email_link", used: false },
    data: { used: true },
  });

  const token = generateSecureLinkToken();
  const tokenHash = hashCode(token);
  await prisma.verification.create({
    data: {
      userId: user.id,
      code: tokenHash,
      type: "email_link",
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
    },
  });

  const verifyUrl = `${env.FRONTEND_URL}/verify?token=${token}`;
  sendVerificationLinkEmail(email, verifyUrl).catch((err) =>
    console.error("Error sending verification link email:", err)
  );

  return { success: true, message: "If an account exists, a verification link has been sent" };
}

export async function verifyVerificationLink(token: string) {
  const tokenHash = hashCode(token);
  const verification = await prisma.verification.findFirst({
    where: {
      code: tokenHash,
      type: "email_link",
      used: false,
      expiresAt: { gt: new Date() },
    },
  });

  if (!verification || !timingSafeEqualHex(verification.code, tokenHash)) {
    throw new BadRequestError("Invalid or expired verification link");
  }

  const user = await prisma.user.findUnique({
    where: { id: verification.userId },
  });

  if (!user) {
    throw new NotFoundError("User not found");
  }

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

  const jwtToken = await generateToken(user.id, user.role);

  return {
    success: true,
    message: "Email verified successfully",
    user: { id: user.id, name: user.name, role: user.role },
    token: jwtToken,
  };
}
