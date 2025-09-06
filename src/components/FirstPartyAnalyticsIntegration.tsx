/**
 * First Party Analytics Integration
 * Integrates the privacy-first analytics system with existing pages
 */

import React from 'react';
import { firstPartyAnalytics } from '@/utils/firstPartyAnalytics';

// Hook to integrate first-party analytics
export const useFirstPartyAnalytics = () => {
  React.useEffect(() => {
    // Analytics is automatically initialized on import
    // Track initial page view is handled by the analytics system
  }, []);

  return {
    trackPageView: (path?: string) => firstPartyAnalytics?.trackPageView(path),
    trackSubscribeView: () => firstPartyAnalytics?.trackSubscribeView(),
    trackSubscribeSubmit: (success: boolean) => firstPartyAnalytics?.trackSubscribeSubmit(success),
    trackAffiliateClick: (productId: string, url: string) => firstPartyAnalytics?.trackAffiliateClick(productId, url),
    trackSearch: (query: string, resultsCount: number) => firstPartyAnalytics?.trackSearch(query, resultsCount),
    trackShare: (platform: string, url: string) => firstPartyAnalytics?.trackShare(platform, url),
    trackError404: () => firstPartyAnalytics?.trackError404(),
    trackError5xx: (error: string) => firstPartyAnalytics?.trackError5xx(error),
    trackOgMissing: (path: string) => firstPartyAnalytics?.trackOgMissing(path)
  };
};

// Component to add analytics tracking to newsletters
export const NewsletterAnalytics: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const analytics = useFirstPartyAnalytics();

  React.useEffect(() => {
    analytics.trackSubscribeView();
  }, []);

  const trackSubmission = (success: boolean) => {
    analytics.trackSubscribeSubmit(success);
  };

  return (
    <div data-analytics-newsletter onSubmit={() => trackSubmission(true)}>
      {children}
    </div>
  );
};

// Component to add analytics tracking to affiliate links
export const AffiliateAnalytics: React.FC<{ 
  productId: string; 
  url: string; 
  children: React.ReactNode 
}> = ({ productId, url, children }) => {
  const analytics = useFirstPartyAnalytics();

  const handleClick = () => {
    analytics.trackAffiliateClick(productId, url);
  };

  return (
    <div onClick={handleClick} data-analytics-affiliate={productId}>
      {children}
    </div>
  );
};

// Component to add analytics tracking to search
export const SearchAnalytics: React.FC<{ 
  query: string; 
  resultsCount: number; 
  children: React.ReactNode 
}> = ({ query, resultsCount, children }) => {
  const analytics = useFirstPartyAnalytics();

  React.useEffect(() => {
    if (query) {
      analytics.trackSearch(query, resultsCount);
    }
  }, [query, resultsCount]);

  return <>{children}</>;
};

// Component to add analytics tracking to social sharing
export const ShareAnalytics: React.FC<{ 
  platform: string; 
  url: string; 
  children: React.ReactNode 
}> = ({ platform, url, children }) => {
  const analytics = useFirstPartyAnalytics();

  const handleClick = () => {
    analytics.trackShare(platform, url);
  };

  return (
    <div onClick={handleClick} data-analytics-share={platform}>
      {children}
    </div>
  );
};

// Error boundary that tracks errors
export class AnalyticsErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    firstPartyAnalytics?.trackError5xx(error.message);
    console.error('Analytics Error Boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 text-center text-muted-foreground">
          <p>Something went wrong with analytics.</p>
          <button 
            onClick={() => this.setState({ hasError: false })}
            className="mt-2 px-4 py-2 bg-primary text-primary-foreground rounded"
          >
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default {
  useFirstPartyAnalytics,
  NewsletterAnalytics,
  AffiliateAnalytics,
  SearchAnalytics,
  ShareAnalytics,
  AnalyticsErrorBoundary
};