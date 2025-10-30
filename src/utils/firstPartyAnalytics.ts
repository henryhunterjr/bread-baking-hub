/**
 * Privacy-First Analytics System - Client Tracker
 * No cookies, respects doNotTrack, under 2.5KB gzip
 */

// Event types for the privacy-first system
export type EventType = 
  | 'page_view'
  | 'subscribe_view' 
  | 'subscribe_submit'
  | 'affiliate_click'
  | 'search'
  | 'search_results'
  | 'share_click'
  | 'error_404'
  | 'error_5xx'
  | 'cwv_metric'
  | 'og_missing';

export interface AnalyticsEvent {
  event_id: string;
  event_type: EventType;
  ts: number;
  path: string;
  title: string;
  slug?: string;
  content_type?: 'recipe' | 'blog' | 'page';
  referrer?: string;
  session_id: string;
  device: 'mobile' | 'desktop';
  source?: string;
  medium?: string;
  campaign?: string;
  value_cents?: number;
  meta?: Record<string, any>;
}

class FirstPartyAnalytics {
  private sessionId: string;
  private queue: AnalyticsEvent[] = [];
  private isDisabled: boolean = false;
  private endpoint: string;
  private hmacKey: string;
  private lastActivity: number = Date.now();
  private readonly SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes

  constructor() {
    // Check for disable flag
    if (typeof window !== 'undefined' && (window as any).__DISABLE_ANALYTICS__) {
      this.isDisabled = true;
      return;
    }

    // Respect Do Not Track
    if (typeof navigator !== 'undefined' && navigator.doNotTrack === '1') {
      this.isDisabled = true;
      return;
    }

    this.endpoint = 'https://ojyckskucneljvuqzrsw.supabase.co/functions/v1/analytics-track';
    this.hmacKey = 'analytics_ingest_key_placeholder'; // Will be env-configured
    this.sessionId = this.getOrCreateSession();
    
    this.setupEventListeners();
    this.setupPerformanceTracking();
  }

  private getOrCreateSession(): string {
    if (typeof localStorage === 'undefined') return this.generateId();
    
    const stored = localStorage.getItem('_spa_sid');
    const lastActivity = parseInt(localStorage.getItem('_spa_last') || '0');
    
    // Session expired or doesn't exist
    if (!stored || (Date.now() - lastActivity) > this.SESSION_TIMEOUT) {
      const newSession = this.generateId();
      localStorage.setItem('_spa_sid', newSession);
      localStorage.setItem('_spa_last', Date.now().toString());
      return newSession;
    }
    
    // Update last activity
    localStorage.setItem('_spa_last', Date.now().toString());
    return stored;
  }

  private generateId(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  private getDevice(): 'mobile' | 'desktop' {
    return /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) 
      ? 'mobile' : 'desktop';
  }

  private parseUtmParams(): { source?: string; medium?: string; campaign?: string } {
    const url = new URL(window.location.href);
    return {
      source: url.searchParams.get('utm_source') || undefined,
      medium: url.searchParams.get('utm_medium') || undefined,
      campaign: url.searchParams.get('utm_campaign') || undefined,
    };
  }

  private async generateHmac(payload: string, timestamp: string): Promise<string> {
    // In production, this would use a proper HMAC with the shared secret
    // For now, return a placeholder
    return `hmac_${timestamp}_${payload.length}`;
  }

