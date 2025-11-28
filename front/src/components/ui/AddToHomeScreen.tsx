import { useState, useEffect } from 'react';
import { XMarkIcon, DevicePhoneMobileIcon } from '@heroicons/react/24/outline';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function AddToHomeScreen() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Verifica se é mobile (tela pequena)
    const checkMobile = () => {
      const isMobileSize = window.innerWidth < 640; // sm breakpoint do Tailwind
      setIsMobile(isMobileSize);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    const isStandaloneMode = 
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true ||
      document.referrer.includes('android-app://');
    
    setIsStandalone(isStandaloneMode);

    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(iOS);

    const hasShownBanner = localStorage.getItem('pwa-install-banner-shown');
    
    // Se já foi mostrado ou está instalado, não faz nada além do cleanup
    if (hasShownBanner === 'true' || isStandaloneMode) {
      return () => {
        window.removeEventListener('resize', checkMobile);
      };
    }

    // Para Android/Chrome - captura o evento beforeinstallprompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Se não houver evento (pode já ter sido disparado), mostra banner após delay
    const timeoutId = setTimeout(() => {
      if (!deferredPrompt && !isStandaloneMode && !hasShownBanner) {
        setShowBanner(true);
      }
    }, 3000);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('resize', checkMobile);
      clearTimeout(timeoutId);
    };
  }, [deferredPrompt]);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      // Android/Chrome - usa o prompt nativo
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        setShowBanner(false);
        localStorage.setItem('pwa-install-banner-shown', 'true');
      }
      
      setDeferredPrompt(null);
    } else {
      // iOS - mostra instruções
      setShowBanner(false);
      localStorage.setItem('pwa-install-banner-shown', 'true');
    }
  };

  const handleDismiss = () => {
    setShowBanner(false);
    localStorage.setItem('pwa-install-banner-shown', 'true');
  };

  // Só mostra em telas pequenas (mobile) e se não estiver instalado
  if (!showBanner || isStandalone || !isMobile) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 sm:left-auto sm:right-4 sm:max-w-sm animate-in slide-in-from-bottom-4">
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-lg p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <DevicePhoneMobileIcon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-50 mb-1">
              Adicionar à tela inicial
            </h3>
            {isIOS ? (
              <div className="text-xs text-neutral-600 dark:text-neutral-400 space-y-1.5">
                <p>Para adicionar este app à sua tela inicial:</p>
                <ol className="list-decimal list-inside space-y-1 ml-2">
                  <li>Toque no botão <span className="font-semibold">Compartilhar</span> <span className="text-lg">⎋</span></li>
                  <li>Selecione <span className="font-semibold">Adicionar à Tela de Início</span></li>
                </ol>
              </div>
            ) : (
              <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-3">
                Instale o Delicious+ no seu celular para acesso rápido e fácil.
              </p>
            )}
            
            {!isIOS && (
              <button
                onClick={handleInstallClick}
                className="w-full px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-lg transition-colors duration-150"
              >
                Instalar agora
              </button>
            )}
          </div>
          
          <button
            onClick={handleDismiss}
            className="flex-shrink-0 p-1 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
            aria-label="Fechar"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

