

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
