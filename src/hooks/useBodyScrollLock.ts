import { useEffect } from 'react';

export function useBodyScrollLock(locked: boolean) {
  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    const prevPad = document.body.style.paddingRight;
    
    if (locked) {
      const sbw = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = 'hidden';
      if (sbw > 0) document.body.style.paddingRight = `${sbw}px`;
    } else {
      document.body.style.overflow = prevOverflow || '';
      document.body.style.paddingRight = prevPad || '';
    }
    
    return () => {
      document.body.style.overflow = prevOverflow || '';
      document.body.style.paddingRight = prevPad || '';
    };
  }, [locked]);
}