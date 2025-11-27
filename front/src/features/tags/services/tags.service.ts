import apiClient from '@/services/apiClient';
import type { Tag } from '@shared/types/tag';

export const tagsService = {
  /**
   * Listar todas as tags
   */
  async getTags(): Promise<{ tags: Tag[] }> {
    const response = await apiClient.get<{ tags: Tag[] }>('/api/tags');
    return response.data;
  },

  /**
   * Obter tag por ID
   */
  async getTagById(id: string): Promise<{ tag: Tag }> {
    const response = await apiClient.get<{ tag: Tag }>(`/api/tags/${id}`);
    return response.data;
  },

  /**
   * Criar tag
   */
  async createTag(data: { name: string }): Promise<{ tag: Tag }> {
    const response = await apiClient.post<{ tag: Tag }>('/api/tags', data);
    return response.data;
  },

  /**
   * Atualizar tag
   */
  async updateTag(id: string, data: Partial<{ name: string }>): Promise<{ tag: Tag }> {
    const response = await apiClient.patch<{ tag: Tag }>(`/api/tags/${id}`, data);
    return response.data;
  },

  /**
   * Deletar tag
   */
  async deleteTag(id: string): Promise<{ message: string }> {
    const response = await apiClient.delete<{ message: string }>(`/api/tags/${id}`);
    return response.data;
  },
};
