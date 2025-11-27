/**
 * CARD COMPONENT (Arc-style Premium)
 * 
 * Cards clean e premium estilo Arc Browser.
 * 
 * DESIGN:
 * - Sombras sutis com blur amplo
 * - Hover suave sem saltos
 * - Transições de 150ms
 */

import { HTMLAttributes, forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { clsx } from 'clsx';

const cardVariants = cva(
  'rounded-lg border transition-all duration-150 ease-arc',
  {
    variants: {
      variant: {
        default:
          'bg-white border-neutral-200/50 shadow-arc-sm dark:bg-neutral-900 dark:border-neutral-800/50 dark:shadow-dark-arc',
        outlined:
          'bg-transparent border border-neutral-200 dark:border-neutral-800',
        hover: 'bg-white border-neutral-200/50 shadow-arc-sm hover:shadow-arc cursor-pointer dark:bg-neutral-900 dark:border-neutral-800/50 dark:shadow-dark-arc dark:hover:shadow-dark-arc-lg',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface CardProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  children: React.ReactNode;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, children, ...props }, ref) => {
    return (
      <div ref={ref} className={clsx(cardVariants({ variant }), className)} {...props}>
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';