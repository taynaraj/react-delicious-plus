import { useState, useEffect, useMemo, useCallback } from 'react';
import { useCollections } from '@features/collections/hooks';
import { CollectionGrid, CollectionDrawer, CollectionForm, CollectionModal } from '@features/collections/components';
import { EmptyState } from '@components/ui';
import { Spinner } from '@components/ui';
import { Button } from '@components/ui';
import { Modal } from '@components/ui';
import { Collection } from '@shared/types/collection';
import { PlusIcon, MagnifyingGlassIcon, FolderIcon } from '@heroicons/react/24/outline';
import { debounce } from '@shared/utils/debounce';

export default function CollectionsPage() {
  const {
    filteredCollections,
    collections,
    isLoading,
    loadCollections,
    addCollection,
    updateCollection,
    deleteCollection,
    searchQuery,
    searchCollections,
  } = useCollections();

  const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null);
  const [isCollectionModalOpen, setIsCollectionModalOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCollection, setEditingCollection] = useState<Collection | null>(null);
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);

  const debouncedSearch = useMemo(
    () => debounce((query: string) => {
      searchCollections(query);
    }, 300),
    [searchCollections]
  );

  useEffect(() => {
    loadCollections();
  }, []);

  const handleSearchChange = useCallback((value: string) => {
    setLocalSearchQuery(value);
    debouncedSearch(value);
  }, [debouncedSearch]);

  const handleCardClick = (collection: Collection) => {
    setSelectedCollection(collection);
    setIsCollectionModalOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedCollection(null);
  };

  const handleEdit = (collection: Collection) => {
    setEditingCollection(collection);
    setIsModalOpen(true);
    handleCloseDrawer();
  };

  const handleDelete = async (collection: Collection) => {
    try {
      await deleteCollection(collection.id);
      if (selectedCollection?.id === collection.id) {
        handleCloseDrawer();
      }
    } catch (error) {
      console.error('Erro ao excluir collection:', error);
      alert('Erro ao excluir collection');
    }
  };

  const handleAddNew = () => {
    setEditingCollection(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCollection(null);
  };

  const handleSubmit = async (data: any) => {
    try {
      if (editingCollection) {
        await updateCollection(editingCollection.id, data);
      } else {
        await addCollection(data);
      }
      handleCloseModal();
    } catch (error) {
      console.error('Erro ao salvar collection:', error);
      throw error;
    }
  };

  return (
    <div className="min-h-full">
      <div className="container-app max-w-6xl mx-auto">
        <div className="mb-10 flex items-start justify-between gap-8">
          <div className="flex-1">
            <h1 className="font-display text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 mb-2.5">
              Coleções
            </h1>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 tracking-tight leading-relaxed">
              Organize seus bookmarks em grupos personalizados.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2">
              <div className="chip">
                <FolderIcon className="w-3.5 h-3.5" strokeWidth={1.7} />
                <span className="font-medium">{collections.length}</span>
              </div>
            </div>

            <Button
              variant="primary"
              onClick={handleAddNew}
              className="rounded-lg"
            >
              <PlusIcon className="w-4 h-4" strokeWidth={1.7} />
              <span className="font-medium">Adicionar</span>
            </Button>
          </div>
        </div>

        <div className="mb-8 flex items-center gap-3 p-1.5 rounded-lg surface-glass" style={{ boxShadow: '0 0 30px rgba(0, 0, 0, 0.02)' }}>
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 dark:text-neutral-500 pointer-events-none" strokeWidth={1.7} />
            <input
              type="text"
              placeholder="Buscar coleções..."
              value={localSearchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-transparent border-0 text-neutral-900 dark:text-neutral-50 placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:outline-none rounded-md"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-24">
            <Spinner size="lg" />
          </div>
        ) : filteredCollections.length === 0 ? (
          <div className="flex items-center justify-center py-24">
            <EmptyState
              icon={
                <FolderIcon
                  className="h-12 w-12 text-neutral-400 dark:text-neutral-500"
                  strokeWidth={1.7}
                />
              }
              title={searchQuery ? 'Nenhuma coleção encontrada' : 'Nenhuma coleção criada ainda'}
              description={
                searchQuery
                  ? 'Tente ajustar sua busca ou criar uma nova coleção.'
                  : 'Crie coleções para organizar grupos de links e tornar seus bookmarks mais fáceis de encontrar.'
              }
              actionLabel={searchQuery ? undefined : 'Criar Primeira Coleção'}
              onAction={searchQuery ? undefined : handleAddNew}
            />
          </div>
        ) : (
          <CollectionGrid
            collections={filteredCollections}
            onCardClick={handleCardClick}
            onEdit={handleEdit}
            onDelete={handleDelete}
            className="gap-6"
          />
        )}

        <CollectionModal
          collection={selectedCollection}
          open={isCollectionModalOpen}
          onClose={() => {
            setIsCollectionModalOpen(false);
            setSelectedCollection(null);
          }}
        />

        {selectedCollection && (
          <CollectionDrawer
            collection={selectedCollection}
            open={isDrawerOpen}
            onClose={handleCloseDrawer}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}

        <Modal
          open={isModalOpen}
          onClose={handleCloseModal}
          title={editingCollection ? 'Editar Coleção' : 'Nova Coleção'}
          size="md"
        >
          <CollectionForm
            collection={editingCollection || undefined}
            onSubmit={handleSubmit}
            onCancel={handleCloseModal}
            isLoading={isLoading}
          />
        </Modal>
      </div>
    </div>
  );
}
