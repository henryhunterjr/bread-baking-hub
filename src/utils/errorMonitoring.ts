// Error monitoring and analytics setup
interface ErrorEventData {
  error: Error;
  errorInfo?: any;
  userId?: string;
  userAgent: string;
  url: string;
  timestamp: number;
}

interface PerformanceMetric {
  name: string;
  value: number;
  timestamp: number;
}

class ErrorMonitor {
  private isProduction = window.location.hostname === 'bakinggreatbread.com';
  private performanceObserver: PerformanceObserver | null = null;

  init() {
    // Global error handler
    window.addEventListener('error', this.handleGlobalError.bind(this));
    window.addEventListener('unhandledrejection', this.handlePromiseRejection.bind(this));
    
    // Performance monitoring
    this.setupPerformanceMonitoring();
    
    // Supabase function error monitoring
    this.setupSupabaseMonitoring();
  }

  private handleGlobalError(event: Event) {
    const errorEvent = event as any;
    const errorMessage = errorEvent.message || errorEvent.error?.message || '';
    const errorFilename = errorEvent.filename || '';
    
    // Ignore errors from browser extensions
    if (errorFilename.includes('content.js') || 
        errorFilename.includes('chrome-extension') ||
        errorFilename.includes('moz-extension') ||
        errorMessage.includes('Extension context invalidated')) {
      return;
    }
    
    // Ignore Vercel analytics/speed-insights errors
    if (errorFilename.includes('speed-insights') || 
        errorFilename.includes('vercel/insights') ||
        errorFilename.includes('_vercel')) {
      return;
    }
    
    const errorData: ErrorEventData = {
      error: errorEvent.error || new Error(errorMessage || 'Unknown error'),
      userId: this.getCurrentUserId(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      timestamp: Date.now(),
    };

    this.logError(errorData);
  }

  private handlePromiseRejection(event: PromiseRejectionEvent) {
    const reason = String(event.reason);
    
    // Ignore errors from browser extensions
    if (reason.includes('Extension context invalidated') ||
        reason.includes('chrome-extension') ||
        reason.includes('moz-extension')) {
      event.preventDefault();
      return;
    }
    
    // Ignore Vercel analytics/network errors from third-party scripts
    if (reason.includes('speed-insights') || 
        reason.includes('_vercel') ||
        reason.includes('Failed to fetch') && reason.includes('rum')) {
      event.preventDefault();
      return;
    }
    
    // Ignore general "Failed to fetch" for external resources
    if (reason.includes('Failed to fetch') && 
        !reason.includes('supabase') && 
        !reason.includes('bakinggreatbread')) {
      event.preventDefault();
      return;
    }
    
    const errorData: ErrorEventData = {
      error: new Error(`Unhandled Promise Rejection: ${reason}`),
      userId: this.getCurrentUserId(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      timestamp: Date.now(),
    };

    this.logError(errorData);
  }

  private setupPerformanceMonitoring() {
    // Monitor Core Web Vitals
    if ('PerformanceObserver' in window) {
      this.performanceObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          // Monitor Core Web Vitals specifically
          if (entry.entryType === 'navigation') {
            this.logPerformanceMetric({
              name: 'page_load_time',
              value: entry.duration || 0,
              timestamp: Date.now(),
            });
          }
          
          if (entry.entryType === 'largest-contentful-paint') {
            this.logPerformanceMetric({
              name: 'largest_contentful_paint',
              value: entry.startTime,
              timestamp: Date.now(),
            });
          }
          
          if (entry.entryType === 'first-input') {
            const fidEntry = entry as any;
            this.logPerformanceMetric({
              name: 'first_input_delay',
              value: fidEntry.processingStart - entry.startTime,
              timestamp: Date.now(),
            });
          }
          
          if (entry.entryType === 'layout-shift') {
            const clsEntry = entry as any;
            this.logPerformanceMetric({
              name: 'cumulative_layout_shift',
              value: clsEntry.value,
              timestamp: Date.now(),
            });
          }
        }
      });

      // Observe Core Web Vitals
      try {
        this.performanceObserver.observe({ 
          entryTypes: ['navigation', 'largest-contentful-paint', 'first-input', 'layout-shift'] 
        });
      } catch (e) {
        // Fallback for browsers that don't support all entry types
        this.performanceObserver.observe({ entryTypes: ['navigation'] });
      }
    }
  }

  private setupSupabaseMonitoring() {
    // Intercept fetch requests to monitor Supabase function calls
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      const [input, init] = args;
      const url = typeof input === 'string' ? input : (input as Request).url;
      
      try {
        const response = await originalFetch(...args);
        
        // Monitor Supabase function errors
        if (url.includes('supabase.co/functions/v1/') && response.status >= 500) {
          this.logError({
            error: new Error(`Supabase Function Error: ${response.status} ${response.statusText}`),
            errorInfo: { url, status: response.status, method: init?.method || 'GET' },
            userId: this.getCurrentUserId(),
            userAgent: navigator.userAgent,
            url: window.location.href,
            timestamp: Date.now(),
          });
        }
        
        return response;
      } catch (error) {
        // Network or other fetch errors
        if (url.includes('supabase.co')) {
          this.logError({
            error: error as Error,
            errorInfo: { url, fetchFailed: true },
            userId: this.getCurrentUserId(),
            userAgent: navigator.userAgent,
            url: window.location.href,
            timestamp: Date.now(),
          });
        }
        throw error;
      }
    };
  }

  private logError(errorData: ErrorEventData) {
    if (!this.isProduction) {
      console.group('🚨 Error Monitor');
      console.error('Error:', errorData.error.message);
      console.log('Details:', errorData);
      console.groupEnd();
      return;
    }

    // In production, send to external service
    this.sendToExternalService(errorData);
  }

  private logPerformanceMetric(metric: PerformanceMetric) {
    if (!this.isProduction) {
      console.log('📊 Performance:', metric);
      return;
    }

    // Send performance data to analytics
    this.sendPerformanceData(metric);
  }

  private async sendToExternalService(errorData: ErrorEventData) {
    try {
      // Example: Send to Sentry, LogRocket, or similar service
      // Replace with your preferred error tracking service
      await fetch('/api/log-error', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(errorData),
      });
    } catch (e) {
      console.error('Failed to log error to external service:', e);
    }
  }

  private async sendPerformanceData(metric: PerformanceMetric) {
    try {
      // Send to analytics service (e.g., Vercel Analytics, Google Analytics)
      if ('gtag' in window) {
        // @ts-ignore
        window.gtag('event', 'performance_metric', {
          metric_name: metric.name,
          metric_value: metric.value,
        });
      }
    } catch (e) {
      console.error('Failed to send performance data:', e);
    }
  }

  private getCurrentUserId(): string | undefined {
    // Get user ID from your auth system
    try {
      const user = JSON.parse(localStorage.getItem('supabase.auth.token') || '{}');
      return user?.user?.id;
    } catch {
      return undefined;
    }
  }
}

export const errorMonitor = new ErrorMonitor();

// Auto-initialize in browser environment
if (typeof window !== 'undefined') {
  errorMonitor.init();
}