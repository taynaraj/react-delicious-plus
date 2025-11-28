
import { useEffect, useRef, HTMLAttributes, ReactNode } from 'react';
import { clsx } from 'clsx';
import { createPortal } from 'react-dom';
import { Button } from './Button';

export interface ModalProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {

  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  closeOnOverlayClick?: boolean;
  showCloseButton?: boolean;
  footer?: ReactNode;
}

const sizeClasses = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
};

export function Modal({
  open,
  onClose,
  title,
  children,
  size = 'md',
  closeOnOverlayClick = true,
  showCloseButton = true,
  footer,
  className,
  ...props
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
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

  // Foco no modal ao abrir
  useEffect(() => {
    if (!open) return;

    // Salvar elemento ativo anterior
    previousActiveElement.current = document.activeElement as HTMLElement;

    // Focar no modal após animação
    const timer = setTimeout(() => {
      modalRef.current?.focus();
    }, 100);

    return () => clearTimeout(timer);
  }, [open]);

  // Restaurar foco ao fechar
  useEffect(() => {
    if (!open && previousActiveElement.current) {
      previousActiveElement.current.focus();
    }
  }, [open]);

  // Prevenir scroll do body quando modal está aberto
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

  const modalContent = (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
    >
      {/* Overlay discreto */}
      <div className="fixed inset-0 bg-black/30 transition-opacity" />

      {/* Modal Content */}
      <div
        ref={modalRef}
        className={clsx(
          'relative z-10 w-full rounded-lg bg-white shadow-xl dark:bg-neutral-900',
          'max-h-[90vh] overflow-y-auto',
          sizeClasses[size],
          className
        )}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        {...props}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 px-6 py-4">
            {title && (
              <h2
                id="modal-title"
                className="text-xl font-semibold text-neutral-900 dark:text-neutral-50"
              >
                {title}
              </h2>
            )}
            {showCloseButton && (
              <button
                type="button"
                onClick={onClose}
                className="rounded-md p-1 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
                aria-label="Fechar modal"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>
        )}

        {/* Body */}
        <div className="px-6 py-4">{children}</div>

        {/* Footer */}
        {footer && (
          <div className="border-t border-neutral-200 dark:border-neutral-800 px-6 py-4">
            {footer}
          </div>
        )}
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
