import type { Request, Response, NextFunction } from "express";
import * as dashboardService from "../services/dashboard.service.js";
import { UnauthorizedError } from "../utils/errors.js";

export async function getStats(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) {
      throw new UnauthorizedError("Unauthorized");
    }
    const stats = await dashboardService.getUserStats(req.user.id);
    res.json(stats);
  } catch (error) {
    next(error);
  }
}

export async function getDonationHistory(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) {
      throw new UnauthorizedError("Unauthorized");
    }
    const history = await dashboardService.getUserDonationHistory(req.user.id);
    res.json(history);
  } catch (error) {
    next(error);
  }
}

export async function getAdminStats(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const stats = await dashboardService.getAdminStats();
    res.json(stats);
  } catch (error) {
    next(error);
  }
}

export async function getUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const roleParam = req.query.role;
    const searchParam = req.query.search;
    const role = typeof roleParam === "string" ? roleParam : undefined;
    const search = typeof searchParam === "string" ? searchParam : undefined;
    const users = await dashboardService.getAllUsers({ role, search });
    res.json(users);
  } catch (error) {
    next(error);
  }
}

export async function getGallery(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const categoryParam = req.query.category;
    const category = typeof categoryParam === "string" ? categoryParam : undefined;
    const items = await dashboardService.getGalleryItems(category);
    res.json(items);
  } catch (error) {
    next(error);
  }
}

export async function deleteUser(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = String(req.params.id || "");
    await dashboardService.deleteUser(id);
    res.json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    next(error);
  }
}

export async function verifyNgo(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = String(req.params.id || "");
    const { status } = req.body as { status: string };
    const user = await dashboardService.verifyNgo(id, status);
    res.json({ success: true, user });
  } catch (error) {
    next(error);
  }
}

export async function updateCampaignStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = String(req.params.id || "");
    const { status } = req.body as { status: string };
    const campaign = await dashboardService.updateCampaignStatus(id, status);
    res.json({ success: true, campaign });
  } catch (error) {
    next(error);
  }
}

export async function updateBlogStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = String(req.params.id || "");
    const { published } = req.body as { published: boolean };
    const post = await dashboardService.updateBlogStatus(id, published);
    res.json({ success: true, post });
  } catch (error) {
    next(error);
  }
}

export async function updateProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) {
      throw new Error("Unauthorized");
    }
    // req.body has been replaced by the validated+cast payload from Zod.
    const user = await dashboardService.updateUserProfile(req.user.id, req.body);
    res.json({ success: true, user });
  } catch (error) {
    next(error);
  }
}

// Public-safe, never-bundled financial disclosures. The actual bank account
// number and IFSC are stored in env vars and only included for authenticated
// ADMINs; everyone else gets masked values. This is the only place a real
// account number is read at runtime, so it never ends up in the client bundle.
export async function getFinancialsDisclosures(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const isAdmin = req.user?.role?.toUpperCase() === "ADMIN";

    const bankEnv = process.env.YSSF_BANK_ACCOUNT_NUMBER || "";
    const ifscEnv = process.env.YSSF_BANK_IFSC || "";
    const bankName = process.env.YSSF_BANK_NAME || "State Bank of India (SBI)";
    const bankBranch = process.env.YSSF_BANK_BRANCH || "Salt Lake Sector V, Kolkata";
    const accountHolder =
      process.env.YSSF_BANK_HOLDER || "Youth Sakti Social Foundation";

    const accountNumber = bankEnv;
    const ifsc = ifscEnv;
    const maskedAccount = accountNumber.length > 4 ? "****" + accountNumber.slice(-4) : "****";
    const maskedIfsc = ifsc.length > 4 ? "****" + ifsc.slice(-4) : "Available on request";

    const bank = {
      label: "Primary Operations Account",
      bank: bankName,
      branch: bankBranch,
      holder: accountHolder,
      accountNumber: isAdmin && accountNumber ? accountNumber : maskedAccount,
      ifsc: isAdmin && ifsc ? ifsc : maskedIfsc,
    };

    const compliance = {
      registrationNo: process.env.YSSF_REGISTRATION_NO || "Available on request",
      pan: process.env.YSSF_PAN || "Available on request",
      eightyG: process.env.YSSF_80G_STATUS || "Tax Exempt Eligible",
      fcra: process.env.YSSF_FCRA_STATUS || "Under Application",
    };

    res.json({ bank, compliance });
  } catch (error) {
    next(error);
  }
}


