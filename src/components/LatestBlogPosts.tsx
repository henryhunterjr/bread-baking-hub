import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { fetchBlogPosts, fetchCategories, BlogPost, WordPressCategory, FetchPostsResponse } from '@/utils/blogFetcher';
import NewsletterSignup from './NewsletterSignup';
import CategoryFilter from './blog/CategoryFilter';
import BlogPostGrid from './blog/BlogPostGrid';
import BlogPagination from './blog/BlogPagination';
import TagFilter from './blog/TagFilter';
import ErrorBoundary from './ErrorBoundary';
import OfflineBanner from './OfflineBanner';
import ProgressiveLoading from './blog/ProgressiveLoading';
import { useBlogCache } from '@/utils/blogCache';
import { useDebounce } from '@/hooks/useDebounce';

const LatestBlogPosts = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<WordPressCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | undefined>();
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [useProgressiveLoading] = useState(true);
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const { cachePosts, getCachedPosts, isOnline } = useBlogCache();

  // Load categories on mount
  useEffect(() => {
    const loadCategories = async () => {
      try {
        setCategoriesLoading(true);
        
        // Try to get cached data first if offline
        if (!isOnline()) {
          const cached = await getCachedPosts();
          if (cached) {
            setCategories(cached.categories);
            setCategoriesLoading(false);
            return;
          }
        }

        const categoriesData = await fetchCategories();
        setCategories(categoriesData);
      } catch (err) {
        console.error('Failed to load categories:', err);
        // Try cache as fallback
        const cached = await getCachedPosts();
        if (cached) {
          setCategories(cached.categories);
        }
      } finally {
        setCategoriesLoading(false);
      }
    };

    loadCategories();
  }, []);

  // Load posts when page or category changes
  useEffect(() => {
    const loadPosts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Try cached posts first if offline
        if (!isOnline()) {
          const cached = await getCachedPosts();
          if (cached) {
            setPosts(cached.posts);
            setTotalPages(1); // No pagination for cached posts
            console.log('Loaded cached blog posts');
            return;
          }
        }

        console.log('Loading blog posts for homepage...', { currentPage, selectedCategory });
        const response: FetchPostsResponse = await fetchBlogPosts(currentPage, selectedCategory, 6);
        console.log('Blog posts loaded successfully:', response);
        
        setPosts(response.posts);
        setTotalPages(response.totalPages);
        
        // Cache the posts for offline use
        if (currentPage === 1) {
          await cachePosts(response.posts, categories);
        }
      } catch (err) {
        setError('Failed to load blog posts. Please try again later.');
        console.error('Failed to load posts:', err);
        
        // Try cache as fallback
        const cached = await getCachedPosts();
        if (cached) {
          setPosts(cached.posts);
          setTotalPages(1);
          setError('Showing cached posts - you may be offline');
        }
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, [currentPage, selectedCategory]);

  // Filter posts by search query and tags
  useEffect(() => {
    console.log('Search filter running:', { 
      searchQuery: debouncedSearchQuery, 
      postsCount: posts.length,
      selectedTags 
    });
    
    let filtered = posts;
    
    // Apply search filter
    if (debouncedSearchQuery.trim()) {
      const searchLower = debouncedSearchQuery.toLowerCase();
      console.log('Applying search filter for:', searchLower);
      
      filtered = filtered.filter(post => {
        const titleMatch = post.title.toLowerCase().includes(searchLower);
        const excerptMatch = post.excerpt.toLowerCase().includes(searchLower);
        const tagMatch = post.tags.some(tag => tag.toLowerCase().includes(searchLower));
        
        console.log('Post:', post.title, 'Title match:', titleMatch, 'Excerpt match:', excerptMatch, 'Tag match:', tagMatch, 'Tags:', post.tags);
        
        return titleMatch || excerptMatch || tagMatch;
      });
      
      console.log('Filtered posts count:', filtered.length);
    }
    
    // Apply tag filter
    if (selectedTags.length > 0) {
      filtered = filtered.filter(post => 
        selectedTags.every(tag => post.tags.includes(tag))
      );
    }
    
    setFilteredPosts(filtered);
  }, [posts, selectedTags, debouncedSearchQuery]);

  const handleCategoryChange = (categoryId: number | undefined) => {
    setSelectedCategory(categoryId);
    setCurrentPage(1); // Reset to first page when filtering
    setSelectedTags([]); // Clear tag filters when changing category
  };

  const handleTagChange = (tags: string[]) => {
    setSelectedTags(tags);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Smooth scroll to top of blog section
    document.getElementById('blog-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="blog-section" className="py-20 px-4 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-primary mb-4">Latest from the Blog</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Fresh insights, techniques, and troubleshooting tips to elevate your bread baking
          </p>
        </div>

        {/* Offline Banner */}
        <OfflineBanner 
          onRetry={() => window.location.reload()}
          cachedPosts={posts}
        />

        <ErrorBoundary
          onError={(error, errorInfo) => {
            console.error('Blog section error:', error, errorInfo);
          }}
        >
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            showFilters={showFilters}
            categoriesLoading={categoriesLoading}
            onToggleFilters={() => setShowFilters(!showFilters)}
            onCategoryChange={handleCategoryChange}
          />

          {/* Search Input */}
          <div className="mb-8 max-w-md mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <input
                type="text"
                placeholder="Search blog posts…"
                value={searchQuery}
                onChange={(e) => {
                  console.log('Search input changed:', e.target.value);
                  setSearchQuery(e.target.value);
                }}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm pl-10 bg-card border-primary/20 focus:border-primary"
              />
            </div>
          </div>

          {/* Tag Filter */}
          <TagFilter
            posts={posts}
            selectedTags={selectedTags}
            onTagChange={handleTagChange}
            className="mb-8"
          />

          {/* Error State */}
          {error && (
            <div className="text-center py-8">
              <p className="text-red-500 mb-4">{error}</p>
              <Button onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </div>
          )}

          {useProgressiveLoading ? (
            <ProgressiveLoading
              initialPosts={posts}
              initialPage={currentPage}
              totalPages={totalPages}
              selectedCategory={selectedCategory}
              selectedTags={selectedTags}
              onPostsUpdate={setFilteredPosts}
              renderPosts={(postsToRender) => (
                <BlogPostGrid
                  posts={postsToRender}
                  loading={loading}
                  skeletonCount={6}
                  selectedCategory={selectedCategory}
                  categories={categories}
                />
              )}
            />
          ) : (
            <>
              <BlogPostGrid
                posts={filteredPosts}
                loading={loading}
                skeletonCount={6}
                selectedCategory={selectedCategory}
                categories={categories}
              />

              <BlogPagination
                currentPage={currentPage}
                totalPages={totalPages}
                loading={loading}
                onPageChange={handlePageChange}
              />
            </>
          )}
        </ErrorBoundary>
        
        <div className="text-center mt-12">
          <Button variant="warm" size="xl" asChild>
            <a href="https://bakinggreatbread.blog" target="_blank" rel="noopener noreferrer">
              View All Posts
            </a>
          </Button>
        </div>
        
        {/* Newsletter Signup */}
        <div className="mt-20">
          <NewsletterSignup />
        </div>
      </div>
    </section>
  );
};

export default LatestBlogPosts;