// Phase 3: Skeleton components for perceived speed
import React from 'react';

export const SkeletonRecipeCard = () => (
  <div className="skeleton rounded-lg p-4 space-y-3">
    <div className="h-48 bg-muted rounded-lg animate-shimmer"></div>
    <div className="h-4 bg-muted rounded w-3/4 animate-shimmer"></div>
    <div className="h-3 bg-muted rounded w-1/2 animate-shimmer"></div>
    <div className="flex gap-2">
      <div className="h-6 bg-muted rounded-full w-16 animate-shimmer"></div>
      <div className="h-6 bg-muted rounded-full w-20 animate-shimmer"></div>
    </div>
  </div>
);

export const SkeletonBlogCard = () => (
  <div className="skeleton rounded-lg overflow-hidden">
    <div className="h-48 bg-muted animate-shimmer"></div>
    <div className="p-4 space-y-3">
      <div className="h-4 bg-muted rounded w-full animate-shimmer"></div>
      <div className="h-4 bg-muted rounded w-3/4 animate-shimmer"></div>
      <div className="h-3 bg-muted rounded w-1/2 animate-shimmer"></div>
    </div>
  </div>
);

export const SkeletonBookCard = () => (
  <div className="skeleton rounded-lg p-4 space-y-3">
    <div className="h-64 bg-muted rounded-lg animate-shimmer"></div>
    <div className="h-4 bg-muted rounded w-full animate-shimmer"></div>
    <div className="h-3 bg-muted rounded w-2/3 animate-shimmer"></div>
    <div className="h-8 bg-muted rounded w-24 animate-shimmer"></div>
  </div>
);

export const SkeletonHero = () => (
  <div className="skeleton h-96 bg-muted rounded-lg animate-shimmer"></div>
);

export const SkeletonGrid = ({ count = 6, type = 'recipe' }: { count?: number; type?: 'recipe' | 'blog' | 'book' }) => {
  const SkeletonComponent = type === 'recipe' ? SkeletonRecipeCard : 
                           type === 'blog' ? SkeletonBlogCard : SkeletonBookCard;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }, (_, i) => (
        <SkeletonComponent key={i} />
      ))}
    </div>
  );
};