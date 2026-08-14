import express from "express";
import * as product from "../controllers/product.controller";
import { asyncHandler } from "../middleware/error.middleware";
import { authenticateToken } from "../middleware/auth.middleware";
import { checkOwnership } from "../middleware/owner.middleware";
import { requirePermission } from "../middleware/permission.middleware";

const router = express.Router();

router.use(authenticateToken);

router.get(
  "/",
  requirePermission(["products:read", "products:all"]),
  asyncHandler(product.getProducts),
);

router.get(
  "/:id",
  requirePermission(["products:read", "products:all"]),
  asyncHandler(product.getProduct),
);

router.post(
  "/",
  requirePermission(["products:create", "products:all"]),
  asyncHandler(product.addProduct),
);

router.put(
  "/:id",
  requirePermission(["products:update", "products:all"]),
  asyncHandler(checkOwnership),
  asyncHandler(product.updateProduct),
);

router.delete(
  "/:id",
  requirePermission(["products:delete", "products:all"]),
  asyncHandler(checkOwnership),
  asyncHandler(product.deleteProduct),
);

export default router;
