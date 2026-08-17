import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { AppDataSource } from "../data-source";
import { User } from "../entities/User";

const userRepo = AppDataSource.getRepository(User);

export const addUser = async (req: Request, res: Response) => {
  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(req.body.password, salt);
  const user = userRepo.create({
    username: req.body.username,
    password: hashedPassword,
  });
  await userRepo.save(user);
  res.status(201).json({ id: user.id, username: user.username });
};
