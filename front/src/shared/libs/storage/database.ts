

import Dexie, { Table } from 'dexie';
import type { Bookmark } from '@shared/types/bookmark';
import type { Collection } from '@shared/types/collection';
import type { Tag } from '@shared/types/tag';


class AppDatabase extends Dexie {
  // Tables (equivalentes a coleções/tabelas)
  bookmarks!: Table<Bookmark>;
  collections!: Table<Collection>;
  tags!: Table<Tag>;

  constructor() {
    super('ReactDeliciousDB');

    // Define o schema do banco
    // Versão 1: estrutura inicial
    this.version(1).stores({
      bookmarks: 'id, title, url, *tags, collectionId, favorite, read, image, createdAt, updatedAt',
      collections: 'id, name, createdAt',
      tags: 'id, name',
    });
  }
}


export const db = new AppDatabase();

/**
 * Função helper para garantir que o banco está pronto
 * 

 */
export async function initDatabase(): Promise<void> {
  try {
    // Dexie inicializa automaticamente ao criar a instância
    // Mas podemos adicionar verificações aqui se necessário
    await db.open();
  } catch (error) {
    console.error('Erro ao inicializar banco de dados:', error);
    throw error;
  }
}
