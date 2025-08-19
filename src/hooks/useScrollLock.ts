import { useEffect } from 'react';

// Global scroll lock state
let scrollLockCount = 0;
let originalStyles: {
  overflow: string;
  position: string;
  width: string;
  top: string;
  overscrollBehavior: string;
  scrollbarGutter: string;
} | null = null;
let scrollY = 0;

const lockScroll = () => {
  if (scrollLockCount === 0) {
    // Store current scroll position
    scrollY = window.scrollY;
    
    // Store original styles only when first lock is applied
    originalStyles = {
      overflow: document.body.style.overflow,
      position: document.body.style.position,
      width: document.body.style.width,
      top: document.body.style.top,
      overscrollBehavior: (document.body.style as any).overscrollBehavior || '',
      scrollbarGutter: (document.body.style as any).scrollbarGutter || '',
    };

    // Apply scroll lock with preserved scroll position
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';
    (document.body.style as any).overscrollBehavior = 'contain';
    (document.body.style as any).scrollbarGutter = 'stable';
  }
  scrollLockCount++;
};

const unlockScroll = () => {
  scrollLockCount = Math.max(0, scrollLockCount - 1);
  
  if (scrollLockCount === 0 && originalStyles) {
    // Restore original styles only when no locks remain
    document.body.style.overflow = originalStyles.overflow;
    document.body.style.position = originalStyles.position;
    document.body.style.width = originalStyles.width;
    document.body.style.top = originalStyles.top;
    (document.body.style as any).overscrollBehavior = originalStyles.overscrollBehavior;
    (document.body.style as any).scrollbarGutter = originalStyles.scrollbarGutter;
    
    // Restore scroll position
    window.scrollTo(0, scrollY);
    
    originalStyles = null;
  }
};

export const useScrollLock = (shouldLock: boolean) => {
  useEffect(() => {
    if (shouldLock) {
      lockScroll();
      return () => {
        unlockScroll();
      };
    }
  }, [shouldLock]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (scrollLockCount > 0) {
        unlockScroll();
      }
    };
  }, []);
};