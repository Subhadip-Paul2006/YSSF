import type { Request, Response, NextFunction } from "express";
import type { ZodSchema } from "zod";

export function validate(
  schema: ZodSchema,
  target: "body" | "query" | "params" = "body",
  customErrorMessage?: string
) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const parseResult = schema.safeParse(req[target]);
    if (!parseResult.success) {
      const message = customErrorMessage || parseResult.error.issues[0].message;
      res.status(400).json({ error: message });
      return;
    }
    // Replace the request property with the parsed and cast/sanitized data from Zod
    req[target] = parseResult.data;
    next();
  };
}
