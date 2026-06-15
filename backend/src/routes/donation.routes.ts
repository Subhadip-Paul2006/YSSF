import { Router } from "express";
import * as donationController from "../controllers/donation.controller.js";
import { authenticate, optionalAuthenticate } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validation.middleware.js";
import { createDonationSchema } from "../validators/donation.schema.js";
import { writeLimiter } from "../middlewares/rate-limiter.middleware.js";

export const donationRouter = Router();

donationRouter.get("/", authenticate, donationController.getDonations);
donationRouter.post(
  "/",
  writeLimiter,
  optionalAuthenticate,
  validate(createDonationSchema, "body"),
  donationController.createDonation
);
