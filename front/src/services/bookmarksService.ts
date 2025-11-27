import apiClient from './apiClient';
import type { Bookmark } from '@shared/types/bookmark';

export interface GetBookmarksParams {
  search?: string;
  tag?: string;
  collectionId?: string;
  isFavorite?: boolean;
  isRead?: boolean;
  limit?: number;
  offset?: number;
}

export interface GetBookmarksResponse {
  data: Bookmark[];
  total: number;
  limit: number;
  offset: number;
}

export interface CreateBookmarkData {
  title: string;
  url: string;
  description?: string | null;
  image?: string | null;
  tags?: string[];
  collectionId?: string | null;
  favorite?: boolean;
  read?: boolean;
}

export interface UpdateBookmarkData extends Partial<CreateBookmarkData> {
  id: string;
}

export const bookmarksService = {
  async getBookmarks(params: GetBookmarksParams = {}): Promise<GetBookmarksResponse> {
    const queryParams = new URLSearchParams();
    
    if (params.search) queryParams.append('search', params.search);
    if (params.tag) queryParams.append('tag', params.tag);
    if (params.collectionId) queryParams.append('collectionId', params.collectionId);
    if (params.isFavorite !== undefined) queryParams.append('isFavorite', String(params.isFavorite));
    if (params.isRead !== undefined) queryParams.append('isRead', String(params.isRead));
    if (params.limit) queryParams.append('limit', String(params.limit));
    if (params.offset) queryParams.append('offset', String(params.offset));

    const queryString = queryParams.toString();
    const path = `/api/bookmarks${queryString ? `?${queryString}` : ''}`;

    const response = await apiClient.get<GetBookmarksResponse>(path);
    return response.data;
  },

  async getBookmarkById(id: string): Promise<{ bookmark: Bookmark }> {
    const response = await apiClient.get<{ bookmark: Bookmark }>(`/api/bookmarks/${id}`);
    return response.data;
  },

  async createBookmark(data: CreateBookmarkData): Promise<{ bookmark: Bookmark }> {
    const { id, ...payload } = data as any;
    
    if (payload.tags && Array.isArray(payload.tags)) {
      payload.tags = payload.tags.map((t: any) => {
        if (typeof t === 'string') return t;
        if (t && typeof t === 'object' && t.name) return t.name;
        return '';
      }).filter(Boolean);
    } else {
      payload.tags = [];
    }
    
    const response = await apiClient.post<{ bookmark: Bookmark }>('/api/bookmarks', payload);
    return response.data;
  },

  async updateBookmark(id: string, data: Partial<CreateBookmarkData>): Promise<{ bookmark: Bookmark }> {
    if (!id || typeof id !== 'string' || id.length === 0) {
      throw new Error('ID inválido para atualização');
    }

    const { id: payloadId, ...payload } = data as any;
    
    if (payload.tags && Array.isArray(payload.tags)) {
      payload.tags = payload.tags.map((t: any) => {
        if (typeof t === 'string') return t;
        if (t && typeof t === 'object' && t.name) return t.name;
        return '';
      }).filter(Boolean);
    }
    
    const response = await apiClient.patch<{ bookmark: Bookmark }>(`/api/bookmarks/${id}`, payload);
    return response.data;
  },

  async deleteBookmark(id: string): Promise<{ message: string }> {
    if (!id || typeof id !== 'string' || id.length === 0) {
      throw new Error('ID inválido para exclusão');
    }
    
    const response = await apiClient.delete<{ message: string }>(`/api/bookmarks/${id}`);
    return response.data;
  },

  async toggleFavorite(id: string, currentValue: boolean): Promise<{ bookmark: Bookmark }> {
    if (!id || typeof id !== 'string' || id.length === 0) {
      throw new Error('ID inválido para toggle favorite');
    }
    
    const response = await apiClient.patch<{ bookmark: Bookmark }>(`/api/bookmarks/${id}`, { favorite: !currentValue });
    return response.data;
  },

  async toggleRead(id: string, currentValue: boolean): Promise<{ bookmark: Bookmark }> {
    if (!id || typeof id !== 'string' || id.length === 0) {
      throw new Error('ID inválido para toggle read');
    }
    
    const response = await apiClient.patch<{ bookmark: Bookmark }>(`/api/bookmarks/${id}`, { read: !currentValue });
    return response.data;
  },
};

