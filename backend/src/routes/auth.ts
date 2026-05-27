import { Router } from "express";
import { SignJWT } from "jose";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { SECRET } from "../lib/auth.js";

export const authRoutes = Router();

// Zod schemas for input validation
const registerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email format"),
  phone: z.string().optional().nullable(),
  role: z.string().default("volunteer"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
});

const registerFullSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email format"),
  phone: z.string().optional().nullable(),
  role: z.string(),
  password: z.string().min(6, "Password must be at least 6 characters"),
  dob: z.string().optional().nullable(),
  location: z.string().optional().nullable(),
  skills: z.string().optional().nullable(),
  availability: z.string().optional().nullable(),
  emergencyName: z.string().optional().nullable(),
  emergencyPhone: z.string().optional().nullable(),
  panTaxId: z.string().optional().nullable(),
  preferredCauses: z.string().optional().nullable(),
  orgName: z.string().optional().nullable(),
  regNumber: z.string().optional().nullable(),
  website: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  mission: z.string().optional().nullable(),
  employeeId: z.string().optional().nullable(),
  roleLevel: z.string().optional().nullable(),
});

// POST /api/auth/register
authRoutes.post("/register", async (req, res) => {
  try {
    const parseResult = registerSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({ error: parseResult.error.issues[0].message });
      return;
    }

    const { name, email, phone, role, password } = parseResult.data;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      res.status(409).json({ error: "Email already registered" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        phone: phone || null,
        role: role || "volunteer",
        dob: "",
        location: "",
        passwordHash: hashedPassword,
      },
    });

    const token = await new SignJWT({ userId: user.id })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("7d")
      .sign(SECRET);

    res.status(201).json({
      success: true,
      user: { id: user.id, name: user.name, role: user.role },
      token,
    });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ error: "Failed to register user" });
  }
});

// POST /api/auth/login
authRoutes.post("/login", async (req, res) => {
  try {
    const parseResult = loginSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({ error: parseResult.error.issues[0].message });
      return;
    }

    const { email, password } = parseResult.data;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.passwordHash) {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordCorrect) {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }

    const token = await new SignJWT({ userId: user.id })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("7d")
      .sign(SECRET);

    res.json({
      success: true,
      user: { id: user.id, name: user.name, role: user.role },
      token,
    });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ error: "Failed to log in" });
  }
});

// GET /api/auth/me
authRoutes.get("/me", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;

    if (!token) {
      res.status(401).json({ user: null });
      return;
    }

    const { jwtVerify } = await import("jose");
    const { payload } = await jwtVerify(token, SECRET);
    const userId = payload.userId as string;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true, role: true },
    });

    if (!user) {
      res.status(401).json({ user: null });
      return;
    }

    res.json({ user });
  } catch {
    res.status(401).json({ user: null });
  }
});

// POST /api/auth/register-full
authRoutes.post("/register-full", async (req, res) => {
  try {
    const parseResult = registerFullSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({ error: parseResult.error.issues[0].message });
      return;
    }

    const { name, email, phone, role, password, ...otherFields } = parseResult.data;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      res.status(409).json({ error: "A user with this email already exists" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const userData: Record<string, unknown> = {
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
      admin: ["employeeId", "roleLevel"],
    };

    const allowedFields = roleFields[role] || [];
    for (const field of allowedFields) {
      const val = (otherFields as Record<string, unknown>)[field];
      if (val !== undefined) {
        userData[field] = val;
      }
    }

    const user = await prisma.user.create({ data: userData as never });

    const token = await new SignJWT({ userId: user.id })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("7d")
      .sign(SECRET);

    res.status(201).json({
      success: true,
      user: { id: user.id, name: user.name, role: user.role },
      token,
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Failed to register user" });
  }
});

// POST /api/auth/google-mock
authRoutes.post("/google-mock", async (req, res) => {
  try {
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
          passwordHash: "", // Google sign in has no password hash
        },
      });
    }

    const token = await new SignJWT({ userId: user.id })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("7d")
      .sign(SECRET);

    res.json({
      success: true,
      user: { id: user.id, name: user.name, role: user.role },
      token,
    });
  } catch (error) {
    console.error("Error in mock Google login:", error);
    res.status(500).json({ error: "Failed mock Google sign-in" });
  }
});

// POST /api/auth/signout
authRoutes.post("/signout", (_req, res) => {
  res.json({ success: true });
});
