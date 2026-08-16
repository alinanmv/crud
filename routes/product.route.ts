import express from "express";
import multer from "multer";
import path from "path";
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

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

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
  upload.single("image"),
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
