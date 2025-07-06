interface AnalyticsEvent {
  name: string;
  properties?: Record<string, any>;
}

interface Analytics {
  track: (eventName: string, properties?: Record<string, any>) => void;
  identify: (userId: string, traits?: Record<string, any>) => void;
  page: (pageName?: string, properties?: Record<string, any>) => void;
}

class AnalyticsService implements Analytics {
  private isEnabled: boolean = true;

  constructor() {
    // In development, log to console. In production, you'd integrate with your analytics service
    this.isEnabled = true;
  }

  track(eventName: string, properties?: Record<string, any>): void {
    if (!this.isEnabled) return;

    const event: AnalyticsEvent = {
      name: eventName,
      properties: {
        timestamp: new Date().toISOString(),
        url: window.location.href,
        userAgent: navigator.userAgent,
        ...properties
      }
    };

    // For now, log to console. Replace with your analytics service (e.g., Mixpanel, Amplitude, GA4)
    console.log('🔍 Analytics Event:', event);

    // Example: Future integration with real analytics service
    // this.sendToAnalyticsService(event);
  }

  identify(userId: string, traits?: Record<string, any>): void {
    if (!this.isEnabled) return;

    console.log('👤 Analytics Identify:', {
      userId,
      traits: {
        timestamp: new Date().toISOString(),
        ...traits
      }
    });
  }

  page(pageName?: string, properties?: Record<string, any>): void {
    if (!this.isEnabled) return;

    console.log('📄 Analytics Page:', {
      page: pageName || document.title,
      url: window.location.href,
      referrer: document.referrer,
      timestamp: new Date().toISOString(),
      ...properties
    });
  }

  // Future method for real analytics service integration
  private async sendToAnalyticsService(event: AnalyticsEvent): Promise<void> {
    try {
      // Example: Send to your analytics service
      // await fetch('/api/analytics', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(event)
      // });
    } catch (error) {
      console.error('Analytics service error:', error);
    }
  }

  // Utility methods for common tracking patterns
  trackSymptomDetection(symptomIds: string[], method: 'keyword' | 'ai' | 'combined' = 'combined'): void {
    this.track('symptomDetected', {
      symptomIds,
      method,
      count: symptomIds.length
    });
  }

  trackCommunityInteraction(action: string, symptomId?: string): void {
    this.track('communityInteraction', {
      action,
      symptomId,
      section: 'troubleshooting'
    });
  }

  trackRecipeInteraction(action: string, recipeId?: string): void {
    this.track('recipeInteraction', {
      action,
      recipeId
    });
  }

  trackPodcastInteraction(action: string, episodeId?: string): void {
    this.track('podcastInteraction', {
      action,
      episodeId: episodeId || 'jar-podcast-main'
    });
  }
}

// Export a singleton instance
export const analytics = new AnalyticsService();

// Export the class for testing
export { AnalyticsService };

// Export common tracking functions for easy use
export const trackSymptomDetection = (symptomIds: string[], method: 'keyword' | 'ai' | 'combined' = 'combined') => {
  analytics.trackSymptomDetection(symptomIds, method);
};

export const trackCommunityShare = (symptomId: string) => {
  analytics.trackCommunityInteraction('shareClicked', symptomId);
};

export const trackCommunityDiscussion = (symptomId: string) => {
  analytics.trackCommunityInteraction('discussionJoined', symptomId);
};

export const trackPodcastPlay = () => {
  analytics.trackPodcastInteraction('playClicked');
};

export const trackPodcastExternalLink = () => {
  analytics.trackPodcastInteraction('externalLinkClicked');
};