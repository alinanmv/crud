import express from "express";
import * as product from "../controllers/product.controller";
import { asyncHandler } from "../middleware/error.middleware";
import { authenticateToken } from "../middleware/auth.middleware";
import { checkOwnership } from "../middleware/owner.middleware";

const router = express.Router();

router.get("/", asyncHandler(product.getProducts));

router.get("/:id", asyncHandler(product.getProduct));

router.post("/", authenticateToken, asyncHandler(product.addProduct));

router.put(
  "/:id",
  authenticateToken,
  asyncHandler(checkOwnership),
  asyncHandler(product.updateProduct),
);

router.delete(
  "/:id",
  authenticateToken,
  asyncHandler(checkOwnership),
  asyncHandler(product.deleteProduct),
);

export default router;
