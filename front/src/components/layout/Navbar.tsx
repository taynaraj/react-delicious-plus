import { useState, useRef } from 'react';
import { HTMLAttributes, ReactNode } from 'react';
import { clsx } from 'clsx';
import { useTheme } from '@app/providers/ThemeProvider';
import { useAuthStore } from '@app/providers/auth';
import { useNavigate } from 'react-router-dom';
import { SunIcon, MoonIcon, PlusIcon, ArrowRightOnRectangleIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import Logo from '@assets/logo/dplus-logo.png';
import { useClickOutside } from '@shared/hooks/useClickOutside';

export interface NavbarProps extends HTMLAttributes<HTMLElement> {
  left?: ReactNode;
  center?: ReactNode;
  right?: ReactNode;
}

export function Navbar({ left, center, right, className, ...props }: NavbarProps) {
  const { theme, themePreference, toggleTheme } = useTheme();
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Fechar menu ao clicar fora
  useClickOutside(userMenuRef, () => setShowUserMenu(false));

  // Ícone do tema baseado na preferência
  const getThemeIcon = () => {
    return theme === 'dark' ? (
      <SunIcon className="h-4 w-4" strokeWidth={1.7} />
    ) : (
      <MoonIcon className="h-4 w-4" strokeWidth={1.7} />
    );
  };

  // Label do tema
  const getThemeLabel = () => {
    if (themePreference === 'light') return 'Claro';
    return 'Escuro';
  };

  // Handler para logout
  const handleLogout = () => {
    logout();
    navigate('/login');
    setShowUserMenu(false);
  };

  // Iniciais do usuário
  const getUserInitials = () => {
    if (!user) return 'U';
    return user.name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };
  
  return (
    <header
      className={clsx(
        'flex h-16 items-center justify-between',
        'bg-white dark:bg-neutral-900',
        'border-b border-neutral-200 dark:border-neutral-800',
        'shadow-sm',
        'px-6',
        className
      )}
      {...props}
    >
      {/* Left - Logo */}
      <div className="flex items-center gap-3">
        {left || (
          <Link to="/" className="flex items-center gap-2.5 hover:opacity-70 transition-opacity duration-150">
            <img src={Logo} alt="D+" className="h-6 w-6 object-contain shrink-0 opacity-90" />
          </Link>
        )}
      </div>

      {/* Center */}
      {center && <div className="flex-1">{center}</div>}

      {/* Right - Botões */}
      <div className="flex items-center gap-2.5">
        {right}
        
        {/* Botão Adicionar Bookmark */}
        <Link
          to="/bookmarks/new"
          className="rounded-lg px-3.5 py-1.5 text-sm font-medium text-neutral-700 dark:text-neutral-300 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors duration-150 flex items-center gap-1.5"
        >
          <PlusIcon className="h-4 w-4" strokeWidth={2} />
          <span>Adicionar</span>
        </Link>

        {/* Toggle tema */}
        <button
          type="button"
          onClick={toggleTheme}
          className="rounded-lg p-2 text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-all duration-150"
          aria-label={`Tema: ${getThemeLabel()}`}
          title={`Tema: ${getThemeLabel()}`}
        >
          {getThemeIcon()}
        </button>

        {/* Menu de Usuário */}
        {user && (
          <div ref={userMenuRef} className="relative">
            <button
              type="button"
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors duration-150"
            >
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold text-white bg-primary-500">
                {getUserInitials()}
              </div>
              <ChevronDownIcon className="h-4 w-4" strokeWidth={2} />
            </button>

            {/* Dropdown Menu */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-lg py-1 z-50">
                {/* Header do menu */}
                <div className="px-4 py-3 border-b border-neutral-200 dark:border-neutral-800">
                  <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-50">
                    {user.name}
                  </p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate">
                    {user.email}
                  </p>
                </div>

                {/* Itens do menu */}
                <div className="py-1">
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 flex items-center gap-2 transition-colors duration-150"
                  >
                    <ArrowRightOnRectangleIcon className="h-4 w-4" strokeWidth={2} />
                    <span>Sair</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}