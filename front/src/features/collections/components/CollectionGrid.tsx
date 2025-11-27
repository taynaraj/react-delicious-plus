import { Collection } from '@shared/types/collection';
import { CollectionCard, CollectionCardProps } from './CollectionCard';
import { clsx } from 'clsx';

export interface CollectionGridProps {
  collections: Collection[];
  onCardClick?: CollectionCardProps['onClick'];
  onEdit?: CollectionCardProps['onEdit'];
  onDelete?: CollectionCardProps['onDelete'];
  className?: string;
}

export function CollectionGrid({
  collections,
  onCardClick,
  onEdit,
  onDelete,
  className,
}: CollectionGridProps) {
  if (collections.length === 0) {
    return null;
  }

  return (
    <div
      className={clsx(
        'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5',
        className
      )}
    >
      {collections.map((collection) => (
        <CollectionCard
          key={collection.id}
          collection={collection}
          onClick={onCardClick}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}

