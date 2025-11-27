/**
 * REPOSITORY BASE
 * 
 * Interface base para repositórios e implementação usando Dexie.
 * 
 * COMPARAÇÃO ANGULAR → REACT:
 * 
 * No Angular:
 * ```typescript
 * @Injectable({ providedIn: 'root' })
 * export abstract class BaseRepository<T> {
 *   abstract findAll(): Promise<T[]>;
 *   abstract findById(id: string): Promise<T | null>;
 *   // ...
 * }
 * 
 * @Injectable({ providedIn: 'root' })
 * export class BookmarksRepository extends BaseRepository<Bookmark> {
 *   constructor(private db: IndexedDBService) {}
 *   
 *   async findAll(): Promise<Bookmark[]> {
 *     return this.db.getAll('bookmarks');
 *   }
 * }
 * ```
 * - Angular usa classes abstratas e injeção de dependência
 * - Services são injetados via DI
 * 
 * No React:
 * - Usamos interfaces TypeScript (mais leve)
 * - Implementações são objetos/funções (não classes)
 * - Não há DI nativo, mas podemos criar factories
 * 
 * VANTAGENS:
 * - Mais simples que classes abstratas
 * - Mais flexível para composição
 * - Mesmo nível de type-safety
 */

/**
 * Interface base para repositórios
 * 
 * Define o contrato que todos os repositórios devem seguir.
 * Equivalente a uma classe abstrata no Angular.
 */
export interface IRepository<T> {
  /**
   * Busca todos os registros
   */
  findAll(): Promise<T[]>;
  
  /**
   * Busca um registro por ID
   */
  findById(id: string): Promise<T | null>;
  
  /**
   * Cria um novo registro
   */
  create(entity: Omit<T, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }): Promise<T>;
  
  /**
   * Atualiza um registro existente
   */
  update(id: string, entity: Partial<T>): Promise<T>;
  
  /**
   * Deleta um registro
   */
  delete(id: string): Promise<void>;
  
  /**
   * Conta o total de registros
   */
  count(): Promise<number>;
}

/**
 * Factory para criar um repository usando Dexie
 * 
 * Esta função cria um repository genérico que funciona com qualquer tabela do Dexie.
 * 
 * POR QUE FACTORY:
 * - Evita repetir código de CRUD em cada repository
 * - Centraliza lógica comum (timestamps, validação, etc)
 * - Facilita testes (podemos mockar o table)
 * 
 * No Angular seria um service genérico injetado:
 * ```typescript
 * constructor(private db: IndexedDBService) {}
 * ```
 */
export function createRepository<T extends { id: string; createdAt: string; updatedAt: string }>(
  table: any // Dexie.Table<T, string>
): IRepository<T> {
  return {
    async findAll(): Promise<T[]> {
      return table.toArray();
    },

    async findById(id: string): Promise<T | null> {
      const entity = await table.get(id);
      return entity || null;
    },

    async create(entity: Omit<T, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }): Promise<T> {
      const now = new Date().toISOString();
      const newEntity = {
        ...entity,
        id: entity.id || crypto.randomUUID(),
        createdAt: now,
        updatedAt: now,
      } as T;

      await table.add(newEntity);
      return newEntity;
    },

    async update(id: string, entity: Partial<T>): Promise<T> {
      const existing = await table.get(id);
      if (!existing) {
        throw new Error(`Entity with id ${id} not found`);
      }

      const updated = {
        ...existing,
        ...entity,
        id, // Garantir que o ID não seja alterado
        updatedAt: new Date().toISOString(),
      } as T;

      await table.put(updated);
      return updated;
    },

    async delete(id: string): Promise<void> {
      await table.delete(id);
    },

    async count(): Promise<number> {
      return table.count();
    },
  };
}
