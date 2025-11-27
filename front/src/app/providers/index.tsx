/**
 * APP PROVIDERS
 * 
 * Providers globais da aplicação (React Context providers).
 * Equivalente a criar providers no AppModule do Angular.
 * 
 * Providers implementados:
 * - ThemeProvider - gerencia tema claro/escuro
 * 
 * IMPORTANTE:
 * - Estes providers envolvem toda a aplicação no App.tsx
 * - Fornecem contexto para componentes filhos
 * - Equivalem a serviços singleton no Angular
 */

import { ThemeProvider } from './ThemeProvider';
import { AuthProvider } from './auth';

/**
 * App Providers
 * 
 * Envolve toda a aplicação com providers necessários.
 */
export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        {children}
      </AuthProvider>
    </ThemeProvider>
  );
}
