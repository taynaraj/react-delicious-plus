import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@app/providers/auth';
import { Input } from '@components/ui/Input';
import { Button } from '@components/ui/Button';
import { Spinner } from '@components/ui/Spinner';
import { EnvelopeIcon } from '@heroicons/react/24/outline';
import Logo from '@assets/logo/dplus-logo.png';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading, error, clearError, isAuthenticated } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      const from = (location.state as { from?: string })?.from || '/';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  useEffect(() => {
    if (error || formError) {
      clearError();
      setFormError(null);
    }
  }, [email, password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!email || !password) {
      setFormError('Preencha todos os campos');
      return;
    }

    try {
      await login({ email, password });
      const from = (location.state as { from?: string })?.from || '/';
      navigate(from, { replace: true });
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Erro ao fazer login');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-950 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <img src={Logo} alt="D+" className="h-20 w-20 object-contain" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50 mb-1">
            Delicios Plus - Seu guardador de links
          </h1>

        </div>

        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-6 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                E-mail
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                disabled={isLoading}
                className="w-full"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                Senha
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                disabled={isLoading}
                className="w-full"
              />
            </div>

            {(error || formError) && (
              <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800/50">
                <p className="text-sm text-red-600 dark:text-red-400">
                  {error || formError}
                </p>
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Spinner size="sm" className="mr-2" />
                  Entrando...
                </>
              ) : (
                'Entrar'
              )}
            </Button>
          </form>

          <div className="mt-6 space-y-3 text-center text-sm">
            <Link
              to="/forgot-password"
              className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors duration-150"
            >
              Esqueceu sua senha?
            </Link>
            <div className="text-neutral-500 dark:text-neutral-400">
              Não tem uma conta?{' '}
              <Link
                to="/register"
                className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium transition-colors duration-150"
              >
                Criar conta
              </Link>
            </div>
          </div>
        </div>

        {/* Créditos */}
        <div className="mt-8 pt-6 border-t border-neutral-200 dark:border-neutral-800">
          <div className="space-y-2.5">
            <p className="text-xs text-neutral-500 dark:text-neutral-400 text-center leading-relaxed">
              Desenvolvido por <span className="font-semibold text-neutral-700 dark:text-neutral-300">Taynara Jaegger</span>
            </p>
            <div className="flex items-center justify-center gap-3">
              <a
                href="mailto:taynaraj@gmail.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-9 h-9 rounded-lg text-neutral-500 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-950/20 active:scale-95 transition-all duration-150"
                aria-label="Enviar email para Taynara Jaegger"
              >
                <EnvelopeIcon className="w-5 h-5" strokeWidth={2} />
              </a>
              <a
                href="https://www.linkedin.com/in/taynara/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-9 h-9 rounded-lg text-neutral-500 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-950/20 active:scale-95 transition-all duration-150"
                aria-label="LinkedIn de Taynara Jaegger"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

