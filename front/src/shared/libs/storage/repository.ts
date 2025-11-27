
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
