import { Response } from "express";
import { AuthRequest } from "../types";
import { AppDataSource } from "../data-source";
import { Product } from "../entities/Product";
import { isAdmin } from "../constants/roles";
import { AppError } from "../utils/app-error";

const productRepo = AppDataSource.getRepository(Product);

export const getProducts = async (req: AuthRequest, res: Response) => {
  const where = isAdmin(req.user!.role_id) ? {} : { ownerId: req.user!.id };
  const products = await productRepo.find({ where });
  res.status(200).json(products);
};

export const getProduct = async (req: AuthRequest, res: Response) => {
  const id = Number(req.params.id);
  const where = isAdmin(req.user!.role_id)
    ? { id }
    : { id, ownerId: req.user!.id };
  const product = await productRepo.findOne({ where });

  if (!product) {
    throw new AppError(404, "Product not found");
  }

  res.status(200).json(product);
};

export const addProduct = async (req: AuthRequest, res: Response) => {
  const product = productRepo.create({
    ...req.body,
    image: req.file ? `/uploads/${req.file.filename}` : null,
    ownerId: req.user!.id,
    username: req.user!.username,
  });
  await productRepo.save(product);
  res.status(201).json(product);
};

export const updateProduct = async (req: AuthRequest, res: Response) => {
  const id = Number(req.params.id);
  const product = await productRepo.findOne({ where: { id } });

  if (!product) {
    throw new AppError(404, "Product not found");
  }

  productRepo.merge(product, req.body);
  await productRepo.save(product);

  res.status(200).json(product);
};

export const deleteProduct = async (req: AuthRequest, res: Response) => {
  const id = Number(req.params.id);
  const product = await productRepo.findOne({ where: { id } });

  if (!product) {
    throw new AppError(404, "Product not found");
  }

  await productRepo.remove(product);

  res.status(200).json({ message: "product deleted successfully" });
};
