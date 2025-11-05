import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, TrendingUp, Users, MousePointer, Clock, Download, RefreshCw } from 'lucide-react';
import { format, subDays } from 'date-fns';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function WebsiteAnalytics() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isImporting, setIsImporting] = useState(false);

  // Fetch daily metrics
  const { data: dailyMetrics, isLoading: loadingDaily } = useQuery({
    queryKey: ['website-analytics-daily'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('website_analytics_daily')
        .select('*')
        .order('metric_date', { ascending: false })
        .limit(30);
      
      if (error) throw error;
      return data;
    }
  });

  // Fetch traffic sources
  const { data: trafficSources, isLoading: loadingSources } = useQuery({
    queryKey: ['website-analytics-sources'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('website_analytics_sources')
        .select('*')
        .order('metric_date', { ascending: false })
        .limit(1)
        .single();
      
      if (error) throw error;
      return data;
    }
  });

  // Fetch top pages
  const { data: topPages, isLoading: loadingPages } = useQuery({
    queryKey: ['website-analytics-pages'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('website_analytics_pages')
        .select('*')
        .order('views', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      return data;
    }
  });

  // Fetch import history
  const { data: imports, isLoading: loadingImports } = useQuery({
    queryKey: ['website-analytics-imports'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('website_analytics_imports')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      return data;
    }
  });

  // Import mutation
  const importMutation = useMutation({
    mutationFn: async () => {
      const endDate = format(new Date(), 'yyyy-MM-dd');
      const startDate = format(subDays(new Date(), 30), 'yyyy-MM-dd');

      const { data: { session } } = await supabase.auth.getSession();
      
      const response = await supabase.functions.invoke('website-analytics-import', {
        body: { start_date: startDate, end_date: endDate },
        headers: {
          Authorization: `Bearer ${session?.access_token}`
        }
      });

      if (response.error) throw response.error;
      return response.data;
    },
    onSuccess: (data) => {
      toast({
        title: 'Import Successful',
        description: `Imported ${data.records_imported} analytics records from bakinggreatbread.com`,
      });
      queryClient.invalidateQueries({ queryKey: ['website-analytics-daily'] });
      queryClient.invalidateQueries({ queryKey: ['website-analytics-sources'] });
      queryClient.invalidateQueries({ queryKey: ['website-analytics-pages'] });
      queryClient.invalidateQueries({ queryKey: ['website-analytics-imports'] });
      setIsImporting(false);
    },
    onError: (error: any) => {
      toast({
        title: 'Import Failed',
        description: error.message || 'Failed to import analytics data',
        variant: 'destructive',
      });
      setIsImporting(false);
    }
  });

  const handleImport = () => {
    setIsImporting(true);
    importMutation.mutate();
  };

  // Calculate summary stats
  const totalPageViews = dailyMetrics?.reduce((sum, day) => sum + Number(day.page_views), 0) || 0;
  const totalSessions = dailyMetrics?.reduce((sum, day) => sum + Number(day.sessions), 0) || 0;
  const totalVisitors = dailyMetrics?.reduce((sum, day) => sum + Number(day.unique_visitors), 0) || 0;
  const avgBounceRate = dailyMetrics?.length 
    ? dailyMetrics.reduce((sum, day) => sum + Number(day.bounce_rate || 0), 0) / dailyMetrics.length
    : 0;

  const isLoading = loadingDaily || loadingSources || loadingPages || loadingImports;

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Website Analytics</h1>
          <p className="text-muted-foreground">
            Analytics data from bakinggreatbread.com (Last 30 days)
          </p>
        </div>
        <Button 
          onClick={handleImport} 
          disabled={isImporting}
          className="gap-2"
        >
          {isImporting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Importing...
            </>
          ) : (
            <>
              <Download className="h-4 w-4" />
              Fetch Latest Data
            </>
          )}
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Page Views</CardTitle>
            <MousePointer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? '...' : totalPageViews.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Last 30 days
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? '...' : totalSessions.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              User sessions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unique Visitors</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? '...' : totalVisitors.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Individual users
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Bounce Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? '...' : `${avgBounceRate.toFixed(1)}%`}
            </div>
            <p className="text-xs text-muted-foreground">
              Single-page visits
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Traffic Sources */}
      {trafficSources && (
        <Card>
          <CardHeader>
            <CardTitle>Traffic Sources</CardTitle>
            <CardDescription>Where your visitors come from</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Organic</p>
                <p className="text-2xl font-bold">{Number(trafficSources.organic).toLocaleString()}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Direct</p>
                <p className="text-2xl font-bold">{Number(trafficSources.direct).toLocaleString()}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Social</p>
                <p className="text-2xl font-bold">{Number(trafficSources.social).toLocaleString()}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Referral</p>
                <p className="text-2xl font-bold">{Number(trafficSources.referral).toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Top Pages */}
      <Card>
        <CardHeader>
          <CardTitle>Top Pages</CardTitle>
          <CardDescription>Most visited pages on your website</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Page Path</TableHead>
                <TableHead className="text-right">Views</TableHead>
                <TableHead className="text-right">Unique Visitors</TableHead>
                <TableHead className="text-right">Avg Time (sec)</TableHead>
                <TableHead className="text-right">Bounce Rate</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {topPages?.map((page) => (
                <TableRow key={page.id}>
                  <TableCell className="font-mono text-sm">{page.path}</TableCell>
                  <TableCell className="text-right">{Number(page.views).toLocaleString()}</TableCell>
                  <TableCell className="text-right">{Number(page.unique_visitors).toLocaleString()}</TableCell>
                  <TableCell className="text-right">
                    {page.avg_time_on_page ? Number(page.avg_time_on_page).toFixed(0) : '-'}
                  </TableCell>
                  <TableCell className="text-right">
                    {page.bounce_rate ? `${Number(page.bounce_rate).toFixed(1)}%` : '-'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Import History */}
      <Card>
        <CardHeader>
          <CardTitle>Import History</CardTitle>
          <CardDescription>Recent analytics data imports</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date Range</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Records</TableHead>
                <TableHead>Completed</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {imports?.map((imp) => (
                <TableRow key={imp.id}>
                  <TableCell className="font-mono text-sm">
                    {imp.start_date} to {imp.end_date}
                  </TableCell>
                  <TableCell className="capitalize">{imp.import_type}</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
                      imp.status === 'success' ? 'bg-green-100 text-green-800' :
                      imp.status === 'failed' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {imp.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">{imp.records_imported || 0}</TableCell>
                  <TableCell>
                    {imp.completed_at ? format(new Date(imp.completed_at), 'MMM d, HH:mm') : '-'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
