import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/user.model";
const bcrypt = require("bcrypt");

let refreshTokens: string[] = [];

function generateAccessToken(user: object) {
  return jwt.sign(user, process.env.JWT_SECRET as string, { expiresIn: "5m" });
}

export const login = async (req: Request, res: Response) => {
  const user = await User.findOne({ username: req.body.username });
  if (user == null) {
    return res.status(400).json({ error: "Cannot find user" });
  }

  try {
    const match = await bcrypt.compare(req.body.password, user.password);
    if (!match) {
      return res.status(401).json({ error: "Wrong password" });
    }

    const payload = { name: user.username };
    const accessToken = generateAccessToken(payload);
    const refreshToken = jwt.sign(
      payload,
      process.env.REFRESH_JWT_SECRET as string,
    );
    refreshTokens.push(refreshToken);
    res.json({ accessToken: accessToken, refreshToken: refreshToken });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

export const refreshToken = (req: Request, res: Response) => {
  const token = req.body.token;
  if (token == null) return res.sendStatus(401);
  if (!refreshTokens.includes(token)) return res.sendStatus(403);
  jwt.verify(
    token,
    process.env.REFRESH_JWT_SECRET as string,
    (err: any, user: any) => {
      if (err) return res.sendStatus(403);
      const accessToken = generateAccessToken({ name: user.name });
      res.json({ accessToken: accessToken });
    },
  );
};

export const logout = (req: Request, res: Response) => {
  refreshTokens = refreshTokens.filter((t) => t !== req.body.token);
  res.sendStatus(204);
};
