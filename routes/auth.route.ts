import express from "express";
import { login, refreshToken, logout } from "../controllers/auth.controller";

const router = express.Router();

router.post("/login", login);

router.post("/token", refreshToken);

router.delete("/logout", logout);

export default router;
