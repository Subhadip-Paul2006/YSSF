import { Router } from "express";
import * as campaignController from "../controllers/campaign.controller.js";

export const campaignRouter = Router();

campaignRouter.get("/", campaignController.getCampaigns);
campaignRouter.get("/:id", campaignController.getCampaign);
