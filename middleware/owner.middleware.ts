import { Response, NextFunction } from "express";
import { AuthRequest } from "../types";
import { AppDataSource } from "../data-source";
import { Product } from "../entities/Product";
import { isAdmin } from "../constants/roles";

const productRepo = AppDataSource.getRepository(Product);

export async function checkOwnership(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) {
  if (req.user && isAdmin(req.user.role_id)) {
    return next();
  }

  const product = await productRepo.findOne({
    where: { id: Number(req.params.id) },
  });
  if (!product) {
    return res.sendStatus(404);
  }

  if (product.ownerId !== req.user?.id) {
    return res.sendStatus(403);
  }

  next();
}
