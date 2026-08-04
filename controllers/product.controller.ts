import { Request, Response } from "express";
import Product from "../models/product.model";

export const getProducts = async (req: Request, res: Response) => {
  const username = (req as any).user.name;
  const products = await Product.find({ username });
  res.status(200).json(products);
};

export const getProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  const username = (req as any).user.name;
  const product = await Product.findOne({ _id: id, username });

  if (!product) {
    return res.status(404).json({ error: "Product not found" });
  }

  res.status(200).json(product);
};

export const addProduct = async (req: Request, res: Response) => {
  const username = (req as any).user.name;
  const product = await Product.create({ ...req.body, username });
  res.status(201).json(product);
};

export const updateProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  const username = (req as any).user.name;
  const product = await Product.findOneAndUpdate(
    { _id: id, username },
    req.body,
    {
      new: true,
      runValidators: true,
    },
  );

  if (!product) {
    return res.status(404).json({ error: "Product not found" });
  }

  res.status(200).json(product);
};

export const deleteProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  const username = (req as any).user.name;
  const product = await Product.findOneAndDelete({ _id: id, username });

  if (!product) {
    return res.status(404).json({ error: "Product not found" });
  }

  res.status(200).json({ message: "product deleted successfully" });
};
