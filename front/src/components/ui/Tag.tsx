/**
 * TAG / BADGE COMPONENT (Arc-style Premium)
 * 
 * Tags clean e premium estilo Arc Browser.
 * 
 * DESIGN:
 * - Tags menores com menos saturação
 * - Bordas sutis
 * - Transições suaves (150ms)
 */

import { HTMLAttributes, forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { clsx } from 'clsx';

const tagVariants = cva(
  'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium tracking-tight transition-all duration-150',
  {
    variants: {
      variant: {
        default:
          'bg-neutral-100/80 text-neutral-700 border border-neutral-200/50 dark:bg-neutral-800/40 dark:text-neutral-300 dark:border-neutral-700/40',
        purple:
          'bg-primary-500/8 text-primary-600 border border-primary-500/15 dark:bg-primary-500/10 dark:text-primary-400 dark:border-primary-500/20',
        blue:
          'bg-blue-50 text-blue-700 border border-blue-200/50 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-800/40',
        green:
          'bg-green-50 text-green-700 border border-green-200/50 dark:bg-green-950/20 dark:text-green-400 dark:border-green-800/40',
        orange:
          'bg-orange-50 text-orange-700 border border-orange-200/50 dark:bg-orange-950/20 dark:text-orange-400 dark:border-orange-800/40',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface TagProps
  extends HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof tagVariants> {
  children: React.ReactNode;
  onRemove?: () => void;
}

export const Tag = forwardRef<HTMLSpanElement, TagProps>(
  ({ className, variant, children, onRemove, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={clsx(tagVariants({ variant }), className)}
        {...props}
      >
        {children}
        {onRemove && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            className="ml-1 rounded-full hover:bg-current/10 p-0.5 transition-colors duration-150 focus:outline-none"
            aria-label="Remover tag"
          >
            <svg
              className="h-3 w-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.7}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </span>
    );
  }
);

Tag.displayName = 'Tag';