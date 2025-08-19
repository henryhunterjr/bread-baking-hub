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

const lockScroll = (caller?: string) => {
  console.log(`🔒 SCROLL LOCK - Called by: ${caller || 'unknown'}`);
  console.log(`🔒 Current count BEFORE: ${scrollLockCount}`);
  console.log(`🔒 Body overflow BEFORE: "${document.body.style.overflow}"`);
  console.log(`🔒 Body classes BEFORE: "${document.body.className}"`);
  
  if (scrollLockCount === 0) {
    // Store current scroll position
    scrollY = window.scrollY;
    console.log(`🔒 Storing scroll position: ${scrollY}`);
    
    // Store original styles only when first lock is applied
    originalStyles = {
      overflow: document.body.style.overflow,
      position: document.body.style.position,
      width: document.body.style.width,
      top: document.body.style.top,
      overscrollBehavior: (document.body.style as any).overscrollBehavior || '',
      scrollbarGutter: (document.body.style as any).scrollbarGutter || '',
    };
    
    console.log(`🔒 Stored original styles:`, originalStyles);

    // Apply scroll lock with preserved scroll position
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';
    (document.body.style as any).overscrollBehavior = 'contain';
    (document.body.style as any).scrollbarGutter = 'stable';
  }
  scrollLockCount++;
  console.log(`🔒 Count AFTER: ${scrollLockCount}`);
  console.log(`🔒 Body overflow AFTER: "${document.body.style.overflow}"`);
};

const unlockScroll = (caller?: string) => {
  console.log(`🔓 SCROLL UNLOCK - Called by: ${caller || 'unknown'}`);
  console.log(`🔓 Current count BEFORE: ${scrollLockCount}`);
  console.log(`🔓 Body overflow BEFORE: "${document.body.style.overflow}"`);
  console.log(`🔓 Body classes BEFORE: "${document.body.className}"`);
  
  scrollLockCount = Math.max(0, scrollLockCount - 1);
  
  if (scrollLockCount === 0 && originalStyles) {
    console.log(`🔓 Restoring original styles:`, originalStyles);
    
    // Restore original styles only when no locks remain
    // If original overflow was empty, set to 'visible' to ensure scrollability
    document.body.style.overflow = originalStyles.overflow || 'visible';
    document.body.style.position = originalStyles.position;
    document.body.style.width = originalStyles.width;
    document.body.style.top = originalStyles.top;
    (document.body.style as any).overscrollBehavior = originalStyles.overscrollBehavior;
    (document.body.style as any).scrollbarGutter = originalStyles.scrollbarGutter;
    
    // Restore scroll position
    console.log(`🔓 Restoring scroll position: ${scrollY}`);
    window.scrollTo(0, scrollY);
    
    originalStyles = null;
  }
  console.log(`🔓 Count AFTER: ${scrollLockCount}`);
  console.log(`🔓 Body overflow AFTER: "${document.body.style.overflow}"`);
};

export const useScrollLock = (shouldLock: boolean, caller: string = 'unknown') => {
  useEffect(() => {
    console.log(`📋 useScrollLock effect - shouldLock: ${shouldLock}, caller: ${caller}`);
    if (shouldLock) {
      lockScroll(caller);
      return () => {
        console.log(`📋 useScrollLock cleanup running for: ${caller}`);
        unlockScroll(caller);
      };
    }
  }, [shouldLock, caller]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      console.log(`📋 useScrollLock unmount cleanup for: ${caller}`);
      if (scrollLockCount > 0) {
        unlockScroll(`${caller}-unmount`);
      }
    };
  }, [caller]);
};