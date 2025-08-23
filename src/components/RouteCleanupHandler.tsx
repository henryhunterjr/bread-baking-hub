import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function RouteCleanupHandler() {
  const location = useLocation();
  
  useEffect(() => {
    return () => {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    };
  }, [location.pathname]);
  
  return null;
}