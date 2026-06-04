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
    const { role, search } = req.query;
    const users = await dashboardService.getAllUsers({
      role: role as string,
      search: search as string,
    });
    res.json(users);
  } catch (error) {
    next(error);
  }
}

export async function getGallery(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { category } = req.query;
    const items = await dashboardService.getGalleryItems(category as string);
    res.json(items);
  } catch (error) {
    next(error);
  }
}

export async function deleteUser(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    await dashboardService.deleteUser(id);
    res.json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    next(error);
  }
}

export async function verifyNgo(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const user = await dashboardService.verifyNgo(id, status);
    res.json({ success: true, user });
  } catch (error) {
    next(error);
  }
}

export async function updateCampaignStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const campaign = await dashboardService.updateCampaignStatus(id, status);
    res.json({ success: true, campaign });
  } catch (error) {
    next(error);
  }
}

export async function updateBlogStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    const { published } = req.body;
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
    const user = await dashboardService.updateUserProfile(req.user.id, req.body);
    res.json({ success: true, user });
  } catch (error) {
    next(error);
  }
}


