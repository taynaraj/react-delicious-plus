import { Collection } from '@shared/types/collection';
import { useBookmarksStore } from '@features/bookmarks/store';
import { clsx } from 'clsx';

export interface CollectionCardProps {
  collection: Collection;
  onClick?: (collection: Collection) => void;
  onEdit?: (collection: Collection) => void;
  onDelete?: (collection: Collection) => void;
  className?: string;
}

export function CollectionCard({
  collection,
  onClick,
  onEdit,
  onDelete,
  className,
}: CollectionCardProps) {
  const bookmarks = useBookmarksStore((state) => state.bookmarks);
  const bookmarkCount = bookmarks.filter(
    (bookmark) => bookmark.collectionId === collection.id
  ).length;

  const initial = collection.name.charAt(0).toUpperCase();

  const handleCardClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button')) {
      return;
    }
    onClick?.(collection);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit?.(collection);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete?.(collection);
  };

  return (
    <div
      className={clsx(
        'group relative rounded-lg p-5 cursor-pointer',
        'bg-white dark:bg-neutral-900',
        'border border-[rgba(0,0,0,0.06)] dark:border-neutral-800/50',
        'transition-all duration-150 ease-arc',
        'hover:translate-y-[-1px]',
        className
      )}
      style={{ boxShadow: '0 0 50px rgba(0, 0, 0, 0.05)' }}
      onClick={handleCardClick}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 0 70px rgba(0, 0, 0, 0.06)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = '0 0 50px rgba(0, 0, 0, 0.05)';
      }}
      role="button"
      tabIndex={0}
      aria-label={`Abrir detalhes de ${collection.name}`}
    >
      <div className="flex items-start gap-3 mb-3">
        <div className="w-11 h-11 rounded-lg flex items-center justify-center flex-shrink-0 bg-primary-500/10 dark:bg-primary-500/20">
          {collection.emoji ? (
            <span className="text-lg">{collection.emoji}</span>
          ) : (
            <span className="text-sm font-display font-bold text-primary-600 dark:text-primary-400">
              {initial}
            </span>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-display font-semibold text-base text-neutral-900 dark:text-neutral-50 mb-1 line-clamp-2 tracking-tight">
            {collection.name}
          </h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            {bookmarkCount === 1 ? '1 bookmark' : `${bookmarkCount} bookmarks`}
          </p>
        </div>

        {(onEdit || onDelete) && (
          <div className="flex-shrink-0 flex items-center gap-1.5">
            {onEdit && (
              <button
                type="button"
                onClick={handleEdit}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-primary-500 hover:bg-primary-50/60 dark:hover:bg-primary-950/20 transition-all duration-150"
                aria-label="Editar coleção"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.7}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                </svg>
              </button>
            )}
            {onDelete && (
              <button
                type="button"
                onClick={handleDelete}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-red-500 hover:bg-red-50/60 dark:hover:bg-red-950/20 transition-all duration-150"
                aria-label="Excluir coleção"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.7}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                </svg>
              </button>
            )}
          </div>
        )}
      </div>

      <div className="text-xs text-neutral-400 dark:text-neutral-500">
        Criada em {new Date(collection.createdAt).toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        })}
      </div>
    </div>
  );
}

