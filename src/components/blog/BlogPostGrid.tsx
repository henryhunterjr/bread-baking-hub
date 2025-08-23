import React, { Suspense } from 'react';
import { BlogPost } from '@/utils/blogFetcher';
import BlogSkeletonGrid from './BlogSkeletonGrid';

interface BlogPostGridProps {
  posts: BlogPost[];
  loading: boolean;
  skeletonCount?: number;
  selectedCategory?: number;
  categories?: Array<{ id: number; name: string }>;
  enableSEO?: boolean;
}

// Lazy load BlogCard outside render loop
const BlogCard = React.lazy(() => import('./BlogCard'));

const BlogPostGrid = ({ posts, loading, skeletonCount = 6, selectedCategory, categories = [], enableSEO = false }: BlogPostGridProps) => {

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {loading ? (
        <BlogSkeletonGrid count={skeletonCount} />
      ) : posts.length === 0 ? (
        <div className="col-span-full text-center py-12">
          <p className="text-muted-foreground text-lg">
            No blog posts found{selectedCategory ? ' in this category' : ''}.
          </p>
        </div>
      ) : (
        <Suspense fallback={<BlogSkeletonGrid count={posts.length} />}>
          {posts.map((post) => (
            <BlogCard 
              key={post.id} 
              post={post} 
              categories={categories}
              enableSEO={enableSEO}
            />
          ))}
        </Suspense>
      )}
    </div>
  );
};

export default BlogPostGrid;