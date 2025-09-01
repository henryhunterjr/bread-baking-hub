// Phase 2: Script optimization utilities for Vite/React
export class ScriptOptimizer {
  private static instance: ScriptOptimizer;
  
  static getInstance(): ScriptOptimizer {
    if (!ScriptOptimizer.instance) {
      ScriptOptimizer.instance = new ScriptOptimizer();
    }
    return ScriptOptimizer.instance;
  }

  // Load scripts with proper timing strategies
  loadScript(
    src: string, 
    strategy: 'critical' | 'afterInteractive' | 'lazyOnload' = 'afterInteractive',
    options: { defer?: boolean; async?: boolean } = {}
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      // Check if script already exists
      if (document.querySelector(`script[src="${src}"]`)) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = src;
      
      // Apply loading strategy
      switch (strategy) {
        case 'critical':
          // Load immediately, blocking
          break;
        case 'afterInteractive':
          script.defer = options.defer ?? true;
          break;
        case 'lazyOnload':
          script.async = options.async ?? true;
          // Note: loading="lazy" is not supported on script elements
          break;
      }

      script.onload = () => resolve();
      script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
      
      // Insert based on strategy
      if (strategy === 'lazyOnload') {
        // Load after page is fully loaded
        if (document.readyState === 'complete') {
          document.head.appendChild(script);
        } else {
          window.addEventListener('load', () => {
            document.head.appendChild(script);
          });
        }
      } else {
        document.head.appendChild(script);
      }
    });
  }

  // Preload critical scripts
  preloadScript(src: string): void {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'script';
    link.href = src;
    document.head.appendChild(link);
  }

  // Dynamic import wrapper for code splitting
  async loadComponent<T>(importFn: () => Promise<T>): Promise<T> {
    try {
      return await importFn();
    } catch (error) {
      console.error('Failed to load component:', error);
      throw error;
    }
  }
}

// Export instance for easy use
export const scriptOptimizer = ScriptOptimizer.getInstance();

// Enhanced component lazy loading
import React from 'react';

export const createLazyComponent = <T extends React.ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  fallback?: React.ComponentType
) => {
  return React.lazy(async () => {
    // Add artificial delay in development to test loading states
    if (import.meta.env.DEV) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    return importFn();
  });
};