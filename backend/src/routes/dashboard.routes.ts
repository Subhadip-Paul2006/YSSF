import { Router } from "express";
import * as dashboardController from "../controllers/dashboard.controller.js";
import { authenticate, requireRole, optionalAuthenticate } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validation.middleware.js";
import {
  updateProfileSchema,
  verifyNgoSchema,
  updateCampaignStatusSchema,
  updateBlogStatusSchema,
} from "../validators/dashboard.schema.js";

export const dashboardRouter = Router();

dashboardRouter.get("/stats", authenticate, dashboardController.getStats);
dashboardRouter.get("/donation-history", authenticate, dashboardController.getDonationHistory);
dashboardRouter.get("/admin-stats", authenticate, requireRole(["ADMIN"]), dashboardController.getAdminStats);
dashboardRouter.get("/users", authenticate, requireRole(["ADMIN"]), dashboardController.getUsers);
dashboardRouter.get("/gallery", authenticate, dashboardController.getGallery);
dashboardRouter.get("/financials/disclosures", optionalAuthenticate, dashboardController.getFinancialsDisclosures);
dashboardRouter.put(
  "/profile",
  authenticate,
  validate(updateProfileSchema, "body", "Invalid input"),
  dashboardController.updateProfile
);

// Admin-only management endpoints
dashboardRouter.delete("/users/:id", authenticate, requireRole(["ADMIN"]), dashboardController.deleteUser);
dashboardRouter.put(
  "/users/:id/verify-ngo",
  authenticate,
  requireRole(["ADMIN"]),
  validate(verifyNgoSchema, "body", "Invalid input"),
  dashboardController.verifyNgo
);
dashboardRouter.put(
  "/campaigns/:id/status",
  authenticate,
  requireRole(["ADMIN"]),
  validate(updateCampaignStatusSchema, "body", "Invalid input"),
  dashboardController.updateCampaignStatus
);
dashboardRouter.put(
  "/blog/:id/status",
  authenticate,
  requireRole(["ADMIN"]),
  validate(updateBlogStatusSchema, "body", "Invalid input"),
  dashboardController.updateBlogStatus
);

