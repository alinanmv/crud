import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { AppDataSource } from "../data-source";
import { User } from "../entities/User";
import { AppError } from "../utils/app-error";

const userRepo = AppDataSource.getRepository(User);

let refreshTokens: string[] = [];

interface TokenPayload {
  id: number;
  username: string;
  role_id: number;
}

function generateAccessToken(payload: TokenPayload) {
  return jwt.sign(payload, process.env.JWT_SECRET as string, {
    expiresIn: "5m",
  });
}

export const login = async (req: Request, res: Response) => {
  const user = await userRepo.findOne({
    where: { username: req.body.username },
  });
  if (user == null) {
    throw new AppError(400, "Cannot find user");
  }

  const match = await bcrypt.compare(req.body.password, user.password);
  if (!match) {
    throw new AppError(401, "Wrong password");
  }

  const payload: TokenPayload = {
    id: user.id,
    username: user.username,
    role_id: user.roleId,
  };

  const accessToken = generateAccessToken(payload);
  const refreshToken = jwt.sign(
    payload,
    process.env.REFRESH_JWT_SECRET as string,
  );
  refreshTokens.push(refreshToken);

  res.json({ accessToken, refreshToken });
};

export const refreshToken = (req: Request, res: Response) => {
  const token = req.body.token;
  if (token == null) return res.sendStatus(401);
  if (!refreshTokens.includes(token)) return res.sendStatus(403);

  jwt.verify(
    token,
    process.env.REFRESH_JWT_SECRET as string,
    (err: jwt.VerifyErrors | null, decoded: unknown) => {
      if (err) return res.sendStatus(403);
      const user = decoded as TokenPayload;
      const accessToken = generateAccessToken({
        id: user.id,
        username: user.username,
        role_id: user.role_id,
      });
      res.json({ accessToken });
    },
  );
};

export const logout = (req: Request, res: Response) => {
  refreshTokens = refreshTokens.filter((t) => t !== req.body.token);
  res.sendStatus(204);
};
