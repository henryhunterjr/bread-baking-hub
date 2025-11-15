import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Area, AreaChart
} from 'recharts';
import { 
  TrendingUp, Users, Eye, MousePointer, DollarSign, Target, 
  Clock, Zap, Activity, AlertTriangle 
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface MetricsSummary {
  total_pageviews?: number;
  unique_pages?: number;
  total_conversions?: number;
  total_revenue?: number;
  conversion_types?: number;
  total_goals?: number;
  unique_goals?: number;
  avg_goal_value?: number;
  total_sessions?: number;
  avg_session_duration?: number;
  bounce_rate?: number;
  avg_events_per_session?: number;
  avg_lcp?: number;
  avg_fid?: number;
  avg_cls?: number;
  total_measurements?: number;
}

interface AnalyticsDashboardProps {
  className?: string;
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ className = "" }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('7d');
  const [selectedMetric, setSelectedMetric] = useState('pageviews');
  const [data, setData] = useState<any[]>([]);
  const [summary, setSummary] = useState<MetricsSummary>({});
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [coreWebVitals, setCoreWebVitals] = useState<any[]>([]);

  function normalizeArray(value: any): any[] {
    if (!value) return [];
    if (Array.isArray(value)) return value;
    return [];
  }

  const periods = {
    '1d': { label: '24 Hours', days: 1 },
    '7d': { label: '7 Days', days: 7 },
    '30d': { label: '30 Days', days: 30 },
    '90d': { label: '90 Days', days: 90 }
  };

  useEffect(() => {
    loadAnalyticsData();
    loadCoreWebVitals();
    
    // Auto-refresh every 30 seconds
    const intervalId = setInterval(() => {
      loadAnalyticsData();
      loadCoreWebVitals();
    }, 30000);

    return () => clearInterval(intervalId);
  }, [selectedPeriod, selectedMetric]);

  const loadAnalyticsData = async () => {
    setIsLoading(true);
    setHasError(false);
    try {
      const endDate = new Date().toISOString();
      const startDate = new Date(Date.now() - periods[selectedPeriod].days * 24 * 60 * 60 * 1000).toISOString();

      const { data: reportData } = await supabase.functions.invoke('analytics-reports', {
        body: {
          metric_type: selectedMetric,
          start_date: startDate,
          end_date: endDate,
          groupBy: selectedMetric === 'pageviews' ? ['date'] : 
                   selectedMetric === 'conversions' ? ['type', 'date'] :
                   selectedMetric === 'goals' ? ['goal', 'date'] :
                   ['date']
        }
      });

      if (reportData?.success) {
        setData(normalizeArray(reportData?.data));
        setSummary(reportData?.summary || {});
      }
    } catch (error) {
      console.error('Error loading analytics data:', error);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const loadCoreWebVitals = async () => {
    try {
      const endDate = new Date().toISOString();
      const startDate = new Date(Date.now() - periods[selectedPeriod].days * 24 * 60 * 60 * 1000).toISOString();

      const { data: vitals } = await supabase.rpc('get_core_web_vitals_summary', {
        start_date: startDate,
        end_date: endDate
      });

      if (vitals) {
        setCoreWebVitals(normalizeArray(vitals));
      }
    } catch (error) {
      console.error('Error loading Core Web Vitals:', error);
    }
  };

  const getMetricIcon = (metric: string) => {
    const icons = {
      pageviews: Eye,
      conversions: DollarSign,
      goals: Target,
      performance: Zap,
      user_behavior: Users
    };
    return icons[metric] || Activity;
  };

  const formatValue = (value: number, type: string) => {
    if (type === 'currency') {
      return new Intl.NumberFormat('en-US', { 
        style: 'currency', 
        currency: 'USD' 
      }).format(value);
    }
    if (type === 'percentage') {
      return `${(value * 100).toFixed(1)}%`;
    }
    if (type === 'duration') {
      return `${Math.round(value)}s`;
    }
    return new Intl.NumberFormat('en-US').format(Math.round(value));
  };

  const getPerformanceStatus = (metric: string, value: number) => {
    const thresholds = {
      lcp: { good: 2500, poor: 4000 },
      fid: { good: 100, poor: 300 },
      cls: { good: 0.1, poor: 0.25 },
      fcp: { good: 1800, poor: 3000 },
      ttfb: { good: 800, poor: 1800 }
    };

    const threshold = thresholds[metric];
    if (!threshold) return 'unknown';

    if (value <= threshold.good) return 'good';
    if (value <= threshold.poor) return 'needs-improvement';
    return 'poor';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'text-green-600 bg-green-100';
      case 'needs-improvement': return 'text-orange-600 bg-orange-100';
      case 'poor': return 'text-red-600 bg-red-100';
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

  const hasNoData = !data || data.length === 0;
  const hasSummaryData = summary && Object.keys(summary).length > 0;

  if (hasNoData && !hasSummaryData) {
    return (
      <div className="p-6 text-center text-muted-foreground">
        No analytics data available yet.
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Controls */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
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
          <Button variant="outline" onClick={() => {
            loadAnalyticsData();
            loadCoreWebVitals();
          }}>
            Refresh
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Page Views</p>
                <p className="text-2xl font-bold">
                  {formatValue(summary.total_pageviews || 0, 'number')}
                </p>
              </div>
              <Eye className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Conversions</p>
                <p className="text-2xl font-bold">
                  {formatValue(summary.total_conversions || 0, 'number')}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Revenue</p>
                <p className="text-2xl font-bold">
                  {formatValue(summary.total_revenue || 0, 'currency')}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Bounce Rate</p>
                <p className="text-2xl font-bold">
                  {formatValue(summary.bounce_rate || 0, 'percentage')}
                </p>
              </div>
              <MousePointer className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Core Web Vitals */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Core Web Vitals
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {coreWebVitals.map((vital) => {
              const status = getPerformanceStatus(vital.metric_type, vital.avg_value);
              return (
                <div key={vital.metric_type} className="text-center">
                  <div className="mb-2">
                    <Badge className={getStatusColor(status)}>
                      {vital.metric_type.toUpperCase()}
                    </Badge>
                  </div>
                  <p className="text-2xl font-bold">
                    {vital.metric_type === 'cls' 
                      ? vital.avg_value.toFixed(3)
                      : Math.round(vital.avg_value)
                    }
                    {vital.metric_type !== 'cls' && 'ms'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {vital.sample_count} samples
                  </p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Charts */}
      <Tabs value={selectedMetric} onValueChange={setSelectedMetric}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="pageviews">Page Views</TabsTrigger>
          <TabsTrigger value="conversions">Conversions</TabsTrigger>
          <TabsTrigger value="goals">Goals</TabsTrigger>
          <TabsTrigger value="user_behavior">Behavior</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="pageviews" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Page Views Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="h-64 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="key" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="count" stroke="#E0B243" fill="#E0B243" fillOpacity={0.3} />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="conversions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Conversion Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="h-64 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="key" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#E0B243" />
                    {data.some(d => d.revenue) && (
                      <Bar dataKey="revenue" fill="#CFA885" />
                    )}
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="goals" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Goal Completions</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="h-64 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={data}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ key, value }) => `${key}: ${value}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={`hsl(${index * 45}, 70%, 60%)`} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="user_behavior" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Average Session Duration</h3>
                  <Clock className="h-5 w-5 text-muted-foreground" />
                </div>
                <p className="text-3xl font-bold">
                  {formatValue(summary.avg_session_duration || 0, 'duration')}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Events per Session</h3>
                  <Activity className="h-5 w-5 text-muted-foreground" />
                </div>
                <p className="text-3xl font-bold">
                  {formatValue(summary.avg_events_per_session || 0, 'number')}
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={coreWebVitals}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="metric_type" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="avg_value" stroke="#E0B243" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalyticsDashboard;