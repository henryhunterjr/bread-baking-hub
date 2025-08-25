import { useState, useEffect, useRef, useCallback } from 'react';
import { BlogPost, fetchBlogPosts } from '@/utils/blogFetcher';
import BlogCard from '@/components/blog/BlogCard';
import { Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BlogFeedProps {
  selectedCategory?: number;
  searchQuery?: string;
  selectedTags?: string[];
}

const BlogFeed = ({ selectedCategory, searchQuery, selectedTags = [] }: BlogFeedProps) => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  
  const abortControllerRef = useRef<AbortController | null>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const isInitialLoad = useRef(true);

  // Filter posts by tags locally
  const filteredPosts = selectedTags.length === 0 
    ? posts 
    : posts.filter(post => 
        selectedTags.every(tag => post.tags.includes(tag))
      );

  // Reset when filters change
  const resetFeed = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setPosts([]);
    setCurrentPage(1);
    setHasMore(true);
    setError(null);
    isInitialLoad.current = true;
  }, []);

  // Load posts function
  const loadPosts = useCallback(async (page: number, isLoadingMore = false) => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    
    try {
      if (isLoadingMore) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }
      
      setError(null);

      const response = await fetchBlogPosts(
        page,
        selectedCategory,
        9,
        searchQuery
      );

      if (abortControllerRef.current.signal.aborted) return;

      if (page === 1) {
        setPosts(response.posts);
      } else {
        setPosts(prevPosts => {
          // Avoid duplicates
          const existingIds = new Set(prevPosts.map(post => post.id));
          const newPosts = response.posts.filter(post => !existingIds.has(post.id));
          return [...prevPosts, ...newPosts];
        });
      }

      setHasMore(page < response.totalPages);
      setCurrentPage(page);
      
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') return;
      
      console.error('Failed to load posts:', err);
      setError('Failed to load posts. Please try again.');
    } finally {
      setLoading(false);
      setLoadingMore(false);
      abortControllerRef.current = null;
    }
  }, [selectedCategory, searchQuery]);

  // Load more posts
  const loadMore = useCallback(() => {
    if (!loadingMore && !loading && hasMore) {
      loadPosts(currentPage + 1, true);
    }
  }, [loadPosts, loadingMore, loading, hasMore, currentPage]);

  // Setup intersection observer
  useEffect(() => {
    if (!sentinelRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && hasMore && !loading && !loadingMore) {
          loadMore();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px'
      }
    );

    const currentSentinel = sentinelRef.current;
    observer.observe(currentSentinel);
    observerRef.current = observer;

    return () => {
      observer.disconnect();
    };
  }, [hasMore, loading, loadingMore, loadMore]);

  // Initial load and filter changes
  useEffect(() => {
    resetFeed();
  }, [selectedCategory, searchQuery, resetFeed]);

  useEffect(() => {
    if (isInitialLoad.current) {
      loadPosts(1);
      isInitialLoad.current = false;
    }
  }, [loadPosts]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  // Error state
  if (error && posts.length === 0) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-lg text-muted-foreground mb-4">{error}</p>
        <Button onClick={() => loadPosts(1)} variant="outline">
          Try Again
        </Button>
      </div>
    );
  }

  // Loading state
  if (loading && posts.length === 0) {
    return (
      <div className="text-center py-12">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
        <p className="text-muted-foreground">Loading blog posts...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPosts.map((post) => (
          <BlogCard 
            key={post.id} 
            post={post} 
            enableSEO={false}
          />
        ))}
      </div>

      {/* Loading More Indicator */}
      {loadingMore && (
        <div className="text-center py-8">
          <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">Loading more posts...</p>
        </div>
      )}

      {/* Error during load more */}
      {error && posts.length > 0 && (
        <div className="text-center py-8">
          <p className="text-sm text-red-500 mb-2">{error}</p>
          <Button 
            onClick={() => loadPosts(currentPage + 1, true)} 
            variant="outline" 
            size="sm"
          >
            Retry
          </Button>
        </div>
      )}

      {/* Intersection Observer Sentinel */}
      {hasMore && !error && (
        <div ref={sentinelRef} className="h-4" />
      )}

      {/* End Message */}
      {!hasMore && !loading && filteredPosts.length > 0 && (
        <div className="text-center py-8 border-t">
          <p className="text-muted-foreground">
            You've reached the end of our blog posts.
          </p>
        </div>
      )}

      {/* No Results */}
      {!loading && filteredPosts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground">
            No blog posts found{searchQuery ? ` for "${searchQuery}"` : ''}.
          </p>
        </div>
      )}
    </div>
  );
};

export default BlogFeed;