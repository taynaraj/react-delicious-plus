import { ReactNode, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@app/providers/auth';
import { Spinner } from '@components/ui';

export interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, checkSession } = useAuthStore();
  const location = useLocation();

  // Verificar sessão ao montar componente
  useEffect(() => {
    const token = localStorage.getItem('react-delicious-token');
    if (token && !isAuthenticated) {
      checkSession();
    }
  }, [checkSession, isAuthenticated]);

  // Mostrar loading enquanto verifica autenticação
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return <>{children}</>;
}

