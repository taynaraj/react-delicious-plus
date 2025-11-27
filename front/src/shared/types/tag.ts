import { z } from 'zod';

export const TagSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1, 'Nome é obrigatório'),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type Tag = z.infer<typeof TagSchema>;

export const CreateTagSchema = TagSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type CreateTagInput = z.infer<typeof CreateTagSchema>;

export const UpdateTagSchema = TagSchema.partial().extend({
  id: z.string().min(1),
});

export type UpdateTagInput = z.infer<typeof UpdateTagSchema>;
