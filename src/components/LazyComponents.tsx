// Phase 2: Lazy-loaded components for better performance
import React, { Suspense } from 'react';
import { createLazyComponent } from '@/utils/scriptOptimizer';

// Lazy load heavy components that exist in the project
export const LazyMarkdownEditor = createLazyComponent(
  () => import('@uiw/react-md-editor').then(module => ({ default: module.default }))
);

// Example lazy components for future use
export const LazyCharts = createLazyComponent(
  () => import('recharts').then(module => ({ default: module.ResponsiveContainer }))
);

// Loading fallback components
export const ComponentLoader = ({ className = '' }: { className?: string }) => (
  <div className={`animate-pulse bg-muted rounded-lg ${className}`}>
    <div className="h-8 bg-muted-foreground/20 rounded mb-4"></div>
    <div className="space-y-2">
      <div className="h-4 bg-muted-foreground/20 rounded w-3/4"></div>
      <div className="h-4 bg-muted-foreground/20 rounded w-1/2"></div>
    </div>
  </div>
);

export const ChartLoader = () => (
  <div className="animate-pulse">
    <div className="h-64 bg-muted rounded-lg mb-4"></div>
    <div className="h-4 bg-muted-foreground/20 rounded w-1/3"></div>
  </div>
);

// Wrapper for lazy components with proper fallbacks
export const LazyComponentWrapper = ({ 
  children, 
  fallback, 
  className = '' 
}: {
  children: React.ReactNode;
  fallback?: React.ComponentType;
  className?: string;
}) => {
  const FallbackComponent = fallback || ComponentLoader;
  
  return (
    <Suspense fallback={<FallbackComponent className={className} />}>
      {children}
    </Suspense>
  );
};