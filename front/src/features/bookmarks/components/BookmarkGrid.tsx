
import { Bookmark } from '@shared/types/bookmark';
import { BookmarkCard, BookmarkCardProps } from './BookmarkCard';
import { clsx } from 'clsx';

export interface BookmarkGridProps {
  bookmarks: Bookmark[];
  onCardClick?: BookmarkCardProps['onClick'];
  onToggleFavorite?: BookmarkCardProps['onToggleFavorite'];
  onToggleRead?: BookmarkCardProps['onToggleRead'];
  className?: string;
}

export function BookmarkGrid({
  bookmarks,
  onCardClick,
  onToggleFavorite,
  onToggleRead,
  className,
}: BookmarkGridProps) {
  if (bookmarks.length === 0) {
    return null;
  }

  return (
    <div
      className={clsx(
        'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5',
        className
      )}
    >
      {bookmarks.map((bookmark) => (
        <BookmarkCard
          key={bookmark.id}
          bookmark={bookmark}
          onClick={onCardClick}
          onToggleFavorite={onToggleFavorite}
          onToggleRead={onToggleRead}
        />
      ))}
    </div>
  );
}
