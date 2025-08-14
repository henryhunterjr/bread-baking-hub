import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Bug, Zap, Shield, Download } from 'lucide-react';

interface AppErrorEvent {
  id: string;
  type: 'javascript' | 'network' | 'performance' | 'security';
  message: string;
  timestamp: Date;
  severity: 'low' | 'medium' | 'high' | 'critical';
  url?: string;
  stack?: string;
  userAgent: string;
}

export const ErrorMonitoring = () => {
  const [errors, setErrors] = useState<AppErrorEvent[]>([]);
  const [isMonitoring, setIsMonitoring] = useState(false);

  useEffect(() => {
    if (!isMonitoring) return;

    // Global error handler
    const handleError = (event: ErrorEvent) => {
      const errorEvent: AppErrorEvent = {
        id: crypto.randomUUID(),
        type: 'javascript',
        message: event.message || 'Unknown error',
        timestamp: new Date(),
        severity: 'high',
        url: event.filename,
        stack: event.error?.stack,
        userAgent: navigator.userAgent
      };
      
      setErrors(prev => [errorEvent, ...prev].slice(0, 50));
      
      // Report to console in development
      console.error('Error captured:', errorEvent);
    };

    // Promise rejection handler
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const errorEvent: AppErrorEvent = {
        id: crypto.randomUUID(),
        type: 'javascript',
        message: `Unhandled promise rejection: ${event.reason}`,
        timestamp: new Date(),
        severity: 'critical',
        userAgent: navigator.userAgent
      };
      
      setErrors(prev => [errorEvent, ...prev].slice(0, 50));
      console.error('Promise rejection captured:', errorEvent);
    };

    // Network error monitoring
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      try {
        const response = await originalFetch(...args);
        
        if (!response.ok) {
          const errorEvent: AppErrorEvent = {
            id: crypto.randomUUID(),
            type: 'network',
            message: `HTTP ${response.status}: ${response.statusText}`,
            timestamp: new Date(),
            severity: response.status >= 500 ? 'critical' : 'medium',
            url: args[0]?.toString(),
            userAgent: navigator.userAgent
          };
          
          setErrors(prev => [errorEvent, ...prev].slice(0, 50));
        }
        
        return response;
      } catch (error) {
        const errorEvent: AppErrorEvent = {
          id: crypto.randomUUID(),
          type: 'network',
          message: `Network error: ${error instanceof Error ? error.message : 'Unknown'}`,
          timestamp: new Date(),
          severity: 'high',
          url: args[0]?.toString(),
          userAgent: navigator.userAgent
        };
        
        setErrors(prev => [errorEvent, ...prev].slice(0, 50));
        throw error;
      }
    };

    // Performance monitoring
    const checkPerformance = () => {
      if (window.performance) {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        
        if (navigation) {
          const loadTime = navigation.loadEventEnd - navigation.loadEventStart;
          
          if (loadTime > 3000) {
            const errorEvent: AppErrorEvent = {
              id: crypto.randomUUID(),
              type: 'performance',
              message: `Slow page load: ${Math.round(loadTime)}ms`,
              timestamp: new Date(),
              severity: loadTime > 5000 ? 'high' : 'medium',
              userAgent: navigator.userAgent
            };
            
            setErrors(prev => [errorEvent, ...prev].slice(0, 50));
          }
        }
      }
    };

    // Security monitoring
    const checkSecurity = () => {
      // Check for mixed content
      if (location.protocol === 'https:' && document.querySelector('img[src^="http:"], script[src^="http:"], link[href^="http:"]')) {
        const errorEvent: AppErrorEvent = {
          id: crypto.randomUUID(),
          type: 'security',
          message: 'Mixed content detected (HTTP resources on HTTPS page)',
          timestamp: new Date(),
          severity: 'medium',
          userAgent: navigator.userAgent
        };
        
        setErrors(prev => [errorEvent, ...prev].slice(0, 50));
      }
    };

    // Attach listeners
    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    // Run initial checks
    setTimeout(checkPerformance, 1000);
    setTimeout(checkSecurity, 2000);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      window.fetch = originalFetch;
    };
  }, [isMonitoring]);

  const toggleMonitoring = () => {
    setIsMonitoring(!isMonitoring);
    if (!isMonitoring) {
      setErrors([]);
    }
  };

  const clearErrors = () => {
    setErrors([]);
  };

  const exportErrors = () => {
    const data = JSON.stringify(errors, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `error-report-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 text-red-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'javascript':
        return <Bug className="w-4 h-4" />;
      case 'network':
        return <Zap className="w-4 h-4" />;
      case 'performance':
        return <AlertTriangle className="w-4 h-4" />;
      case 'security':
        return <Shield className="w-4 h-4" />;
      default:
        return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const errorStats = {
    total: errors.length,
    critical: errors.filter(e => e.severity === 'critical').length,
    high: errors.filter(e => e.severity === 'high').length,
    medium: errors.filter(e => e.severity === 'medium').length,
    low: errors.filter(e => e.severity === 'low').length
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bug className="w-5 h-5" />
            <CardTitle>Error Monitoring</CardTitle>
            <Badge variant={isMonitoring ? "default" : "secondary"}>
              {isMonitoring ? 'Active' : 'Inactive'}
            </Badge>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={toggleMonitoring}
              variant={isMonitoring ? "destructive" : "default"}
              size="sm"
            >
              {isMonitoring ? 'Stop Monitoring' : 'Start Monitoring'}
            </Button>
            {errors.length > 0 && (
              <>
                <Button onClick={clearErrors} variant="outline" size="sm">
                  Clear
                </Button>
                <Button onClick={exportErrors} variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-1" />
                  Export
                </Button>
              </>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Statistics */}
        <div className="grid grid-cols-5 gap-4">
          <div className="text-center p-3 border rounded">
            <div className="text-2xl font-bold">{errorStats.total}</div>
            <div className="text-sm text-muted-foreground">Total</div>
          </div>
          <div className="text-center p-3 border rounded">
            <div className="text-2xl font-bold text-red-600">{errorStats.critical}</div>
            <div className="text-sm text-muted-foreground">Critical</div>
          </div>
          <div className="text-center p-3 border rounded">
            <div className="text-2xl font-bold text-orange-600">{errorStats.high}</div>
            <div className="text-sm text-muted-foreground">High</div>
          </div>
          <div className="text-center p-3 border rounded">
            <div className="text-2xl font-bold text-yellow-600">{errorStats.medium}</div>
            <div className="text-sm text-muted-foreground">Medium</div>
          </div>
          <div className="text-center p-3 border rounded">
            <div className="text-2xl font-bold text-blue-600">{errorStats.low}</div>
            <div className="text-sm text-muted-foreground">Low</div>
          </div>
        </div>

        {/* Error List */}
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {errors.map((error) => (
            <div key={error.id} className="flex items-start gap-3 p-3 border rounded-lg">
              <div className="mt-0.5">
                {getTypeIcon(error.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Badge className={getSeverityColor(error.severity)}>
                    {error.severity}
                  </Badge>
                  <Badge variant="outline">
                    {error.type}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {error.timestamp.toLocaleTimeString()}
                  </span>
                </div>
                <div className="font-medium mb-1">{error.message}</div>
                {error.url && (
                  <div className="text-sm text-muted-foreground mb-1">
                    URL: {error.url}
                  </div>
                )}
                {error.stack && (
                  <details className="text-xs text-muted-foreground">
                    <summary className="cursor-pointer">Stack trace</summary>
                    <pre className="mt-2 whitespace-pre-wrap">{error.stack}</pre>
                  </details>
                )}
              </div>
            </div>
          ))}
        </div>

        {!isMonitoring && (
          <div className="text-center py-8 text-muted-foreground">
            Click "Start Monitoring" to begin tracking errors in production
          </div>
        )}

        {isMonitoring && errors.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No errors detected. Monitoring is active...
          </div>
        )}
      </CardContent>
    </Card>
  );
};