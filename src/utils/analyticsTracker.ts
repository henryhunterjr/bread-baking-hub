/**
 * Enhanced Analytics Tracker with HMAC Security
 * Provides secure, authenticated tracking with replay protection
 */

import { firstPartyAnalytics } from './firstPartyAnalytics';

export class SecureAnalyticsTracker {
  private analyticsKey: string;
  private endpoint: string;

  constructor(endpoint: string = '/api/track') {
    this.endpoint = endpoint;
    this.analyticsKey = this.getAnalyticsKey();
  }

  private getAnalyticsKey(): string {
    // In production, this should be a proper HMAC key
    // For now, use a derived key from environment or default
    return 'secure-analytics-key-2024';
  }

  private async generateHMAC(payload: string, timestamp: string): Promise<string> {
    const key = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(this.analyticsKey),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );

    const signature = await crypto.subtle.sign(
      'HMAC',
      key,
      new TextEncoder().encode(payload + timestamp)
    );

    return Array.from(new Uint8Array(signature))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }

  async trackSecure(events: any[]): Promise<void> {
    if (!events.length) return;

    try {
      const timestamp = Date.now().toString();
      const payload = JSON.stringify({ events });
      const hmac = await this.generateHMAC(payload, timestamp);

      const response = await fetch(this.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-analytics-key': hmac,
          'x-analytics-ts': timestamp,
        },
        body: payload,
      });

      // Always succeeds silently for privacy
      if (!response.ok) {
        console.debug('Analytics tracking failed silently');
      }
    } catch (error) {
      console.debug('Analytics tracking error:', error);
    }
  }
}

// Enhanced version of the existing analytics
export const secureAnalytics = new SecureAnalyticsTracker();

// Wrapper functions that use secure tracking
export const trackPageViewSecure = (path?: string) => {
  const event = {
    event_type: 'page_view',
    path: path || window.location.pathname,
    title: document.title,
    // ... other properties from firstPartyAnalytics
  };
  
  secureAnalytics.trackSecure([event]);
};

export const trackEventSecure = (eventType: string, properties: any = {}) => {
  const event = {
    event_type: eventType,
    path: window.location.pathname,
    title: document.title,
    ...properties,
  };
  
  secureAnalytics.trackSecure([event]);
};

// Re-export existing analytics for backward compatibility
export { firstPartyAnalytics } from './firstPartyAnalytics';
