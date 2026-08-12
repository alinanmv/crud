import { Response, NextFunction } from "express";
import { AuthRequest } from "../types";
import Product from "../models/product.model";
import { isAdmin } from "../constants/roles";

export async function checkOwnership(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) {
  if (req.user && isAdmin(req.user.role_id)) {
    return next();
  }

  const product = await Product.findById(req.params.id);
  if (!product) {
    return res.sendStatus(404);
  }

  if (product.owner.toString() !== req.user?.id) {
    return res.sendStatus(403);
  }

  next();
}
