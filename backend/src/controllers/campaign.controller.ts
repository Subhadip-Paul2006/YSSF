import type { Request, Response, NextFunction } from "express";
import * as campaignService from "../services/campaign.service.js";

export async function getCampaigns(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { category, search } = req.query;
    const campaigns = await campaignService.getAllCampaigns({
      category: typeof category === "string" ? category : undefined,
      search: typeof search === "string" ? search : undefined,
    });
    res.json(campaigns);
  } catch (error) {
    next(error);
  }
}

export async function getCampaign(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    const campaign = await campaignService.getCampaignBySlug(id as string);
    res.json(campaign);
  } catch (error) {
    next(error);
  }
}
