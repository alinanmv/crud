import express from "express";
import { login, refreshToken, logout } from "../controllers/auth.controller";
import { addUser } from "../controllers/user.controller";
import { validate } from "../middleware/validate.middleware";
import { registerSchema, loginSchema, tokenSchema } from "../schemas/auth.schema";

const router = express.Router();

router.post("/register", validate(registerSchema), addUser);

router.post("/login", validate(loginSchema), login);

router.post("/token", validate(tokenSchema), refreshToken);

router.delete("/logout", validate(tokenSchema), logout);

export default router;
