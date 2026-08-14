import { NextFunction, Request, Response } from "express";
import logger from "../utils/logger";

export const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) =>
  (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(fn(req, res, next)).catch(next);

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  logger.error(`${req.method} ${req.originalUrl}`, err);

  if (err.code === 11000) {
    return res.status(409).json({ error: "Duplicate value" });
  }

  if (err.name === "ValidationError") {
    return res.status(400).json({ error: err.message });
  }

  res
    .status(err.status || 500)
    .json({ error: err.message || "Something went wrong" });
}
