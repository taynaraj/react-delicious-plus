
import { z } from 'zod';

export const CollectionSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1, 'Nome é obrigatório'),
  emoji: z.string().optional().nullable(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type Collection = z.infer<typeof CollectionSchema>;

export const CreateCollectionSchema = CollectionSchema.omit({
  id: true,
  createdAt: true,
});

export type CreateCollectionInput = z.infer<typeof CreateCollectionSchema>;

export const UpdateCollectionSchema = CollectionSchema.partial().extend({
  id: z.string().min(1),
});

export type UpdateCollectionInput = z.infer<typeof UpdateCollectionSchema>;
