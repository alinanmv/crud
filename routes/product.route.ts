import express from "express";
import {
  getProducts,
  getProduct,
  addProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/product.controller";
import { asyncHandler } from "../middleware/error.middleware";

const router = express.Router();

router.get("/", asyncHandler(getProducts));

router.get("/:id", asyncHandler(getProduct));

router.post("/", asyncHandler(addProduct));

router.put("/:id", asyncHandler(updateProduct));

router.delete("/:id", asyncHandler(deleteProduct));

export default router;
