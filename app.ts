import dotenv from "dotenv";
dotenv.config({ path: "./atlas-credentials.env" });
dotenv.config({ path: "./.env" });

import express, { Request, Response } from "express";
import mongoose from "mongoose";
import productRoutes from "./routes/product.route";
import authRoutes from "./routes/auth.route";
import { authenticateToken } from "./middleware/auth.middleware";
import { errorHandler } from "./middleware/error.middleware";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", authRoutes);
app.use("/api/products", authenticateToken, productRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

app.use(errorHandler);

app.listen(3000, () => {
  console.log(`App listening on port 3000`);
});

mongoose
  .connect(process.env.MONGODB_URI as string)
  .then(() => {
    console.log("MongoDB Connected!");
  })
  .catch((err) => {
    console.log(err);
  });
