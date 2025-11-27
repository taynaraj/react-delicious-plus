import { useMemo } from 'react';
import { useCollectionsStore, useCollectionsSelector } from '../store';
import type { CreateCollectionInput, UpdateCollectionInput } from '@shared/types/collection';

export function useCollections() {
  const collections = useCollectionsSelector.useCollections();
  const isLoading = useCollectionsSelector.useIsLoading();
  const error = useCollectionsSelector.useError();

  const searchQuery = useCollectionsStore((state) => state.searchQuery);

  const filteredCollections = useMemo(() => {
    let filtered = [...collections];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((collection) =>
        collection.name.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [collections, searchQuery]);

  const loadCollections = useCollectionsStore((state) => state.loadCollections);
  const addCollection = useCollectionsStore((state) => state.addCollection);
  const updateCollection = useCollectionsStore((state) => state.updateCollection);
  const deleteCollection = useCollectionsStore((state) => state.deleteCollection);

  const setSearchQuery = useCollectionsStore((state) => state.setSearchQuery);
  const clearFilters = useCollectionsStore((state) => state.clearFilters);

  const handleAddCollection = async (collectionData: CreateCollectionInput): Promise<void> => {
    try {
      await addCollection(collectionData);
    } catch (error) {
      console.error('Erro ao adicionar collection:', error);
      throw error;
    }
  };

  const handleUpdateCollection = async (
    id: string,
    updates: UpdateCollectionInput
  ): Promise<void> => {
    try {
      await updateCollection(id, updates);
    } catch (error) {
      console.error('Erro ao atualizar collection:', error);
      throw error;
    }
  };

  const handleDeleteCollection = async (id: string, confirm?: () => boolean): Promise<void> => {
    if (confirm && !confirm()) {
      return;
    }

    try {
      await deleteCollection(id);
    } catch (error) {
      console.error('Erro ao deletar collection:', error);
      throw error;
    }
  };

  const searchCollections = (query: string): void => {
    setSearchQuery(query);
  };

  return {
    collections,
    filteredCollections,
    isLoading,
    error,

    loadCollections,
    addCollection: handleAddCollection,
    updateCollection: handleUpdateCollection,
    deleteCollection: handleDeleteCollection,

    searchQuery,
    searchCollections,
    clearFilters,
  };
}

export function useCollectionById(id: string) {
  const collections = useCollectionsSelector.useCollections();
  return collections.find((collection) => collection.id === id) ?? null;
}

