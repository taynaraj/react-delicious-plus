import { z } from 'zod';

export const updateUserSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório').optional(),
  avatar: z.string().url('URL do avatar inválida').optional().nullable(),
  themePreference: z.enum(['light', 'dark', 'system']).optional(),
});

export type UpdateUserInput = z.infer<typeof updateUserSchema>;

