import type { Request, Response, NextFunction } from "express";
import * as contactService from "../services/contact.service.js";

export async function create(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const contactMessage = await contactService.createContactMessage(req.body);
    res.status(201).json({ success: true, id: contactMessage.id });
  } catch (error) {
    next(error);
  }
}

export async function getMessages(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { read } = req.query;
    const filterRead = read !== undefined ? read === "true" : undefined;
    const messages = await contactService.getContactMessages({ read: filterRead });
    res.json(messages);
  } catch (error) {
    next(error);
  }
}
