import React from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface AnalyticsEvent {
  event_type: string;
  event_data?: Record<string, any>;
  page_url?: string;
  user_agent?: string;
  referrer?: string;
}

interface ConversionEvent {
  conversion_type: 'affiliate_click' | 'download' | 'newsletter_signup' | 'recipe_save' | 'purchase';
  conversion_value?: number;
  product_id?: string;
  revenue?: number;
  currency?: string;
  page_url?: string;
  referrer?: string;
}

interface GoalEvent {
  goal_type: 'engagement' | 'conversion' | 'retention';
  goal_name: string;
  goal_value?: number;
  metadata?: Record<string, any>;
}

class AnalyticsManager {
  private sessionId: string;
  private queue: Array<{ type: 'event' | 'conversion' | 'goal'; data: any }> = [];
  private flushInterval: number = 30000; // 30 seconds
  private maxQueueSize: number = 20;
  private userId?: string;

  constructor() {
    this.sessionId = this.getOrCreateSessionId();
    this.setupPerformanceTracking();
    this.setupPageViewTracking();
    this.setupAutoFlush();
  }

  setUserId(userId: string | undefined) {
    this.userId = userId;
  }

  private getOrCreateSessionId(): string {
    let sessionId = sessionStorage.getItem('analytics_session_id');
    if (!sessionId) {
      sessionId = crypto.randomUUID();
      sessionStorage.setItem('analytics_session_id', sessionId);
    }
    return sessionId;
  }

  // Track custom events
  track(event: AnalyticsEvent) {
    const enrichedEvent = {
      ...event,
      page_url: event.page_url || window.location.href,
      user_agent: event.user_agent || navigator.userAgent,
      referrer: event.referrer || document.referrer
    };

    this.queue.push({ type: 'event', data: enrichedEvent });
    this.checkFlush();
  }

  // Track page views automatically
  trackPageView(path?: string) {
    this.track({
      event_type: 'page_view',
      event_data: {
        path: path || window.location.pathname,
        title: document.title,
        timestamp: Date.now()
      }
    });
  }

  // Track conversion events
  trackConversion(conversion: ConversionEvent) {
    const enrichedConversion = {
      ...conversion,
      page_url: conversion.page_url || window.location.href,
      referrer: conversion.referrer || document.referrer
    };

    this.queue.push({ type: 'conversion', data: enrichedConversion });
    this.checkFlush();
  }

  // Track goal completions
  trackGoal(goal: GoalEvent) {
    this.queue.push({ type: 'goal', data: goal });
    this.checkFlush();
  }

  // Track affiliate clicks
  trackAffiliateClick(productId: string, productName: string, url: string) {
    this.trackConversion({
      conversion_type: 'affiliate_click',
      product_id: productId,
      conversion_value: 1
    });

    this.track({
      event_type: 'affiliate_click',
      event_data: {
        product_id: productId,
        product_name: productName,
        target_url: url
      }
    });
  }

  // Track recipe interactions
  trackRecipeInteraction(action: string, recipeId: string, recipeTitle: string) {
    this.track({
      event_type: 'recipe_interaction',
      event_data: {
        action,
        recipe_id: recipeId,
        recipe_title: recipeTitle
      }
    });

    if (action === 'save') {
      this.trackConversion({
        conversion_type: 'recipe_save',
        product_id: recipeId,
        conversion_value: 1
      });

      this.trackGoal({
        goal_type: 'engagement',
        goal_name: 'recipe_save',
        goal_value: 1,
        metadata: { recipe_id: recipeId, recipe_title: recipeTitle }
      });
    }
  }

  // Track search behavior
  trackSearch(query: string, resultsCount: number, source: string = 'global') {
    this.track({
      event_type: 'search',
      event_data: {
        query,
        results_count: resultsCount,
        source
      }
    });
  }

