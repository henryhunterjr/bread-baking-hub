import React, { Suspense, lazy } from 'react';

interface LazyComponentProps {
  component: React.ComponentType<any>;
  fallback?: React.ReactNode;
  [key: string]: any;
}

const LazyComponentLoader = ({ component: Component, fallback = null, ...props }: LazyComponentProps) => {
  return (
    <Suspense fallback={fallback}>
      <Component {...props} />
    </Suspense>
  );
};

// Lazy load heavy components
export const LazyAudioPlayerModal = lazy(() => import('./AudioPlayerModal'));
export const LazyVideoPlayerModal = lazy(() => import('./VideoPlayerModal'));
export const LazyBookPreviewModal = lazy(() => import('./BookPreviewModal'));
export const LazyAnalyticsDashboard = lazy(() => import('./AnalyticsDashboard'));
export const LazyBakersBench = lazy(() => import('./BakersBench'));

// Loading fallbacks
export const AudioPlayerFallback = () => (
  <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center">
    <div className="bg-background rounded-lg p-6">
      <div className="animate-pulse">Loading audio player...</div>
    </div>
  </div>
);

export const VideoPlayerFallback = () => (
  <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center">
    <div className="bg-background rounded-lg p-6">
      <div className="animate-pulse">Loading video player...</div>
    </div>
  </div>
);

export const BookPreviewFallback = () => (
  <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center">
    <div className="bg-background rounded-lg p-6 max-w-md">
      <div className="animate-pulse">Loading book preview...</div>
    </div>
  </div>
);

export default LazyComponentLoader;