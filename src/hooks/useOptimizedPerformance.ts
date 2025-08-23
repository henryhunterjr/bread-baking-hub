import { useEffect, useRef } from 'react';
import { domBatcher } from '@/utils/performanceUtils';

// Performance-optimized hook for handling forced reflows
export const useOptimizedLayout = () => {
  const elementRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    // Add CSS containment for performance
    element.style.contain = 'content';

    // Batch any initial measurements
    domBatcher.addRead(() => {
      const rect = element.getBoundingClientRect();
      // Store measurements for later use
      element.dataset.initialWidth = String(rect.width);
      element.dataset.initialHeight = String(rect.height);
    });

    return () => {
      if (element) {
        element.style.contain = '';
      }
    };
  }, []);

  return elementRef;
};

// Hook for optimized mobile detection without forced reflows
export const useOptimizedMobile = () => {
  const isMobileRef = useRef<boolean>(false);
  
  useEffect(() => {
    // Use matchMedia instead of window.innerWidth to avoid reflows
    const mediaQuery = window.matchMedia('(max-width: 768px)');
    
    const handleMediaChange = (e: MediaQueryListEvent) => {
      isMobileRef.current = e.matches;
    };

    isMobileRef.current = mediaQuery.matches;
    
    // Use addEventListener for better performance
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleMediaChange);
      return () => mediaQuery.removeEventListener('change', handleMediaChange);
    } else {
      // Fallback for older browsers
      mediaQuery.addListener(handleMediaChange);
      return () => mediaQuery.removeListener(handleMediaChange);
    }
  }, []);

  return isMobileRef.current;
};

// Performance-optimized scroll hook
export const useOptimizedScroll = (callback: () => void, throttleMs = 16) => {
  useEffect(() => {
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          callback();
          ticking = false;
        });
        ticking = true;
      }
    };

    // Use passive listeners to prevent blocking
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [callback, throttleMs]);
};

// Animation utilities that prefer transform/opacity
export const performOptimizedAnimation = {
  // Slide animation using transform instead of left/top
  slideIn: (element: HTMLElement, direction: 'left' | 'right' | 'up' | 'down') => {
    const transforms = {
      left: 'translateX(-100%)',
      right: 'translateX(100%)', 
      up: 'translateY(-100%)',
      down: 'translateY(100%)'
    };

    element.style.transform = transforms[direction];
    element.style.opacity = '0';
    element.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
    
    requestAnimationFrame(() => {
      element.style.transform = 'translate(0, 0)';
      element.style.opacity = '1';
    });
  },

  // Fade animation using opacity
  fadeIn: (element: HTMLElement, duration = 300) => {
    element.style.opacity = '0';
    element.style.transition = `opacity ${duration}ms ease`;
    
    requestAnimationFrame(() => {
      element.style.opacity = '1';
    });
  },

  // Scale animation using transform
  scaleIn: (element: HTMLElement, duration = 200) => {
    element.style.transform = 'scale(0.95)';
    element.style.opacity = '0';
    element.style.transition = `transform ${duration}ms ease, opacity ${duration}ms ease`;
    
    requestAnimationFrame(() => {
      element.style.transform = 'scale(1)';
      element.style.opacity = '1';
    });
  }
};