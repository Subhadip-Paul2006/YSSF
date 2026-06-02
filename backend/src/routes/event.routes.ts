import { Router } from "express";
import * as eventController from "../controllers/event.controller.js";
import { optionalAuthenticate } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validation.middleware.js";
import { registerEventSchema } from "../validators/event.schema.js";

export const eventRouter = Router();

eventRouter.get("/", eventController.getEvents);
eventRouter.get("/:id", eventController.getEvent);
eventRouter.post(
  "/:id/register",
  optionalAuthenticate,
  validate(registerEventSchema, "body", "Invalid input"),
  eventController.register
);
