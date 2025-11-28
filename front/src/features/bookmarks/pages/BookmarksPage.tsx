import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useBookmarksStore } from '@features/bookmarks/store';
import { clsx } from 'clsx';
import { useBookmarks } from '@features/bookmarks/hooks';
import { BookmarkGrid, BookmarkDrawer } from '@features/bookmarks/components';
import { EmptyState } from '@components/ui';
import { Spinner } from '@components/ui';
import { ConfirmDeleteModal } from '@components/ui/ConfirmDeleteModal';
import { Bookmark } from '@shared/types/bookmark';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { debounce } from '@shared/utils/debounce';

export default function BookmarksPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const {
    filteredBookmarks,
    isLoading,
    loadBookmarks,
    deleteBookmark,
    toggleFavorite,
    toggleRead,
    searchQuery,
    searchBookmarks,
    setFavoriteFilter,
    setReadFilter,
    setSelectedTag,
  } = useBookmarks();

  const [selectedBookmark, setSelectedBookmark] = useState<Bookmark | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);
  const [activeFilter, setActiveFilter] = useState<'all' | 'favorites' | 'unread' | 'read'>('all');
  const [bookmarkToDelete, setBookmarkToDelete] = useState<Bookmark | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const debouncedSearch = useMemo(
    () => debounce((query: string) => {
      searchBookmarks(query); 
    }, 300),
    [searchBookmarks]
  );

  useEffect(() => {
    loadBookmarks();
  }, [loadBookmarks]);

  useEffect(() => {
    const tagParam = searchParams.get('tag');
    if (tagParam) {
      setSelectedTag(tagParam);
    } else {
      setSelectedTag(null);
      const { clearFilters } = useBookmarksStore.getState();
      clearFilters();
    }
  }, [searchParams, setSelectedTag]);

  // Sincronizar filtro ativo com o store
  useEffect(() => {
    if (activeFilter === 'favorites') {
      setFavoriteFilter(true);
      setReadFilter(null);
    } else if (activeFilter === 'unread') {
      setReadFilter(false);
      setFavoriteFilter(null);
    } else if (activeFilter === 'read') {
      setReadFilter(true);
      setFavoriteFilter(null);
    } else {
      setFavoriteFilter(null);
      setReadFilter(null);
    }
  }, [activeFilter, setFavoriteFilter, setReadFilter]);

  const handleSearchChange = useCallback((value: string) => {
    setLocalSearchQuery(value);
    debouncedSearch(value);
  }, [debouncedSearch]);

  const handleCardClick = (bookmark: Bookmark) => {
    setSelectedBookmark(bookmark);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedBookmark(null);
  };

  const handleEdit = (bookmark: Bookmark) => {
    navigate(`/bookmarks/${bookmark.id}/edit`);
    handleCloseDrawer();
  };

  const handleDelete = async (bookmark: Bookmark) => {
    try {
      await deleteBookmark(bookmark.id);
      handleCloseDrawer();
    } catch (error) {
      console.error('Erro ao excluir bookmark:', error);
      alert('Erro ao excluir bookmark');
    }
  };

  const handleDeleteClick = (bookmark: Bookmark) => {
    setBookmarkToDelete(bookmark);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!bookmarkToDelete) return;
    
    try {
      await deleteBookmark(bookmarkToDelete.id);
      setShowDeleteModal(false);
      setBookmarkToDelete(null);
      
      if (selectedBookmark?.id === bookmarkToDelete.id) {
        handleCloseDrawer();
      }
    } catch (error) {
      console.error('Erro ao excluir bookmark:', error);
      alert('Erro ao excluir bookmark');
    }
  };

  const handleToggleFavorite = async (bookmark: Bookmark) => {
    try {
      await toggleFavorite(bookmark.id);
      if (selectedBookmark?.id === bookmark.id) {
        const updated = filteredBookmarks.find((b) => b.id === bookmark.id);
        if (updated) setSelectedBookmark(updated);
      }
    } catch (error) {
      console.error('Erro ao atualizar favorito:', error);
    }
  };

  const handleToggleRead = async (bookmark: Bookmark) => {
    try {
      await toggleRead(bookmark.id);
      if (selectedBookmark?.id === bookmark.id) {
        const updated = filteredBookmarks.find((b) => b.id === bookmark.id);
        if (updated) setSelectedBookmark(updated);
      }
    } catch (error) {
      console.error('Erro ao atualizar lido:', error);
    }
  };

  const handleAddNew = () => {
    navigate('/bookmarks/new');
  };

  const getEmptyState = () => {
    if (searchQuery) {
      return {
        title: 'Nenhum resultado encontrado',
        description: 'Tente ajustar sua busca ou criar um novo bookmark.',
      };
    }

    const filterStates = {
      favorites: {
        title: 'Nenhum favorito ainda',
        description: 'Marque bookmarks como favoritos para vê-los aqui.',
      },
      unread: {
        title: 'Nada para ler',
        description: 'Todos os seus bookmarks foram marcados como lidos.',
      },
      read: {
        title: 'Nenhum bookmark lido',
        description: 'Marque bookmarks como lidos para organizá-los.',
      },
    };

    if (activeFilter in filterStates) {
      return filterStates[activeFilter as keyof typeof filterStates];
    }

    return {
      title: 'Nenhum bookmark encontrado',
      description: 'Organize seus links favoritos em um só lugar. Comece adicionando seu primeiro bookmark.',
    };
  };

  return (
    <div className="min-h-full">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50 mb-1">
          {(() => {
            const tag = searchParams.get('tag');
            return tag ? `Bookmarks – Tag: ${tag}` : 'Bookmarks (Links favoritos)';
          })()}
        </h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          Todos os seus bookmarks (links favoritos) organizados
        </p>
      </div>

      <div className="mb-8 flex items-center gap-3">
        <div className="flex-1 relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 dark:text-neutral-500 pointer-events-none" strokeWidth={2} />
          <input
            type="text"
            placeholder="Buscar..."
            value={localSearchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-neutral-50 placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-300 dark:focus:ring-neutral-700 rounded-lg transition-colors duration-150"
          />
        </div>

        {/* Filtros */}
        <div className="flex items-center gap-1 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-1 rounded-lg">
          {([
            { key: 'all', label: 'Todos' },
            { key: 'favorites', label: 'Favoritos' },
            { key: 'unread', label: 'Para ler' },
            { key: 'read', label: 'Lidos' },
          ] as const).map(({ key, label }) => (
            <button
              key={key}
              type="button"
              onClick={() => setActiveFilter(key)}
              className={clsx(
                'px-3 py-1.5 rounded-md text-sm font-medium transition-colors duration-150',
                activeFilter === key
                  ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-50'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Conteúdo */}
      {isLoading ? (
        <div className="flex items-center justify-center py-24">
          <Spinner size="lg" />
        </div>
      ) : filteredBookmarks.length === 0 ? (
        <div className="flex items-center justify-center py-24">
          <EmptyState
            icon={
              <svg
                className="h-12 w-12 text-neutral-400 dark:text-neutral-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                />
              </svg>
            }
            title={getEmptyState().title}
            description={getEmptyState().description}
            actionLabel={activeFilter === 'all' ? 'Adicionar bookmark' : undefined}
            onAction={activeFilter === 'all' ? handleAddNew : undefined}
          />
        </div>
      ) : (
        <BookmarkGrid
          bookmarks={filteredBookmarks}
          onCardClick={handleCardClick}
          onToggleFavorite={handleToggleFavorite}
          onToggleRead={handleToggleRead}
          onDelete={handleDeleteClick}
          className="gap-6"
        />
      )}

      {selectedBookmark && (
        <BookmarkDrawer
          bookmark={selectedBookmark}
          open={isDrawerOpen}
          onClose={handleCloseDrawer}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onToggleFavorite={handleToggleFavorite}
          onToggleRead={handleToggleRead}
        />
      )}

      {/* Modal de Confirmação de Exclusão */}
      <ConfirmDeleteModal
        open={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setBookmarkToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        title=""
        message={`Excluir "${bookmarkToDelete?.title}"?`}
      />
    </div>
  );
}