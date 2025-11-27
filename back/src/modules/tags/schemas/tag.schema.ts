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

export const createTagSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  // color removido - não existe no schema do Prisma
});

export const updateTagSchema = createTagSchema.partial().extend({
  id: cuidOrUuidSchema,
});

export type CreateTagInput = z.infer<typeof createTagSchema>;
export type UpdateTagInput = z.infer<typeof updateTagSchema>;

