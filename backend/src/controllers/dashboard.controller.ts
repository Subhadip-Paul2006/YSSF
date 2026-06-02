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
