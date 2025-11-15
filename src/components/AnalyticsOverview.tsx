/**
 * Analytics Overview - Phase A MVP Dashboard
 * Shows KPIs, Sessions by Source, and Health Check
 */

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell
} from 'recharts';
import { 
  TrendingUp, Users, Eye, MousePointer, Clock, Zap, Activity, 
  CheckCircle, AlertTriangle, Globe, Search, Share, Target
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface OverviewMetrics {
  pageviews: number;
  sessions: number;
  bounce_rate: number;
  avg_session_duration: number;
  conversions: number;
  errors: number;
  top_pages: Array<{ path: string; count: number }>;
  sources: Array<{ source: string; sessions: number; percentage: number }>;
  performance_score: 'good' | 'needs_improvement' | 'poor';
  health_status: 'healthy' | 'warning' | 'critical';
}

interface AnalyticsOverviewProps {
  className?: string;
}

export const AnalyticsOverview: React.FC<AnalyticsOverviewProps> = ({ className = "" }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('7d');
  const [metrics, setMetrics] = useState<OverviewMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  function normalizeArray(value: any): any[] {
    if (!value) return [];
    if (Array.isArray(value)) return value;
    return [];
  }

  const periods = {
    '24h': { label: '24 Hours', hours: 24 },
    '7d': { label: '7 Days', hours: 168 },
    '30d': { label: '30 Days', hours: 720 },
  };

  useEffect(() => {
    loadOverviewData();
    
    // Auto-refresh every 30 seconds
    const intervalId = setInterval(() => {
      loadOverviewData();
    }, 30000);

    return () => clearInterval(intervalId);
  }, [selectedPeriod]);

  const loadOverviewData = async () => {
    setIsLoading(true);
    setHasError(false);
    try {
      const hoursBack = periods[selectedPeriod].hours;
      const startTime = new Date(Date.now() - hoursBack * 60 * 60 * 1000).toISOString();
      
      // Fetch analytics data from new table
      const { data: events } = await supabase
        .from('app_analytics_events')
        .select('*')
        .gte('ts', startTime);

      if (events) {
        const calculatedMetrics = calculateMetrics(events);
        setMetrics(calculatedMetrics);
        setLastUpdated(new Date());
      }
    } catch (error) {
      console.error('Error loading analytics overview:', error);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateMetrics = (events: any[]): OverviewMetrics => {
    const normalizedEvents = normalizeArray(events);
    
    // Group by session for session-based calculations
    const sessionMap = new Map<string, any[]>();
    const pageviews = normalizedEvents.filter(e => e.event === 'page_view');
    const errors = normalizedEvents.filter(e => e.event === 'error_404' || e.event === 'error_5xx');
    
    // Group events by session
    normalizedEvents.forEach(event => {
      const sessionId = event.session_id;
      if (!sessionMap.has(sessionId)) {
        sessionMap.set(sessionId, []);
      }
      sessionMap.get(sessionId)!.push(event);
    });

    // Calculate session metrics
    const sessions = sessionMap.size;
    let totalSessionDuration = 0;
    let bouncedSessions = 0;
    
    sessionMap.forEach(sessionEvents => {
      const sortedEvents = sessionEvents.sort((a, b) => 
        new Date(a.ts).getTime() - new Date(b.ts).getTime()
      );
      
      if (sortedEvents.length === 1) {
        bouncedSessions++;
      } else {
        const duration = new Date(sortedEvents[sortedEvents.length - 1].ts).getTime() - 
                        new Date(sortedEvents[0].ts).getTime();
        totalSessionDuration += duration;
      }
    });

    const avgSessionDuration = sessions > 0 ? totalSessionDuration / sessions / 1000 : 0;
    const bounceRate = sessions > 0 ? bouncedSessions / sessions : 0;

    // Top pages
    const pageMap = new Map<string, number>();
    pageviews.forEach(event => {
      const path = event.path || 'unknown';
      pageMap.set(path, (pageMap.get(path) || 0) + 1);
    });
    
    const topPages = Array.from(pageMap.entries())
      .map(([path, count]) => ({ path, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Sources analysis
    const sourceMap = new Map<string, number>();
    sessionMap.forEach(sessionEvents => {
      const firstEvent = sessionEvents[0];
      const source = firstEvent.source || 
                    (firstEvent.referrer ? new URL(firstEvent.referrer).hostname : 'direct') || 
                    'direct';
      sourceMap.set(source, (sourceMap.get(source) || 0) + 1);
    });

    const sources = Array.from(sourceMap.entries())
      .map(([source, count]) => ({
        source,
        sessions: count,
        percentage: sessions > 0 ? (count / sessions) * 100 : 0
      }))
      .sort((a, b) => b.sessions - a.sessions);

    // Performance and health scoring
    const performanceEvents = normalizedEvents.filter(e => e.event === 'cwv_metric');
    const performanceScore = calculatePerformanceScore(performanceEvents);
    const healthStatus = calculateHealthStatus(normalizedEvents, errors.length);

    return {
      pageviews: pageviews.length,
      sessions,
      bounce_rate: bounceRate,
      avg_session_duration: avgSessionDuration,
      conversions: normalizedEvents.filter(e => ['subscribe_submit', 'affiliate_click'].includes(e.event)).length,
      errors: errors.length,
      top_pages: topPages,
      sources,
      performance_score: performanceScore,
      health_status: healthStatus
    };
  };

  const calculatePerformanceScore = (perfEvents: any[]): 'good' | 'needs_improvement' | 'poor' => {
    if (perfEvents.length === 0) return 'good';
    
    // Simple scoring based on Core Web Vitals
    const lcpEvents = perfEvents.filter(e => e.meta?.metric === 'lcp');
    const avgLcp = lcpEvents.length > 0 
      ? lcpEvents.reduce((sum, e) => sum + (e.meta?.value || 0), 0) / lcpEvents.length 
      : 0;
    
    if (avgLcp <= 2500) return 'good';
    if (avgLcp <= 4000) return 'needs_improvement';
    return 'poor';
  };

  const calculateHealthStatus = (events: any[], errorCount: number): 'healthy' | 'warning' | 'critical' => {
    const totalEvents = events.length;
    if (totalEvents === 0) return 'healthy';
    
    const errorRate = errorCount / totalEvents;
    if (errorRate > 0.05) return 'critical';
    if (errorRate > 0.01) return 'warning';
    return 'healthy';
  };

  const getHealthColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-600 bg-green-100';
      case 'warning': return 'text-orange-600 bg-orange-100';
      case 'critical': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 text-center text-muted-foreground">
        Loading analytics…
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="p-6 text-center text-red-600">
        There was a problem loading analytics data.
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="p-6 text-center text-muted-foreground">
        No analytics data available yet.
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Analytics Overview</h1>
          <p className="text-sm text-muted-foreground">
            Privacy-first analytics • Last updated: {lastUpdated?.toLocaleTimeString()}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(periods).map(([key, period]) => (
                <SelectItem key={key} value={key}>
                  {period.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={loadOverviewData}>
            Refresh
          </Button>
        </div>
      </div>

      {/* Health Status */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="font-medium">System Health</span>
            </div>
            <Badge className={getHealthColor(metrics?.health_status || 'healthy')}>
              {metrics?.health_status || 'Unknown'}
            </Badge>
          </div>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Performance: </span>
              <Badge variant="outline" className={
                metrics?.performance_score === 'good' ? 'text-green-600' :
                metrics?.performance_score === 'needs_improvement' ? 'text-orange-600' :
                'text-red-600'
              }>
                {metrics?.performance_score || 'Unknown'}
              </Badge>
            </div>
            <div>
              <span className="text-muted-foreground">Errors: </span>
              <span className="font-medium">{metrics?.errors || 0}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Active Sessions: </span>
              <span className="font-medium">{metrics?.sessions || 0}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Page Views</p>
                <p className="text-2xl font-bold">{metrics?.pageviews?.toLocaleString() || 0}</p>
              </div>
              <Eye className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Sessions</p>
                <p className="text-2xl font-bold">{metrics?.sessions?.toLocaleString() || 0}</p>
              </div>
              <Users className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Bounce Rate</p>
                <p className="text-2xl font-bold">{((metrics?.bounce_rate || 0) * 100).toFixed(1)}%</p>
              </div>
              <MousePointer className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg. Session</p>
                <p className="text-2xl font-bold">{Math.round(metrics?.avg_session_duration || 0)}s</p>
              </div>
              <Clock className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sessions by Source */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Sessions by Source
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={normalizeArray(metrics?.sources)}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ source, percentage }) => `${source}: ${percentage.toFixed(1)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="sessions"
                >
                  {normalizeArray(metrics?.sources).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={`hsl(${index * 60}, 70%, 60%)`} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Pages */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Top Pages
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={normalizeArray(metrics?.top_pages)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="path" 
                  tick={{ fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={100}
                />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsOverview;