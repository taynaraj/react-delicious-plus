import { useMemo } from 'react';
import { useBookmarksStore, useBookmarksSelector } from '../store';
import type { Bookmark, CreateBookmarkInput, UpdateBookmarkInput } from '@shared/types/bookmark';


export function useBookmarks() {
  const bookmarks = useBookmarksSelector.useBookmarks();
  const isLoading = useBookmarksSelector.useIsLoading();
  const error = useBookmarksSelector.useError();

  const searchQuery = useBookmarksStore((state) => state.searchQuery);
  const selectedTag = useBookmarksStore((state) => state.selectedTag);
  const selectedCollection = useBookmarksStore((state) => state.selectedCollection);
  const favoriteFilter = useBookmarksStore((state) => state.favoriteFilter);
  const readFilter = useBookmarksStore((state) => state.readFilter);

  const filteredBookmarks = useMemo(() => {
    let filtered = [...bookmarks];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (bookmark) =>
          bookmark.title.toLowerCase().includes(query) ||
          bookmark.url.toLowerCase().includes(query) ||
          (bookmark.description?.toLowerCase().includes(query) ?? false)
      );
    }

    if (selectedTag) {
      filtered = filtered.filter((bookmark) =>
        bookmark.tags.some((t) => {
          const tagName = typeof t === 'string' ? t : t.name;
          return tagName.toLowerCase() === selectedTag.toLowerCase();
        })
      );
    }

    if (selectedCollection) {
      filtered = filtered.filter((bookmark) => bookmark.collectionId === selectedCollection);
    }

    if (favoriteFilter !== null) {
      filtered = filtered.filter((bookmark) => bookmark.favorite === favoriteFilter);
    }

    if (readFilter !== null) {
      filtered = filtered.filter((bookmark) => bookmark.read === readFilter);
    }

    return filtered;
  }, [bookmarks, searchQuery, selectedTag, selectedCollection, favoriteFilter, readFilter]);

  // Actions do store - usar useShallow para evitar re-renders quando a função não muda
  const loadBookmarks = useBookmarksStore((state) => state.loadBookmarks);
  const addBookmark = useBookmarksStore((state) => state.addBookmark);
  const updateBookmark = useBookmarksStore((state) => state.updateBookmark);
  const deleteBookmark = useBookmarksStore((state) => state.deleteBookmark);
  const toggleFavorite = useBookmarksStore((state) => state.toggleFavorite);
  const toggleRead = useBookmarksStore((state) => state.toggleRead);

  // Actions de filtros
  const setSearchQuery = useBookmarksStore((state) => state.setSearchQuery);
  const setSelectedTag = useBookmarksStore((state) => state.setSelectedTag);
  const setSelectedCollection = useBookmarksStore((state) => state.setSelectedCollection);
  const setFavoriteFilter = useBookmarksStore((state) => state.setFavoriteFilter);
  const setReadFilter = useBookmarksStore((state) => state.setReadFilter);
  const clearFilters = useBookmarksStore((state) => state.clearFilters);

  // Helpers do store
  const getBookmarksByTag = useBookmarksStore((state) => state.getBookmarksByTag);
  const getBookmarksByCollection = useBookmarksStore((state) => state.getBookmarksByCollection);


  /**
   * Adiciona um novo bookmark com validação
   */
  const handleAddBookmark = async (bookmarkData: CreateBookmarkInput): Promise<void> => {
    try { 
      await addBookmark(bookmarkData as unknown as Omit<Bookmark, "id" | "createdAt" | "updatedAt">);
    } catch (error) {
      console.error('Erro ao adicionar bookmark:', error);
      throw error;
    }
  };

  const handleUpdateBookmark = async (
    id: string,
    updates: UpdateBookmarkInput
  ): Promise<void> => {
    try {
      await updateBookmark(id, updates as unknown as Partial<Bookmark>);
    } catch (error) {
      console.error('Erro ao atualizar bookmark:', error);
      throw error;
    }
  };

  const handleDeleteBookmark = async (id: string, confirm?: () => boolean): Promise<void> => {
    if (confirm && !confirm()) {
      return;
    }

    try {
      await deleteBookmark(id);
    } catch (error) {
      console.error('Erro ao deletar bookmark:', error);
      throw error;
    }
  };

  /**
   * Busca bookmarks por texto
   * 
   */
  const searchBookmarks = (query: string): void => {
    setSearchQuery(query);
  };

  /**
   * Filtra bookmarks por tag
   */
  const filterByTag = (tag: string | null): void => {
    setSelectedTag(tag);
  };

  /**
   * Filtra bookmarks por coleção
   */
  const filterByCollection = (collectionId: string | null): void => {
    setSelectedCollection(collectionId);
  };

  return {
    // Dados
    bookmarks,
    filteredBookmarks,
    isLoading,
    error,

    // Actions principais
    loadBookmarks,
    addBookmark: handleAddBookmark,
    updateBookmark: handleUpdateBookmark,
    deleteBookmark: handleDeleteBookmark,
    toggleFavorite,
    toggleRead,

    // Busca e filtros
    searchQuery,
    selectedTag,
    selectedCollection,
    favoriteFilter,
    readFilter,
    searchBookmarks,
    filterByTag,
    filterByCollection,
    setSelectedTag,
    setFavoriteFilter,
    setReadFilter,
    clearFilters,

    // Helpers
    getBookmarksByTag,
    getBookmarksByCollection,
  };
}

export function useBookmarkById(id: string) {
  const bookmarks = useBookmarksSelector.useBookmarks();
  return bookmarks.find((bookmark) => bookmark.id === id) ?? null;
}
