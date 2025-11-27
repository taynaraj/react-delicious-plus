import { ReactNode } from 'react';
import { useAuthStore } from './authStore';

export interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {

  useAuthStore.getState();

  return <>{children}</>;
}

