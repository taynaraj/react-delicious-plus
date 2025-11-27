import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Input } from '@components/ui/Input';
import { Button } from '@components/ui/Button';
import Logo from '@assets/logo/dplus-logo.png';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock: apenas simular envio
    setSent(true);
  };

  if (sent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-950 px-4 py-12">
        <div className="w-full max-w-md">
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-6 shadow-sm text-center">
            <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-950/20 flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-6 h-6 text-green-600 dark:text-green-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-50 mb-2">
              E-mail enviado!
            </h2>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-6">
              Verifique sua caixa de entrada e siga as instruções para redefinir sua senha.
            </p>
            <Link to="/login">
              <Button variant="primary" className="w-full">
                Voltar para login
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-950 px-4 py-12">
      <div className="w-full max-w-md">

        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <img src={Logo} alt="D+" className="h-12 w-12 object-contain opacity-90" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50 mb-1">
            Esqueceu sua senha?
          </h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Digite seu e-mail para receber instruções
          </p>
        </div>


        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-6 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
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
                required
                className="w-full"
              />
            </div>


            <Button type="submit" variant="primary" className="w-full">
              Enviar instruções
            </Button>
          </form>


          <div className="mt-6 text-center text-sm text-neutral-500 dark:text-neutral-400">
            <Link
              to="/login"
              className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors duration-150"
            >
              Voltar para login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

