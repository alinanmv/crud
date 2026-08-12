import { Response } from "express";
import { QueryFilter } from "mongoose";
import { AuthRequest } from "../types";
import Product, { IProduct } from "../models/product.model";
import { isAdmin } from "../constants/roles";

export const getProducts = async (req: AuthRequest, res: Response) => {
  const filter: QueryFilter<IProduct> = {};
  if (!isAdmin(req.user!.role_id)) {
    filter.owner = req.user!.id;
  }
  const products = await Product.find(filter);
  res.status(200).json(products);
};

export const getProduct = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const filter: QueryFilter<IProduct> = { _id: id };
  if (!isAdmin(req.user!.role_id)) {
    filter.owner = req.user!.id;
  }
  const product = await Product.findOne(filter);

  if (!product) {
    return res.status(404).json({ error: "Product not found" });
  }

  res.status(200).json(product);
};

export const addProduct = async (req: AuthRequest, res: Response) => {
  const product = await Product.create({
    ...req.body,
    owner: req.user!.id,
    username: req.user!.username,
  });
  res.status(201).json(product);
};

export const updateProduct = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const product = await Product.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!product) {
    return res.status(404).json({ error: "Product not found" });
  }

  res.status(200).json(product);
};

export const deleteProduct = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const product = await Product.findByIdAndDelete(id);

  if (!product) {
    return res.status(404).json({ error: "Product not found" });
  }

  res.status(200).json({ message: "product deleted successfully" });
};
