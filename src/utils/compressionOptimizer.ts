// Phase 2: Compression and bundle optimization
export class CompressionOptimizer {
  private static instance: CompressionOptimizer;

  static getInstance(): CompressionOptimizer {
    if (!CompressionOptimizer.instance) {
      CompressionOptimizer.instance = new CompressionOptimizer();
    }
    return CompressionOptimizer.instance;
  }

  // Monitor bundle size and performance
  monitorPerformance(): void {
    if (typeof window === 'undefined') return;

    // Track Core Web Vitals
    if ('PerformanceObserver' in window) {
      // Monitor LCP
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1] as any;
        console.log('LCP:', lastEntry.startTime);
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

      // Monitor CLS
      const clsObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            console.log('CLS:', entry.value);
          }
        });
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });

      // Monitor INP (replacing FID)
      const inpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          console.log('INP:', entry.processingStart - entry.startTime);
        });
      });
      inpObserver.observe({ entryTypes: ['event'] });
    }
  }

  // Remove unused CSS classes (runtime purging for dynamic content)
  purgeUnusedCSS(): void {
    // This would be done at build time with Tailwind's purge
    // But we can remove any dynamically added unused styles
    const unusedSelectors = [
      // Add any CSS selectors that are known to be unused
    ];

    unusedSelectors.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(el => el.remove());
    });
  }

  // Optimize third-party scripts
  optimizeThirdPartyScripts(): void {
    // Move non-critical scripts to load after interaction
    const scripts = document.querySelectorAll('script[src]');
    
    scripts.forEach((script: Element) => {
      const src = script.getAttribute('src') || '';
      
      // Identify analytics and social scripts
      if (src.includes('analytics') || 
          src.includes('gtag') || 
          src.includes('facebook') ||
          src.includes('twitter')) {
        
        // Add loading="lazy" if not present
        if (!script.hasAttribute('loading')) {
          script.setAttribute('loading', 'lazy');
        }
        
        // Add async if not present
        if (!script.hasAttribute('async') && !script.hasAttribute('defer')) {
          script.setAttribute('async', 'true');
        }
      }
    });
  }

  // Initialize all optimizations
  initialize(): void {
    this.monitorPerformance();
    this.optimizeThirdPartyScripts();
    
    // Delay non-critical optimizations
    requestIdleCallback(() => {
      this.purgeUnusedCSS();
    });
  }
}

// Auto-initialize
if (typeof window !== 'undefined') {
  const optimizer = CompressionOptimizer.getInstance();
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => optimizer.initialize());
  } else {
    optimizer.initialize();
  }
}

export const compressionOptimizer = CompressionOptimizer.getInstance();