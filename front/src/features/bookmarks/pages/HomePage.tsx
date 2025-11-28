import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { clsx } from 'clsx';
import { useBookmarks } from '@features/bookmarks/hooks';
import { BookmarkGrid, BookmarkDrawer } from '@features/bookmarks/components';
import { EmptyState } from '@components/ui';
import { Spinner } from '@components/ui';
import { Button } from '@components/ui/Button';
import { Bookmark } from '@shared/types/bookmark';
import { MagnifyingGlassIcon, PlusIcon } from '@heroicons/react/24/outline';
import { debounce } from '@shared/utils/debounce';
import { useAuthStore } from '@app/providers/auth';

export default function HomePage() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const {
    filteredBookmarks,
    bookmarks,
    isLoading,
    loadBookmarks,
    searchQuery,
    searchBookmarks,
    deleteBookmark,
    toggleFavorite,
    toggleRead,
    setFavoriteFilter,
    setReadFilter,
  } = useBookmarks();

  const [selectedBookmark, setSelectedBookmark] = useState<Bookmark | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);
  const [activeFilter, setActiveFilter] = useState<'all' | 'favorites' | 'unread' | 'read'>('all');

  // Debounce da busca
  const debouncedSearch = useMemo(
    () => debounce((query: string) => {
      searchBookmarks(query);
    }, 300),
    [searchBookmarks]
  );

  useEffect(() => {
    loadBookmarks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const handleToggleFavorite = async (bookmark: Bookmark) => {
    if (!bookmark.id || typeof bookmark.id !== 'string' || bookmark.id.length === 0) {
      console.error('ID inválido do bookmark:', bookmark);
      alert('Erro: Bookmark com ID inválido. Recarregue a página.');
      return;
    }

    try {
      await toggleFavorite(bookmark.id);
      
      if (selectedBookmark?.id === bookmark.id) {
        const updated = filteredBookmarks.find((b) => b.id === bookmark.id);
        if (updated) setSelectedBookmark(updated);
      }
    } catch (error) {
      console.error('[HomePage] Erro ao atualizar favorito:', error);
      alert(`Erro ao atualizar favorito: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
      
      // Recarregar bookmarks em caso de erro
      await loadBookmarks();
    }
  };

  const handleToggleRead = async (bookmark: Bookmark) => {
    if (!bookmark.id || typeof bookmark.id !== 'string' || bookmark.id.length === 0) {
      console.error('ID inválido do bookmark:', bookmark);
      alert('Erro: Bookmark com ID inválido. Recarregue a página.');
      return;
    }

    try {
      await toggleRead(bookmark.id);
      
      if (selectedBookmark?.id === bookmark.id) {
        const updated = filteredBookmarks.find((b) => b.id === bookmark.id);
        if (updated) setSelectedBookmark(updated);
      }
    } catch (error) {
      console.error('[HomePage] Erro ao atualizar lido:', error);
      alert(`Erro ao atualizar lido: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
      
      // Recarregar bookmarks em caso de erro
      await loadBookmarks();
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

    if (activeFilter === 'favorites') {
      return {
        title: 'Nenhum favorito ainda',
        description: 'Marque bookmarks como favoritos para vê-los aqui.',
      };
    }

    if (activeFilter === 'unread') {
      return {
        title: 'Nada para ler',
        description: 'Todos os seus bookmarks foram marcados como lidos.',
      };
    }

    if (activeFilter === 'read') {
      return {
        title: 'Nenhum bookmark lido',
        description: 'Marque bookmarks como lidos para organizá-los.',
      };
    }

    return {
      title: 'Nenhum bookmark encontrado',
      description: 'Organize seus links favoritos em um só lugar. Comece adicionando seu primeiro bookmark.',
    };
  };

  const totalBookmarks = bookmarks.length;
  const favoriteBookmarks = bookmarks.filter((b) => b.favorite).length;
  const unreadBookmarks = bookmarks.filter((b) => !b.read).length;
  const readBookmarks = bookmarks.filter((b) => b.read).length;

  return (
    <div className="min-h-full">
      {/* Header Dashboard Premium */}
      <div className="mb-8">
        <h1 className="text-4xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50 mb-2">
          {user ? `Olá, ${user.name.split(' ')[0]}` : 'Olá!'}
        </h1>
        <p className="text-base text-neutral-600 dark:text-neutral-400">
          Gerencie seus bookmarks de forma organizada e eficiente.
        </p>
      </div>

      {/* Botão Adicionar Link - Centralizado */}
      <div className="mb-8 flex flex-col items-center justify-center">
        <Button
          onClick={handleAddNew}
          variant="primary"
          size="lg"
          className="flex items-center gap-2"
        >
          <PlusIcon className="h-5 w-5" strokeWidth={2} />
          <span>Adicionar link</span>
        </Button>
        <p className="mt-3 text-sm text-neutral-600 dark:text-neutral-400">
          Adicione seu Bookmark
        </p>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        <div className="rounded-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm p-6">
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-1">Total</p>
          <p className="text-2xl font-semibold text-neutral-900 dark:text-neutral-50">{totalBookmarks}</p>
        </div>
        <div className="rounded-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm p-6">
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-1">Favoritos</p>
          <p className="text-2xl font-semibold text-neutral-900 dark:text-neutral-50">{favoriteBookmarks}</p>
        </div>
        <div className="rounded-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm p-6">
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-1">Para ler</p>
          <p className="text-2xl font-semibold text-neutral-900 dark:text-neutral-50">{unreadBookmarks}</p>
        </div>
        <div className="rounded-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm p-6">
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-1">Lidos</p>
          <p className="text-2xl font-semibold text-neutral-900 dark:text-neutral-50">{readBookmarks}</p>
        </div>
      </div>

      {/* Busca e Filtros */}
      <div className="mb-8 flex items-center gap-3">
        {/* Busca */}
        <div className="flex-1 relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 dark:text-neutral-500 pointer-events-none" strokeWidth={2} />
          <input
            type="text"
            placeholder="Buscar bookmarks..."
            value={localSearchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-sm bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 text-neutral-900 dark:text-neutral-50 placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 rounded-lg transition-all duration-150"
          />
        </div>

        {/* Filtros */}
        <div className="flex items-center gap-1 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 p-1 rounded-lg">
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
          className="gap-6"
        />
      )}

      {/* Drawer */}
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
    </div>
  );
}