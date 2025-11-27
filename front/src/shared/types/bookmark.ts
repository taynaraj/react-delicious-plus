/**
 * BOOKMARK TYPES
 * 
 * Tipos e schemas Zod para Bookmark.

 */

import { z } from 'zod';

/**
 * Schema para Tag (usado em bookmarks)
 */
const TagSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
});

export const BookmarkSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1, 'Título é obrigatório'),
  url: z.string().url('URL inválida'),
  description: z.string().optional(),
  tags: z.array(TagSchema).default([]), // Array de { id, name }
  collectionId: z.string().optional(),
  favorite: z.boolean().default(false),
  read: z.boolean().default(false),
  image: z.string().nullable().optional(), // Base64 string (será salva no IndexedDB)
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});


export type Bookmark = z.infer<typeof BookmarkSchema>;

export const CreateBookmarkSchema = BookmarkSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  tags: true,
}).extend({
  title: z.string().min(1, 'Título é obrigatório'),
  url: z.string().url('URL inválida'),
  tags: z.array(z.string()).optional().default([]),
});

export type CreateBookmarkInput = z.infer<typeof CreateBookmarkSchema>;


export const UpdateBookmarkSchema = BookmarkSchema.omit({
  tags: true,
}).partial().extend({
  id: z.string().min(1),
  tags: z.array(z.string()).optional(),
});

export type UpdateBookmarkInput = z.infer<typeof UpdateBookmarkSchema>;
