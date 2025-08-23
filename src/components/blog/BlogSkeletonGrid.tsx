import BlogPostSkeleton from './BlogPostSkeleton';

interface BlogSkeletonGridProps {
  count?: number;
}

const BlogSkeletonGrid = ({ count = 9 }: BlogSkeletonGridProps) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
    {Array.from({ length: count }).map((_, index) => (
      <BlogPostSkeleton key={index} />
    ))}
  </div>
);

export default BlogSkeletonGrid;