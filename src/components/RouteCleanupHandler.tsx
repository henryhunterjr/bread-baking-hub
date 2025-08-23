import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import scrollLock from '@/utils/scrollLockManager';

export default function RouteCleanupHandler() {
  const { pathname } = useLocation();
  useEffect(() => { scrollLock.forceReset(); }, [pathname]);
  return null;
}