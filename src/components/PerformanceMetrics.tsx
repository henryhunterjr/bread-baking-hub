import { useEffect, useState } from 'react';

interface PerformanceMetrics {
  lcp: number | null;
  fid: number | null;
  cls: number | null;
  fcp: number | null;
  ttfb: number | null;
}

export const usePerformanceMetrics = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    lcp: null,
    fid: null,
    cls: null,
    fcp: null,
    ttfb: null
  });

  useEffect(() => {
    // Track LCP (Largest Contentful Paint)
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1] as any;
      setMetrics(prev => ({ ...prev, lcp: lastEntry.renderTime || lastEntry.loadTime }));
    });
    lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });

    // Track FCP (First Contentful Paint)
    const fcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const entry = entries[0] as any;
      setMetrics(prev => ({ ...prev, fcp: entry.startTime }));
    });
    fcpObserver.observe({ type: 'paint', buffered: true });

    // Track CLS (Cumulative Layout Shift)
    let clsValue = 0;
    const clsObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries() as any[]) {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
          setMetrics(prev => ({ ...prev, cls: clsValue }));
        }
      }
    });
    clsObserver.observe({ type: 'layout-shift', buffered: true });

    // Track TTFB (Time to First Byte)
    const navigationEntry = performance.getEntriesByType('navigation')[0] as any;
    if (navigationEntry) {
      const ttfb = navigationEntry.responseStart - navigationEntry.requestStart;
      setMetrics(prev => ({ ...prev, ttfb }));
    }

    return () => {
      lcpObserver.disconnect();
      fcpObserver.disconnect();
      clsObserver.disconnect();
    };
  }, []);

  return metrics;
};

// Component to display performance metrics in development
export const PerformanceDebugger = () => {
  const metrics = usePerformanceMetrics();
  const [showMetrics, setShowMetrics] = useState(false);

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setShowMetrics(!showMetrics)}
        className="bg-black/80 text-white p-2 rounded text-xs"
      >
        📊 Perf
      </button>
      
      {showMetrics && (
        <div className="absolute bottom-full right-0 mb-2 bg-black/90 text-white p-3 rounded text-xs min-w-[200px]">
          <div className="font-bold mb-2">Core Web Vitals</div>
          <div>LCP: {metrics.lcp ? `${metrics.lcp.toFixed(0)}ms` : 'Loading...'}</div>
          <div>FCP: {metrics.fcp ? `${metrics.fcp.toFixed(0)}ms` : 'Loading...'}</div>
          <div>CLS: {metrics.cls ? metrics.cls.toFixed(3) : 'Loading...'}</div>
          <div>TTFB: {metrics.ttfb ? `${metrics.ttfb.toFixed(0)}ms` : 'Loading...'}</div>
          <div className="mt-2 text-xs opacity-70">
            Targets: LCP &lt; 2500ms, CLS &lt; 0.1, TTFB &lt; 800ms
          </div>
        </div>
      )}
    </div>
  );
};