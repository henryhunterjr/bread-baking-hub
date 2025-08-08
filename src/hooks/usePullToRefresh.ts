import { useEffect, useRef, useState } from 'react';

interface Options {
  onRefresh: () => void;
  threshold?: number;
}

export const usePullToRefresh = ({ onRefresh, threshold = 60 }: Options) => {
  const startY = useRef<number | null>(null);
  const [pulling, setPulling] = useState(false);

  useEffect(() => {
    const onTouchStart = (e: TouchEvent) => {
      if (window.scrollY === 0) {
        startY.current = e.touches[0].clientY;
      } else {
        startY.current = null;
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (startY.current !== null) {
        const dy = e.touches[0].clientY - startY.current;
        setPulling(dy > 0);
        if (dy > threshold) {
          onRefresh();
          startY.current = null;
          setPulling(false);
        }
      }
    };

    const onTouchEnd = () => {
      startY.current = null;
      setPulling(false);
    };

    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd);
    return () => {
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, [onRefresh, threshold]);

  return { pulling };
};
