import { z } from 'zod';

export const updateUserSchema = z.object({
  name: z.string().min(1, 'Name is required').optional(),
  avatar: z.string().url('Invalid avatar URL').optional().nullable(),
  themePreference: z.enum(['light', 'dark', 'system']).optional(),
});

export type UpdateUserInput = z.infer<typeof updateUserSchema>;

