import { NextFunction, Response } from "express";
import { AuthRequest } from "../types";
import logger from "../utils/logger";

export function requestLogger(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) {
  const start = process.hrtime.bigint();

  res.on("finish", () => {
    const durationMs = Number(process.hrtime.bigint() - start) / 1_000_000;

    logger.info("request", {
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      durationMs: Math.round(durationMs),
      userId: req.user?.id,
      ip: req.ip,
    });
  });

  next();
}