  private setupEventListeners(): void {
    // Page visibility change
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        this.flush(true);
      }
    });

    // Before unload
    window.addEventListener('beforeunload', () => {
      this.flush(true);
    });

    // Auto-flush interval
    setInterval(() => {
      this.flush();
    }, 15000);

    // Track initial page view after LCP or timeout
    this.scheduleInitialPageView();
  }

  private scheduleInitialPageView(): void {
    let tracked = false;
    
    // Track after LCP
    new PerformanceObserver((list) => {
      if (!tracked) {
        tracked = true;
        this.trackPageView();
      }
    }).observe({ entryTypes: ['largest-contentful-paint'] });

    // Fallback timeout
    setTimeout(() => {
      if (!tracked) {
        tracked = true;
        this.trackPageView();
      }
    }, 3000);
  }

  private setupPerformanceTracking(): void {
    // LCP
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      this.track({
        event_type: 'cwv_metric',
        meta: { metric: 'lcp', value: lastEntry.startTime }
      });
    }).observe({ entryTypes: ['largest-contentful-paint'] });

    // CLS
    let clsValue = 0;
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!(entry as any).hadRecentInput) {
          clsValue += (entry as any).value;
        }
      }
      this.track({
        event_type: 'cwv_metric',
        meta: { metric: 'cls', value: clsValue }
      });
    }).observe({ entryTypes: ['layout-shift'] });

    // INP (Interaction to Next Paint)
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const inp = (entry as any).processingStart - entry.startTime;
        this.track({
          event_type: 'cwv_metric',
          meta: { metric: 'inp', value: inp }
        });
      }
    }).observe({ entryTypes: ['first-input'] });
  }

  public track(event: Partial<AnalyticsEvent>): void {
    if (this.isDisabled) return;

    const fullEvent: AnalyticsEvent = {
      event_id: this.generateId(),
      ts: Date.now(),
      path: window.location.pathname,
      title: document.title,
      referrer: document.referrer || undefined,
      session_id: this.sessionId,
      device: this.getDevice(),
      ...this.parseUtmParams(),
      ...event,
      event_type: event.event_type || 'page_view'
    };

    this.queue.push(fullEvent);
    this.updateActivity();

    // Auto-flush if queue is full
    if (this.queue.length >= 10) {
      this.flush();
    }
  }

  private updateActivity(): void {
    this.lastActivity = Date.now();
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('_spa_last', this.lastActivity.toString());
    }
  }

  public trackPageView(path?: string): void {
    this.track({
      event_type: 'page_view',
      path: path || window.location.pathname,
      content_type: this.inferContentType()
    });
  }

  private inferContentType(): 'recipe' | 'blog' | 'page' {
    const path = window.location.pathname;
    if (path.startsWith('/recipes/')) return 'recipe';
    if (path.startsWith('/blog/')) return 'blog';
    return 'page';
  }

  public trackSubscribeView(): void {
    this.track({ event_type: 'subscribe_view' });
  }

  public trackSubscribeSubmit(success: boolean): void {
    this.track({ 
      event_type: 'subscribe_submit',
      meta: { success }
    });
  }

  public trackAffiliateClick(productId: string, url: string): void {
    this.track({
      event_type: 'affiliate_click',
      meta: { product_id: productId, target_url: url }
    });
  }

  public trackSearch(query: string, resultsCount: number): void {
    this.track({
      event_type: 'search',
      meta: { query, results_count: resultsCount }
    });
  }

  public trackSearchResults(query: string, clickedResult?: string): void {
    this.track({
      event_type: 'search_results',
      meta: { query, clicked_result: clickedResult }
    });
  }

  public trackShare(platform: string, url: string): void {
    this.track({
      event_type: 'share_click',
      meta: { platform, shared_url: url }
    });
  }

  public trackError404(): void {
    this.track({ event_type: 'error_404' });
  }

  public trackError5xx(error: string): void {
    this.track({ 
      event_type: 'error_5xx',
      meta: { error }
    });
  }

  public trackOgMissing(path: string): void {
    this.track({
      event_type: 'og_missing',
      meta: { missing_path: path }
    });
  }

  private async flush(useBeacon: boolean = false): Promise<void> {
    if (this.queue.length === 0 || this.isDisabled) return;

    const events = [...this.queue];
    this.queue = [];

    const payload = JSON.stringify({ events });
    const timestamp = Date.now().toString();
    const hmac = await this.generateHmac(payload, timestamp);

    const headers = {
      'Content-Type': 'application/json',
      'x-analytics-key': hmac,
      'x-analytics-ts': timestamp
    };

    try {
      if (useBeacon && navigator.sendBeacon) {
        // Use beacon for page unload - more reliable
        const blob = new Blob([payload], { type: 'application/json' });
        navigator.sendBeacon(this.endpoint, blob);
      } else {
        // Regular fetch for other cases
        await fetch(this.endpoint, {
          method: 'POST',
          headers,
          body: payload,
          keepalive: true
        });
      }
    } catch (error) {
      // Silently fail - no user impact
      console.debug('Analytics send failed:', error);
    }
  }
}

// Create singleton instance
export const firstPartyAnalytics = typeof window !== 'undefined' 
  ? new FirstPartyAnalytics() 
  : null;

// Export convenience functions
export const trackPageView = (path?: string) => firstPartyAnalytics?.trackPageView(path);
export const trackSubscribeView = () => firstPartyAnalytics?.trackSubscribeView();
export const trackSubscribeSubmit = (success: boolean) => firstPartyAnalytics?.trackSubscribeSubmit(success);
export const trackAffiliateClick = (productId: string, url: string) => firstPartyAnalytics?.trackAffiliateClick(productId, url);
export const trackSearch = (query: string, resultsCount: number) => firstPartyAnalytics?.trackSearch(query, resultsCount);
export const trackShare = (platform: string, url: string) => firstPartyAnalytics?.trackShare(platform, url);
export const trackError404 = () => firstPartyAnalytics?.trackError404();
export const trackError5xx = (error: string) => firstPartyAnalytics?.trackError5xx(error);
export const trackOgMissing = (path: string) => firstPartyAnalytics?.trackOgMissing(path);