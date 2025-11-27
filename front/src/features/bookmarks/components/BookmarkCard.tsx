import { useState } from 'react';
import { Bookmark } from '@shared/types/bookmark';
import { Tag } from '@components/ui';
import { HeartIcon, BookOpenIcon, PhotoIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon, BookOpenIcon as BookSolidIcon } from '@heroicons/react/24/solid';
import { clsx } from 'clsx';

export interface BookmarkCardProps {
  bookmark: Bookmark;
  onClick?: (bookmark: Bookmark) => void;
  onToggleFavorite?: (bookmark: Bookmark) => void;
  onToggleRead?: (bookmark: Bookmark) => void;
  className?: string;
}

export function BookmarkCard({
  bookmark,
  onClick,
  onToggleFavorite,
  onToggleRead,
  className,
}: BookmarkCardProps) {
  const getHostname = (url: string) => {
    try {
      return new URL(url).hostname;
    } catch {
      return url;
    }
  };

  const [imageError, setImageError] = useState(false);


  const thumbnailUrl = bookmark.image 
    ? bookmark.image 
    : `https://api.microlink.io?url=${encodeURIComponent(bookmark.url)}&screenshot=true&viewport.width=1280&viewport.height=720&viewport.deviceScaleFactor=1&waitFor=2000`;

  const handleImageError = () => {
    setImageError(true);
  };

  const handleCardClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button')) return;
    onClick?.(bookmark);
  };

  return (
    <div
      className={clsx(
        'group relative rounded-lg p-4 sm:p-6 cursor-pointer',
        'bg-white dark:bg-neutral-900',
        'border border-neutral-200 dark:border-neutral-800',
        'shadow-card-sm hover:shadow-card-md',
        'transition-all duration-150',
        'hover:-translate-y-0.5',
        className
      )}
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      aria-label={`Abrir detalhes de ${bookmark.title}`}
    >

      <div className="flex items-start gap-2 sm:gap-3 mb-3">
        {!imageError ? (
          <div className="w-16 h-12 sm:w-20 sm:h-14 rounded-lg flex items-center justify-center flex-shrink-0 bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 overflow-hidden shadow-sm relative">
            {bookmark.image ? (
              <img
                src={bookmark.image}
                alt={bookmark.title}
                className="w-full h-full object-cover"
                onError={handleImageError}
              />
            ) : (
              <>

                <div className="absolute top-0 left-0 right-0 h-2.5 bg-neutral-200 dark:bg-neutral-700 flex items-center gap-1 px-1.5 z-10">
                  <div className="flex items-center gap-1">
                    <div className="w-1 h-1 rounded-full bg-red-400"></div>
                    <div className="w-1 h-1 rounded-full bg-yellow-400"></div>
                    <div className="w-1 h-1 rounded-full bg-green-400"></div>
                  </div>
                  <div className="flex-1 h-1.5 mx-1.5 rounded-sm bg-white dark:bg-neutral-600"></div>
                </div>
                <img
                  src={thumbnailUrl}
                  alt={bookmark.title}
                  className="w-full h-full object-cover"
                  onError={handleImageError}
                  loading="lazy"
                />
              </>
            )}
          </div>
        ) : (
          <div className="w-20 h-14 rounded-lg flex items-center justify-center flex-shrink-0 bg-primary-500/10 dark:bg-primary-500/20 border border-neutral-200 dark:border-neutral-700 shadow-sm">
            <PhotoIcon className="w-6 h-6 text-primary-600 dark:text-primary-400" strokeWidth={1.5} />
          </div>
        )}

        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-base text-neutral-900 dark:text-neutral-50 mb-1 line-clamp-2 tracking-tight">
            {bookmark.title}
          </h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate">
            {getHostname(bookmark.url)}
          </p>
        </div>

        <div className="flex-shrink-0 flex items-center gap-1.5">
          {/* Toggle Favorito */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite?.(bookmark);
            }}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-red-500 hover:bg-red-50/60 dark:hover:bg-red-950/20 transition-all duration-150"
            aria-label={bookmark.favorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
          >
            {bookmark.favorite ? (
              <HeartSolidIcon className="w-4 h-4 text-red-500" strokeWidth={1.7} />
            ) : (
              <HeartIcon className="w-4 h-4" strokeWidth={1.7} />
            )}
          </button>

          {/* Toggle Lido */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleRead?.(bookmark);
            }}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-primary-500 hover:bg-primary-50/60 dark:hover:bg-primary-950/20 transition-all duration-150"
            aria-label={bookmark.read ? 'Marcar como não lido' : 'Marcar como lido'}
          >
            {bookmark.read ? (
              <BookSolidIcon className="w-4 h-4 text-primary-500" strokeWidth={1.7} />
            ) : (
              <BookOpenIcon className="w-4 h-4" strokeWidth={1.7} />
            )}
          </button>
        </div>
      </div>

      {bookmark.description && (
        <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-3 line-clamp-3 leading-relaxed">
          {bookmark.description}
        </p>
      )}

      {bookmark.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {bookmark.tags.slice(0, 3).map((tag, index) => (
            <Tag
              key={`${bookmark.id}-tag-${index}-${typeof tag === 'string' ? tag : tag.id}`}
              variant="purple"
              className="bg-primary-500/8 text-primary-600 dark:text-primary-400 border border-primary-500/15 text-xs px-2 py-0.5"
            >
              {typeof tag === 'string' ? tag : tag.name}
            </Tag>
          ))}
          {bookmark.tags.length > 3 && (
            <span className="text-xs text-neutral-400 dark:text-neutral-500 self-center">
              +{bookmark.tags.length - 3}
            </span>
          )}
        </div>
      )}

      <div className="text-xs text-neutral-400 dark:text-neutral-500">
        {new Date(bookmark.createdAt).toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        })}
      </div>
    </div>
  );
}