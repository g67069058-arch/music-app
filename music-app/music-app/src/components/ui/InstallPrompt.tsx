'use client';

import { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) return;
    if (dismissed) return;

    // iOS detection
    const ios = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(ios);

    if (ios) {
      // Show iOS instructions after a delay
      const t = setTimeout(() => setShowBanner(true), 3000);
      return () => clearTimeout(t);
    }

    // Android / Chrome - beforeinstallprompt
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, [dismissed]);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') setShowBanner(false);
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowBanner(false);
    setDismissed(true);
  };

  if (!showBanner) return null;

  return (
    <div
      className="fixed top-4 left-4 right-4 z-50 rounded-2xl p-4 animate-slide-down"
      style={{
        background: 'rgba(26,255,140,0.08)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(26,255,140,0.2)',
      }}
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 bg-accent-primary/20 rounded-xl flex items-center justify-center flex-shrink-0">
          <Download size={18} className="text-accent-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-white text-sm">Install Soundwave</p>
          {isIOS ? (
            <p className="text-xs text-ink-300 mt-0.5">
              Tap <strong className="text-white">Share</strong> then{' '}
              <strong className="text-white">Add to Home Screen</strong> for background playback
            </p>
          ) : (
            <p className="text-xs text-ink-300 mt-0.5">
              Install for lock-screen controls & offline playback
            </p>
          )}
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {!isIOS && (
            <button
              onClick={handleInstall}
              className="text-xs font-semibold text-black bg-accent-primary px-3 py-1.5 rounded-lg active:scale-95 transition-all"
            >
              Install
            </button>
          )}
          <button
            onClick={handleDismiss}
            className="p-1 rounded-lg hover:bg-white/10 text-ink-300"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
