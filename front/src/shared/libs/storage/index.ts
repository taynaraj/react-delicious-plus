/**
 * STORAGE LIBRARY
 * 
 * Adapters para persistência offline-first (IndexedDB/localForage).
 * Equivalente a criar services de storage no Angular.
 * 
 * Arquitetura:
 * - Abstração sobre IndexedDB/localForage
 * - Repositórios por entidade (bookmarks, collections, tags)
 * - Operações assíncronas com error handling
 * 
 * TODO: Implementar:
 * - createStorageAdapter() - factory para criar adapters
 * - IndexedDBRepository<T> - classe base para repositórios
 * - bookmarksRepository, collectionsRepository, tagsRepository
 * - Backup/restore utilities
 */

// Exemplo de interface para repository (será expandido depois)
export interface IRepository<T> {
  findAll(): Promise<T[]>;
  findById(id: string): Promise<T | null>;
  create(entity: T): Promise<T>;
  update(id: string, entity: Partial<T>): Promise<T>;
  delete(id: string): Promise<void>;
}
