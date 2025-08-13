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
  private isProduction = window.location.hostname !== 'localhost' && 
                        !window.location.hostname.includes('lovableproject.com');

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
    const errorData: ErrorEventData = {
      error: errorEvent.error || new Error(errorEvent.message || 'Unknown error'),
      userId: this.getCurrentUserId(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      timestamp: Date.now(),
    };

    this.logError(errorData);
  }

  private handlePromiseRejection(event: PromiseRejectionEvent) {
    const errorData: ErrorEventData = {
      error: new Error(`Unhandled Promise Rejection: ${event.reason}`),
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
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          this.logPerformanceMetric({
            name: entry.name,
            value: entry.duration || 0,
            timestamp: Date.now(),
          });
        }
      });

      observer.observe({ entryTypes: ['measure', 'navigation'] });
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