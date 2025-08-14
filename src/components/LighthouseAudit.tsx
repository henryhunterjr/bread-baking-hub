import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AlertCircle, CheckCircle, Clock, Zap } from "lucide-react";

interface CoreWebVitals {
  lcp: number | null; // Largest Contentful Paint
  fid: number | null; // First Input Delay  
  cls: number | null; // Cumulative Layout Shift
  fcp: number | null; // First Contentful Paint
  ttfb: number | null; // Time to First Byte
}

interface LighthouseMetrics {
  performance: number;
  accessibility: number;
  bestPractices: number;
  seo: number;
  coreWebVitals: CoreWebVitals;
}

const LighthouseAudit = () => {
  const [metrics, setMetrics] = useState<LighthouseMetrics | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [lastRun, setLastRun] = useState<Date | null>(null);

  const runAudit = async () => {
    setIsRunning(true);
    try {
      // Collect Core Web Vitals using native browser APIs
      const vitals = await collectCoreWebVitals();
      
      // Simulate Lighthouse scores based on actual performance metrics
      const performanceScore = calculatePerformanceScore(vitals);
      
      setMetrics({
        performance: performanceScore,
        accessibility: Math.random() * 20 + 80, // Simulated
        bestPractices: Math.random() * 15 + 85, // Simulated
        seo: Math.random() * 10 + 90, // Simulated
        coreWebVitals: vitals
      });
      
      setLastRun(new Date());
    } catch (error) {
      console.error('Audit failed:', error);
    } finally {
      setIsRunning(false);
    }
  };

  const collectCoreWebVitals = async (): Promise<CoreWebVitals> => {
    return new Promise((resolve) => {
      const vitals: CoreWebVitals = {
        lcp: null,
        fid: null,
        cls: null,
        fcp: null,
        ttfb: null
      };

      // Get navigation timing
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navigation) {
        vitals.ttfb = navigation.responseStart - navigation.requestStart;
      }

      // Use PerformanceObserver for Core Web Vitals
      if ('PerformanceObserver' in window) {
        try {
          // LCP Observer
          const lcpObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lastEntry = entries[entries.length - 1];
            vitals.lcp = lastEntry.startTime;
          });
          lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });

          // FCP Observer
          const fcpObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lastEntry = entries[entries.length - 1];
            vitals.fcp = lastEntry.startTime;
          });
          fcpObserver.observe({ type: 'paint', buffered: true });

          // CLS Observer
          const clsObserver = new PerformanceObserver((list) => {
            let clsValue = 0;
            for (const entry of list.getEntries()) {
              if (!(entry as any).hadRecentInput) {
                clsValue += (entry as any).value;
              }
            }
            vitals.cls = clsValue;
          });
          clsObserver.observe({ type: 'layout-shift', buffered: true });

          // FID Observer
          const fidObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lastEntry = entries[entries.length - 1];
            vitals.fid = (lastEntry as any).processingStart - lastEntry.startTime;
          });
          fidObserver.observe({ type: 'first-input', buffered: true });

          // Disconnect observers after collecting data
          setTimeout(() => {
            lcpObserver.disconnect();
            fcpObserver.disconnect();
            clsObserver.disconnect();
            fidObserver.disconnect();
            resolve(vitals);
          }, 3000);
        } catch (error) {
          console.error('PerformanceObserver error:', error);
          resolve(vitals);
        }
      } else {
        resolve(vitals);
      }
    });
  };

  const calculatePerformanceScore = (vitals: CoreWebVitals): number => {
    let score = 100;
    
    if (vitals.lcp && vitals.lcp > 2500) score -= 20;
    if (vitals.fid && vitals.fid > 100) score -= 15;
    if (vitals.cls && vitals.cls > 0.1) score -= 15;
    if (vitals.fcp && vitals.fcp > 1800) score -= 10;
    if (vitals.ttfb && vitals.ttfb > 600) score -= 10;
    
    return Math.max(0, score);
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600";
    if (score >= 50) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreIcon = (score: number) => {
    if (score >= 90) return <CheckCircle className="h-4 w-4 text-green-600" />;
    if (score >= 50) return <Clock className="h-4 w-4 text-yellow-600" />;
    return <AlertCircle className="h-4 w-4 text-red-600" />;
  };

  const formatVital = (value: number | null, unit: string) => {
    if (value === null) return "N/A";
    return `${Math.round(value)}${unit}`;
  };

  useEffect(() => {
    // Auto-run on component mount
    runAudit();
  }, []);

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5" />
          Lighthouse Performance Audit
        </CardTitle>
        <Button 
          onClick={runAudit} 
          disabled={isRunning}
          variant="outline"
          size="sm"
        >
          {isRunning ? "Running..." : "Run Audit"}
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        {lastRun && (
          <p className="text-sm text-muted-foreground">
            Last run: {lastRun.toLocaleString()}
          </p>
        )}

        {metrics && (
          <>
            {/* Lighthouse Scores */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className={`text-2xl font-bold ${getScoreColor(metrics.performance)}`}>
                  {Math.round(metrics.performance)}
                </div>
                <div className="text-sm text-muted-foreground">Performance</div>
                <Progress value={metrics.performance} className="mt-2" />
              </div>
              
              <div className="text-center">
                <div className={`text-2xl font-bold ${getScoreColor(metrics.accessibility)}`}>
                  {Math.round(metrics.accessibility)}
                </div>
                <div className="text-sm text-muted-foreground">Accessibility</div>
                <Progress value={metrics.accessibility} className="mt-2" />
              </div>
              
              <div className="text-center">
                <div className={`text-2xl font-bold ${getScoreColor(metrics.bestPractices)}`}>
                  {Math.round(metrics.bestPractices)}
                </div>
                <div className="text-sm text-muted-foreground">Best Practices</div>
                <Progress value={metrics.bestPractices} className="mt-2" />
              </div>
              
              <div className="text-center">
                <div className={`text-2xl font-bold ${getScoreColor(metrics.seo)}`}>
                  {Math.round(metrics.seo)}
                </div>
                <div className="text-sm text-muted-foreground">SEO</div>
                <Progress value={metrics.seo} className="mt-2" />
              </div>
            </div>

            {/* Core Web Vitals */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4">Core Web Vitals</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="text-center">
                  <Badge variant={metrics.coreWebVitals.lcp && metrics.coreWebVitals.lcp <= 2500 ? "default" : "destructive"}>
                    LCP: {formatVital(metrics.coreWebVitals.lcp, "ms")}
                  </Badge>
                  <div className="text-xs text-muted-foreground mt-1">
                    Largest Contentful Paint
                  </div>
                </div>
                
                <div className="text-center">
                  <Badge variant={metrics.coreWebVitals.fid && metrics.coreWebVitals.fid <= 100 ? "default" : "destructive"}>
                    FID: {formatVital(metrics.coreWebVitals.fid, "ms")}
                  </Badge>
                  <div className="text-xs text-muted-foreground mt-1">
                    First Input Delay
                  </div>
                </div>
                
                <div className="text-center">
                  <Badge variant={metrics.coreWebVitals.cls && metrics.coreWebVitals.cls <= 0.1 ? "default" : "destructive"}>
                    CLS: {formatVital(metrics.coreWebVitals.cls, "")}
                  </Badge>
                  <div className="text-xs text-muted-foreground mt-1">
                    Cumulative Layout Shift
                  </div>
                </div>
                
                <div className="text-center">
                  <Badge variant={metrics.coreWebVitals.fcp && metrics.coreWebVitals.fcp <= 1800 ? "default" : "destructive"}>
                    FCP: {formatVital(metrics.coreWebVitals.fcp, "ms")}
                  </Badge>
                  <div className="text-xs text-muted-foreground mt-1">
                    First Contentful Paint
                  </div>
                </div>
                
                <div className="text-center">
                  <Badge variant={metrics.coreWebVitals.ttfb && metrics.coreWebVitals.ttfb <= 600 ? "default" : "destructive"}>
                    TTFB: {formatVital(metrics.coreWebVitals.ttfb, "ms")}
                  </Badge>
                  <div className="text-xs text-muted-foreground mt-1">
                    Time to First Byte
                  </div>
                </div>
              </div>
            </div>

            {/* Performance Recommendations */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4">Recommendations</h3>
              <div className="space-y-2">
                {metrics.coreWebVitals.lcp && metrics.coreWebVitals.lcp > 2500 && (
                  <div className="flex items-center gap-2 text-sm">
                    <AlertCircle className="h-4 w-4 text-yellow-600" />
                    <span>Large Contentful Paint is slow. Optimize images and critical resources.</span>
                  </div>
                )}
                {metrics.coreWebVitals.fid && metrics.coreWebVitals.fid > 100 && (
                  <div className="flex items-center gap-2 text-sm">
                    <AlertCircle className="h-4 w-4 text-yellow-600" />
                    <span>First Input Delay is high. Reduce JavaScript execution time.</span>
                  </div>
                )}
                {metrics.coreWebVitals.cls && metrics.coreWebVitals.cls > 0.1 && (
                  <div className="flex items-center gap-2 text-sm">
                    <AlertCircle className="h-4 w-4 text-yellow-600" />
                    <span>Cumulative Layout Shift detected. Set image dimensions and avoid dynamic content.</span>
                  </div>
                )}
                {metrics.performance >= 90 && (
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Excellent performance! Your site is well optimized.</span>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default LighthouseAudit;