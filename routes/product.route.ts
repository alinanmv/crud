import express from "express";
import * as product from "../controllers/product.controller";
import { authenticateToken } from "../middleware/auth.middleware";
import { checkOwnership } from "../middleware/owner.middleware";
import { requirePermission } from "../middleware/permission.middleware";
import { validate } from "../middleware/validate.middleware";
import {
  createProductSchema,
  updateProductSchema,
} from "../schemas/product.schema";

const router = express.Router();

router.use(authenticateToken);

router.get(
  "/",
  requirePermission(["products:read", "products:all"]),
  product.getProducts,
);

router.get(
  "/:id",
  requirePermission(["products:read", "products:all"]),
  product.getProduct,
);

router.post(
  "/",
  requirePermission(["products:create", "products:all"]),
  validate(createProductSchema),
  product.addProduct,
);

router.put(
  "/:id",
  requirePermission(["products:update", "products:all"]),
  validate(updateProductSchema),
  checkOwnership,
  product.updateProduct,
);

router.delete(
  "/:id",
  requirePermission(["products:delete", "products:all"]),
  checkOwnership,
  product.deleteProduct,
);

export default router;
