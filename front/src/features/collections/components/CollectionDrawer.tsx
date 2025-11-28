import { useState } from 'react';
import { Collection } from '@shared/types/collection';
import { Drawer } from '@components/ui/Drawer';
import { Button } from '@components/ui/Button';
import { ConfirmDeleteModal } from '@components/ui/ConfirmDeleteModal';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useBookmarksStore } from '@features/bookmarks/store';

export interface CollectionDrawerProps {
  collection: Collection | null;
  open: boolean;
  onClose: () => void;
  onEdit?: (collection: Collection) => void;
  onDelete?: (collection: Collection) => void;
}

export function CollectionDrawer({
  collection,
  open,
  onClose,
  onEdit,
  onDelete,
}: CollectionDrawerProps) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const bookmarks = useBookmarksStore((state) => state.bookmarks);
  const bookmarkCount = collection
    ? bookmarks.filter((bookmark) => bookmark.collectionId === collection.id).length
    : 0;

  if (!collection) return null;

  const initial = collection.name.charAt(0).toUpperCase();

  const handleEdit = () => {
    onEdit?.(collection);
  };

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!onDelete) return;
    setIsDeleting(true);
    try {
      await onDelete(collection);
      setShowDeleteModal(false);
      onClose();
    } catch (error) {
      console.error('Erro ao excluir collection:', error);
      setIsDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
  };

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title={collection.name}
      width="lg"
      className="rounded-l-lg"
    >
      <div className="space-y-6">
        <div className="flex items-start gap-4 pb-6 border-b border-neutral-200/50 dark:border-neutral-800/50">
          <div className="w-14 h-14 rounded-lg flex items-center justify-center flex-shrink-0 bg-primary-500/10 dark:bg-primary-500/20 border border-primary-500/15 dark:border-primary-500/20">
            {collection.emoji ? (
              <span className="text-2xl">{collection.emoji}</span>
            ) : (
              <span className="text-lg font-display font-bold text-primary-600 dark:text-primary-400">
                {initial}
              </span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-display font-semibold text-lg text-neutral-900 dark:text-neutral-50 mb-1 tracking-tight">
              {collection.name}
            </h3>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              {bookmarkCount === 1 ? '1 bookmark' : `${bookmarkCount} bookmarks`}
            </p>
          </div>
        </div>

        <div className="space-y-2 text-sm text-neutral-500 dark:text-neutral-400">
          <p>
            <span className="font-medium">Criada em:</span>{' '}
            {new Date(collection.createdAt).toLocaleDateString('pt-BR', {
              day: '2-digit',
              month: 'long',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        </div>

        <div className="flex flex-col gap-2.5 pt-4 border-t border-neutral-200/50 dark:border-neutral-800/50">
          {onEdit && (
            <Button
              variant="outline"
              onClick={handleEdit}
              className="w-full rounded-lg"
            >
              <PencilIcon className="w-4 h-4" strokeWidth={1.7} />
              Editar
            </Button>
          )}

          {onDelete && (
            <Button
              variant="danger"
              onClick={handleDeleteClick}
              className="w-full rounded-lg"
            >
              <TrashIcon className="w-4 h-4" strokeWidth={1.7} />
              Excluir
            </Button>
          )}
        </div>
      </div>

      {/* Modal de confirmação de exclusão */}
      <ConfirmDeleteModal
        open={showDeleteModal}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Excluir Coleção"
        message={`Tem certeza que deseja excluir "${collection.name}"?`}
        isLoading={isDeleting}
      />
    </Drawer>
  );
}

