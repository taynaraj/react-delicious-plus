
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Tag } from '@shared/types/tag';
import apiClient from '@/services/apiClient';

interface TagsState {
  // Dados
  tags: Tag[];
  
  // Estados de UI
  isLoading: boolean;
  error: string | null;
  
  // Filtros e busca
  searchQuery: string;
  
  loadTags: () => Promise<void>; 
  addTagIfNotExists: (tag: Tag) => void; 
  importReplace: (tags: Tag[]) => Promise<void>; 
  importMerge: (tags: Tag[]) => Promise<Record<string, string>>; 
  setSearchQuery: (query: string) => void;
  clearFilters: () => void;
}


export const useTagsStore = create<TagsState>()(
  persist(
    (set, get) => ({
      tags: [],
      isLoading: false,
      error: null,
      searchQuery: '',

      loadTags: async () => {
        set({ isLoading: true, error: null });
        try {
          const response = await apiClient.get<{ tags: Tag[] }>('/api/tags');
          const tags = response.data.tags || [];
          set({ tags, isLoading: false });
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Erro ao carregar tags';
          set({ error: message, isLoading: false });
        }
      },

      addTagIfNotExists: (tag: Tag) => {
        const { tags } = get();
        const exists = tags.some(
          (t) => t.id === tag.id || t.name.toLowerCase() === tag.name.toLowerCase()
        );
        
        if (!exists) {
          set((state) => ({
            tags: [...state.tags, tag],
          }));
        }
      },
      
      // Métodos de importacao de backups
      importReplace: async (tagsToImport) => {
        set({ isLoading: true, error: null });
        try {
          await get().loadTags();
          
          const createdTags: Tag[] = [];
          for (const tagData of tagsToImport) {
            try {
              const response = await apiClient.post<{ tag: Tag }>('/api/tags', {
                name: tagData.name,
              });
              createdTags.push(response.data.tag);
            } catch (error: any) {
              if (error?.message?.includes('already exists') || error?.message?.includes('duplicate')) {
                await get().loadTags();
                const found = get().tags.find(
                  (t) => t.name.toLowerCase() === tagData.name.toLowerCase()
                );
                if (found) {
                  createdTags.push(found);
                }
              } else {
                console.warn('Erro ao criar tag durante import:', error);
              }
            }
          }

          await get().loadTags();
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Erro ao importar tags';
          set({ error: message, isLoading: false });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      importMerge: async (tagsToImport) => {
        set({ isLoading: true, error: null });
        try {
          await get().loadTags();
          const currentTags = get().tags;
          const tagMap: Record<string, string> = {}; 

          for (const tagData of tagsToImport) {
            const existing = currentTags.find(
              (t) => t.name.toLowerCase() === tagData.name.toLowerCase()
            );

            if (existing) {
              tagMap[tagData.id] = existing.id;
            } else {
              const existingById = currentTags.find((t) => t.id === tagData.id);
              
              if (existingById) {
                tagMap[tagData.id] = existingById.id;
              } else {
                try {
                  const response = await apiClient.post<{ tag: Tag }>('/api/tags', {
                    name: tagData.name,
                  });
                  const newTag = response.data.tag;
                  set((state) => ({
                    tags: [...state.tags, newTag],
                  }));
                  tagMap[tagData.id] = newTag.id;
                } catch (error: any) {
                  if (error?.message?.includes('already exists') || error?.message?.includes('duplicate')) {
                    await get().loadTags();
                    const found = get().tags.find(
                      (t) => t.name.toLowerCase() === tagData.name.toLowerCase()
                    );
                    if (found) {
                      tagMap[tagData.id] = found.id;
                    }
                  } else {
                    console.warn('Erro ao criar tag durante import:', error);
                  }
                }
              }
            }
          }

          await get().loadTags();
          return tagMap;
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Erro ao mesclar tags';
          set({ error: message, isLoading: false });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      setSearchQuery: (query) => set({ searchQuery: query }),
      clearFilters: () => set({ searchQuery: '' }),
    }),
    {
      name: 'tags-store',
      partialize: (state) => ({
        tags: state.tags,
      }),
    }
  )
);

export const useTagsSelector = {
  useTags: () => useTagsStore((state) => state.tags),

  useIsLoading: () => useTagsStore((state) => state.isLoading),
  useError: () => useTagsStore((state) => state.error),
};

