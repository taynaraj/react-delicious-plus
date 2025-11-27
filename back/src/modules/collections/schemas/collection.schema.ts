import { z } from 'zod';

// Validação para CUID (usado pelo Prisma) ou UUID
const cuidOrUuidSchema = z.string().min(1, 'ID is required').refine(
  (val) => {
    // Aceitar CUID (começa com 'c' e tem pelo menos 20 caracteres)
    if (val.startsWith('c') && val.length >= 20) {
      return true;
    }
    // Aceitar UUID (formato com hífens)
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(val);
  },
  { message: 'Invalid ID format (must be CUID or UUID)' }
);

export const createCollectionSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  emoji: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
});

export const updateCollectionSchema = createCollectionSchema.partial().extend({
  id: cuidOrUuidSchema,
});

export type CreateCollectionInput = z.infer<typeof createCollectionSchema>;
export type UpdateCollectionInput = z.infer<typeof updateCollectionSchema>;

