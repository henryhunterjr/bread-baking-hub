/**
 * Owner Analytics Dashboard - Protected SPA
 * Comprehensive analytics with global filters and multiple tabs
 */

import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Calendar, 
  Users, 
  Eye, 
  Clock, 
  TrendingUp, 
  Search,
  AlertTriangle,
  RefreshCw,
  Filter,
  Download,
  BarChart3,
  PieChart,
  Globe,
  Smartphone
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  LineChart, 
  Line,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';
import { supabase } from '@/integrations/supabase/client';

interface GlobalFilters {
  startDate: string;
  endDate: string;
  device: string;
  source: string;
  campaign: string;
}

interface OverviewMetrics {
  users: number;
  sessions: number;
  pageviews: number;
  avgReadTime: number;
  signups: number;
  conversionRate: number;
  searches: number;
  errors404: number;
  lcpP95: number;
  netSubscribers: number;
  sessionsBySource: Array<{
    date: string;
    direct: number;
    organic: number;
    social: number;
    referral: number;
    email: number;
  }>;
}

const OwnerAnalytics: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  
  // Global filters
  const [filters, setFilters] = useState<GlobalFilters>({
    startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    device: '',
    source: '',
    campaign: ''
  });

  // Data states
  const [overviewData, setOverviewData] = useState<OverviewMetrics | null>(null);
  const [acquisitionData, setAcquisitionData] = useState<any>(null);
  const [contentData, setContentData] = useState<any>(null);

  // Admin check
  const isAdmin = user?.email && process.env.ADMIN_EMAIL_ALLOWLIST?.includes(user.email);

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      return; // Will redirect via Navigate below
    }
    
    if (user && isAdmin) {
      loadAnalyticsData();
    }
  }, [user, isAdmin, authLoading, filters]);

  const loadAnalyticsData = async () => {
    setIsLoading(true);
    try {
      await Promise.all([
        loadOverviewData(),
        loadAcquisitionData(),
        loadContentData()
      ]);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to load analytics data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadOverviewData = async () => {
    const params = new URLSearchParams({
      start_date: filters.startDate,
      end_date: filters.endDate,
      ...(filters.device && { device: filters.device }),
      ...(filters.source && { source: filters.source }),
      ...(filters.campaign && { campaign: filters.campaign })
    });

    const { data, error } = await supabase.functions.invoke('analytics-overview', {
      body: Object.fromEntries(params)
    });

    if (!error && data) {
      setOverviewData(data);
    }
  };

  const loadAcquisitionData = async () => {
    const params = new URLSearchParams({
      start_date: filters.startDate,
      end_date: filters.endDate
    });

    const { data, error } = await supabase.functions.invoke('analytics-acquisition', {
      body: Object.fromEntries(params)
    });

    if (!error && data) {
      setAcquisitionData(data);
    }
  };

  const loadContentData = async () => {
    const params = new URLSearchParams({
      start_date: filters.startDate,
      end_date: filters.endDate
    });

    const { data, error } = await supabase.functions.invoke('analytics-content', {
      body: Object.fromEntries(params)
    });

    if (!error && data) {
      setContentData(data);
    }
  };

  const updateFilter = (key: keyof GlobalFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      endDate: new Date().toISOString().split('T')[0],
      device: '',
      source: '',
      campaign: ''
    });
  };

  // Loading or authentication check
  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Redirect if not admin
  if (!user || !isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#8dd1e1'];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
            <p className="text-muted-foreground">
              Owner analytics • Last updated: {lastUpdated?.toLocaleTimeString() || 'Never'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={loadAnalyticsData} disabled={isLoading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Global Filters */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Filter className="h-5 w-5" />
              Global Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Start Date</label>
                <Input
                  type="date"
                  value={filters.startDate}
                  onChange={(e) => updateFilter('startDate', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">End Date</label>
                <Input
                  type="date"
                  value={filters.endDate}
                  onChange={(e) => updateFilter('endDate', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Device</label>
                <Select value={filters.device} onValueChange={(value) => updateFilter('device', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="All devices" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All devices</SelectItem>
                    <SelectItem value="mobile">Mobile</SelectItem>
                    <SelectItem value="desktop">Desktop</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Source</label>
                <Input
                  placeholder="e.g. google, facebook"
                  value={filters.source}
                  onChange={(e) => updateFilter('source', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Campaign</label>
                <Input
                  placeholder="Campaign name"
                  value={filters.campaign}
                  onChange={(e) => updateFilter('campaign', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">&nbsp;</label>
                <Button variant="outline" onClick={clearFilters} className="w-full">
                  Clear All
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="acquisition">Acquisition</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="search">Search</TabsTrigger>
            <TabsTrigger value="tech">Tech Health</TabsTrigger>
            <TabsTrigger value="definitions">Definitions</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[...Array(8)].map((_, i) => (
                  <Card key={i}>
                    <CardContent className="p-6">
                      <Skeleton className="h-16 w-full" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <>
                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Users</p>
                          <p className="text-2xl font-bold">{overviewData?.users?.toLocaleString() || 0}</p>
                        </div>
                        <Users className="h-8 w-8 text-muted-foreground" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Sessions</p>
                          <p className="text-2xl font-bold">{overviewData?.sessions?.toLocaleString() || 0}</p>
                        </div>
                        <BarChart3 className="h-8 w-8 text-muted-foreground" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Pageviews</p>
                          <p className="text-2xl font-bold">{overviewData?.pageviews?.toLocaleString() || 0}</p>
                        </div>
                        <Eye className="h-8 w-8 text-muted-foreground" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Avg Read Time</p>
                          <p className="text-2xl font-bold">{overviewData?.avgReadTime || 0}s</p>
                        </div>
                        <Clock className="h-8 w-8 text-muted-foreground" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Signups</p>
                          <p className="text-2xl font-bold">{overviewData?.signups || 0}</p>
                        </div>
                        <TrendingUp className="h-8 w-8 text-muted-foreground" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Conv Rate</p>
                          <p className="text-2xl font-bold">{overviewData?.conversionRate || 0}%</p>
                        </div>
                        <TrendingUp className="h-8 w-8 text-muted-foreground" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Searches</p>
                          <p className="text-2xl font-bold">{overviewData?.searches || 0}</p>
                        </div>
                        <Search className="h-8 w-8 text-muted-foreground" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">LCP P95</p>
                          <p className="text-2xl font-bold">{overviewData?.lcpP95 || 0}ms</p>
                          <Badge variant={
                            (overviewData?.lcpP95 || 0) <= 2500 ? 'default' :
                            (overviewData?.lcpP95 || 0) <= 4000 ? 'secondary' : 'destructive'
                          } className="text-xs mt-1">
                            {(overviewData?.lcpP95 || 0) <= 2500 ? 'Good' :
                             (overviewData?.lcpP95 || 0) <= 4000 ? 'Needs Work' : 'Poor'}
                          </Badge>
                        </div>
                        <AlertTriangle className="h-8 w-8 text-muted-foreground" />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Charts Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Sessions by Source */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Sessions by Source</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={overviewData?.sessionsBySource || []}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Area 
                            type="monotone" 
                            dataKey="direct" 
                            stackId="1" 
                            stroke="#8884d8" 
                            fill="#8884d8" 
                          />
                          <Area 
                            type="monotone" 
                            dataKey="organic" 
                            stackId="1" 
                            stroke="#82ca9d" 
                            fill="#82ca9d" 
                          />
                          <Area 
                            type="monotone" 
                            dataKey="social" 
                            stackId="1" 
                            stroke="#ffc658" 
                            fill="#ffc658" 
                          />
                          <Area 
                            type="monotone" 
                            dataKey="referral" 
                            stackId="1" 
                            stroke="#ff7300" 
                            fill="#ff7300" 
                          />
                          <Area 
                            type="monotone" 
                            dataKey="email" 
                            stackId="1" 
                            stroke="#8dd1e1" 
                            fill="#8dd1e1" 
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  {/* Net Subscribers */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Newsletter Metrics</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div className="text-center">
                          <p className="text-3xl font-bold text-primary">
                            +{overviewData?.netSubscribers || 0}
                          </p>
                          <p className="text-sm text-muted-foreground">Net new subscribers</p>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 text-center">
                          <div>
                            <p className="text-lg font-semibold">{overviewData?.signups || 0}</p>
                            <p className="text-xs text-muted-foreground">Total signups</p>
                          </div>
                          <div>
                            <p className="text-lg font-semibold">{overviewData?.conversionRate || 0}%</p>
                            <p className="text-xs text-muted-foreground">Conversion rate</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </>
            )}
          </TabsContent>

          {/* Acquisition Tab */}
          <TabsContent value="acquisition" className="space-y-6">
            <div className="text-center py-12">
              <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Acquisition Analytics</h3>
              <p className="text-muted-foreground">
                Sources, mediums, campaigns, geo, and device data will be displayed here.
              </p>
            </div>
          </TabsContent>

          {/* Content Tab */}
          <TabsContent value="content" className="space-y-6">
            <div className="text-center py-12">
              <PieChart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Content Performance</h3>
              <p className="text-muted-foreground">
                Top pages, read time, exit rates, and content insights will be displayed here.
              </p>
            </div>
          </TabsContent>

          {/* Search Tab */}
          <TabsContent value="search" className="space-y-6">
            <div className="text-center py-12">
              <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Search Analytics</h3>
              <p className="text-muted-foreground">
                Top queries, CTR, and zero-result queries will be displayed here.
              </p>
            </div>
          </TabsContent>

          {/* Tech Health Tab */}
          <TabsContent value="tech" className="space-y-6">
            <div className="text-center py-12">
              <AlertTriangle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Technical Health</h3>
              <p className="text-muted-foreground">
                404/5xx trends, Core Web Vitals, and OG coverage will be displayed here.
              </p>
            </div>
          </TabsContent>

          {/* Definitions Tab */}
          <TabsContent value="definitions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Metric Definitions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold">Users</h4>
                    <p className="text-sm text-muted-foreground">
                      Sessions deduplicated per day (no PII tracking)
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Sessions</h4>
                    <p className="text-sm text-muted-foreground">
                      Unique session IDs within the date range
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold">LCP P95</h4>
                    <p className="text-sm text-muted-foreground">
                      Largest Contentful Paint 95th percentile (Core Web Vital)
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Conversion Rate</h4>
                    <p className="text-sm text-muted-foreground">
                      Percentage of page views that result in newsletter signups
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default OwnerAnalytics;