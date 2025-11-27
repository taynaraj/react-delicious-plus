import { InputHTMLAttributes, forwardRef } from 'react';
import { clsx } from 'clsx';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {

  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, id, ...props }, ref) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
    const hasError = !!error;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={clsx(
            'input w-full',
            hasError &&
              'border-error-500 focus:ring-error-500 focus:border-error-500',
            className
          )}
          aria-invalid={hasError}
          aria-describedby={
            error || helperText ? `${inputId}-help` : undefined
          }
          {...props}
        />
        {(error || helperText) && (
          <p
            id={`${inputId}-help`}
            className={clsx(
              'mt-1.5 text-sm',
              hasError
                ? 'text-error-600 dark:text-error-400'
                : 'text-neutral-500 dark:text-neutral-400'
            )}
          >
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
