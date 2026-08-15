import { z } from "zod";

export const registerSchema = z.object({
  username: z.string().min(3).max(30),
  password: z.string().min(8),
});

export const loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

export const tokenSchema = z.object({
  token: z.string().min(1),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type TokenInput = z.infer<typeof tokenSchema>;
