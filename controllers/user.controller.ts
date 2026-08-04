import { Request, Response } from "express";
import User from "../models/user.model";
import bcrypt from "bcrypt";

export const addUser = async (req: Request, res: Response) => {
  try {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    const user = await User.create({
      username: req.body.username,
      password: hashedPassword,
    });
    res.status(201).json({ _id: user._id, username: user.username });
  } catch (err: any) {
    if (err.code === 11000) {
      return res.status(409).json({ error: "Username already taken" });
    }
    res.status(500).json({ error: err });
  }
};
