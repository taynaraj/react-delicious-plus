
import { useState } from 'react';
import { Input } from '@components/ui/Input';
import { Button } from '@components/ui/Button';
import { Select } from '@components/ui/Select';
import { XMarkIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { clsx } from 'clsx';

export interface BookmarkFiltersProps {

  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedTag?: string | null;
  onTagChange?: (tag: string | null) => void;

  availableTags?: string[];
  selectedCollection?: string | null;
  onCollectionChange?: (collection: string | null) => void;
  availableCollections?: Array<{ id: string; name: string }>;
  favoriteFilter?: boolean | null;
  onFavoriteFilterChange?: (filter: boolean | null) => void;
  readFilter?: boolean | null;
  onReadFilterChange?: (filter: boolean | null) => void;
  onClearFilters?: () => void;
  className?: string;
}

export function BookmarkFilters({
  searchQuery,
  onSearchChange,
  selectedTag,
  onTagChange,
  availableTags = [],
  selectedCollection,
  onCollectionChange,
  availableCollections = [],
  favoriteFilter,
  onFavoriteFilterChange,
  readFilter,
  onReadFilterChange,
  onClearFilters,
  className,
}: BookmarkFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    selectedTag !== null ||
    selectedCollection !== null ||
    favoriteFilter !== null ||
    readFilter !== null;

  return (
    <div
      className={clsx(
        'space-y-4 rounded-xl p-4 sm:p-5',
        'bg-white/80 backdrop-blur-sm dark:bg-neutral-900/80',
        'border border-[rgba(0,0,0,0.08)] dark:border-neutral-800/50',
        className
      )}
      style={{ boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)' }}
    >
      <div className="relative">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400 dark:text-neutral-500" />
        <Input
          type="text"
          placeholder="Buscar bookmarks..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 rounded-xl"
          style={{ boxShadow: '0 2px 10px rgba(0, 0, 0, 0.04)' }}
        />
      </div>

      <div className="space-y-3">
        {!isExpanded && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(true)}
            className="text-xs rounded-xl"
          >
            + Filtros avançados
          </Button>
        )}

        {isExpanded && (
          <div className="space-y-3 pt-3 border-t border-[rgba(0,0,0,0.08)] dark:border-neutral-800/50">
            {onTagChange && availableTags.length > 0 && (
              <div>
                <Select
                  label="Tag"
                  placeholder="Todas as tags"
                  options={[
                    { value: '', label: 'Todas as tags' },
                    ...availableTags.map((tag) => ({ value: tag, label: tag })),
                  ]}
                  value={selectedTag || ''}
                  onChange={(e) => onTagChange(e.target.value || null)}
                  className="rounded-xl"
                />
              </div>
            )}

            {onCollectionChange && availableCollections.length > 0 && (
              <div>
                <Select
                  label="Coleção"
                  placeholder="Todas as coleções"
                  options={[
                    { value: '', label: 'Todas as coleções' },
                    ...availableCollections.map((collection) => ({
                      value: collection.id,
                      label: collection.name,
                    })),
                  ]}
                  value={selectedCollection || ''}
                  onChange={(e) => onCollectionChange(e.target.value || null)}
                  className="rounded-xl"
                />
              </div>
            )}

            {onFavoriteFilterChange && (
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  Favoritos:
                </span>
                <div className="flex gap-2 flex-wrap">
                  <Button
                    type="button"
                    variant={favoriteFilter === null ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => onFavoriteFilterChange(null)}
                    className="rounded-xl text-xs"
                  >
                    Todos
                  </Button>
                  <Button
                    type="button"
                    variant={favoriteFilter === true ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => onFavoriteFilterChange(true)}
                    className="rounded-xl text-xs"
                  >
                    Sim
                  </Button>
                  <Button
                    type="button"
                    variant={favoriteFilter === false ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => onFavoriteFilterChange(false)}
                    className="rounded-xl text-xs"
                  >
                    Não
                  </Button>
                </div>
              </div>
            )}

            {onReadFilterChange && (
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  Lidos:
                </span>
                <div className="flex gap-2 flex-wrap">
                  <Button
                    type="button"
                    variant={readFilter === null ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => onReadFilterChange(null)}
                    className="rounded-xl text-xs"
                  >
                    Todos
                  </Button>
                  <Button
                    type="button"
                    variant={readFilter === true ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => onReadFilterChange(true)}
                    className="rounded-xl text-xs"
                  >
                    Sim
                  </Button>
                  <Button
                    type="button"
                    variant={readFilter === false ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => onReadFilterChange(false)}
                    className="rounded-xl text-xs"
                  >
                    Não
                  </Button>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between pt-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(false)}
                className="text-xs rounded-xl"
              >
                Ocultar filtros
              </Button>
              {hasActiveFilters && onClearFilters && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={onClearFilters}
                  className="text-xs rounded-xl text-error-600 dark:text-error-400 hover:text-error-700 dark:hover:text-error-300"
                >
                  <XMarkIcon className="w-4 h-4" />
                  Limpar filtros
                </Button>
              )}
            </div>
          </div>
        )}
      </div>

      {hasActiveFilters && !isExpanded && (
        <div className="text-xs text-primary-600 dark:text-primary-400">
          Filtros ativos
        </div>
      )}
    </div>
  );
}
