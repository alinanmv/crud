import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import { AuthRequest, JwtPayload } from "../types";

export function authenticateToken(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET as string, (err, decoded) => {
    if (err) return res.sendStatus(403);
    req.user = decoded as JwtPayload;
    next();
  });
}
