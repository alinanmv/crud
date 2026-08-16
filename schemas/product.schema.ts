import { z } from "zod";

export const createProductSchema = z.object({
  name: z.string().min(1),
  quantity: z.coerce.number().int().nonnegative().optional(),
  price: z.coerce.number().nonnegative().optional(),
});

export const updateProductSchema = createProductSchema.partial();

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
