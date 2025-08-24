import { useState, useEffect } from 'react';
import { logger } from '@/utils/logger';

export const useNetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => {
      logger.log('Network: Online');
      setIsOnline(true);
    };
    
    const handleOffline = () => {
      logger.log('Network: Offline');
      setIsOnline(false);
    };

    // Additional connectivity check
    const checkConnectivity = async () => {
      if (!navigator.onLine) {
        setIsOnline(false);
        return;
      }

      try {
        // Try to fetch a small resource to verify actual connectivity
        const response = await fetch('/placeholder.svg', { 
          method: 'HEAD',
          cache: 'no-cache'
        });
        setIsOnline(response.ok);
      } catch {
        setIsOnline(false);
      }
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Check connectivity periodically
    const interval = setInterval(checkConnectivity, 30000);
    
    // Initial check
    checkConnectivity();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
    };
  }, []);

  return isOnline;
};