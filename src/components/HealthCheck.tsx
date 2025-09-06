import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, AlertTriangle, XCircle, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface HealthCheckProps {
  className?: string;
}

interface HealthStatus {
  status: 'healthy' | 'warning' | 'critical';
  recent_events: number;
  error_rate: number;
  avg_lcp: number;
  timestamp: string;
}

export const HealthCheck: React.FC<HealthCheckProps> = ({ className = "" }) => {
  const [healthStatus, setHealthStatus] = React.useState<HealthStatus | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [lastCheck, setLastCheck] = React.useState<Date | null>(null);

  const checkHealth = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.rpc('get_analytics_health_status');
      
      if (error) {
        console.error('Health check error:', error);
        return;
      }

      if (data && typeof data === 'object' && !Array.isArray(data)) {
        setHealthStatus(data as unknown as HealthStatus);
      }
      setLastCheck(new Date());
    } catch (error) {
      console.error('Health check failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    checkHealth();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(checkHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-orange-600" />;
      case 'critical':
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return <CheckCircle className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'text-green-600 bg-green-100';
      case 'warning':
        return 'text-orange-600 bg-orange-100';
      case 'critical':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  if (isLoading && !healthStatus) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            <span className="ml-2">Running health check...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {healthStatus && getStatusIcon(healthStatus.status)}
            Analytics Health Check
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={checkHealth}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {healthStatus ? (
          <div className="space-y-4">
            {/* Overall Status */}
            <div className="flex items-center justify-between">
              <span className="font-medium">Overall Status</span>
              <Badge className={getStatusColor(healthStatus.status)}>
                {healthStatus.status.toUpperCase()}
              </Badge>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="space-y-1">
                <span className="text-muted-foreground">Recent Events (1h)</span>
                <p className="text-lg font-semibold">{healthStatus.recent_events}</p>
              </div>
              
              <div className="space-y-1">
                <span className="text-muted-foreground">Error Rate (24h)</span>
                <p className="text-lg font-semibold">{healthStatus.error_rate}%</p>
              </div>
              
              <div className="space-y-1">
                <span className="text-muted-foreground">Avg LCP</span>
                <p className="text-lg font-semibold">
                  {healthStatus.avg_lcp}ms
                  <Badge 
                    variant="outline" 
                    className={`ml-2 ${
                      healthStatus.avg_lcp <= 2500 ? 'text-green-600' :
                      healthStatus.avg_lcp <= 4000 ? 'text-orange-600' :
                      'text-red-600'
                    }`}
                  >
                    {healthStatus.avg_lcp <= 2500 ? 'Good' :
                     healthStatus.avg_lcp <= 4000 ? 'Needs Work' : 'Poor'}
                  </Badge>
                </p>
              </div>
              
              <div className="space-y-1">
                <span className="text-muted-foreground">Last Check</span>
                <p className="text-lg font-semibold">
                  {lastCheck?.toLocaleTimeString() || 'Never'}
                </p>
              </div>
            </div>

            {/* Status Messages */}
            <div className="text-xs text-muted-foreground">
              {healthStatus.status === 'healthy' && (
                <p>✅ All systems operational. Analytics collection is working normally.</p>
              )}
              {healthStatus.status === 'warning' && (
                <p>⚠️ Minor issues detected. Error rate is elevated but within acceptable limits.</p>
              )}
              {healthStatus.status === 'critical' && (
                <p>🚨 Critical issues detected. High error rate may indicate problems with data collection.</p>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center text-muted-foreground">
            <p>Unable to fetch health status</p>
            <Button variant="outline" size="sm" onClick={checkHealth} className="mt-2">
              Retry
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default HealthCheck;