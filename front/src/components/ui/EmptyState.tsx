import { HTMLAttributes } from 'react';
import { clsx } from 'clsx';
import { Button } from './Button';

export interface EmptyStateProps extends HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  className,
  ...props
}: EmptyStateProps) {
  return (
    <div
      className={clsx(
        'flex flex-col items-center justify-center py-16 px-4 text-center',
        className
      )}
      {...props}
    >
      {icon && (
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800">
          {typeof icon === 'string' ? (
            <span className="text-3xl">{icon}</span>
          ) : (
            <div className="h-8 w-8 text-neutral-400 dark:text-neutral-500">
              {icon}
            </div>
          )}
        </div>
      )}
      <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-50 mb-2">
        {title}
      </h3>
      {description && (
        <p className="max-w-sm text-sm text-neutral-600 dark:text-neutral-400 mb-6">
          {description}
        </p>
      )}
      {actionLabel && onAction && (
        <Button variant="primary" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
