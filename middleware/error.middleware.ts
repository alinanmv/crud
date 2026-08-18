import { NextFunction, Request, Response } from "express";
import logger from "../utils/logger";

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  logger.error(`${req.method} ${req.originalUrl}`, err);

  if (err.code === "23505") {
    return res.status(409).json({ error: "Duplicate value" });
  }

  if (err.name === "MulterError") {
    const message =
      err.code === "LIMIT_FILE_SIZE"
        ? "File too large (max 2 MB)"
        : err.message;
    return res.status(400).json({ error: message });
  }

  res
    .status(err.status || 500)
    .json({ error: err.message || "Something went wrong" });
}
