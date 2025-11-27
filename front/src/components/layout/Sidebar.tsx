import { NavLink, useLocation } from 'react-router-dom';
import { clsx } from 'clsx';
import { HTMLAttributes, ReactNode, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import Logo from '@assets/logo/dplus-logo.png';
import { useBookmarksStore } from '@features/bookmarks/store';
import { XMarkIcon } from '@heroicons/react/24/outline';

export interface SidebarItem {
  to: string;
  label: string;
  icon?: ReactNode;
}

export interface SidebarProps extends HTMLAttributes<HTMLElement> {
  items: SidebarItem[];
  header?: ReactNode;
  footer?: ReactNode;
  open?: boolean;
  onClose?: () => void;
}

function SidebarContent({ items, header, footer, onItemClick, showHeader = true }: {
  items: SidebarItem[];
  header?: ReactNode;
  footer?: ReactNode;
  onItemClick?: () => void;
  showHeader?: boolean;
}) {
  const location = useLocation();
  const clearFilters = useBookmarksStore((state) => state.clearFilters);

  return (
    <>

      {showHeader && (
        header ? (
          <div className="px-4 py-5 border-b border-neutral-200 dark:border-neutral-800">
            {header}
          </div>
        ) : (
          <div className="px-4 py-5 border-b border-neutral-200 dark:border-neutral-800">
            <div className="flex items-center gap-3">
              {/* Logo */}
              <img src={Logo} alt="D+" className="h-6 w-6 object-contain shrink-0 opacity-90" />
              <div className="flex-1 min-w-0">
                <h2 className="font-semibold text-sm tracking-tight text-neutral-900 dark:text-neutral-50 truncate">
                  Delicious+
                </h2>
              </div>
            </div>
          </div>
        )
      )}

      {/* Navigation*/}
      <nav className="flex-1 overflow-y-auto px-3 py-4 scrollbar-thin flex flex-col">
        <ul className="space-y-1">
          {items.map((item) => {
            const isActive = location.pathname === item.to || 
              (item.to !== '/' && location.pathname.startsWith(item.to));
            
            return (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  onClick={() => {
                    if (item.to === '/') {
                      clearFilters();
                    }
                    onItemClick?.();
                  }}
                  className={clsx(
                    'flex items-center gap-3 h-10 px-3 rounded-lg text-sm font-medium relative',
                    'transition-all duration-150',
                    isActive
                      ? 'bg-primary-50 dark:bg-primary-950/20 text-primary-600 dark:text-primary-400'
                      : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                  )}
                >
                  {isActive && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-primary-500 rounded-r-full" />
                  )}
                  {item.icon && (
                    <span className="flex-shrink-0 w-5 h-5">
                      {item.icon}
                    </span>
                  )}
                  <span>{item.label}</span>
                </NavLink>
              </li>
            );
          })}
        </ul>
        
        {/* Footer dentro do nav */}
        {footer && (
          <div className="mt-6 pt-4 border-t border-neutral-200 dark:border-neutral-800">
            {footer}
          </div>
        )}
      </nav>
    </>
  );
}

function MobileSidebarDrawer({
  open,
  onClose,
  items,
  header,
  footer,
}: {
  open: boolean;
  onClose: () => void;
  items: SidebarItem[];
  header?: ReactNode;
  footer?: ReactNode;
}) {
  const drawerRef = useRef<HTMLDivElement>(null);

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

  if (!open) return null;

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const drawerContent = (
    <div
      className="fixed inset-0 z-50 flex justify-start lg:hidden"
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-label="Menu de navegação"
    >
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-150" />

      {/* Drawer Panel - Abre da esquerda */}
      <div
        ref={drawerRef}
        className={clsx(
          'relative z-10 flex h-full w-64 flex-col bg-white dark:bg-neutral-950',
          'transform transition-transform duration-200 ease-out',
          open ? 'translate-x-0' : '-translate-x-full',
          'border-r border-neutral-200 dark:border-neutral-800'
        )}
        style={{ boxShadow: '2px 0 20px rgba(0, 0, 0, 0.1)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header com botão fechar */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-neutral-200 dark:border-neutral-800">
          <div className="flex-1">
            {header || (
              <div className="flex items-center gap-3">
                <img src={Logo} alt="D+" className="h-6 w-6 object-contain shrink-0 opacity-90" />
                <h2 className="font-semibold text-sm tracking-tight text-neutral-900 dark:text-neutral-50">
                  Delicious+
                </h2>
              </div>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all duration-150 ml-2 flex-shrink-0"
            aria-label="Fechar menu"
          >
            <XMarkIcon className="w-5 h-5" strokeWidth={2} />
          </button>
        </div>

        {/* Conteúdo do sidebar - sem header duplicado */}
        <div className="flex-1 overflow-y-auto">
          <SidebarContent items={items} header={header} footer={footer} onItemClick={onClose} showHeader={false} />
        </div>
      </div>
    </div>
  );

  return createPortal(drawerContent, document.body);
}

export function Sidebar({ items, header, footer, open, onClose, className, ...props }: SidebarProps) {
  const location = useLocation();
  const prevPathnameRef = useRef<string | null>(null);
  const openRef = useRef(open);

  // Atualiza a ref do estado aberto
  useEffect(() => {
    openRef.current = open;
  }, [open]);

  // Fechar sidebar ao navegar em mobile (apenas quando a rota mudar, não ao abrir)
  useEffect(() => {
    const currentPathname = location.pathname;
    
    // Ignora a primeira vez (inicialização)
    if (prevPathnameRef.current === null) {
      prevPathnameRef.current = currentPathname;
      return;
    }
    
    // Se a rota mudou e o drawer está aberto, fecha
    if (prevPathnameRef.current !== currentPathname && openRef.current && onClose) {
      prevPathnameRef.current = currentPathname;
      onClose();
    } else {
      // Atualiza a referência
      prevPathnameRef.current = currentPathname;
    }
  }, [location.pathname, onClose]);

  return (
    <>
      {/* Desktop Sidebar - sempre visível */}
      <aside
        className={clsx(
          'hidden lg:flex h-screen w-64 flex-col',
          'bg-white dark:bg-neutral-950',
          'border-r border-neutral-200 dark:border-neutral-800',
          className
        )}
        {...props}
      >
        <SidebarContent items={items} header={header} footer={footer} />
      </aside>

      {/* Mobile Drawer - Customizado para abrir da esquerda */}
      {open && onClose && (
        <MobileSidebarDrawer
          open={open}
          onClose={onClose}
          items={items}
          header={header}
          footer={footer}
        />
      )}
    </>
  );
}