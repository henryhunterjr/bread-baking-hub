import { useEffect, useState } from 'react';

export const useA2HS = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    const onBeforeInstall = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsSupported(true);
    };
    window.addEventListener('beforeinstallprompt', onBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', onBeforeInstall);
  }, []);

  const promptInstall = async () => {
    if (!deferredPrompt) return false;
    const e = deferredPrompt;
    setDeferredPrompt(null);
    try {
      const { outcome } = await e.prompt();
      return outcome === 'accepted';
    } catch {
      return false;
    }
  };

  return { isSupported, promptInstall };
};
