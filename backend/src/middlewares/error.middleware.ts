import type { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/errors.js";

export function errorMiddleware(
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  // Log the stack trace in development or testing for debugging
  console.error("Error occurred:", err);

  if (err instanceof AppError) {
    res.status(err.statusCode).json({ error: err.message });
    return;
  }

  // Handle generic JWT or Zod validation errors that bubble up
  if (err.name === "ValidationError" || err.name === "ZodError") {
    const message = err.issues?.[0]?.message || err.message || "Invalid input";
    res.status(400).json({ error: message });
    return;
  }

  // Database unique constraint errors mapping (Prisma P2002 code)
  if (err.code === "P2002") {
    res.status(409).json({ error: "A record with this field already exists" });
    return;
  }

  // Default fallback for unexpected errors
  res.status(500).json({ error: "Internal server error" });
}
