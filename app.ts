import dotenv from "dotenv";
dotenv.config({ path: "./atlas-credentials.env" });
dotenv.config({ path: "./.env" });

import express, { Request, Response } from "express";
import mongoose from "mongoose";
import productRoutes from "./routes/product.route";
import authRoutes from "./routes/auth.route";
import { authenticateToken } from "./middleware/auth.middleware";
import { errorHandler } from "./middleware/error.middleware";
import logger from './utils/logger'

logger.info(`App starting in ${process.env.NODE_ENV} mode`);

const app = express();
const port = Number(process.env.PORT) || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", authRoutes);
app.use("/api/products", authenticateToken, productRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

app.use(errorHandler);

app.listen(port, () => {
  logger.info(`App listening on ` + port);
});

mongoose
  .connect(process.env.MONGODB_URI as string)
  .then(() => {
    console.log("MongoDB Connected!");
  })
  .catch((err) => {
    console.log(err);
  });
