// Enhanced performance optimization utilities
import { errorMonitor } from './errorMonitoring';

export class PerformanceOptimizer {
  private static instance: PerformanceOptimizer;
  private observer: IntersectionObserver | null = null;
  private performanceObserver: PerformanceObserver | null = null;
  private errorMonitor = errorMonitor;

  constructor() {
    this.initializeLazyLoading();
    this.initializePerformanceMonitoring();
    this.optimizeCriticalResources();
  }

  static getInstance(): PerformanceOptimizer {
    if (!PerformanceOptimizer.instance) {
      PerformanceOptimizer.instance = new PerformanceOptimizer();
    }
    return PerformanceOptimizer.instance;
  }

  private initializeLazyLoading() {
    // Enhanced intersection observer for better lazy loading
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const target = entry.target as HTMLElement;
            
            // Handle lazy images
            if (target.tagName === 'IMG' && target.dataset.src) {
              const img = target as HTMLImageElement;
              img.src = img.dataset.src;
              img.removeAttribute('data-src');
              this.observer?.unobserve(img);
            }
            
            // Handle lazy components
            if (target.dataset.lazyComponent) {
              target.style.display = 'block';
              this.observer?.unobserve(target);
            }
          }
        });
      },
      {
        rootMargin: '50px 0px',
        threshold: 0.1
      }
    );

    // Observe all lazy elements
    this.observeLazyElements();
  }

  private observeLazyElements() {
    // Observe images with data-src
    document.querySelectorAll('img[data-src]').forEach((img) => {
      this.observer?.observe(img);
    });

    // Observe lazy components
    document.querySelectorAll('[data-lazy-component]').forEach((element) => {
      this.observer?.observe(element);
    });
  }

  private initializePerformanceMonitoring() {
    if (!('PerformanceObserver' in window)) return;

    // Monitor Core Web Vitals with enhanced metrics
    this.performanceObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        this.processPerformanceEntry(entry);
      }
    });

    try {
      this.performanceObserver.observe({
        entryTypes: ['navigation', 'paint', 'largest-contentful-paint', 'first-input', 'layout-shift']
      });
    } catch (e) {
      console.warn('Some performance metrics not supported:', e);
    }
  }

  private processPerformanceEntry(entry: PerformanceEntry) {
    const metric = {
      name: entry.name,
      entryType: entry.entryType,
      startTime: entry.startTime,
      duration: entry.duration
    };

    // Track specific Core Web Vitals
    switch (entry.entryType) {
      case 'largest-contentful-paint':
        this.trackCoreWebVital('LCP', entry.startTime);
        break;
      case 'first-input':
        const fidEntry = entry as any;
        this.trackCoreWebVital('FID', fidEntry.processingStart - entry.startTime);
        break;
      case 'layout-shift':
        const clsEntry = entry as any;
        if (!clsEntry.hadRecentInput) {
          this.trackCoreWebVital('CLS', clsEntry.value);
        }
        break;
      case 'navigation':
        this.trackLoadingMetrics(entry as PerformanceNavigationTiming);
        break;
    }
  }

  private trackCoreWebVital(name: string, value: number) {
    // Send to analytics
    if (typeof window !== 'undefined' && 'gtag' in window) {
      (window as any).gtag('event', name, {
        custom_parameter_1: value,
        event_category: 'Web Vitals'
      });
    }

    // Log for development
    console.log(`Core Web Vital ${name}:`, value);
  }

  private trackLoadingMetrics(entry: PerformanceNavigationTiming) {
    const metrics = {
      dns: entry.domainLookupEnd - entry.domainLookupStart,
      tcp: entry.connectEnd - entry.connectStart,
      request: entry.responseStart - entry.requestStart,
      response: entry.responseEnd - entry.responseStart,
      dom: entry.domContentLoadedEventEnd - entry.responseEnd,
      load: entry.loadEventEnd - entry.loadEventStart
    };

    console.log('Loading Metrics:', metrics);
  }

  private optimizeCriticalResources() {
    // Preload critical fonts
    this.preloadCriticalFonts();
    
    // Optimize images
    this.optimizeImages();
    
    // Add resource hints
    this.addResourceHints();
  }

  private preloadCriticalFonts() {
    const criticalFonts = [
      'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'
    ];

    criticalFonts.forEach(href => {
      if (!document.querySelector(`link[href="${href}"]`)) {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'style';
        link.href = href;
        link.onload = () => {
          link.rel = 'stylesheet';
        };
        document.head.appendChild(link);
      }
    });
  }

  private optimizeImages() {
    const images = document.querySelectorAll('img');
    images.forEach((img, index) => {
      // Set loading priority based on position
      if (index < 3) {
        img.loading = 'eager';
        img.setAttribute('fetchpriority', 'high');
      } else {
        img.loading = 'lazy';
        img.setAttribute('fetchpriority', 'low');
      }

      // Add aspect ratio if missing
      if (!img.width && !img.height && !img.style.aspectRatio) {
        img.style.aspectRatio = '16/9';
      }

      // Add error handling
      img.onerror = () => {
        img.style.display = 'none';
        console.warn('Failed to load image:', img.src);
      };
    });
  }

  private addResourceHints() {
    const hints = [
      { rel: 'dns-prefetch', href: 'https://fonts.googleapis.com' },
      { rel: 'dns-prefetch', href: 'https://fonts.gstatic.com' },
      { rel: 'dns-prefetch', href: 'https://ojyckskucneljvuqzrsw.supabase.co' },
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: 'anonymous' }
    ];

    hints.forEach(hint => {
      const existing = document.querySelector(`link[rel="${hint.rel}"][href="${hint.href}"]`);
      if (!existing) {
        const link = document.createElement('link');
        link.rel = hint.rel;
        link.href = hint.href;
        if ('crossorigin' in hint) {
          link.crossOrigin = hint.crossorigin;
        }
        document.head.appendChild(link);
      }
    });
  }

  // Bundle optimization utilities
  public static optimizeBundle() {
    // Code splitting markers for dynamic imports
    return {
      loadRecipeEditor: () => import('../components/recipe-edit/RecipeEditor'),
      loadChartComponents: () => import('recharts'),
      loadMarkdownEditor: () => import('@uiw/react-md-editor'),
      loadImageCompression: () => import('browser-image-compression')
    };
  }

  // Cleanup
  public destroy() {
    this.observer?.disconnect();
    this.performanceObserver?.disconnect();
  }
}

// Auto-initialize in browser
if (typeof window !== 'undefined') {
  PerformanceOptimizer.getInstance();
}

export default PerformanceOptimizer;