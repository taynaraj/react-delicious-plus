import { useState } from 'react';
import { Tag } from '@shared/types/tag';
import { Drawer } from '@components/ui/Drawer';
import { Button } from '@components/ui/Button';
import { ConfirmDeleteModal } from '@components/ui/ConfirmDeleteModal';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useBookmarksStore } from '@features/bookmarks/store';

export interface TagDrawerProps {
  tag: Tag | null;
  open: boolean;
  onClose: () => void;
  onEdit?: (tag: Tag) => void;
  onDelete?: (tag: Tag) => void;
}

export function TagDrawer({
  tag,
  open,
  onClose,
  onEdit,
  onDelete,
}: TagDrawerProps) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const bookmarks = useBookmarksStore((state) => state.bookmarks);
  const bookmarkCount = tag
    ? bookmarks.filter((bookmark) =>
        bookmark.tags.some((t) => {
          const tagName = typeof t === 'string' ? t : t.name;
          return tagName.toLowerCase() === tag.name.toLowerCase();
        })
      ).length
    : 0;

  if (!tag) return null;

  const initial = tag.name.charAt(0).toUpperCase();
  const tagColor = '#8B5CF6';

  const handleEdit = () => {
    onEdit?.(tag);
  };

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!onDelete) return;
    setIsDeleting(true);
    try {
      await onDelete(tag);
      setShowDeleteModal(false);
      onClose();
    } catch (error) {
      console.error('Erro ao excluir tag:', error);
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
      title={tag.name}
      width="lg"
      className="rounded-l-lg"
    >
      <div className="space-y-6">
        <div className="flex items-start gap-4 pb-6 border-b border-neutral-200/50 dark:border-neutral-800/50">
          <div
            className="w-14 h-14 rounded-lg flex items-center justify-center flex-shrink-0 border border-neutral-200 dark:border-neutral-700"
            style={{
              backgroundColor: `${tagColor}15`,
              color: tagColor,
            }}
          >
            <span className="text-lg font-display font-bold">
              {initial}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-display font-semibold text-lg text-neutral-900 dark:text-neutral-50 mb-1 tracking-tight">
              {tag.name}
            </h3>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              {bookmarkCount === 1 ? '1 bookmark' : `${bookmarkCount} bookmarks`}
            </p>
          </div>
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

      <ConfirmDeleteModal
        open={showDeleteModal}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Excluir Tag"
        message={`Tem certeza que deseja excluir "${tag.name}"?`}
        isLoading={isDeleting}
      />
    </Drawer>
  );
}

