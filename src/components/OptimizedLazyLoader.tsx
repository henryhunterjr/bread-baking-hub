import { Suspense, lazy, useState, useRef, useEffect, ReactNode, ComponentType, ComponentProps, ReactElement } from 'react';
import { SkeletonGrid } from './SkeletonLoaders';

// Optimized lazy loading with better error boundaries and loading states
const createOptimizedLazy = <T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  fallback: ReactElement = <div className="animate-pulse bg-muted h-32 rounded" />
) => {
  const LazyComponent = lazy(importFn);
  
  return (props: ComponentProps<T>) => (
    <Suspense fallback={fallback}>
      <LazyComponent {...props} />
    </Suspense>
  );
};

// Removed LazyCharts - recharts is now directly imported where needed
// Vite handles code splitting automatically

export const LazyMarkdownEditor = createOptimizedLazy(
  () => import('@uiw/react-md-editor'),
  <div className="h-32 bg-muted rounded animate-pulse" />
);

export const LazyFramerMotion = createOptimizedLazy(
  () => import('framer-motion').then(m => ({ default: m.motion.div })),
  <div className="animate-pulse bg-muted h-48 rounded" />
);

// Utility functions for lazy loading non-React libraries
export const loadImageCompression = () => import('browser-image-compression');
export const loadPDFGenerator = () => import('html2pdf.js');

// Enhanced lazy loading with intersection observer
export const IntersectionLazyLoader = ({ 
  children, 
  fallback = <div className="h-32 bg-muted animate-pulse rounded" />,
  rootMargin = "50px"
}: {
  children: ReactNode;
  fallback?: ReactNode;
  rootMargin?: string;
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [rootMargin]);

  return (
    <div ref={ref}>
      {isVisible ? children : fallback}
    </div>
  );
};

export default createOptimizedLazy;