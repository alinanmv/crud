import { Request, Response } from "express";
import Product from "../models/product.model";

export const getProducts = async (req: Request, res: Response) => {
  try {
    const username = (req as any).user.name;
    const products = await Product.find({ username });
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

export const getProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const username = (req as any).user.name;
    const product = await Product.findOne({ _id: id, username });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

export const addProduct = async (req: Request, res: Response) => {
  try {
    const username = (req as any).user.name;
    const product = await Product.create({ ...req.body, username });
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
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
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const username = (req as any).user.name;
    const product = await Product.findOneAndDelete({ _id: id, username });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.status(200).json({ message: "product deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};