  // Track Core Web Vitals
  private setupPerformanceTracking() {
    // Track LCP (Largest Contentful Paint)
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      this.trackPerformanceMetric('lcp', lastEntry.startTime);
    }).observe({ entryTypes: ['largest-contentful-paint'] });

    // Track FID (First Input Delay)
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry: any) => {
        this.trackPerformanceMetric('fid', entry.processingStart - entry.startTime);
      });
    }).observe({ entryTypes: ['first-input'] });

    // Track CLS (Cumulative Layout Shift)
    let clsValue = 0;
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry: any) => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      });
      this.trackPerformanceMetric('cls', clsValue);
    }).observe({ entryTypes: ['layout-shift'] });

    // Track TTFB (Time to First Byte)
    window.addEventListener('load', () => {
      const navigationTiming = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      const ttfb = navigationTiming.responseStart - navigationTiming.fetchStart;
      this.trackPerformanceMetric('ttfb', ttfb);

      // Track FCP (First Contentful Paint)
      const paintEntries = performance.getEntriesByType('paint');
      const fcpEntry = paintEntries.find(entry => entry.name === 'first-contentful-paint');
      if (fcpEntry) {
        this.trackPerformanceMetric('fcp', fcpEntry.startTime);
      }
    });
  }

  private trackPerformanceMetric(type: string, value: number) {
    // Send directly to performance_metrics table
    supabase.from('performance_metrics').insert({
      page_url: window.location.href,
      metric_type: type,
      metric_value: value,
      user_agent: navigator.userAgent,
      connection_type: (navigator as any).connection?.effectiveType || 'unknown',
      device_type: /Mobile|Android|iPhone|iPad/.test(navigator.userAgent) ? 'mobile' : 'desktop'
    }).then(({ error }) => {
      if (error) {
        console.error('Error tracking performance metric:', error);
      }
    });
  }

  // Setup automatic page view tracking for SPAs
  private setupPageViewTracking() {
    let currentPath = window.location.pathname;
    
    // Track initial page view
    this.trackPageView();

    // Track navigation in SPAs
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = function(...args) {
      originalPushState.apply(history, args);
      if (window.location.pathname !== currentPath) {
        currentPath = window.location.pathname;
        analytics.trackPageView();
      }
    };

    history.replaceState = function(...args) {
      originalReplaceState.apply(history, args);
      if (window.location.pathname !== currentPath) {
        currentPath = window.location.pathname;
        analytics.trackPageView();
      }
    };

    window.addEventListener('popstate', () => {
      if (window.location.pathname !== currentPath) {
        currentPath = window.location.pathname;
        this.trackPageView();
      }
    });
  }

  private setupAutoFlush() {
    // Flush on page unload
    window.addEventListener('beforeunload', () => {
      this.flush(true);
    });

    // Flush on visibility change (mobile/tab switching)
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        this.flush(true);
      }
    });

    // Regular interval flush
    setInterval(() => {
      this.flush();
    }, this.flushInterval);
  }

  private checkFlush() {
    if (this.queue.length >= this.maxQueueSize) {
      this.flush();
    }
  }

  private async flush(isBeacon: boolean = false) {
    if (this.queue.length === 0) return;

    const events = this.queue.filter(item => item.type === 'event').map(item => item.data);
    const conversions = this.queue.filter(item => item.type === 'conversion').map(item => item.data);
    const goals = this.queue.filter(item => item.type === 'goal').map(item => item.data);

    const payload = {
      events,
      conversions,
      goals,
      user_id: this.userId,
      session_id: this.sessionId
    };

    this.queue = []; // Clear queue immediately to prevent duplicates

    try {
      if (isBeacon && navigator.sendBeacon) {
        // Use beacon for reliable delivery on page unload
        const supabaseUrl = 'https://ojyckskucneljvuqzrsw.supabase.co';
        navigator.sendBeacon(
          `${supabaseUrl}/functions/v1/analytics-tracker`,
          JSON.stringify(payload)
        );
      } else {
        // Use Supabase functions invoke for regular tracking
        await supabase.functions.invoke('analytics-tracker', {
          body: payload
        });
      }
    } catch (error) {
      console.error('Error flushing analytics:', error);
      // Re-queue events on error (but limit retries)
      if (events.length + conversions.length + goals.length < 100) {
        this.queue.push(
          ...events.map(data => ({ type: 'event' as const, data })),
          ...conversions.map(data => ({ type: 'conversion' as const, data })),
          ...goals.map(data => ({ type: 'goal' as const, data }))
        );
      }
    }
  }
}

// Create global analytics instance
export const analytics = new AnalyticsManager();

// React hook for analytics
export const useAnalytics = () => {
  const { user } = useAuth();

  // Update user ID when auth state changes
  React.useEffect(() => {
    analytics.setUserId(user?.id);
  }, [user]);

  return {
    track: analytics.track.bind(analytics),
    trackPageView: analytics.trackPageView.bind(analytics),
    trackConversion: analytics.trackConversion.bind(analytics),
    trackGoal: analytics.trackGoal.bind(analytics),
    trackAffiliateClick: analytics.trackAffiliateClick.bind(analytics),
    trackRecipeInteraction: analytics.trackRecipeInteraction.bind(analytics),
    trackSearch: analytics.trackSearch.bind(analytics)
  };
};

export default analytics;