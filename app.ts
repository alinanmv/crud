import "./env";
import express from "express";
import "reflect-metadata";
import { AppDataSource } from "./data-source";
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
app.use("/uploads", express.static("uploads"));

app.get("/register", (req, res) => {
  res.sendFile("register.html", { root: "public" });
});

app.use(requestLogger);

app.use("/api", authRoutes);
app.use("/api/products", productRoutes);

app.use(errorHandler);

AppDataSource.initialize()
  .then(() => {
    logger.info("DB connected");
    app.listen(port, () => logger.info(`Server listening on port ${port}`));
  })
  .catch((err) => logger.error("DB connection error:", err));
