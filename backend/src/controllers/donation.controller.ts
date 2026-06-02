import type { Request, Response, NextFunction } from "express";
import * as donationService from "../services/donation.service.js";
import { UnauthorizedError } from "../utils/errors.js";

export async function getDonations(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) {
      throw new UnauthorizedError("Authentication required");
    }
    const { campaignId } = req.query;
    const donations = await donationService.getDonations({
      user: req.user,
      campaignId: campaignId as string,
    });
    res.json(donations);
  } catch (error) {
    next(error);
  }
}

export async function createDonation(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { amount, donorName, donorEmail, campaignId } = req.body;
    const userId = req.user?.id || null;

    const donation = await donationService.createDonation({
      amount: Number(amount),
      donorName,
      donorEmail,
      campaignId,
      userId,
    });

    res.status(201).json(donation);
  } catch (error) {
    next(error);
  }
}
