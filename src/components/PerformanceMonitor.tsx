import React, { useEffect } from 'react';
import { analytics } from '@/utils/analytics';
import { logger } from '@/utils/logger';

interface PerformanceMonitorProps {
  children: React.ReactNode;
}

export const PerformanceMonitor: React.FC<PerformanceMonitorProps> = ({ children }) => {
  useEffect(() => {
    // Service worker registration is handled by VitePWA in main.tsx
    // Enable background sync for analytics if supported
    if ('serviceWorker' in navigator && 'sync' in (window as any).ServiceWorkerRegistration.prototype) {
      navigator.serviceWorker.ready.then((registration) => {
        (registration as any).sync.register('analytics-sync');
      }).catch((error) => {
          logger.error('Service Worker registration failed:', error);
        });
    }

    // Performance monitoring
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      
      entries.forEach((entry) => {
        // Log performance entries for debugging (only critical ones)
        if (entry.entryType === 'navigation') {
          const nav = entry as PerformanceNavigationTiming;
          // Only log if there are performance issues
          if (nav.duration > 3000) {
            logger.warn('Slow navigation performance detected:', {
              duration: entry.duration,
              domContentLoaded: nav.domContentLoadedEventEnd - nav.domContentLoadedEventStart,
              loadComplete: nav.loadEventEnd - nav.loadEventStart
            });
          }
        }
        
        if (entry.entryType === 'largest-contentful-paint') {
          // Only log if LCP is poor (>2.5s)
          if (entry.startTime > 2500) {
            logger.warn('Poor LCP performance:', entry.startTime);
          }
        }
        
        if (entry.entryType === 'first-input') {
          const fid = entry as PerformanceEventTiming;
          const fidValue = fid.processingStart - fid.startTime;
          // Only log if FID is poor (>100ms)
          if (fidValue > 100) {
            logger.warn('Poor FID performance:', fidValue);
          }
        }
        
        if (entry.entryType === 'layout-shift') {
          const cls = entry as any; // LayoutShift interface may not be available
          if (!cls.hadRecentInput && cls.value > 0.1) {
            logger.warn('Poor CLS performance:', cls.value);
          }
        }
      });
    });

    // Observe various performance metrics
    const entryTypes = [
      'navigation',
      'largest-contentful-paint',
      'first-input',
      'layout-shift',
      'paint',
      'measure'
    ];

    entryTypes.forEach(type => {
      try {
        observer.observe({ entryTypes: [type] });
      } catch (e) {
        // Some entry types might not be supported
        logger.warn(`Performance observer entry type "${type}" not supported`);
      }
    });

    // Monitor bundle size and loading performance
    const measureBundlePerformance = () => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navigation) {
        const metrics = {
          dns: navigation.domainLookupEnd - navigation.domainLookupStart,
          tcp: navigation.connectEnd - navigation.connectStart,
          ssl: navigation.connectEnd - navigation.secureConnectionStart,
          ttfb: navigation.responseStart - navigation.requestStart,
          download: navigation.responseEnd - navigation.responseStart,
          domParsing: navigation.domContentLoadedEventStart - navigation.responseEnd,
          resourceLoading: navigation.loadEventStart - navigation.domContentLoadedEventEnd
        };

        analytics.track({
          event_type: 'performance_metrics',
          event_data: metrics
        });
      }
    };

    // Measure performance after page load
    window.addEventListener('load', () => {
      setTimeout(measureBundlePerformance, 1000);
    });

    // Monitor memory usage (if available)
    if ('memory' in performance) {
      const measureMemory = () => {
        const memory = (performance as any).memory;
        analytics.track({
          event_type: 'memory_usage',
          event_data: {
            used: memory.usedJSHeapSize,
            total: memory.totalJSHeapSize,
            limit: memory.jsHeapSizeLimit
          }
        });
      };

      // Measure memory usage periodically
      const memoryInterval = setInterval(measureMemory, 60000); // Every minute

      return () => {
        clearInterval(memoryInterval);
        observer.disconnect();
      };
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  // Resource loading optimization
  useEffect(() => {
    // Preload critical resources
    const preloadCriticalResources = () => {
      const criticalImages = [
        '/hero/fallback.jpg',
        'https://ojyckskucneljvuqzrsw.supabase.co/storage/v1/object/public/hero-images/logo-primary.png'
      ];

      criticalImages.forEach(src => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        document.head.appendChild(link);
      });
    };

    // Prefetch likely next pages
    const prefetchPages = () => {
      const currentPath = window.location.pathname;
      const likelyNextPages = [];

      if (currentPath === '/') {
        likelyNextPages.push('/recipes', '/blog');
      } else if (currentPath === '/recipes') {
        likelyNextPages.push('/recipe-workspace', '/glossary');
      } else if (currentPath.startsWith('/recipe/')) {
        likelyNextPages.push('/recipes', '/my-recipes');
      }

      likelyNextPages.forEach(path => {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = path;
        document.head.appendChild(link);
      });
    };

    preloadCriticalResources();
    prefetchPages();

    // Image loading optimization
    const optimizeImages = () => {
      const images = document.querySelectorAll('img[data-src]');
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            img.src = img.dataset.src || '';
            img.classList.remove('lazy');
            imageObserver.unobserve(img);
          }
        });
      }, {
        rootMargin: '50px 0px'
      });

      images.forEach(img => imageObserver.observe(img));
    };

    // Run image optimization after a short delay
    setTimeout(optimizeImages, 100);
  }, []);

  return <>{children}</>;
};

export default PerformanceMonitor;