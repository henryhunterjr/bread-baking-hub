import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '../components/Header';
import Footer from '../components/Footer';
import NewsletterSignup from '../components/NewsletterSignup';
import CategoryFilter from '../components/blog/CategoryFilter';
import BlogPostGrid from '../components/blog/BlogPostGrid';
import BlogPagination from '../components/blog/BlogPagination';
import TagFilter from '../components/blog/TagFilter';
import ErrorBoundary from '../components/ErrorBoundary';
import OfflineBanner from '../components/OfflineBanner';
import ProgressiveLoading from '../components/blog/ProgressiveLoading';
import RSSFeedLink from '../components/blog/RSSFeedLink';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowRight, Search } from 'lucide-react';
import { fetchBlogPosts, fetchCategories, BlogPost, WordPressCategory, FetchPostsResponse } from '@/utils/blogFetcher';
import { useDebounce } from '@/hooks/useDebounce';
import { generateBlogListingSchema } from '@/utils/structuredData';
import { useBlogCache } from '@/utils/blogCache';
import { sanitizeStructuredData } from '@/utils/sanitize';
import { SafeImage } from '@/components/ui/SafeImage';
import { Suspense, lazy } from 'react';

const LazyAIAssistantSidebar = lazy(() => import('@/components/AIAssistantSidebar').then(m => ({ default: m.AIAssistantSidebar })));

const BLOG_HERO =
  "https://ojyckskucneljvuqzrsw.supabase.co/storage/v1/object/public/blog-images/2025-08/baking-great-bread-at-home-blog-recipes-tips-and-expert-guidance/untitled-600-x-300-px-1200-x-630-px-1200-x-600-px-1200-x-500-px-1200-x-450-px.png?v=2025-08-22";

