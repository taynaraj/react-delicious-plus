/**
 * DATABASE ADAPTER (IndexedDB via Dexie)
 * 
 * Configuração do banco de dados IndexedDB usando Dexie.
 * 
 * COMPARAÇÃO ANGULAR → REACT:
 * 
 * No Angular:
 * ```typescript
 * @Injectable({ providedIn: 'root' })
 * export class IndexedDBService {
 *   private db: IDBDatabase;
 *   
 *   async open(): Promise<void> {
 *     // Abrir conexão com IndexedDB
 *   }
 * }
 * ```
 * - Angular usa services para gerenciar conexão
 * - Poderia usar NgRx com effects para operações assíncronas
 * 
 * No React:
 * - Dexie é um wrapper simples sobre IndexedDB
 * - Mais fácil de usar que IndexedDB puro
 * - Equivalente a criar um service Angular, mas mais direto
 * 
 * VANTAGENS DO DEXIE:
 * - API mais simples que IndexedDB nativo
 * - TypeScript first
 * - Promises nativas (não precisa converter callbacks)
 * - Queries poderosas
 */

import Dexie, { Table } from 'dexie';
import type { Bookmark } from '@shared/types/bookmark';
import type { Collection } from '@shared/types/collection';
import type { Tag } from '@shared/types/tag';

/**
 * Classe do banco de dados Dexie
 * 
 * Dexie usa classes para definir o schema do banco.
 * Equivalente a definir entities no TypeORM/Angular.
 */
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

/**
 * Instância única do banco de dados
 * 
 * IMPORTANTE:
 * - Singleton pattern (uma única instância)
 * - Equivalente a injetar o mesmo service em todos os lugares no Angular
 * 
 * No Angular seria:
 * ```typescript
 * @Injectable({ providedIn: 'root' })
 * export class DatabaseService {
 *   private db = new AppDatabase();
 * }
 * ```
 */
export const db = new AppDatabase();

/**
 * Função helper para garantir que o banco está pronto
 * 
 * Útil para casos onde precisamos garantir que o banco foi inicializado
 * antes de fazer operações
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
