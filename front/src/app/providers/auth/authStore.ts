
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, LoginCredentials, RegisterData, AuthSession } from '@shared/types/auth';
import { authService } from '@services/authService';

interface AuthState {
  // Estado
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Ações
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  getSession: () => AuthSession | null;
  clearError: () => void;
  checkSession: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Estado inicial
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Login
      login: async (credentials: LoginCredentials) => {
        set({ isLoading: true, error: null });

        try {
          const { user, token } = await authService.login(credentials);
          
          localStorage.setItem('react-delicious-token', token);

          set({
            user: {
              id: user.id,
              name: user.name,
              email: user.email,
              createdAt: new Date().toISOString(),
            },
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Erro ao fazer login';
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: message,
          });
          throw error;
        }
      },

      // Register
      register: async (data: RegisterData) => {
        set({ isLoading: true, error: null });

        try {
          if ('confirmPassword' in data && data.password !== data.confirmPassword) {
            throw new Error('As senhas não coincidem');
          }

          const { user, token } = await authService.register({
            name: data.name,
            email: data.email,
            password: data.password,
          });

          localStorage.setItem('react-delicious-token', token);

          set({
            user: {
              id: user.id,
              name: user.name,
              email: user.email,
              createdAt: new Date().toISOString(),
            },
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Erro ao registrar';
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: message,
          });
          throw error;
        }
      },

      // Logout
      logout: () => {
        localStorage.removeItem('react-delicious-token');
        
        set({
          user: null,
          isAuthenticated: false,
          error: null,
        });
      },

      // Get session
      getSession: () => {
        const { user } = get();
        const token = localStorage.getItem('react-delicious-token');
        
        if (!user || !token) return null;

        return {
          user,
          token,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        };
      },

      // Check session (verifica se token ainda é válido)
      checkSession: async () => {
        const token = localStorage.getItem('react-delicious-token');
        
        if (!token) {
          set({ user: null, isAuthenticated: false });
          return;
        }

        set({ isLoading: true });

        try {
          const { user } = await authService.getMe();
          
          set({
            user: {
              id: user.id,
              name: user.name,
              email: user.email,
              createdAt: user.createdAt,
            },
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          localStorage.removeItem('react-delicious-token');
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      },

      // Clear error
      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'react-delicious-auth',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

