import { Skeleton } from '@/components/ui/skeleton';

const BlogPostSkeleton = () => (
  <div className="bg-card rounded-xl overflow-hidden shadow-stone">
    <Skeleton className="w-full h-48" />
    <div className="p-6 space-y-4">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-6 w-full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-32" />
    </div>
  </div>
);

export default BlogPostSkeleton;