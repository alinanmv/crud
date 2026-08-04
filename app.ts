import dotenv from "dotenv";
dotenv.config({ path: "./atlas-credentials.env" });

import express, { Request, Response } from "express";
import mongoose from "mongoose";
import Product from "./models/product.model";

const app = express();
app.use(express.json());

app.listen(3000, () => {
  console.log(`App listening on port 3000`);
});

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

app.get("/api/products", async (req: Request, res: Response) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

app.get("/api/product/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

app.post("/api/products", async (req: Request, res: Response) => {
  try {
    const product = await Product.create(req.body);
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

app.put("/api/product/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndUpdate(id, req.body);

    if (!product) {
      res.status(404).json({ error: "Product not found" });
    }

    const updatedProduct = await Product.findById(id);
    res.status(200).json(updatedProduct);
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

app.delete("/api/product/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      res.status(404).json({ error: "Product not found" });
    }

    res.status(200).json({ message: "product deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

mongoose
  .connect(process.env.MONGODB_URI as string)
  .then(() => {
    console.log("MongoDB Connected!");
  })
  .catch((err) => {
    console.log(err);
  });
