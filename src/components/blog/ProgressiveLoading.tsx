import { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { fetchBlogPosts, BlogPost, FetchPostsResponse } from '@/utils/blogFetcher';
import { Loader2 } from 'lucide-react';

interface ProgressiveLoadingProps {
  initialPosts: BlogPost[];
  initialPage: number;
  totalPages: number;
  selectedCategory?: number;
  searchQuery?: string;
  selectedTags?: string[];
  onPostsUpdate: (posts: BlogPost[]) => void;
  renderPosts: (posts: BlogPost[]) => React.ReactNode;
  className?: string;
}

const ProgressiveLoading = ({
  initialPosts,
  initialPage,
  totalPages,
  selectedCategory,
  searchQuery,
  selectedTags = [],
  onPostsUpdate,
  renderPosts,
  className
}: ProgressiveLoadingProps) => {
  const [allPosts, setAllPosts] = useState<BlogPost[]>(initialPosts);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(currentPage < totalPages);
  const [error, setError] = useState<string | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const isFirstRender = useRef(true);

  // Filter posts by tags locally
  const filteredPosts = selectedTags.length === 0 
    ? allPosts 
    : allPosts.filter(post => 
        selectedTags.every(tag => post.tags.includes(tag))
      );

  // Reset when filters change - don't restore scroll position for infinite scroll
  useEffect(() => {
    setAllPosts(initialPosts);
    setCurrentPage(initialPage);
    setHasMore(initialPage < totalPages);
    setError(null);
  }, [initialPosts, initialPage, totalPages, selectedCategory, searchQuery]);

  // Update parent with filtered posts (prevent first render flash)
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    onPostsUpdate(filteredPosts);
  }, [filteredPosts, onPostsUpdate]);

  const loadMorePosts = useCallback(async () => {
    if (isLoading || !hasMore) return;

    // Cancel previous request if still pending
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    abortControllerRef.current = new AbortController();
    setIsLoading(true);
    setError(null);

    try {
      const nextPage = currentPage + 1;
      const response: FetchPostsResponse = await fetchBlogPosts(
        nextPage, 
        selectedCategory, 
        9, 
        searchQuery
      );

      // Check if request was aborted
      if (abortControllerRef.current?.signal.aborted) {
        return;
      }

      if (response.posts.length > 0) {
        setAllPosts(prev => {
          // Avoid duplicates
          const existingIds = new Set(prev.map(post => post.id));
          const newPosts = response.posts.filter(post => !existingIds.has(post.id));
          return [...prev, ...newPosts];
        });
        setCurrentPage(nextPage);
        setHasMore(nextPage < response.totalPages);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        return; // Request was aborted, don't show error
      }
      console.error('Failed to load more posts:', error);
      setError('Failed to load more posts. Please try again.');
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  }, [currentPage, hasMore, isLoading, selectedCategory, searchQuery]);

  // Intersection Observer for infinite scroll (prevent multiple triggers)
  useEffect(() => {
    if (!loadMoreRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        // Add debouncing to prevent rapid triggers
        if (entry.isIntersecting && hasMore && !isLoading) {
          setTimeout(() => {
            if (hasMore && !isLoading) {
              loadMorePosts();
            }
          }, 100);
        }
      },
      {
        threshold: 0.1,
        rootMargin: '100px' // Smaller margin to prevent early triggers
      }
    );

    observer.observe(loadMoreRef.current);
    observerRef.current = observer;

    return () => {
      observer.disconnect();
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []); // Keep empty deps array for stable observer

  return (
    <div className={className}>
      {renderPosts(filteredPosts)}
      
      {/* Loading trigger element */}
      <div ref={loadMoreRef} className="mt-8">
        {hasMore && (
          <div className="text-center space-y-4">
            {isLoading ? (
              <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Loading more posts...</span>
              </div>
            ) : (
              <Button 
                onClick={loadMorePosts}
                variant="outline"
                size="lg"
                className="min-w-32"
              >
                Load More Posts
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Error state */}
      {error && (
        <div className="text-center mt-4">
          <p className="text-red-500 mb-2">{error}</p>
          <Button 
            onClick={loadMorePosts}
            variant="outline"
            size="sm"
          >
            Try Again
          </Button>
        </div>
      )}

      {/* End message */}
      {!hasMore && !isLoading && allPosts.length > initialPosts.length && (
        <div className="text-center mt-8 py-4 border-t">
          <p className="text-muted-foreground">
            You've reached the end of our blog posts.
          </p>
        </div>
      )}
    </div>
  );
};

export default ProgressiveLoading;