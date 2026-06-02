import { Router } from "express";
import * as dashboardController from "../controllers/dashboard.controller.js";
import { authenticate, requireRole } from "../middlewares/auth.middleware.js";

export const dashboardRouter = Router();

dashboardRouter.get("/stats", authenticate, dashboardController.getStats);
dashboardRouter.get("/donation-history", authenticate, dashboardController.getDonationHistory);
dashboardRouter.get("/admin-stats", authenticate, requireRole(["ADMIN"]), dashboardController.getAdminStats);
dashboardRouter.get("/users", authenticate, requireRole(["ADMIN"]), dashboardController.getUsers);
dashboardRouter.get("/gallery", dashboardController.getGallery);