const Blog = () => {
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const { cachePosts, getCachedPosts, isOnline } = useBlogCache();

  // Load categories on mount
  useEffect(() => {
    const loadCategories = async () => {
      try {
        setCategoriesLoading(true);
        const categoriesData = await fetchCategories();
        setCategories(categoriesData);
      } catch (err) {
        console.error('Failed to load categories:', err);
      } finally {
        setCategoriesLoading(false);
      }
    };

    loadCategories();
  }, []);

  // Load posts when page, category, or search changes
  useEffect(() => {
    const loadPosts = async () => {
      try {
        setLoading(true);
        setError(null);
        const response: FetchPostsResponse = await fetchBlogPosts(currentPage, selectedCategory, 9, debouncedSearchQuery);
        setPosts(response.posts);
        setTotalPages(response.totalPages);
        
        // Cache posts for offline use
        if (response.posts.length > 0) {
          cachePosts(response.posts);
        }
      } catch (err) {
        console.error('Failed to load posts:', err);
        
        // Try to use cached posts if available
        const cachedPosts = getCachedPosts();
        if (cachedPosts.length > 0) {
          setPosts(cachedPosts);
          setError('Using cached posts. Some content may be outdated.');
        } else {
          setError('Failed to load blog posts. Please check your connection and try again.');
        }
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, [currentPage, selectedCategory, debouncedSearchQuery, cachePosts, getCachedPosts]);

  // Filter posts by tags
  useEffect(() => {
    if (selectedTags.length === 0) {
      setFilteredPosts(posts);
    } else {
      const filtered = posts.filter(post => 
        selectedTags.every(tag => post.tags.includes(tag))
      );
      setFilteredPosts(filtered);
    }
  }, [posts, selectedTags]);

  const handleCategoryChange = (categoryId: number | undefined) => {
    setSelectedCategory(categoryId);
    setCurrentPage(1); // Reset to first page when filtering
    setSelectedTags([]); // Clear tag filters when changing category
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1); // Reset to first page when searching
    setSelectedTags([]); // Clear tag filters when searching
  };

  const handleTagChange = (tags: string[]) => {
    setSelectedTags(tags);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top of blog section instead of window top
    document.getElementById('blog-section')?.scrollIntoView({ behavior: 'smooth' });
  };


  return (
    <>
      <Helmet>
        <title>Blog | Baking Great Bread at Home</title>
        <meta name="description" content="Read the latest bread baking tutorials, tips, and stories from our community of home bakers. Learn techniques and discover new recipes." />
        <meta name="keywords" content="bread baking blog, sourdough tips, bread troubleshooting, baking techniques, Henry's bread recipes" />
        <link rel="canonical" href="https://bread-baking-hub.vercel.app/blog" />
        
        {/* Open Graph meta tags */}
        <meta property="og:title" content="Blog | Baking Great Bread at Home" />
        <meta property="og:description" content="Read the latest bread baking tutorials, tips, and stories from our community of home bakers. Learn techniques and discover new recipes." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://the-bakers-bench.lovable.app/blog" />
        <meta property="og:image" content="https://the-bakers-bench.lovable.app/lovable-uploads/1df33d05-6c4f-409b-a817-9b27e6d8edbc.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Baking Great Bread at Home Blog - Bread making tutorials and tips" />
        <meta property="og:site_name" content="Baking Great Bread at Home" />
        
        {/* Twitter Card meta tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Blog | Baking Great Bread at Home" />
        <meta name="twitter:description" content="Read the latest bread baking tutorials, tips, and stories from our community of home bakers. Learn techniques and discover new recipes." />
        <meta name="twitter:image" content="https://the-bakers-bench.lovable.app/lovable-uploads/1df33d05-6c4f-409b-a817-9b27e6d8edbc.png" />
        
        {/* RSS Feed Link */}
        <link rel="alternate" type="application/rss+xml" title="Baking Great Bread RSS Feed" href="https://ojyckskucneljvuqzrsw.supabase.co/functions/v1/rss-feed" />
        
        {/* JSON Feed Link */}
        <link rel="alternate" type="application/feed+json" title="Baking Great Bread JSON Feed" href="https://ojyckskucneljvuqzrsw.supabase.co/functions/v1/rss-feed?format=json" />
        
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: sanitizeStructuredData(JSON.parse(generateBlogListingSchema()))
          }}
        />
      </Helmet>

      <div className="bg-background text-foreground min-h-screen">
        <Header />
        <main id="main-content" role="main">
          <nav aria-label="Breadcrumb" className="sr-only">
            <ul>
              <li><a href="/">Home</a></li>
              <li aria-current="page">Blog</li>
            </ul>
          </nav>
          {/* Hero Section */}
          <section className="py-20 px-4 bg-gradient-hero min-h-[320px] md:min-h-[420px]">
            <h1 className="sr-only">Baking Great Bread Blog</h1>
            <div className="max-w-7xl mx-auto" data-hero-src={BLOG_HERO}>
              <SafeImage
                key={BLOG_HERO}
                src={BLOG_HERO}
                alt="Rustic kitchen scene with wooden cutting board displaying 'Baking Great Bread at Home Blog' text, surrounded by baking ingredients, rolling pin, mixing bowls, and fresh flowers"
                aspectRatio="16 / 9"
                fit="cover"
                className="w-full rounded-2xl shadow-warm"
                loading="eager"
                fetchpriority="high"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 1200px"
              />
            </div>
          </section>

          {/* Blog Posts Section */}
          <section className="py-20 px-4">
            {/* Offline Banner */}
            <OfflineBanner 
              onRetry={() => window.location.reload()}
              cachedPosts={posts}
            />

            <ErrorBoundary
              onError={(error, errorInfo) => {
                console.error('Blog page error:', error, errorInfo);
              }}
            >
              {/* Search Bar */}
              <div className="mb-8 max-w-2xl mx-auto">
                <form
                  className="relative"
                  role="search"
                  aria-label="Search blog posts"
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSearchChange(searchQuery.trim());
                  }}
                >
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    type="search"
                    placeholder="Search blog posts…"
                    value={searchQuery}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleSearchChange(searchQuery.trim());
                      }
                    }}
                    aria-label="Search blog posts"
                    className="pl-10 pr-28 bg-card border-primary/20 focus:border-primary"
                  />
                  <Button
                    type="submit"
                    aria-label="Search"
                    className="absolute right-2 top-1/2 -translate-y-1/2"
                  >
                    Search
                  </Button>
                </form>
              </div>

              {/* Category Filter */}
              <div className="mb-12">
                <CategoryFilter
                  categories={categories}
                  selectedCategory={selectedCategory}
                  showFilters={showFilters}
                  categoriesLoading={categoriesLoading}
                  onToggleFilters={() => setShowFilters(!showFilters)}
                  onCategoryChange={handleCategoryChange}
                />
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
                  searchQuery={debouncedSearchQuery}
                  selectedTags={selectedTags}
                  onPostsUpdate={setFilteredPosts}
                  renderPosts={(postsToRender) => (
                    <BlogPostGrid
                      posts={postsToRender}
                      loading={loading}
                      skeletonCount={9}
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
                    skeletonCount={9}
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
            
            <div className="max-w-7xl mx-auto">
              {/* RSS Feed Link */}
              <div className="mb-8">
                <RSSFeedLink className="max-w-sm mx-auto" />
              </div>

              {/* Newsletter Signup */}
              <div className="mt-20">
                <NewsletterSignup />
              </div>
            </div>
          </section>
        </main>
        <Footer />
        
        <Suspense fallback={null}>
          <LazyAIAssistantSidebar
            isOpen={isSidebarOpen}
            onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
          />
        </Suspense>
      </div>
    </>
  );
};

export default Blog;