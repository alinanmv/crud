import dotenv from "dotenv";
dotenv.config({ path: "./atlas-credentials.env" });
dotenv.config({ path: "./.env" });

import express from "express";
import mongoose from "mongoose";
import productRoutes from "./routes/product.route";
import authRoutes from "./routes/auth.route";
import { errorHandler } from "./middleware/error.middleware";
import { requestLogger } from "./middleware/request-logger.middleware";
import logger from "./utils/logger";

logger.info(`App starting in ${process.env.NODE_ENV} mode`);

const app = express();
const port = Number(process.env.PORT) || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

app.get("/register", (req, res) => {
  res.sendFile("register.html", { root: "public" });
});

app.use(requestLogger);

app.use("/api", authRoutes);
app.use("/api/products", productRoutes);

app.use(errorHandler);

mongoose
  .connect(process.env.MONGODB_URI as string)
  .then(() => {
    logger.info("MongoDB connected");
    app.listen(port, () => {
      logger.info(`App listening on port ${port}`);
    });
  })
  .catch((err) => {
    logger.error("MongoDB connection failed", err);
    process.exit(1);
  });
