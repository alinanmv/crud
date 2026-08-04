import express from "express";
import { login, refreshToken, logout } from "../controllers/auth.controller";
import { addUser } from "../controllers/user.controller";

const router = express.Router();

router.post("/register", addUser);

router.post("/login", login);

router.post("/token", refreshToken);

router.delete("/logout", logout);

export default router;
