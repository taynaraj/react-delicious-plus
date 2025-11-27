import { InputHTMLAttributes, forwardRef } from 'react';
import { clsx } from 'clsx';

export interface ToggleProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {

  label?: string;
  description?: string;
}


export const Toggle = forwardRef<HTMLInputElement, ToggleProps>(
  ({ className, label, description, id, ...props }, ref) => {
    const toggleId = id || `toggle-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className="flex items-start gap-3">
        <div className="relative flex h-6 items-center">
          <input
            ref={ref}
            id={toggleId}
            type="checkbox"
            role="switch"
            aria-checked={props.checked}
            className={clsx(
              'peer sr-only',
              className
            )}
            {...props}
          />
          {/* Toggle Track */}
          <div
            className={clsx(
              'h-6 w-11 rounded-full transition-colors duration-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary-500 peer-focus:ring-offset-2 dark:peer-focus:ring-offset-neutral-900',
              props.checked
                ? 'bg-primary-500 dark:bg-primary-600'
                : 'bg-neutral-300 dark:bg-neutral-700'
            )}
          >
            {/* Toggle Thumb */}
            <div
              className={clsx(
                'absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white transition-transform duration-200 dark:bg-neutral-100',
                props.checked ? 'translate-x-5' : 'translate-x-0'
              )}
            />
          </div>
        </div>
        {(label || description) && (
          <div className="flex-1">
            {label && (
              <label
                htmlFor={toggleId}
                className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 cursor-pointer"
              >
                {label}
              </label>
            )}
            {description && (
              <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
                {description}
              </p>
            )}
          </div>
        )}
      </div>
    );
  }
);

Toggle.displayName = 'Toggle';
