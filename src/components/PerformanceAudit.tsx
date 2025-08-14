import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Zap, Clock, Eye, Smartphone, Wifi, Image, FileText } from 'lucide-react';

interface PerformanceMetric {
  name: string;
  value: number;
  threshold: number;
  unit: string;
  status: 'good' | 'needs-improvement' | 'poor';
  description: string;
}

interface ResourceTiming {
  name: string;
  duration: number;
  size: number;
  type: 'script' | 'stylesheet' | 'image' | 'document' | 'fetch';
}

export const PerformanceAudit = () => {
  const [metrics, setMetrics] = useState<PerformanceMetric[]>([]);
  const [resources, setResources] = useState<ResourceTiming[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [overallScore, setOverallScore] = useState(0);

  const runPerformanceAudit = async () => {
    setIsAnalyzing(true);

    // Core Web Vitals and Performance Metrics
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    const paint = performance.getEntriesByType('paint');
    
    const lcpEntry = performance.getEntriesByType('largest-contentful-paint')[0];
    const fidEntry = performance.getEntriesByType('first-input')[0];
    const clsEntries = performance.getEntriesByType('layout-shift');

    const newMetrics: PerformanceMetric[] = [
      {
        name: 'First Contentful Paint (FCP)',
        value: paint.find(entry => entry.name === 'first-contentful-paint')?.startTime || 0,
        threshold: 1800,
        unit: 'ms',
        status: 'good',
        description: 'Time until first text or image is painted'
      },
      {
        name: 'Largest Contentful Paint (LCP)',
        value: lcpEntry?.startTime || 0,
        threshold: 2500,
        unit: 'ms',
        status: 'good',
        description: 'Time until largest content element is painted'
      },
      {
        name: 'Time to Interactive (TTI)',
        value: navigation.domContentLoadedEventEnd - navigation.fetchStart,
        threshold: 3800,
        unit: 'ms',
        status: 'good',
        description: 'Time until page is fully interactive'
      },
      {
        name: 'Total Blocking Time (TBT)',
        value: navigation.loadEventEnd - navigation.domContentLoadedEventEnd,
        threshold: 300,
        unit: 'ms',
        status: 'good',
        description: 'Sum of blocking time for all long tasks'
      },
      {
        name: 'Cumulative Layout Shift (CLS)',
        value: clsEntries.reduce((sum, entry: any) => sum + (entry.value || 0), 0),
        threshold: 0.1,
        unit: '',
        status: 'good',
        description: 'Visual stability during page load'
      }
    ];

    // Calculate status based on thresholds
    newMetrics.forEach(metric => {
      if (metric.name === 'Cumulative Layout Shift (CLS)') {
        if (metric.value <= 0.1) metric.status = 'good';
        else if (metric.value <= 0.25) metric.status = 'needs-improvement';
        else metric.status = 'poor';
      } else {
        if (metric.value <= metric.threshold) metric.status = 'good';
        else if (metric.value <= metric.threshold * 1.5) metric.status = 'needs-improvement';
        else metric.status = 'poor';
      }
    });

    // Resource timing analysis
    const resourceEntries = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
    const resourceData: ResourceTiming[] = resourceEntries.map(entry => ({
      name: entry.name.split('/').pop() || entry.name,
      duration: entry.duration,
      size: entry.transferSize || 0,
      type: getResourceType(entry.name)
    })).sort((a, b) => b.duration - a.duration).slice(0, 20);

    setMetrics(newMetrics);
    setResources(resourceData);

    // Calculate overall score (0-100)
    const goodMetrics = newMetrics.filter(m => m.status === 'good').length;
    const score = Math.round((goodMetrics / newMetrics.length) * 100);
    setOverallScore(score);

    setIsAnalyzing(false);
  };

  const getResourceType = (url: string): ResourceTiming['type'] => {
    if (url.includes('.js')) return 'script';
    if (url.includes('.css')) return 'stylesheet';
    if (url.match(/\.(png|jpg|jpeg|gif|svg|webp)$/)) return 'image';
    if (url.includes('api') || url.includes('fetch')) return 'fetch';
    return 'document';
  };

  const getStatusColor = (status: PerformanceMetric['status']) => {
    switch (status) {
      case 'good': return 'text-green-600 bg-green-100';
      case 'needs-improvement': return 'text-yellow-600 bg-yellow-100';
      case 'poor': return 'text-red-600 bg-red-100';
    }
  };

  const getResourceIcon = (type: ResourceTiming['type']) => {
    switch (type) {
      case 'script': return <FileText className="h-4 w-4" />;
      case 'stylesheet': return <FileText className="h-4 w-4" />;
      case 'image': return <Image className="h-4 w-4" />;
      case 'fetch': return <Wifi className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  useEffect(() => {
    // Auto-run on component mount
    const timer = setTimeout(() => {
      if (metrics.length === 0) {
        runPerformanceAudit();
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Performance Audit
            </CardTitle>
            <Button 
              onClick={runPerformanceAudit} 
              disabled={isAnalyzing}
              variant="outline"
            >
              {isAnalyzing ? 'Analyzing...' : 'Refresh Analysis'}
            </Button>
          </div>
          
          {overallScore > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span>Performance Score</span>
                <span className={`text-2xl font-bold ${getScoreColor(overallScore)}`}>
                  {overallScore}
                </span>
              </div>
              <Progress value={overallScore} className="h-2" />
            </div>
          )}
        </CardHeader>
      </Card>

      {metrics.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Core Web Vitals
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {metrics.map(metric => (
              <div key={metric.name} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="font-medium">{metric.name}</div>
                  <div className="text-sm text-muted-foreground">{metric.description}</div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="font-mono text-lg">
                      {metric.value.toFixed(metric.unit === 'ms' ? 0 : 3)}{metric.unit}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Target: {metric.threshold}{metric.unit}
                    </div>
                  </div>
                  <Badge className={getStatusColor(metric.status)}>
                    {metric.status.replace('-', ' ')}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {resources.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Resource Loading Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {resources.map((resource, index) => (
                <div key={index} className="flex items-center gap-3 p-2 rounded border">
                  {getResourceIcon(resource.type)}
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-mono truncate">{resource.name}</div>
                    <div className="text-xs text-muted-foreground capitalize">{resource.type}</div>
                  </div>
                  <div className="text-right text-sm">
                    <div>{Math.round(resource.duration)}ms</div>
                    <div className="text-xs text-muted-foreground">
                      {formatBytes(resource.size)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-700">
            <Smartphone className="h-5 w-5" />
            Mobile Performance Tips
          </CardTitle>
        </CardHeader>
        <CardContent className="text-blue-700 space-y-2">
          <div className="text-sm">
            • Test on real mobile devices with throttled network (3G/4G)
          </div>
          <div className="text-sm">
            • Optimize images with WebP format and proper sizing
          </div>
          <div className="text-sm">
            • Implement lazy loading for below-the-fold content
          </div>
          <div className="text-sm">
            • Use code splitting to reduce initial bundle size
          </div>
          <div className="text-sm">
            • Enable compression (gzip/brotli) on server
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PerformanceAudit;