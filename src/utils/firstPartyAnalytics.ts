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
  | 'og_missing'
  | 'session_end'
  | 'bounce';

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
  private visitorId: string;
  private queue: AnalyticsEvent[] = [];
  private isDisabled: boolean = false;
  private endpoint: string;
  private hmacKey: string;
  private lastActivity: number = Date.now();
  private readonly SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes
  private sessionStart: number = Date.now();
  private pagesInSession: number = 0;

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
    this.visitorId = this.getOrCreateVisitorId();
    
    this.initializeAttribution();
    this.initializeSessionTracking();
    this.setupEventListeners();
    this.setupPerformanceTracking();
  }

  private getOrCreateVisitorId(): string {
    if (typeof localStorage === 'undefined') return this.generateId();
    
    let visitorId = localStorage.getItem('_spa_vid');
    if (!visitorId) {
      visitorId = 'vis_' + this.generateId();
      localStorage.setItem('_spa_vid', visitorId);
    }
    return visitorId;
  }

  private initializeAttribution(): void {
    if (typeof sessionStorage === 'undefined') return;
    
    // Only set attribution on first page of session
    if (!sessionStorage.getItem('_spa_attribution_set')) {
      const trafficSource = this.classifyTrafficSource();
      const utmParams = this.parseUtmParams();
      
      sessionStorage.setItem('_spa_traffic_type', trafficSource.type);
      sessionStorage.setItem('_spa_traffic_source', trafficSource.source);
      sessionStorage.setItem('_spa_utm_source', utmParams.source || 'direct');
      sessionStorage.setItem('_spa_utm_medium', utmParams.medium || 'none');
      sessionStorage.setItem('_spa_utm_campaign', utmParams.campaign || 'none');
      sessionStorage.setItem('_spa_attribution_set', 'true');
    }
  }

  private initializeSessionTracking(): void {
    if (typeof sessionStorage === 'undefined') return;
    
    // Track session start time
    if (!sessionStorage.getItem('_spa_session_start')) {
      sessionStorage.setItem('_spa_session_start', this.sessionStart.toString());
    } else {
      this.sessionStart = parseInt(sessionStorage.getItem('_spa_session_start') || Date.now().toString());
    }
    
    // Track pages in session
    const currentPages = parseInt(sessionStorage.getItem('_spa_pages') || '0');
    this.pagesInSession = currentPages;
  }

  private classifyTrafficSource(): { type: 'organic' | 'direct' | 'social' | 'referral'; source: string } {
    const referrer = document.referrer;
    const url = new URL(window.location.href);
    const utmSource = url.searchParams.get('utm_source');
    
    // Priority 1: UTM parameters
    if (utmSource) {
      const source = utmSource.toLowerCase();
      if (['google', 'bing', 'yahoo', 'duckduckgo'].includes(source)) {
        return { type: 'organic', source: utmSource };
      }
      if (['facebook', 'instagram', 'twitter', 'linkedin', 'pinterest', 'tiktok'].includes(source)) {
        return { type: 'social', source: utmSource };
      }
      return { type: 'referral', source: utmSource };
    }
    
    // Priority 2: Referrer analysis
    if (!referrer) {
      return { type: 'direct', source: 'direct' };
    }
    
    try {
      const referrerDomain = new URL(referrer).hostname;
      
      // Search engines
      if (/google|bing|yahoo|duckduckgo|baidu|yandex/.test(referrerDomain)) {
        return { type: 'organic', source: referrerDomain };
      }
      
      // Social media
      if (/facebook|instagram|twitter|linkedin|pinterest|tiktok|reddit/.test(referrerDomain)) {
        return { type: 'social', source: referrerDomain };
      }
      
      // Everything else is referral
      return { type: 'referral', source: referrerDomain };
    } catch {
      return { type: 'direct', source: 'direct' };
    }
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

    // Before unload - track session end
    window.addEventListener('beforeunload', () => {
      this.trackSessionEnd();
      this.flush(true);
    });

    // Page load - increment page counter
    window.addEventListener('load', () => {
      this.pagesInSession++;
      if (typeof sessionStorage !== 'undefined') {
        sessionStorage.setItem('_spa_pages', this.pagesInSession.toString());
      }
    });

    // Auto-flush interval
    setInterval(() => {
      this.flush();
    }, 15000);

    // Track initial page view after LCP or timeout
    this.scheduleInitialPageView();
  }

  private trackSessionEnd(): void {
    if (typeof sessionStorage === 'undefined') return;
    
    const sessionStart = parseInt(sessionStorage.getItem('_spa_session_start') || Date.now().toString());
    const sessionDuration = Math.floor((Date.now() - sessionStart) / 1000); // seconds
    
    this.track({
      event_type: 'session_end',
      meta: {
        duration: sessionDuration,
        pages_viewed: this.pagesInSession,
        is_bounce: this.pagesInSession === 1
      }
    });
    
    // Track bounce if only 1 page viewed
    if (this.pagesInSession === 1) {
      this.track({
        event_type: 'bounce',
        meta: {
          landing_page: window.location.pathname
        }
      });
    }
  }

  private scheduleInitialPageView(): void {
    let tracked = false;
    
    // Track after LCP
    try {
      new PerformanceObserver((list) => {
        if (!tracked) {
          tracked = true;
          this.trackPageView();
        }
      }).observe({ entryTypes: ['largest-contentful-paint'] });
    } catch {
      // PerformanceObserver not supported or failed
    }

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
    try {
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        this.track({
          event_type: 'cwv_metric',
          meta: { metric: 'lcp', value: lastEntry.startTime }
        });
      }).observe({ entryTypes: ['largest-contentful-paint'] });
    } catch {
      // Silently fail
    }

    // CLS
    try {
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
    } catch {
      // Silently fail
    }

    // INP (Interaction to Next Paint)
    try {
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const inp = (entry as any).processingStart - entry.startTime;
          this.track({
            event_type: 'cwv_metric',
            meta: { metric: 'inp', value: inp }
          });
        }
      }).observe({ entryTypes: ['first-input'] });
    } catch {
      // Silently fail
    }
  }

  public track(event: Partial<AnalyticsEvent>): void {
    if (this.isDisabled) return;

    // Get attribution data from session storage
    const getSessionValue = (key: string, fallback: string = '') => {
      if (typeof sessionStorage === 'undefined') return fallback;
      return sessionStorage.getItem(key) || fallback;
    };

    const fullEvent: AnalyticsEvent = {
      event_id: this.generateId(),
      ts: Date.now(),
      path: window.location.pathname,
      title: document.title,
      referrer: document.referrer || undefined,
      session_id: this.sessionId,
      device: this.getDevice(),
      source: getSessionValue('_spa_utm_source', 'direct'),
      medium: getSessionValue('_spa_utm_medium', 'none'),
      campaign: getSessionValue('_spa_utm_campaign', 'none'),
      meta: {
        ...event.meta,
        visitor_id: this.visitorId,
        traffic_type: getSessionValue('_spa_traffic_type', 'direct'),
        traffic_source: getSessionValue('_spa_traffic_source', 'direct'),
        pages_in_session: this.pagesInSession
      },
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
    this.pagesInSession++;
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.setItem('_spa_pages', this.pagesInSession.toString());
    }
    
    this.track({
      event_type: 'page_view',
      path: path || window.location.pathname,
      content_type: this.inferContentType(),
      meta: {
        page_number: this.pagesInSession,
        is_landing_page: this.pagesInSession === 1
      }
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

// Create singleton instance - wrapped in try-catch to prevent crashes
export const firstPartyAnalytics = (() => {
  if (typeof window === 'undefined') return null;
  try {
    return new FirstPartyAnalytics();
  } catch (e) {
    console.debug('Analytics initialization failed:', e);
    return null;
  }
})();

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