import { z } from 'zod';
import type { BackupPayload } from '../schemas/backup.schema';
import { BackupPayloadSchema, BACKUP_VERSION } from '../schemas/backup.schema';
import { useBookmarksStore } from '@features/bookmarks/store';
import { useCollectionsStore } from '@features/collections/store';
import { useTagsStore } from '@features/tags/store';


export async function exportBackup(): Promise<BackupPayload> {
  // Obter dados de todos os stores
  const bookmarks = useBookmarksStore.getState().bookmarks;
  const collections = useCollectionsStore.getState().collections;
  const tags = useTagsStore.getState().tags;

  // Criar payload de backup
  const payload: BackupPayload = {
    version: BACKUP_VERSION,
    exportedAt: new Date().toISOString(),
    bookmarks: [...bookmarks],
    collections: [...collections],
    tags: [...tags],
  };

  // Validar com Zod antes de retornar
  const validated = BackupPayloadSchema.parse(payload);
  return validated;
}

export function validateBackupFile(jsonString: string): BackupPayload {
  try {
    const data = JSON.parse(jsonString);
    return BackupPayloadSchema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(`Arquivo de backup inválido: ${error.issues.map((issue) => issue.message).join(', ')}`);
    }
    if (error instanceof SyntaxError) {
      throw new Error('Arquivo JSON inválido: erro de sintaxe');
    }
    throw new Error('Arquivo JSON inválido');
  }
}

