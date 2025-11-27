import { Collection } from '@shared/types/collection';
import { Bookmark } from '@shared/types/bookmark';
import { Modal } from '@components/ui/Modal';
import { useBookmarksStore } from '@features/bookmarks/store';
import { useNavigate } from 'react-router-dom';
import { HeartIcon } from '@heroicons/react/24/solid';
import { clsx } from 'clsx';

export interface CollectionModalProps {
  collection: Collection | null;
  open: boolean;
  onClose: () => void;
}

export function CollectionModal({
  collection,
  open,
  onClose,
}: CollectionModalProps) {
  const navigate = useNavigate();
  const bookmarks = useBookmarksStore((state) => state.bookmarks);

  if (!collection) return null;

  const collectionBookmarks = bookmarks.filter(
    (bookmark) => bookmark.collectionId === collection.id
  );

  const handleBookmarkClick = (bookmark: Bookmark) => {
    navigate(`/bookmarks/${bookmark.id}/edit`);
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`Collection: ${collection.name}`}
      size="lg"
    >
      <div className="space-y-3">
        {collectionBookmarks.length === 0 ? (
          <div className="text-center py-8 space-y-3">
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              Nenhum bookmark nesta coleção
            </p>
            <button
              onClick={() => {
                navigate(`/bookmarks/new?collectionId=${collection.id}`);
                onClose();
              }}
              className={clsx(
                'text-primary-600 dark:text-primary-400',
                'hover:text-primary-700 dark:hover:text-primary-300',
                'underline text-sm font-medium',
                'transition-colors duration-150'
              )}
            >
              Adicionar primeiro bookmark
            </button>
          </div>
        ) : (
          collectionBookmarks.map((bookmark) => {
            const tagNames = bookmark.tags
              .map((t) => (typeof t === 'string' ? t : t.name))
              .join(', ');

            return (
              <div
                key={bookmark.id}
                className={clsx(
                  'border border-neutral-200 dark:border-neutral-800',
                  'rounded-lg p-3',
                  'hover:bg-neutral-50 dark:hover:bg-neutral-800/50',
                  'transition-colors duration-150',
                  'cursor-pointer'
                )}
                onClick={() => handleBookmarkClick(bookmark)}
              >
                <div className="flex items-start gap-3">
                  {bookmark.favorite && (
                    <div className="flex-shrink-0 mt-0.5">
                      <HeartIcon className="w-4 h-4 text-red-500" />
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <a
                      href={bookmark.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className={clsx(
                        'text-primary-600 dark:text-primary-400',
                        'hover:text-primary-700 dark:hover:text-primary-300',
                        'underline text-sm font-medium',
                        'block mb-1'
                      )}
                    >
                      {bookmark.title}
                    </a>

                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1 truncate">
                      {bookmark.url}
                    </p>

                    {tagNames && (
                      <p className="text-xs text-neutral-600 dark:text-neutral-500">
                        {tagNames}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </Modal>
  );
}

