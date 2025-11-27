import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Bookmark } from "@shared/types/bookmark";
import { bookmarksService } from "@services/bookmarksService";
import { useTagsStore } from "@features/tags/store/tagsStore";

interface BookmarksState {
  // Dados
  bookmarks: Bookmark[];

  // Estados de UI
  isLoading: boolean;
  error: string | null;

  // Filtros e busca
  searchQuery: string;
  selectedTag: string | null;
  selectedCollection: string | null;
  favoriteFilter: boolean | null;
  readFilter: boolean | null;

  // Estados derivados (computed)
  getFilteredBookmarks: () => Bookmark[];
  getBookmarksByTag: (tag: string) => Bookmark[];
  getBookmarksByCollection: (collectionId: string) => Bookmark[];

  loadBookmarks: () => Promise<void>;
  addBookmark: (
    bookmark: Omit<Bookmark, "id" | "createdAt" | "updatedAt">
  ) => Promise<Bookmark>;
  updateBookmark: (id: string, updates: Partial<Bookmark>) => Promise<Bookmark>;
  deleteBookmark: (id: string) => Promise<void>;
  toggleFavorite: (id: string) => Promise<void>;
  toggleRead: (id: string) => Promise<void>;

  // Métodos de importação
  importReplace: (bookmarks: Bookmark[]) => Promise<void>;
  importMerge: (bookmarks: Bookmark[], collectionMap?: Record<string, string>, tagMap?: Record<string, string>) => Promise<void>;

  // Actions de filtros
  setSearchQuery: (query: string) => void;
  setSelectedTag: (tag: string | null) => void;
  setSelectedCollection: (collectionId: string | null) => void;
  setFavoriteFilter: (value: boolean | null) => void;
  setReadFilter: (value: boolean | null) => void;
  clearFilters: () => void;
}

function mapAndSyncTags(tags: any[]): Array<{ id: string; name: string }> {
  const mappedTags = Array.isArray(tags)
    ? tags.map((t: any) => ({
        id: t?.id || '',
        name: t?.name || '',
      })).filter((t: any) => t.id && t.name)
    : [];

  // Sincronizar tags com tagsStore
  const { addTagIfNotExists } = useTagsStore.getState();
  mappedTags.forEach((tag) => {
    addTagIfNotExists(tag);
  });

  return mappedTags;
}

