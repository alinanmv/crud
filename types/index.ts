import { Request } from "express";

export type UserRole = "admin" | "user";

export interface JwtPayload {
  id: number;
  username: string;
  role_id: number;
}

export interface AuthRequest extends Request {
  user?: JwtPayload;
}
