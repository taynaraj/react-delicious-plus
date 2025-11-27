import { TextareaHTMLAttributes, forwardRef } from 'react';
import { clsx } from 'clsx';

export interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {

  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, helperText, id, ...props }, ref) => {
    const textareaId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;
    const hasError = !!error;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5"
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          className={clsx(
            'textarea w-full',
            hasError &&
              'border-error-500 focus:ring-error-500 focus:border-error-500',
            className
          )}
          aria-invalid={hasError}
          aria-describedby={
            error || helperText ? `${textareaId}-help` : undefined
          }
          {...props}
        />
        {(error || helperText) && (
          <p
            id={`${textareaId}-help`}
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

Textarea.displayName = 'Textarea';
