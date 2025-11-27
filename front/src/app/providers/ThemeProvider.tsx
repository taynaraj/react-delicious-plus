/**
 * THEME PROVIDER
 * 
 * Provider para gerenciar tema claro/escuro.
 * 
 * COMPARAÇÃO ANGULAR → REACT:
 * 
 * No Angular (Material):
 * ```typescript
 * @Injectable({ providedIn: 'root' })
 * export class ThemeService {
 *   private darkMode$ = new BehaviorSubject<boolean>(false);
 *   
 *   toggleTheme() {
 *     const current = this.darkMode$.value;
 *     this.darkMode$.next(!current);
 *   }
 * }
 * ```
 * - Angular usa services com BehaviorSubject
 * - Componentes assinam via async pipe
 * 
 * No React:
 * - Context API para fornecer tema globalmente
 * - Hook customizado para usar o tema
 * - Mais simples e direto
 * 
 * VANTAGENS:
 * - Context API é nativo do React
 * - Fácil de usar com hook customizado
 * - Persistência no localStorage automática
 */

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type Theme = 'light' | 'dark';
type ThemePreference = 'light' | 'dark';

interface ThemeContextValue {
  theme: Theme;
  themePreference: ThemePreference;
  toggleTheme: () => void;
  setTheme: (theme: ThemePreference) => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

/**
 * Theme Provider
 * 
 * Gerencia tema claro/escuro e aplica classe no documento HTML.
 * Suporta "system", "light" e "dark" com persistência simples no localStorage.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  // Estado local da preferência de tema (persistido no localStorage)
  const [themePreference, setThemePreferenceState] = useState<ThemePreference>(() => {
    // Ler do localStorage
    const stored = localStorage.getItem('theme-preference');
    if (stored === 'light' || stored === 'dark') {
      return stored;
    }
    
    // Fallback para localStorage antigo
    const oldStored = localStorage.getItem('theme');
    if (oldStored === 'light' || oldStored === 'dark') {
      return oldStored;
    }
    
    return 'light';
  });

  // Função para atualizar preferência (persiste no localStorage)
  const setThemePreference = (theme: ThemePreference) => {
    setThemePreferenceState(theme);
    localStorage.setItem('theme-preference', theme);
  };

  // Estado do tema atual (light ou dark, considerando system)
  const [theme, setThemeState] = useState<Theme>(() => {
    return themePreference;
  });

  // Atualizar tema quando preferência mudar
  useEffect(() => {
    setThemeState(themePreference);
  }, [themePreference]);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setThemePreference(theme === 'light' ? 'dark' : 'light');
  };

  const setTheme = (newTheme: ThemePreference) => {
    setThemePreference(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, themePreference, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

/**
 * Hook para usar o tema
 */
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme deve ser usado dentro de ThemeProvider');
  }
  return context;
}
