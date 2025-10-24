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
      'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
      'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&display=swap'
    ];

    criticalFonts.forEach(href => {
      if (!document.querySelector(`link[href="${href}"]`)) {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'style';
        link.href = href;
        link.setAttribute('importance', 'high');
        link.onload = () => {
          link.rel = 'stylesheet';
        };
        document.head.appendChild(link);
      }
    });
    
    // Preload critical hero images for LCP optimization
    const criticalImages = [
      '/lovable-uploads/6ed25ae6-4928-46c6-9fe0-fa7af97ffa2d.png' // Hero image
    ];
    
    criticalImages.forEach(src => {
      if (!document.querySelector(`link[href="${src}"]`)) {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        link.setAttribute('importance', 'high');
        document.head.appendChild(link);
      }
    });
  }

  private optimizeImages() {
    const images = document.querySelectorAll('img');
    images.forEach((img, index) => {
      // Set loading priority based on position and viewport
      const rect = img.getBoundingClientRect();
      const isAboveFold = rect.top < window.innerHeight;
      
      if (index < 3 || isAboveFold) {
        img.loading = 'eager';
        img.setAttribute('fetchpriority', 'high');
      } else {
        img.loading = 'lazy';
        img.setAttribute('fetchpriority', 'low');
      }

      // Fix layout shift by ensuring dimensions
      if (!img.width && !img.height && !img.style.aspectRatio) {
        // Use common recipe card aspect ratio
        img.style.aspectRatio = '4/3';
        img.style.width = '100%';
        img.style.height = 'auto';
      }
      
      // Ensure explicit dimensions to prevent CLS
      if (img.naturalWidth && img.naturalHeight && !img.style.aspectRatio) {
        img.style.aspectRatio = `${img.naturalWidth}/${img.naturalHeight}`;
      }

      // Add error handling and fallback
      img.onerror = () => {
        img.src = '/hero/fallback.jpg'; // Fallback image
        img.alt = 'Image failed to load';
      };
    });
    
    // Optimize hero images specifically for LCP
    const heroImages = document.querySelectorAll('.hero img, [data-hero] img, .hero-image') as NodeListOf<HTMLImageElement>;
    heroImages.forEach(img => {
      img.loading = 'eager';
      img.setAttribute('fetchpriority', 'high');
      img.setAttribute('importance', 'high');
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

    // Add passive scroll optimization
    this.addPassiveScrollListeners();

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
    // Code splitting markers for dynamic imports (recharts removed - now directly imported)
    return {
      loadRecipeEditor: () => import('../components/FullRecipeEditForm'),
      loadMarkdownEditor: () => import('@uiw/react-md-editor'),
      loadImageCompression: () => import('browser-image-compression')
    };
  }

  private addPassiveScrollListeners() {
    // Replace any existing scroll listeners with passive ones
    const scrollElements = document.querySelectorAll('[data-scroll-listener]');
    scrollElements.forEach(element => {
      // Remove old listeners and add passive ones
      const events = ['scroll', 'wheel', 'touchstart', 'touchmove'];
      events.forEach(eventType => {
        element.addEventListener(eventType, () => {}, { passive: true });
      });
    });
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