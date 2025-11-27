import { useEffect, useRef, HTMLAttributes, ReactNode } from 'react';
import { clsx } from 'clsx';
import { createPortal } from 'react-dom';

export interface DrawerProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  children: ReactNode;
  width?: 'sm' | 'md' | 'lg' | 'xl';
  closeOnOverlayClick?: boolean;
  showCloseButton?: boolean;
}

const widthClasses = {
  sm: 'w-80',
  md: 'w-96',
  lg: 'w-[32rem]',
  xl: 'w-[40rem]',
};

export function Drawer({
  open,
  onClose,
  title,
  children,
  width = 'md',
  closeOnOverlayClick = true,
  showCloseButton = true,
  className,
  ...props
}: DrawerProps) {
  const drawerRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    previousActiveElement.current = document.activeElement as HTMLElement;
    const timer = setTimeout(() => {
      drawerRef.current?.focus();
    }, 100);
    return () => clearTimeout(timer);
  }, [open]);

  useEffect(() => {
    if (!open && previousActiveElement.current) {
      previousActiveElement.current.focus();
    }
  }, [open]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  if (!open) return null;

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  const drawerContent = (
    <div
      className="fixed inset-0 z-50 flex justify-end"
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'drawer-title' : undefined}
    >
      {/* Overlay */}
      <div
        className={clsx(
          'fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-150',
          open ? 'opacity-100' : 'opacity-0'
        )}
      />

      {/* Drawer Panel - Arc-style */}
      <div
        ref={drawerRef}
        className={clsx(
          'relative z-10 flex h-full flex-col bg-white dark:bg-neutral-900',
          'transform transition-transform duration-150 ease-arc',
          open ? 'translate-x-0' : 'translate-x-full',
          widthClasses[width],
          className
        )}
        style={{ boxShadow: '0 0 50px rgba(0, 0, 0, 0.05)' }}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        {...props}
      >
        {/* Header - Glass effect leve */}
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between border-b border-neutral-200/50 dark:border-neutral-800/50 px-6 py-5 bg-white/50 dark:bg-neutral-900/50 backdrop-blur-[20px]">
            {title && (
              <h2
                id="drawer-title"
                className="text-xl font-display font-semibold tracking-tight text-neutral-900 dark:text-neutral-50"
              >
                {title}
              </h2>
            )}
            {showCloseButton && (
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg p-1.5 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 hover:bg-neutral-100/60 dark:hover:bg-neutral-800/40 focus:outline-none transition-all duration-150"
                aria-label="Fechar drawer"
              >
                <svg
                  className="h-5 w-5"
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
          </div>
        )}

        {/* Body - Scroll interno com espaçamento maior */}
        <div className="flex-1 overflow-y-auto px-6 py-6 scrollbar-thin">
          {children}
        </div>
      </div>
    </div>
  );

  return createPortal(drawerContent, document.body);
}