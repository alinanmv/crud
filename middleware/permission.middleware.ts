import { Response, NextFunction } from "express";
import { AuthRequest } from "../types";
import { PermissionSlug } from "../types/permissions.types";
import { hasPermission } from "../constants/roles";

export function requirePermission(slugs: PermissionSlug[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    const user = req.user;

    if (!user) {
      return res.sendStatus(401);
    }

    if (slugs.some((slug) => hasPermission(user.role_id, slug))) {
      next();
    } else {
      return res.sendStatus(403);
    }
  };
}
