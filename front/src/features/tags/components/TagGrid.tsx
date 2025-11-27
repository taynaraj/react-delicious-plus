import { Tag } from '@shared/types/tag';
import { TagCard, TagCardProps } from './TagCard';
import { clsx } from 'clsx';

export interface TagGridProps {
  tags: Tag[];
  onCardClick?: TagCardProps['onClick'];
  onEdit?: TagCardProps['onEdit'];
  onDelete?: TagCardProps['onDelete'];
  className?: string;
}

export function TagGrid({
  tags,
  onCardClick,
  onEdit,
  onDelete,
  className,
}: TagGridProps) {
  if (tags.length === 0) {
    return null;
  }

  return (
    <div
      className={clsx(
        'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5',
        className
      )}
    >
      {tags.map((tag) => (
        <TagCard
          key={tag.id}
          tag={tag}
          onClick={onCardClick}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}

