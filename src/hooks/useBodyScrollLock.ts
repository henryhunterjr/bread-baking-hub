import { useEffect } from 'react';

export function useBodyScrollLock(locked: boolean) {
  useEffect(() => {
    const prev = document.body.style.overflow;
    const prevPad = document.body.style.paddingRight;
    
    if (locked) {
      const scrollBarW = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = 'hidden';
      if (scrollBarW > 0) document.body.style.paddingRight = `${scrollBarW}px`;
    } else {
      document.body.style.overflow = prev || '';
      document.body.style.paddingRight = prevPad || '';
    }
    
    return () => {
      document.body.style.overflow = prev || '';
      document.body.style.paddingRight = prevPad || '';
    };
  }, [locked]);
}