import { z } from 'zod';
import { BookmarkSchema } from '@shared/types/bookmark';
import { CollectionSchema } from '@shared/types/collection';
import { TagSchema } from '@shared/types/tag';


export const BackupPayloadSchema = z.object({
  version: z.string().default('1.0.0'),
  exportedAt: z.string().datetime(),
  bookmarks: z.array(BookmarkSchema).default([]),
  collections: z.array(CollectionSchema).default([]),
  tags: z.array(TagSchema).default([]),
});


export type BackupPayload = z.infer<typeof BackupPayloadSchema>;


export const BACKUP_VERSION = '1.0.0';

