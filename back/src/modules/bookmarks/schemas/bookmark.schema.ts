import { z } from 'zod';

// Validação para CUID (usado pelo Prisma) ou UUID
// CUIDs começam com 'c' e têm ~25 caracteres
// UUIDs têm formato específico com hífens
const cuidOrUuidSchema = z.string().min(1, 'ID é obrigatório').refine(
  (val) => {
    // Aceitar CUID (começa com 'c' e tem pelo menos 20 caracteres)
    if (val.startsWith('c') && val.length >= 20) {
      return true;
    }
    // Aceitar UUID (formato com hífens)
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(val);
  },
  { message: 'Formato de ID inválido (deve ser CUID ou UUID)' }
);

export const createBookmarkSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório'),
  url: z.string().url('Formato de URL inválido'),
  description: z.string().optional().nullable(),
  image: z.string().url('URL da imagem inválida').optional().nullable(),
  tags: z.array(z.string()).optional().default([]),
  collectionId: cuidOrUuidSchema.optional().nullable(),
  favorite: z.boolean().optional().default(false),
  read: z.boolean().optional().default(false),
});

export const updateBookmarkSchema = createBookmarkSchema.partial().extend({
  id: cuidOrUuidSchema,
});

export const getBookmarksQuerySchema = z.object({
  search: z.string().optional(),
  tag: z.string().optional(),
  collectionId: cuidOrUuidSchema.optional(),
  isFavorite: z.string().transform((val) => val === 'true').optional(),
  isRead: z.string().transform((val) => val === 'true').optional(),
  limit: z.string().transform(Number).optional().default('20'),
  offset: z.string().transform(Number).optional().default('0'),
});

export type CreateBookmarkInput = z.infer<typeof createBookmarkSchema>;
export type UpdateBookmarkInput = z.infer<typeof updateBookmarkSchema>;
export type GetBookmarksQuery = z.infer<typeof getBookmarksQuerySchema>;

