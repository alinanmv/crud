import dotenv from "dotenv";
dotenv.config({ path: "./atlas-credentials.env" });

import express, { Request, Response } from "express";
import mongoose from "mongoose";
import productRoutes from "./routes/product.route";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/products", productRoutes);

app.listen(3000, () => {
  console.log(`App listening on port 3000`);
});

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

mongoose
  .connect(process.env.MONGODB_URI as string)
  .then(() => {
    console.log("MongoDB Connected!");
  })
  .catch((err) => {
    console.log(err);
  });
