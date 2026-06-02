import type { Request, Response, NextFunction } from "express";
import * as eventService from "../services/event.service.js";

export async function getEvents(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { category, status, search } = req.query;
    const events = await eventService.getAllEvents({
      category: typeof category === "string" ? category : undefined,
      status: typeof status === "string" ? status : undefined,
      search: typeof search === "string" ? search : undefined,
    });
    res.json(events);
  } catch (error) {
    next(error);
  }
}

export async function getEvent(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    const event = await eventService.getEventBySlug(id as string);
    res.json(event);
  } catch (error) {
    next(error);
  }
}

export async function register(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    const { name, email, phone } = req.body;
    const userId = req.user?.id || null;

    const registration = await eventService.registerForEvent({
      slug: id as string,
      name: name as string,
      email: email as string,
      phone: phone as string,
      userId,
    });

    res.status(201).json(registration);
  } catch (error) {
    next(error);
  }
}
