import apiClient from '@/services/apiClient';
import type { Collection } from '@shared/types/collection';

export const collectionsService = {
  /**
   * Listar todas as collections
   */
  async getCollections(): Promise<{ collections: Collection[] }> {
    const response = await apiClient.get<{ collections: Collection[] }>('/api/collections');
    return response.data;
  },

  /**
   * Obter collection por ID
   */
  async getCollectionById(id: string): Promise<{ collection: Collection }> {
    const response = await apiClient.get<{ collection: Collection }>(`/api/collections/${id}`);
    return response.data;
  },

  /**
   * Criar collection
   */
  async createCollection(data: { name: string; emoji?: string | null }): Promise<{ collection: Collection }> {
    const response = await apiClient.post<{ collection: Collection }>('/api/collections', data);
    return response.data;
  },

  /**
   * Atualizar collection
   */
  async updateCollection(id: string, data: Partial<{ name: string; emoji?: string | null }>): Promise<{ collection: Collection }> {
    const response = await apiClient.patch<{ collection: Collection }>(`/api/collections/${id}`, data);
    return response.data;
  },

  /**
   * Deletar collection
   */
  async deleteCollection(id: string): Promise<{ message: string }> {
    const response = await apiClient.delete<{ message: string }>(`/api/collections/${id}`);
    return response.data;
  },
};
