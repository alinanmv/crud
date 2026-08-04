import express from "express";
import { login, refreshToken, logout } from "../controllers/auth.controller";
import { addUser } from "../controllers/user.controller";
import { asyncHandler } from "../middleware/error.middleware";

const router = express.Router();

router.post("/register", asyncHandler(addUser));

router.post("/login", asyncHandler(login));

router.post("/token", refreshToken);

router.delete("/logout", logout);

export default router;
