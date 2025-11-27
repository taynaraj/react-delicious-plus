import { useState } from 'react';
import { Bookmark } from '@shared/types/bookmark';
import { Drawer } from '@components/ui/Drawer';
import { Button } from '@components/ui/Button';
import { Tag } from '@components/ui/Tag';
import { ConfirmDeleteModal } from '@components/ui/ConfirmDeleteModal';
import { LinkIcon, PencilIcon, TrashIcon, HeartIcon, BookOpenIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon, BookOpenIcon as BookSolidIcon } from '@heroicons/react/24/solid';
import { clsx } from 'clsx';

export interface BookmarkDrawerProps {
  bookmark: Bookmark | null;
  open: boolean;
  onClose: () => void;
  onEdit?: (bookmark: Bookmark) => void;
  onDelete?: (bookmark: Bookmark) => void;
  onToggleFavorite?: (bookmark: Bookmark) => void;
  onToggleRead?: (bookmark: Bookmark) => void;
}

export function BookmarkDrawer({
  bookmark,
  open,
  onClose,
  onEdit,
  onDelete,
  onToggleFavorite,
  onToggleRead,
}: BookmarkDrawerProps) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  if (!bookmark) return null;

  const getHostname = (url: string) => {
    try {
      return new URL(url).hostname;
    } catch {
      return url;
    }
  };

  const handleOpenSite = () => {
    window.open(bookmark.url, '_blank', 'noopener,noreferrer');
  };

  const handleDeleteConfirm = async () => {
    if (!onDelete) return;
    setIsDeleting(true);
    try {
      await Promise.resolve(onDelete(bookmark));
      setShowDeleteModal(false);
      onClose();
    } catch (error) {
      console.error('Erro ao excluir bookmark:', error);
      setIsDeleting(false);
    }
  };

  const initial = bookmark.title.charAt(0).toUpperCase();

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title={bookmark.title}
      width="lg"
      className="rounded-l-lg"
    >
      <div className="space-y-6">
        <div className="flex items-start gap-4 pb-6 border-b border-neutral-200/50 dark:border-neutral-800/50">
          <div className="w-14 h-14 rounded-lg flex items-center justify-center flex-shrink-0 bg-primary-500/10 dark:bg-primary-500/20 border border-primary-500/15 dark:border-primary-500/20">
            <span className="text-lg font-display font-bold text-primary-600 dark:text-primary-400">
              {initial}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <a
              href={bookmark.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 hover:underline text-sm font-medium break-all transition-colors duration-150"
            >
              {bookmark.url}
            </a>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
              {getHostname(bookmark.url)}
            </p>
          </div>
        </div>

        {bookmark.description && (
          <div className="pb-6 border-b border-neutral-200/50 dark:border-neutral-800/50">
            <h3 className="font-display font-semibold text-sm tracking-tight text-neutral-900 dark:text-neutral-50 mb-3">
              Descrição
            </h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed whitespace-pre-wrap">
              {bookmark.description}
            </p>
          </div>
        )}

        {bookmark.tags.length > 0 && (
          <div className="pb-6 border-b border-neutral-200/50 dark:border-neutral-800/50">
            <h3 className="font-display font-semibold text-sm tracking-tight text-neutral-900 dark:text-neutral-50 mb-3">
              Tags
            </h3>
            <div className="flex flex-wrap gap-2">
              {bookmark.tags.map((tag) => (
                <Tag
                  key={typeof tag === 'string' ? tag : tag.id}
                  variant="purple"
                  className="bg-primary-500/8 text-primary-600 dark:text-primary-400 border border-primary-500/15 text-xs px-2.5 py-1"
                >
                  {typeof tag === 'string' ? tag : tag.name}
                </Tag>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center gap-3 py-4 border-y border-neutral-200/50 dark:border-neutral-800/50">
          <button
            type="button"
            onClick={() => onToggleFavorite?.(bookmark)}
            className={clsx(
              'flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-150 text-sm font-medium',
              bookmark.favorite
                ? 'text-red-600 dark:text-red-400 bg-red-50/60 dark:bg-red-950/20'
                : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100/60 dark:hover:bg-neutral-800/40'
            )}
            aria-label={bookmark.favorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
          >
            {bookmark.favorite ? (
              <HeartSolidIcon className="w-4 h-4" strokeWidth={1.7} />
            ) : (
              <HeartIcon className="w-4 h-4" strokeWidth={1.7} />
            )}
            <span>{bookmark.favorite ? 'Favorito' : 'Adicionar aos favoritos'}</span>
          </button>

          <button
            type="button"
            onClick={() => onToggleRead?.(bookmark)}
            className={clsx(
              'flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-150 text-sm font-medium',
              bookmark.read
                ? 'text-primary-600 dark:text-primary-400 bg-primary-50/60 dark:bg-primary-950/20'
                : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100/60 dark:hover:bg-neutral-800/40'
            )}
            aria-label={bookmark.read ? 'Marcar como não lido' : 'Marcar como lido'}
          >
            {bookmark.read ? (
              <BookSolidIcon className="w-4 h-4" strokeWidth={1.7} />
            ) : (
              <BookOpenIcon className="w-4 h-4" strokeWidth={1.7} />
            )}
            <span>{bookmark.read ? 'Lido' : 'Marcar como lido'}</span>
          </button>
        </div>

        <div className="space-y-2 text-xs text-neutral-500 dark:text-neutral-400">
          <p>
            <span className="font-medium">Criado em:</span>{' '}
            {new Date(bookmark.createdAt).toLocaleDateString('pt-BR', {
              day: '2-digit',
              month: 'long',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
          <p>
            <span className="font-medium">Atualizado em:</span>{' '}
            {new Date(bookmark.updatedAt).toLocaleDateString('pt-BR', {
              day: '2-digit',
              month: 'long',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        </div>

        <div className="flex flex-col gap-2.5 pt-4 border-t border-neutral-200/50 dark:border-neutral-800/50">
          <Button
            variant="primary"
            onClick={handleOpenSite}
            className="w-full rounded-lg"
          >
            <LinkIcon className="w-4 h-4" strokeWidth={1.7} />
            Abrir Site
          </Button>

          {onEdit && (
            <Button
              variant="outline"
              onClick={() => onEdit(bookmark)}
              className="w-full rounded-lg"
            >
              <PencilIcon className="w-4 h-4" strokeWidth={1.7} />
              Editar
            </Button>
          )}

          {onDelete && (
            <Button
              variant="danger"
              onClick={() => setShowDeleteModal(true)}
              className="w-full rounded-lg"
            >
              <TrashIcon className="w-4 h-4" strokeWidth={1.7} />
              Excluir
            </Button>
          )}
        </div>
      </div>

      <ConfirmDeleteModal
        open={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteConfirm}
        title="Excluir Bookmark"
        message="Tem certeza que deseja excluir este bookmark?"
        itemName={bookmark.title}
        isLoading={isDeleting}
      />
    </Drawer>
  );
}