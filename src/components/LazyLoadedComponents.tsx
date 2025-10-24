// Phase 3: Lazy loaded components for better performance
import React, { Suspense } from 'react';
import { SkeletonGrid, SkeletonHero } from './SkeletonLoaders';

// Removed LazyCharts - recharts is now directly imported where needed to avoid circular dependencies

export const LazyMarkdownEditor = React.lazy(() => 
  import('@uiw/react-md-editor').then(module => ({ default: module.default }))
);

export const LazyFramerMotion = React.lazy(() =>
  import('framer-motion').then(module => ({ default: module.motion.div }))
);

// Placeholder lazy components for now
const PlaceholderComponent = ({ type }: { type: string }) => (
  <div className="p-8 text-center text-muted-foreground">
    {type} component placeholder - replace with actual component paths
  </div>
);

export const LazyRecipeGrid = React.lazy(() => 
  Promise.resolve({ default: () => <PlaceholderComponent type="Recipe Grid" /> })
);

export const LazyBlogGrid = React.lazy(() => 
  Promise.resolve({ default: () => <PlaceholderComponent type="Blog Grid" /> })
);

export const LazyBookShelf = React.lazy(() => 
  Promise.resolve({ default: () => <PlaceholderComponent type="Book Shelf" /> })
);

// Wrapper components with proper fallbacks
export const LazyRecipeGridWrapper = ({ ...props }) => (
  <Suspense fallback={<SkeletonGrid count={6} type="recipe" />}>
    <LazyRecipeGrid {...props} />
  </Suspense>
);

export const LazyBlogGridWrapper = ({ ...props }) => (
  <Suspense fallback={<SkeletonGrid count={6} type="blog" />}>
    <LazyBlogGrid {...props} />
  </Suspense>
);

export const LazyBookShelfWrapper = ({ ...props }) => (
  <Suspense fallback={<SkeletonGrid count={4} type="book" />}>
    <LazyBookShelf {...props} />
  </Suspense>
);

// Removed LazyChartsWrapper - no longer needed