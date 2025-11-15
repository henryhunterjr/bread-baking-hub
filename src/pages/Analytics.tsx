import React from 'react';
import { AnalyticsDashboard } from '@/components/AnalyticsDashboard';
import { AnalyticsOverview } from '@/components/AnalyticsOverview';
import { AnalyticsErrorBoundary, useFirstPartyAnalytics } from '@/components/FirstPartyAnalyticsIntegration';

const Analytics = () => {
  useFirstPartyAnalytics();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-3">Analytics Dashboard</h1>
          <p className="text-lg text-muted-foreground">
            Track your website's performance, user engagement, and key metrics in real-time.
          </p>
        </div>

        <AnalyticsErrorBoundary>
          <div className="space-y-8">
            <AnalyticsOverview />
            <AnalyticsDashboard />
          </div>
        </AnalyticsErrorBoundary>
      </div>
    </div>
  );
};

export default Analytics;
