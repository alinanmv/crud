import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { AppDataSource } from "../data-source";
import { User } from "../entities/User";
import { Session } from "../entities/Session";
import { AppError } from "../utils/app-error";

const userRepo = AppDataSource.getRepository(User);
const sessionRepo = AppDataSource.getRepository(Session);

const REFRESH_TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000;

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

function hashToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
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

  await sessionRepo.save({
    userId: user.id,
    tokenHash: hashToken(refreshToken),
    expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL_MS),
  });

  res.json({ accessToken, refreshToken });
};

export const refreshToken = async (req: Request, res: Response) => {
  const token = req.body.token;
  if (token == null) return res.sendStatus(401);

  const session = await sessionRepo.findOne({
    where: { tokenHash: hashToken(token) },
  });
  if (
    session == null ||
    session.revokedAt != null ||
    session.expiresAt < new Date()
  ) {
    return res.sendStatus(403);
  }

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

export const logout = async (req: Request, res: Response) => {
  if (req.body.token != null) {
    await sessionRepo.update(
      { tokenHash: hashToken(req.body.token) },
      { revokedAt: new Date() },
    );
  }
  res.sendStatus(204);
};
