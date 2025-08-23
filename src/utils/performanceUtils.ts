// Enhanced performance utilities for scroll/resize optimization
let ticking = false;

export const throttle = <T extends (...args: any[]) => void>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;
  let lastExecTime = 0;

  return (...args: Parameters<T>) => {
    const currentTime = Date.now();

    if (currentTime - lastExecTime > delay) {
      func(...args);
      lastExecTime = currentTime;
    } else {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func(...args);
        lastExecTime = Date.now();
      }, delay - (currentTime - lastExecTime));
    }
  };
};

export const rafThrottle = <T extends (...args: any[]) => void>(
  func: T
): ((...args: Parameters<T>) => void) => {
  return (...args: Parameters<T>) => {
    if (!ticking) {
      requestAnimationFrame(() => {
        func(...args);
        ticking = false;
      });
      ticking = true;
    }
  };
};

// Batch DOM reads and writes to prevent layout thrashing
export class DOMBatcher {
  private reads: Array<() => void> = [];
  private writes: Array<() => void> = [];
  private scheduled = false;

  addRead(fn: () => void) {
    this.reads.push(fn);
    this.schedule();
  }

  addWrite(fn: () => void) {
    this.writes.push(fn);
    this.schedule();
  }

  private schedule() {
    if (!this.scheduled) {
      this.scheduled = true;
      requestAnimationFrame(() => {
        this.flush();
      });
    }
  }

  private flush() {
    // Execute all reads first (prevents layout thrashing)
    this.reads.forEach(fn => fn());
    this.reads = [];

    // Then execute all writes
    this.writes.forEach(fn => fn());
    this.writes = [];

    this.scheduled = false;
  }
}

export const domBatcher = new DOMBatcher();

// Enhanced scroll listener with passive support
export const addOptimizedScrollListener = (
  element: Element | Window,
  handler: (event: Event) => void,
  options: { passive?: boolean; throttle?: number } = {}
) => {
  const { passive = true, throttle: throttleMs = 16 } = options;
  
  const optimizedHandler = throttleMs > 0 
    ? throttle(handler, throttleMs)
    : rafThrottle(handler);

  const listenerOptions: AddEventListenerOptions = {
    passive,
    capture: false
  };

  element.addEventListener('scroll', optimizedHandler, listenerOptions);

  return () => {
    element.removeEventListener('scroll', optimizedHandler, listenerOptions);
  };
};

// Enhanced resize listener with passive support
export const addOptimizedResizeListener = (
  handler: (event: Event) => void,
  options: { throttle?: number } = {}
) => {
  const { throttle: throttleMs = 100 } = options;
  
  const optimizedHandler = rafThrottle(
    throttleMs > 0 ? throttle(handler, throttleMs) : handler
  );

  window.addEventListener('resize', optimizedHandler, { passive: true });

  return () => {
    window.removeEventListener('resize', optimizedHandler);
  };
};

// Intersection Observer with optimized options
export const createOptimizedIntersectionObserver = (
  callback: IntersectionObserverCallback,
  options: IntersectionObserverInit = {}
) => {
  const defaultOptions: IntersectionObserverInit = {
    rootMargin: '50px 0px',
    threshold: [0, 0.1, 0.25, 0.5, 0.75, 1],
    ...options
  };

  return new IntersectionObserver(callback, defaultOptions);
};

// Image loading optimization
export const preloadCriticalImage = (src: string, priority: 'high' | 'low' = 'high') => {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'image';
  link.href = src;
  link.setAttribute('fetchpriority', priority);
  document.head.appendChild(link);
  return link;
};

export const preloadCriticalImages = (images: Array<{ src: string; priority?: 'high' | 'low' }>) => {
  return images.map(({ src, priority = 'high' }) => preloadCriticalImage(src, priority));
};