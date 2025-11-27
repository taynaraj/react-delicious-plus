
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Collection } from '@shared/types/collection';
import { collectionsService } from '../services/collections.service';

interface CollectionsState {
  collections: Collection[];
  
  isLoading: boolean;
  error: string | null;
  
  searchQuery: string;
  
  loadCollections: () => Promise<void>;
  addCollection: (collection: Omit<Collection, 'id' | 'createdAt'>) => Promise<Collection>;
  updateCollection: (id: string, updates: Partial<Collection>) => Promise<Collection>;
  deleteCollection: (id: string) => Promise<void>;
  
  // Métodos de importação (backup/restore)
  importReplace: (collections: Collection[]) => Promise<void>;
  importMerge: (collections: Collection[]) => Promise<Record<string, string>>;
  
  // Actions de filtros
  setSearchQuery: (query: string) => void;
  clearFilters: () => void;
}


export const useCollectionsStore = create<CollectionsState>()(
  persist(
    (set, get) => ({
      // Estado inicial
      collections: [],
      isLoading: false,
      error: null,
      searchQuery: '',

    
      loadCollections: async () => {
        set({ isLoading: true, error: null });
        try {
          const response = await collectionsService.getCollections();
          set({ collections: response.collections || [], isLoading: false });
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Erro ao carregar collections';
          set({ error: message, isLoading: false });
        }
      },

      
      addCollection: async (collectionData) => {
        set({ isLoading: true, error: null });
        try {
          const response = await collectionsService.createCollection(collectionData);
          const newCollection = response.collection;
          set((state) => ({
            collections: [...state.collections, newCollection],
            isLoading: false,
          }));
          return newCollection;
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Erro ao criar collection';
          set({ error: message, isLoading: false });
          throw error;
        }
      },


      updateCollection: async (id, updates) => {
        set({ isLoading: true, error: null });
        try {
          const response = await collectionsService.updateCollection(id, updates);
          const updated = response.collection;
          set((state) => ({
            collections: state.collections.map((c) => (c.id === id ? updated : c)),
            isLoading: false,
          }));
          return updated;
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Erro ao atualizar collection';
          set({ error: message, isLoading: false });
          throw error;
        }
      },


      deleteCollection: async (id) => {
        set({ isLoading: true, error: null });
        try {
          await collectionsService.deleteCollection(id);
          set((state) => ({
            collections: state.collections.filter((c) => c.id !== id),
            isLoading: false,
          }));
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Erro ao deletar collection';
          set({ error: message, isLoading: false });
          throw error;
        }
      },

      importReplace: async (collectionsToImport) => {
        set({ isLoading: true, error: null });
        try {

          const currentCollections = get().collections;
          for (const collection of currentCollections) {
            try {
              await collectionsService.deleteCollection(collection.id);
            } catch (error) {
              console.warn('Erro ao deletar collection durante import:', error);
            }
          }


          const createdCollections: Collection[] = [];
          for (const collectionData of collectionsToImport) {
            try {
              const response = await collectionsService.createCollection({
                name: collectionData.name,
                emoji: collectionData.emoji || null,
              });
              createdCollections.push(response.collection);
            } catch (error) {
              console.warn('Erro ao criar collection durante import:', error);
            }
          }

          set({ collections: createdCollections, isLoading: false });
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Erro ao importar collections';
          set({ error: message, isLoading: false });
          throw error;
        }
      },

      importMerge: async (collectionsToImport) => {
        set({ isLoading: true, error: null });
        try {
          await get().loadCollections();
          const currentCollections = get().collections;
          const allCollections = [...currentCollections];
          const collectionMap: Record<string, string> = {}; 

          for (const collectionData of collectionsToImport) {
            const existingByName = currentCollections.find(
              (c) => c.name.toLowerCase() === collectionData.name.toLowerCase()
            );

            if (existingByName) {
              collectionMap[collectionData.id] = existingByName.id;
            } else {
              const existingById = currentCollections.find((c) => c.id === collectionData.id);
              
              if (existingById) {
                try {
                  const response = await collectionsService.updateCollection(collectionData.id, {
                    name: collectionData.name,
                    emoji: collectionData.emoji || null,
                  });
                  const index = allCollections.findIndex((c) => c.id === collectionData.id);
                  if (index >= 0) {
                    allCollections[index] = response.collection;
                  }
                  collectionMap[collectionData.id] = response.collection.id;
                } catch (error) {
                  console.warn('Erro ao atualizar collection durante import:', error);
                }
              } else {
                try {
                  const response = await collectionsService.createCollection({
                    name: collectionData.name,
                    emoji: collectionData.emoji || null,
                  });
                  allCollections.push(response.collection);
                  collectionMap[collectionData.id] = response.collection.id;
                } catch (error: any) {
                  if (error?.message?.includes('already exists') || error?.message?.includes('duplicate')) {
                    await get().loadCollections();
                    const found = get().collections.find(
                      (c) => c.name.toLowerCase() === collectionData.name.toLowerCase()
                    );
                    if (found) {
                      collectionMap[collectionData.id] = found.id;
                    }
                  } else {
                    console.warn('Erro ao criar collection durante import:', error);
                  }
                }
              }
            }
          }

          await get().loadCollections();
          return collectionMap;
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Erro ao mesclar collections';
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
      name: 'collections-store',
      partialize: (state) => ({
        collections: state.collections,
      }),
    }
  )
);

export const useCollectionsSelector = {
  useCollections: () => useCollectionsStore((state) => state.collections),

  useIsLoading: () => useCollectionsStore((state) => state.isLoading),
  useError: () => useCollectionsStore((state) => state.error),
};

