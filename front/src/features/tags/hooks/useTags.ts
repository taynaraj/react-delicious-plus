
import { useMemo } from 'react';
import { useTagsStore, useTagsSelector } from '../store';

export function useTags() {
  // Selectors otimizados
  const tags = useTagsSelector.useTags();
  const isLoading = useTagsSelector.useIsLoading();
  const error = useTagsSelector.useError();

  // Filtros
  const searchQuery = useTagsStore((state) => state.searchQuery);

  // Computar filteredTags usando useMemo
  const filteredTags = useMemo(() => {
    let filtered = [...tags];

    // Filtro de busca (texto)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((tag) =>
        tag.name.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [tags, searchQuery]);

  // Actions do store
  const loadTags = useTagsStore((state) => state.loadTags);
  const addTagIfNotExists = useTagsStore((state) => state.addTagIfNotExists);

  // Actions de filtros
  const setSearchQuery = useTagsStore((state) => state.setSearchQuery);
  const clearFilters = useTagsStore((state) => state.clearFilters);

  /**
   * Busca tags por texto
   */
  const searchTags = (query: string): void => {
    setSearchQuery(query);
  };

  return {
    // Dados
    tags,
    filteredTags,
    isLoading,
    error,

    // Actions principais
    loadTags,
    addTagIfNotExists,

    // Busca e filtros
    searchQuery,
    searchTags,
    clearFilters,
  };
}

// Hook simplificado para apenas ler uma tag específica
 
export function useTagById(id: string) {
  const tags = useTagsSelector.useTags();
  return tags.find((tag) => tag.id === id) ?? null;
}