export const useBookmarksStore = create<BookmarksState>()(
  persist(
    (set, get) => ({
      // Estado inicial
      bookmarks: [],
      isLoading: false,
      error: null,
      searchQuery: "",
      selectedTag: null,
      selectedCollection: null,
      favoriteFilter: null,
      readFilter: null,

      getFilteredBookmarks: () => {
        const {
          bookmarks,
          searchQuery,
          selectedTag,
          selectedCollection,
          favoriteFilter,
          readFilter,
        } = get();

        let filtered = [...bookmarks];

        // Filtro de busca texto
        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase();
          filtered = filtered.filter(
            (bookmark) =>
              bookmark.title.toLowerCase().includes(query) ||
              bookmark.url.toLowerCase().includes(query) ||
              (bookmark.description?.toLowerCase().includes(query) ?? false)
          );
        }

          // Filtro por tag
          if (selectedTag) {
            filtered = filtered.filter((bookmark) =>
              bookmark.tags.some((t) => {
                const tagName = typeof t === 'string' ? t : t.name;
                return tagName.toLowerCase() === selectedTag.toLowerCase();
              })
            );
          }

        // Filtro por coleção
        if (selectedCollection) {
          filtered = filtered.filter(
            (bookmark) => bookmark.collectionId === selectedCollection
          );
        }

        // Filtro por favorito
        if (favoriteFilter !== null) {
          filtered = filtered.filter(
            (bookmark) => bookmark.favorite === favoriteFilter
          );
        }

        // Filtro por lido
        if (readFilter !== null) {
          filtered = filtered.filter(
            (bookmark) => bookmark.read === readFilter
          );
        }

        return filtered;
      },

      getBookmarksByTag: (tag: string) => {
        const { bookmarks } = get();
        return bookmarks.filter((bookmark) =>
          bookmark.tags.some((t) => {
            const tagName = typeof t === 'string' ? t : t.name;
            return tagName.toLowerCase() === tag.toLowerCase();
          })
        );
      },
      

      getBookmarksByCollection: (collectionId: string) => {
        const { bookmarks } = get();
        return bookmarks.filter(
          (bookmark) => bookmark.collectionId === collectionId
        );
      },


      loadBookmarks: async () => {
        set({ isLoading: true, error: null });
        try {
          const {
            searchQuery,
            selectedTag,
            selectedCollection,
            favoriteFilter,
            readFilter,
          } = get();

          const params: any = {
            limit: 100, 
            offset: 0,
          };

          if (searchQuery.trim()) {
            params.search = searchQuery.trim();
          }

          if (selectedTag) {
            params.tag = selectedTag;
          }

          if (selectedCollection) {
            params.collectionId = selectedCollection;
          }

          if (favoriteFilter !== null) {
            params.isFavorite = favoriteFilter;
          }

          if (readFilter !== null) {
            params.isRead = readFilter;
          }

          const response = await bookmarksService.getBookmarks(params);


          const bookmarks: Bookmark[] = response.data
            .filter(
              (b: any) => b.id && typeof b.id === "string" && b.id.length > 0
            )
            .map((b: any) => ({
              id: b.id, 
              title: b.title,
              url: b.url,
              description: b.description || "",
              tags: mapAndSyncTags(b.tags),
              collectionId:
                (b.collection as any)?.id || b.collectionId || undefined,
              // O backend retorna isFavorite/isRead, mas pode também retornar favorite/read
              favorite: b.favorite ?? b.isFavorite ?? false, 
              read: b.read ?? b.isRead ?? false, 
              image: b.image || null,
              createdAt: b.createdAt,
              updatedAt: b.updatedAt,
            }));

          set({ bookmarks, isLoading: false });
        } catch (error) {
          const message =
            error instanceof Error
              ? error.message
              : "Erro ao carregar bookmarks";
          console.error("Erro ao carregar bookmarks:", error);
          set({ error: message, isLoading: false });
        }
      },

      addBookmark: async (bookmarkData) => {
        set({ isLoading: true, error: null });
        try {
          const payload = {
            title: bookmarkData.title,
            url: bookmarkData.url,
            description: bookmarkData.description || null,
            image: bookmarkData.image || null,
            tags: (() => {
              // Converter tags de { id, name }[] para string[]
              if (Array.isArray(bookmarkData.tags)) {
                return bookmarkData.tags.map((t: any) => {
                  if (typeof t === 'string') return t;
                  if (t && typeof t === 'object' && t.name) return t.name;
                  return '';
                }).filter(Boolean);
              }
              return [];
            })(),
            collectionId: bookmarkData.collectionId || null,
            favorite: bookmarkData.favorite || false,
            read: bookmarkData.read || false,
          };


          const response = await bookmarksService.createBookmark(payload);

          if (!response.bookmark?.id) {
            throw new Error("Backend não retornou ID válido para o bookmark");
          }

          const tags = mapAndSyncTags(response.bookmark.tags);

          const newBookmark: Bookmark = {
            id: response.bookmark.id, 
            title: response.bookmark.title,
            url: response.bookmark.url,
            description: response.bookmark.description || "",
            tags,
            collectionId:
              (response.bookmark as any).collection?.id ||
              response.bookmark.collectionId ||
              undefined,
            favorite: (response.bookmark as any).favorite ?? (response.bookmark as any).isFavorite ?? false,
            read: (response.bookmark as any).read ?? (response.bookmark as any).isRead ?? false,
            image: response.bookmark.image || null,
            createdAt: response.bookmark.createdAt,
            updatedAt: response.bookmark.updatedAt,
          };

          // Bookmark criado com ID do backend

          set((state) => ({
            bookmarks: [...state.bookmarks, newBookmark],
            isLoading: false,
          }));
          return newBookmark;
        } catch (error) {
          const message =
            error instanceof Error ? error.message : "Erro ao criar bookmark";
          console.error("Erro ao criar bookmark:", error);
          set({ error: message, isLoading: false });
          throw error;
        }
      },

      updateBookmark: async (id, updates) => {
        if (!id || typeof id !== "string" || id.length === 0) {
          throw new Error("ID inválido para atualização");
        }

        set({ isLoading: true, error: null });
        try {
          const existing = get().bookmarks.find((b) => b.id === id);
          if (!existing) {
            throw new Error(
              `Bookmark com ID ${id} não encontrado no store. Recarregue a lista.`
            );
          }

          const updateData: any = {};

          if (updates.title !== undefined) updateData.title = updates.title;
          if (updates.url !== undefined) updateData.url = updates.url;
          if (updates.description !== undefined)
            updateData.description = updates.description || null;
          if (updates.image !== undefined)
            updateData.image = updates.image || null;
          if (updates.tags !== undefined) updateData.tags = updates.tags;
          if (updates.collectionId !== undefined)
            updateData.collectionId = updates.collectionId || null;
          if (updates.favorite !== undefined)
            updateData.favorite = updates.favorite;
          if (updates.read !== undefined) updateData.read = updates.read;

          const response = await bookmarksService.updateBookmark(
            id,
            updateData
          );

          // Validar que o backend retornou o mesmo ID
          if (response.bookmark.id !== id) {
            throw new Error(
              "ID retornado pelo backend não corresponde ao ID enviado"
            );
          }


          const updated: Bookmark = {
            id: response.bookmark.id, 
            title: response.bookmark.title,
            url: response.bookmark.url,
            description: response.bookmark.description || "",
            tags: mapAndSyncTags(response.bookmark.tags),
            collectionId:
              (response.bookmark as any).collection?.id ||
              response.bookmark.collectionId ||
              undefined,
            favorite: (response.bookmark as any).favorite ?? (response.bookmark as any).isFavorite ?? false,
            read: (response.bookmark as any).read ?? (response.bookmark as any).isRead ?? false,
            image: response.bookmark.image || null,
            createdAt: response.bookmark.createdAt,
            updatedAt: response.bookmark.updatedAt,
          };

          set((state) => ({
            bookmarks: state.bookmarks.map((b) => (b.id === id ? updated : b)),
            isLoading: false,
          }));
          return updated;
        } catch (error) {
          const message =
            error instanceof Error
              ? error.message
              : "Erro ao atualizar bookmark";
          console.error("Erro ao atualizar bookmark:", error);
          set({ error: message, isLoading: false });
          throw error;
        }
      },

      deleteBookmark: async (id) => {
        if (!id || typeof id !== "string" || id.length === 0) {
          throw new Error("ID inválido para exclusão");
        }

        set({ isLoading: true, error: null });
        try {
          const existing = get().bookmarks.find((b) => b.id === id);
          if (!existing) {
            throw new Error(
              `Bookmark com ID ${id} não encontrado no store. Recarregue a lista.`
            );
          }

          await bookmarksService.deleteBookmark(id);
          set((state) => ({
            bookmarks: state.bookmarks.filter((b) => b.id !== id),
            isLoading: false,
          }));
        } catch (error) {
          const message =
            error instanceof Error ? error.message : "Erro ao deletar bookmark";
          console.error("Erro ao deletar bookmark:", error);
          set({ error: message, isLoading: false });
          throw error;
        }
      },

      toggleFavorite: async (id) => {
        if (!id || typeof id !== "string" || id.length === 0) {
          throw new Error("ID inválido para toggle favorite");
        }

        const bookmark = get().bookmarks.find((b) => b.id === id);
        if (!bookmark) {
          throw new Error(
            `Bookmark com ID ${id} não encontrado no store. Recarregue a lista.`
          );
        }

        if (
          !bookmark.id ||
          typeof bookmark.id !== "string" ||
          bookmark.id.length === 0
        ) {
          throw new Error(
            "Bookmark no store possui ID inválido. Recarregue a lista."
          );
        }

        const previousFavorite = bookmark.favorite;
        const newFavoriteValue = !previousFavorite;

        // Atualização otimista: atualizar estado imediatamente
        set((state) => ({
          bookmarks: state.bookmarks.map((b) =>
            b.id === id ? { ...b, favorite: newFavoriteValue } : b
          ),
        }));

        try {
          const response = await bookmarksService.toggleFavorite(
            bookmark.id,
            previousFavorite
          );

          if (!response.bookmark) {
            throw new Error("Backend não retornou bookmark válido");
          }

          if (response.bookmark.id !== bookmark.id) {
            throw new Error(
              "ID retornado pelo backend não corresponde ao ID enviado"
            );
          }

          const favoriteValue = (response.bookmark as any).favorite ?? (response.bookmark as any).isFavorite ?? false;
          const currentRead = bookmark.read;

          const updated: Bookmark = {
            id: response.bookmark.id, 
            title: response.bookmark.title,
            url: response.bookmark.url,
            description: response.bookmark.description || "",
            tags: mapAndSyncTags(response.bookmark.tags),
            collectionId:
              (response.bookmark as any).collection?.id ||
              response.bookmark.collectionId ||
              undefined,
            favorite: favoriteValue,
            read: currentRead,
            image: response.bookmark.image || null,
            createdAt: response.bookmark.createdAt,
            updatedAt: response.bookmark.updatedAt,
          };

          set((state) => ({
            bookmarks: state.bookmarks.map((b) =>
              b.id === bookmark.id ? updated : b
            ),
          }));
        } catch (error: any) {
          set((state) => ({
            bookmarks: state.bookmarks.map((b) =>
              b.id === id ? { ...b, favorite: previousFavorite } : b
            ),
          }));
          
          const errorMessage = error?.response?.data?.message || error?.message || 'Erro ao atualizar favorito no servidor';
          throw new Error(errorMessage);
        }
      },

      toggleRead: async (id) => {
        if (!id || typeof id !== "string" || id.length === 0) {
          throw new Error("ID inválido para toggle read");
        }

        const bookmark = get().bookmarks.find((b) => b.id === id);
        if (!bookmark) {
          throw new Error(
            `Bookmark com ID ${id} não encontrado no store. Recarregue a lista.`
          );
        }

        // Atualização otimista: atualizar estado imediatamente
        const previousRead = bookmark.read;
        const newReadValue = !previousRead;

        set((state) => ({
          bookmarks: state.bookmarks.map((b) =>
            b.id === id ? { ...b, read: newReadValue } : b
          ),
        }));

        try {
          const response = await bookmarksService.toggleRead(id, previousRead);

          if (response.bookmark.id !== id) {
            throw new Error(
              "ID retornado pelo backend não corresponde ao ID enviado"
            );
          }

          const readValue = (response.bookmark as any).read ?? (response.bookmark as any).isRead ?? false;
          const currentFavorite = bookmark.favorite;

          const updated: Bookmark = {
            id: response.bookmark.id, 
            title: response.bookmark.title,
            url: response.bookmark.url,
            description: response.bookmark.description || "",
            tags: mapAndSyncTags(response.bookmark.tags),
            collectionId:
              (response.bookmark as any).collection?.id ||
              response.bookmark.collectionId ||
              undefined,
            favorite: currentFavorite,
            read: readValue,
            image: response.bookmark.image || null,
            createdAt: response.bookmark.createdAt,
            updatedAt: response.bookmark.updatedAt,
          };

          set((state) => ({
            bookmarks: state.bookmarks.map((b) => (b.id === id ? updated : b)),
          }));
        } catch (error: any) {
          set((state) => ({
            bookmarks: state.bookmarks.map((b) =>
              b.id === id ? { ...b, read: previousRead } : b
            ),
          }));
          
          const errorMessage = error?.response?.data?.message || error?.message || 'Erro ao atualizar status de leitura no servidor';
          throw new Error(errorMessage);
        }
      },

      setSearchQuery: (query) => set({ searchQuery: query }),
      setSelectedTag: (tag) => set({ selectedTag: tag }),
      setSelectedCollection: (collectionId) =>
        set({ selectedCollection: collectionId }),
      setFavoriteFilter: (value) => set({ favoriteFilter: value }),
      setReadFilter: (value) => set({ readFilter: value }),
      clearFilters: () =>
        set({
          searchQuery: "",
          selectedTag: null,
          selectedCollection: null,
          favoriteFilter: null,
          readFilter: null,
        }),

      importReplace: async (bookmarksToImport) => {
        set({ isLoading: true, error: null });
        try {
          // Deletar todos os bookmarks existentes
          const currentBookmarks = get().bookmarks;
          for (const bookmark of currentBookmarks) {
            try {
              await bookmarksService.deleteBookmark(bookmark.id);
            } catch (error) {
              console.warn("Erro ao deletar bookmark durante import:", error);
            }
          }

          // Criar todos os bookmarks importados via API
          const createdBookmarks: Bookmark[] = [];
          for (const bookmarkData of bookmarksToImport) {
            try {
              // Converter tags de { id, name }[] para string[]
              let tagsArray: string[] = [];
              if (Array.isArray(bookmarkData.tags)) {
                tagsArray = bookmarkData.tags.map((t: any) => {
                  if (typeof t === 'string') {
                    return t;
                  } else if (t && typeof t === 'object' && t.name) {
                    return t.name;
                  }
                  return '';
                }).filter(Boolean);
              }

              const response = await bookmarksService.createBookmark({
                title: bookmarkData.title,
                url: bookmarkData.url,
                description: bookmarkData.description || null,
                image: bookmarkData.image || null,
                tags: tagsArray,
                collectionId: bookmarkData.collectionId || null,
                favorite: bookmarkData.favorite || false,
                read: bookmarkData.read || false,
              });

              const newBookmark: Bookmark = {
                id: response.bookmark.id,
                title: response.bookmark.title,
                url: response.bookmark.url,
                description: response.bookmark.description || "",
                tags: mapAndSyncTags(response.bookmark.tags),
                collectionId:
                  (response.bookmark as any).collection?.id ||
                  response.bookmark.collectionId ||
                  undefined,
                favorite: response.bookmark.favorite || false,
                read: response.bookmark.read || false,
                image: response.bookmark.image || null,
                createdAt: response.bookmark.createdAt,
                updatedAt: response.bookmark.updatedAt,
              };

              createdBookmarks.push(newBookmark);
            } catch (error) {
              console.warn("Erro ao criar bookmark durante import:", error);
            }
          }

          set({ bookmarks: createdBookmarks, isLoading: false });
        } catch (error) {
          const message =
            error instanceof Error
              ? error.message
              : "Erro ao importar bookmarks";
          set({ error: message, isLoading: false });
          throw error;
        }
      },

      /**
       * Importa bookmarks mesclando com os existentes
       */
      importMerge: async (bookmarksToImport, collectionMap?: Record<string, string>) => {
        set({ isLoading: true, error: null });
        try {
          const currentBookmarks = get().bookmarks.filter(
            (b) => b.id && typeof b.id === "string" && b.id.length > 0
          );
          const allBookmarks = [...currentBookmarks];

          for (const bookmarkData of bookmarksToImport) {
            let tagsArray: string[] = [];
            if (Array.isArray(bookmarkData.tags)) {
              tagsArray = bookmarkData.tags.map((t: any) => {
                if (typeof t === 'string') {
                  return t;
                } else if (t && typeof t === 'object' && t.name) {
                  return t.name;
                }
                return '';
              }).filter(Boolean);
            }

            let mappedCollectionId: string | null = null;
            if (bookmarkData.collectionId && collectionMap) {
              mappedCollectionId = collectionMap[bookmarkData.collectionId] || null;
            } else if (bookmarkData.collectionId) {
              const { useCollectionsStore } = await import('@features/collections/store');
              const existingCollections = useCollectionsStore.getState().collections;
              const found = existingCollections.find(
                (c) => c.id === bookmarkData.collectionId
              );
              mappedCollectionId = found ? found.id : null;
            }
            const hasValidId =
              bookmarkData.id &&
              typeof bookmarkData.id === "string" &&
              bookmarkData.id.length > 0;
            const existing = hasValidId
              ? allBookmarks.find((b) => b.id === bookmarkData.id)
              : null;

            if (existing && hasValidId) {
              try {
                const response = await bookmarksService.updateBookmark(
                  bookmarkData.id,
                  {
                    title: bookmarkData.title,
                    url: bookmarkData.url,
                    description: bookmarkData.description || null,
                    image: bookmarkData.image || null,
                    tags: tagsArray,
                    collectionId: mappedCollectionId,
                    favorite: bookmarkData.favorite || false,
                    read: bookmarkData.read || false,
                  }
                );

                const updated: Bookmark = {
                  id: response.bookmark.id, 
                  title: response.bookmark.title,
                  url: response.bookmark.url,
                  description: response.bookmark.description || "",
                  tags:
                    Array.isArray(response.bookmark.tags) ? response.bookmark.tags : [],
                  collectionId:
                    (response.bookmark as any).collection?.id ||
                    response.bookmark.collectionId ||
                    undefined,
                  favorite: (response.bookmark as any).favorite ?? (response.bookmark as any).isFavorite ?? false,
                  read: (response.bookmark as any).read ?? (response.bookmark as any).isRead ?? false,
                  image: response.bookmark.image || null,
                  createdAt: response.bookmark.createdAt,
                  updatedAt: response.bookmark.updatedAt,
                };

                const index = allBookmarks.findIndex(
                  (b) => b.id === bookmarkData.id
                );
                if (index >= 0) {
                  allBookmarks[index] = updated;
                }
              } catch (error) {
                console.warn(
                  "Erro ao atualizar bookmark durante import, criando novo:",
                  error
                );
                try {
                  const response = await bookmarksService.createBookmark({
                    title: bookmarkData.title,
                    url: bookmarkData.url,
                    description: bookmarkData.description || null,
                    image: bookmarkData.image || null,
                    tags: tagsArray,
                    collectionId: mappedCollectionId,
                    favorite: bookmarkData.favorite || false,
                    read: bookmarkData.read || false,
                  });

                  const newBookmark: Bookmark = {
                    id: response.bookmark.id, 
                    title: response.bookmark.title,
                    url: response.bookmark.url,
                    description: response.bookmark.description || "",
                    tags: mapAndSyncTags(response.bookmark.tags),
                    collectionId:
                      (response.bookmark as any).collection?.id ||
                      response.bookmark.collectionId ||
                      undefined,
                    favorite: response.bookmark.favorite || false,
                    read: response.bookmark.read || false,
                    image: response.bookmark.image || null,
                    createdAt: response.bookmark.createdAt,
                    updatedAt: response.bookmark.updatedAt,
                  };

                  allBookmarks.push(newBookmark);
                } catch (createError) {
                  console.warn(
                    "Erro ao criar bookmark durante import:",
                    createError
                  );
                }
              }
            } else {
              try {
                const response = await bookmarksService.createBookmark({
                  title: bookmarkData.title,
                  url: bookmarkData.url,
                  description: bookmarkData.description || null,
                  image: bookmarkData.image || null,
                  tags: tagsArray,
                  collectionId: mappedCollectionId,
                  favorite: bookmarkData.favorite || false,
                  read: bookmarkData.read || false,
                });

                const newBookmark: Bookmark = {
                  id: response.bookmark.id, 
                  title: response.bookmark.title,
                  url: response.bookmark.url,
                  description: response.bookmark.description || "",
                  tags:
                    Array.isArray(response.bookmark.tags) ? response.bookmark.tags : [],
                  collectionId:
                    (response.bookmark as any).collection?.id ||
                    response.bookmark.collectionId ||
                    undefined,
                  favorite: (response.bookmark as any).favorite ?? (response.bookmark as any).isFavorite ?? false,
                  read: (response.bookmark as any).read ?? (response.bookmark as any).isRead ?? false,
                  image: response.bookmark.image || null,
                  createdAt: response.bookmark.createdAt,
                  updatedAt: response.bookmark.updatedAt,
                };

                allBookmarks.push(newBookmark);
              } catch (error) {
                console.warn("Erro ao criar bookmark durante import:", error);
              }
            }
          }

          set({ bookmarks: allBookmarks, isLoading: false });
        } catch (error) {
          const message =
            error instanceof Error
              ? error.message
              : "Erro ao mesclar bookmarks";
          set({ error: message, isLoading: false });
          throw error;
        }
      },
    }),
    {
      name: "bookmarks-store", 
      partialize: (state) => ({
        bookmarks: state.bookmarks.filter(
          (b) => b.id && typeof b.id === "string" && b.id.length > 0
        ),
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          const validBookmarks = state.bookmarks.filter(
            (b) => b.id && typeof b.id === "string" && b.id.length > 0
          );

          if (validBookmarks.length !== state.bookmarks.length) {
            state.bookmarks = validBookmarks;
          }
        }
      },
    }
  )
);

export const useBookmarksSelector = {
  useBookmarks: () => useBookmarksStore((state) => state.bookmarks),

  useFilteredBookmarks: () => {
    const bookmarks = useBookmarksStore((state) => state.bookmarks);
    const searchQuery = useBookmarksStore((state) => state.searchQuery);
    const selectedTag = useBookmarksStore((state) => state.selectedTag);
    const selectedCollection = useBookmarksStore(
      (state) => state.selectedCollection
    );
    const favoriteFilter = useBookmarksStore((state) => state.favoriteFilter);
    const readFilter = useBookmarksStore((state) => state.readFilter);

    return {
      bookmarks,
      searchQuery,
      selectedTag,
      selectedCollection,
      favoriteFilter,
      readFilter,
    };
  },

  useIsLoading: () => useBookmarksStore((state) => state.isLoading),

  useError: () => useBookmarksStore((state) => state.error),
};
