
import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { clsx } from 'clsx';
import { Spinner } from './Spinner';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-lg font-medium tracking-tight transition-all duration-150 ease-arc focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary:
          'bg-primary-500 text-white hover:bg-primary-600 focus:ring-primary-500/20 dark:bg-primary-600 dark:hover:bg-primary-700',
        secondary:
          'bg-neutral-100 text-neutral-900 hover:bg-neutral-200 focus:ring-neutral-500/20 dark:bg-neutral-800 dark:text-neutral-50 dark:hover:bg-neutral-700',
        outline:
          'border border-primary-500/30 bg-transparent text-primary-600 hover:bg-primary-500/8 focus:ring-primary-500/20 dark:border-primary-400/30 dark:text-primary-400 dark:hover:bg-primary-500/10',
        ghost:
          'bg-transparent text-neutral-700 hover:bg-neutral-100/60 focus:ring-neutral-500/20 dark:text-neutral-300 dark:hover:bg-neutral-800/40',
        danger:
          'bg-error-500 text-white hover:bg-error-600 focus:ring-error-500/20 dark:bg-error-600 dark:hover:bg-error-700',
      },
      size: {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2 text-sm',
        lg: 'px-6 py-3 text-base',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
  children: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, isLoading, disabled, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={clsx(buttonVariants({ variant, size }), className)}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && <Spinner size="sm" className="text-current" />}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';