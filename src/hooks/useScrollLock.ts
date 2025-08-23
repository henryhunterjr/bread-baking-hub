
import { useEffect } from 'react';

// Enhanced global scroll lock state with component tracking
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
const activeLocks = new Set<string>(); // Track which components have active locks

const lockScroll = (caller?: string) => {
  console.log(`🔒 SCROLL LOCK - Called by: ${caller || 'unknown'}`);
  console.log(`🔒 Current count BEFORE: ${scrollLockCount}`);
  console.log(`🔒 Active locks BEFORE:`, Array.from(activeLocks));
  console.log(`🔒 Body overflow BEFORE: "${document.body.style.overflow}"`);
  console.log(`🔒 Body position BEFORE: "${document.body.style.position}"`);
  console.log(`🔒 Body classes BEFORE: "${document.body.className}"`);
  
  // Add this caller to active locks
  if (caller) {
    activeLocks.add(caller);
  }
  
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

    // Apply CSS-only scroll lock - no position manipulation to avoid layout shifts
    document.body.style.overflow = 'hidden';
    (document.body.style as any).overscrollBehavior = 'contain';
    
    console.log(`🔒 Applied CSS-only scroll lock (overflow: hidden)`);
  }
  scrollLockCount++;
  console.log(`🔒 Count AFTER: ${scrollLockCount}`);
  console.log(`🔒 Active locks AFTER:`, Array.from(activeLocks));
  console.log(`🔒 Body overflow AFTER: "${document.body.style.overflow}"`);
  console.log(`🔒 Body position AFTER: "${document.body.style.position}"`);
};

const unlockScroll = (caller?: string) => {
  console.log(`🔓 SCROLL UNLOCK - Called by: ${caller || 'unknown'}`);
  console.log(`🔓 Current count BEFORE: ${scrollLockCount}`);
  console.log(`🔓 Active locks BEFORE:`, Array.from(activeLocks));
  console.log(`🔓 Body overflow BEFORE: "${document.body.style.overflow}"`);
  console.log(`🔓 Body position BEFORE: "${document.body.style.position}"`);
  console.log(`🔓 Body classes BEFORE: "${document.body.className}"`);
  
  // Remove this caller from active locks
  if (caller) {
    activeLocks.delete(caller);
  }
  
  scrollLockCount = Math.max(0, scrollLockCount - 1);
  console.log(`🔓 Count decremented to: ${scrollLockCount}`);
  console.log(`🔓 Active locks after removal:`, Array.from(activeLocks));
  
  if (scrollLockCount === 0 && originalStyles) {
    console.log(`🔓 RESTORING SCROLL - No more locks remaining`);
    console.log(`🔓 Restoring original styles:`, originalStyles);
    
    // Restore original styles only when no locks remain
    // If original overflow was empty, set to 'visible' to ensure scrollability
    const targetOverflow = originalStyles.overflow || 'visible';
    document.body.style.overflow = targetOverflow;
    document.body.style.position = originalStyles.position || '';
    document.body.style.width = originalStyles.width || '';
    document.body.style.top = originalStyles.top || '';
    (document.body.style as any).overscrollBehavior = originalStyles.overscrollBehavior || '';
    (document.body.style as any).scrollbarGutter = originalStyles.scrollbarGutter || '';
    
    console.log(`🔓 Restored overflow to: "${targetOverflow}"`);
    console.log(`🔓 Restored position to: "${originalStyles.position}"`);
    
    // Restore scroll position
    console.log(`🔓 Restoring scroll position: ${scrollY}`);
    window.scrollTo(0, scrollY);
    
    // Validate restoration
    setTimeout(() => {
      console.log(`🔓 VALIDATION - Body overflow after restore: "${document.body.style.overflow}"`);
      console.log(`🔓 VALIDATION - Body position after restore: "${document.body.style.position}"`);
      console.log(`🔓 VALIDATION - Can scroll? ${document.body.scrollHeight > window.innerHeight ? 'YES' : 'NO'}`);
      console.log(`🔓 VALIDATION - Document scrollTop: ${document.documentElement.scrollTop}`);
    }, 100);
    
    originalStyles = null;
  } else if (scrollLockCount === 0) {
    console.log(`🔓 WARNING - Count is 0 but no originalStyles found!`);
  } else {
    console.log(`🔓 SKIPPING RESTORE - Still ${scrollLockCount} locks remaining`);
  }
  
  console.log(`🔓 Count AFTER: ${scrollLockCount}`);
  console.log(`🔓 Body overflow AFTER: "${document.body.style.overflow}"`);
  console.log(`🔓 Body position AFTER: "${document.body.style.position}"`);
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

  // Cleanup on unmount with additional validation
  useEffect(() => {
    return () => {
      console.log(`📋 useScrollLock unmount cleanup for: ${caller}`);
      if (scrollLockCount > 0 && activeLocks.has(caller)) {
        console.log(`📋 UNMOUNT - ${caller} still has active lock, cleaning up`);
        unlockScroll(`${caller}-unmount`);
      } else {
        console.log(`📋 UNMOUNT - ${caller} no active lock found`);
      }
    };
  }, [caller]);
};
