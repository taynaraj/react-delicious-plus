import { NavLink, useLocation } from 'react-router-dom';
import { clsx } from 'clsx';
import { HTMLAttributes, ReactNode } from 'react';
import Logo from '@assets/logo/dplus-logo.png';
import { useBookmarksStore } from '@features/bookmarks/store';

export interface SidebarItem {
  to: string;
  label: string;
  icon?: ReactNode;
}

export interface SidebarProps extends HTMLAttributes<HTMLElement> {
  items: SidebarItem[];
  header?: ReactNode;
  footer?: ReactNode;
}

export function Sidebar({ items, header, footer, className, ...props }: SidebarProps) {
  const location = useLocation();
  const clearFilters = useBookmarksStore((state) => state.clearFilters);

  return (
    <aside
      className={clsx(
        'flex h-screen w-64 flex-col',
        'bg-white dark:bg-neutral-950',
        'border-r border-neutral-200 dark:border-neutral-800',
        className
      )}
      {...props}
    >
      {/* Header */}
      {header ? (
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
    </aside>
  );
}