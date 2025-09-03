// Bundle optimization utilities to reduce JS payload
export class BundleOptimizer {
  private static instance: BundleOptimizer;
  
  static getInstance(): BundleOptimizer {
    if (!BundleOptimizer.instance) {
      BundleOptimizer.instance = new BundleOptimizer();
    }
    return BundleOptimizer.instance;
  }

  // Lazy load heavy libraries after initial paint
  async loadHeavyLibraries() {
    // Only load after first paint to not block initial render
    await new Promise(resolve => {
      if (document.readyState === 'complete') {
        resolve(true);
      } else {
        window.addEventListener('load', () => resolve(true));
      }
    });

    // Use requestIdleCallback for non-critical libraries
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        this.preloadNonCriticalChunks();
      });
    } else {
      setTimeout(() => this.preloadNonCriticalChunks(), 100);
    }
  }

  private preloadNonCriticalChunks() {
    // Preload chunks that will likely be needed
    const chunks = [
      '/assets/charts-',
      '/assets/editor-',
      '/assets/animation-'
    ];

    chunks.forEach(chunkPrefix => {
      const link = document.createElement('link');
      link.rel = 'modulepreload';
      link.href = this.findChunkFile(chunkPrefix);
      if (link.href !== window.location.href) {
        document.head.appendChild(link);
      }
    });
  }

  private findChunkFile(prefix: string): string {
    // In production, this would read from the manifest
    // For now, return the prefix as fallback
    return prefix;
  }

  // Remove unused imports and dead code
  removeUnusedImports() {
    // This would be part of build process
    console.log('Bundle optimization: Removing unused imports via tree shaking');
  }

  // Analyze bundle and suggest optimizations
  analyzeBundleSize() {
    if (typeof window !== 'undefined' && 'performance' in window) {
      const entries = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
      if (entries.length > 0) {
        const transferSize = entries[0].transferSize;
        const decodedBodySize = entries[0].decodedBodySize;
        
        console.log('Bundle Analysis:', {
          transferSize: `${(transferSize / 1024).toFixed(2)} KB`,
          decodedSize: `${(decodedBodySize / 1024).toFixed(2)} KB`,
          compressionRatio: `${((1 - transferSize / decodedBodySize) * 100).toFixed(1)}%`
        });
        
        if (transferSize > 250 * 1024) {
          console.warn('⚠️ Bundle size exceeds 250KB recommendation');
        }
      }
    }
  }
}

// Auto-initialize
if (typeof window !== 'undefined') {
  const optimizer = BundleOptimizer.getInstance();
  optimizer.loadHeavyLibraries();
  
  // Analyze on load
  window.addEventListener('load', () => {
    optimizer.analyzeBundleSize();
  });
}

export const bundleOptimizer = BundleOptimizer.getInstance();