import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTags } from '@features/tags/hooks';
import { TagGrid, TagDrawer, TagForm } from '@features/tags/components';
import { EmptyState } from '@components/ui';
import { Spinner } from '@components/ui';
import { Button } from '@components/ui';
import { Modal } from '@components/ui';
import { Tag } from '@shared/types/tag';
import { PlusIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import apiClient from '@/services/apiClient';
import { useTagsStore } from '@features/tags/store/tagsStore';

const TagIcon = ({ className, strokeWidth = 1.7 }: { className?: string; strokeWidth?: number }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={strokeWidth}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
  </svg>
);
import { debounce } from '@shared/utils/debounce';

export default function TagsPage() {
  const navigate = useNavigate();
  const {
    filteredTags,
    tags,
    isLoading,
    loadTags,
    searchQuery,
    searchTags,
  } = useTags();

  const [selectedTag, setSelectedTag] = useState<Tag | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);

  const debouncedSearch = useMemo(
    () => debounce((query: string) => {
      searchTags(query);
    }, 300),
    [searchTags]
  );

  useEffect(() => {
    loadTags();
  }, []);

  const handleSearchChange = useCallback((value: string) => {
    setLocalSearchQuery(value);
    debouncedSearch(value);
  }, [debouncedSearch]);

  const handleCardClick = (tag: Tag) => {
    navigate(`/bookmarks?tag=${encodeURIComponent(tag.name)}`);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedTag(null);
  };

  const handleEdit = (tag: Tag) => {
    setEditingTag(tag);
    setIsModalOpen(true);
    handleCloseDrawer();
  };

  const handleDelete = async (tag: Tag) => {
    if (!confirm(`Tem certeza que deseja excluir a tag "${tag.name}"?`)) {
      return;
    }
    try {
      await apiClient.delete(`/api/tags/${tag.id}`);
      useTagsStore.setState((state) => ({
        tags: state.tags.filter((t) => t.id !== tag.id),
      }));
      if (selectedTag?.id === tag.id) {
        handleCloseDrawer();
      }
      await loadTags();
    } catch (error) {
      console.error('Erro ao excluir tag:', error);
      alert('Erro ao excluir tag');
    }
  };

  const handleAddNew = () => {
    setEditingTag(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTag(null);
  };

  const handleSubmit = async (data: any) => {
    try {
      if (editingTag) {
        const response = await apiClient.patch<{ tag: Tag }>(`/api/tags/${editingTag.id}`, data);
        const updatedTag = response.data.tag;
        useTagsStore.setState((state) => ({
          tags: state.tags.map((t) => (t.id === updatedTag.id ? updatedTag : t)),
        }));
      } else {
        const response = await apiClient.post<{ tag: Tag }>('/api/tags', data);
        const newTag = response.data.tag;
        useTagsStore.setState((state) => ({
          tags: [...state.tags, newTag],
        }));
      }
      handleCloseModal();
      await loadTags();
    } catch (error) {
      console.error('Erro ao salvar tag:', error);
      throw error;
    }
  };

  return (
    <div className="min-h-full">
      <div className="container-app max-w-6xl mx-auto">
        <div className="mb-10 flex items-start justify-between gap-8">
          <div className="flex-1">
            <h1 className="font-display text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 mb-2.5">
              Tags
            </h1>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 tracking-tight leading-relaxed">
              Use tags para categorizar seus links.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2">
              <div className="chip">
                <TagIcon className="w-3.5 h-3.5" strokeWidth={1.7} />
                <span className="font-medium">{tags.length}</span>
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
              placeholder="Buscar tags..."
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
        ) : filteredTags.length === 0 ? (
          <div className="flex items-center justify-center py-24">
            <EmptyState
              icon={
                <TagIcon
                  className="h-12 w-12 text-neutral-400 dark:text-neutral-500"
                  strokeWidth={1.7}
                />
              }
              title={searchQuery ? 'Nenhuma tag encontrada' : 'Nenhuma tag criada'}
              description={
                searchQuery
                  ? 'Tente ajustar sua busca ou criar uma nova tag.'
                  : 'Use tags para categorizar seus links e torná-los mais fáceis de encontrar.'
              }
              actionLabel={searchQuery ? undefined : 'Criar Primeira Tag'}
              onAction={searchQuery ? undefined : handleAddNew}
            />
          </div>
        ) : (
          <TagGrid
            tags={filteredTags}
            onCardClick={handleCardClick}
            onEdit={handleEdit}
            onDelete={handleDelete}
            className="gap-6"
          />
        )}

        {selectedTag && (
          <TagDrawer
            tag={selectedTag}
            open={isDrawerOpen}
            onClose={handleCloseDrawer}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}

        <Modal
          open={isModalOpen}
          onClose={handleCloseModal}
          title={editingTag ? 'Editar Tag' : 'Nova Tag'}
          size="md"
        >
          <TagForm
            tag={editingTag || undefined}
            onSubmit={handleSubmit}
            onCancel={handleCloseModal}
            isLoading={isLoading}
          />
        </Modal>
      </div>
    </div>
  );
}
