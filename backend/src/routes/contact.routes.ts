import { Router } from "express";
import * as contactController from "../controllers/contact.controller.js";
import { authenticate, requireRole } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validation.middleware.js";
import { contactMessageSchema } from "../validators/contact.schema.js";
import { writeLimiter } from "../middlewares/rate-limiter.middleware.js";

export const contactRouter = Router();

contactRouter.post("/", writeLimiter, validate(contactMessageSchema, "body"), contactController.create);
contactRouter.get("/", authenticate, requireRole(["ADMIN"]), contactController.getMessages);
