import { Request, Response } from "express";
import jwt from "jsonwebtoken";

let refreshTokens: string[] = [];

function generateAccessToken(user: object) {
  return jwt.sign(user, process.env.JWT_SECRET as string, { expiresIn: "5m" });
}

export const login = (req: Request, res: Response) => {
  const username = req.body.username;
  const user = { name: username };

  const accessToken = generateAccessToken(user);
  const refreshToken = jwt.sign(user, process.env.REFRESH_JWT_SECRET as string);
  refreshTokens.push(refreshToken);
  res.json({ accessToken: accessToken, refreshToken: refreshToken });
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
