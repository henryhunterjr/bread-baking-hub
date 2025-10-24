import React, { Suspense } from 'react';

// Code-split heavy components for better performance
export const LazyCarousel = React.lazy(() => 
  import('@/components/ui/carousel').then(m => ({ default: m.Carousel }))
);

// Removed LazyChart - recharts is now directly imported where needed
// Vite handles code splitting via vite.config.ts manualChunks

export const LazyTTS = React.lazy(() => 
  import('@/components/AIAssistantSidebar').then(m => ({ default: m.AIAssistantSidebar }))
);

export const LazyMarkdownEditor = React.lazy(() => 
  import('@uiw/react-md-editor').then(m => ({ default: m.default }))
);

// Remove LazyImageCompression as it's not a React component
export const loadImageCompression = () => import('browser-image-compression');

// Performance wrapper for lazy components
interface LazyWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const LazyWrapper = ({ children, fallback }: LazyWrapperProps) => {
  const defaultFallback = React.createElement('div', {
    className: 'animate-pulse bg-muted h-32 rounded'
  });
  
  return React.createElement(Suspense, {
    fallback: fallback || defaultFallback
  }, children);
};

// Route-specific lazy loading configuration
export const routeComponentMap: Record<string, { heavy: string[]; critical: string[] }> = {
  '/': {
    heavy: [],
    critical: ['Hero', 'Navigation']
  },
  '/recipes': {
    heavy: ['Carousel', 'ImageGallery'],
    critical: ['RecipeGrid', 'SearchBar']
  },
  '/blog': {
    heavy: ['Chart', 'ShareButtons'],
    critical: ['PostList', 'CategoryFilter']
  },
  '/tools': {
    heavy: ['Calculator', 'ImageCompression'],
    critical: ['ToolsList']
  }
};

// Progressive loading utility
export const useProgressiveLoading = (route: string) => {
  const [loadedComponents, setLoadedComponents] = React.useState<string[]>([]);
  
  React.useEffect(() => {
    const routeConfig = routeComponentMap[route as keyof typeof routeComponentMap];
    if (!routeConfig) return;

    // Load critical components immediately
    setLoadedComponents(routeConfig.critical);

    // Load heavy components after a delay
    const timer = setTimeout(() => {
      setLoadedComponents(prev => [...prev, ...routeConfig.heavy]);
    }, 100);

    return () => clearTimeout(timer);
  }, [route]);

  return loadedComponents;
};