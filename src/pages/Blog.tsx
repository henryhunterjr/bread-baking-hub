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
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowRight, Search } from 'lucide-react';
import { fetchBlogPosts, fetchCategories, BlogPost, WordPressCategory, FetchPostsResponse } from '@/utils/blogFetcher';
import { useDebounce } from '@/hooks/useDebounce';
import { generateBlogListingSchema } from '@/utils/structuredData';
import { useBlogCache } from '@/utils/blogCache';

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
      } catch (err) {
        setError('Failed to load blog posts. Please try again later.');
        console.error('Failed to load posts:', err);
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, [currentPage, selectedCategory, debouncedSearchQuery]);

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
    // Smooth scroll to top of blog section
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };


  return (
    <>
      <Helmet>
        <title>Blog - Baking Great Bread</title>
        <meta name="description" content="Discover the latest bread baking tips, techniques, and recipes from Henry's blog. Learn troubleshooting methods, seasonal adjustments, and the science behind perfect bread." />
        <meta name="keywords" content="bread baking blog, sourdough tips, bread troubleshooting, baking techniques, Henry's bread recipes" />
        
        {/* Open Graph meta tags */}
        <meta property="og:title" content="Blog - Baking Great Bread" />
        <meta property="og:description" content="Discover the latest bread baking tips, techniques, and recipes from Henry's blog. Learn troubleshooting methods, seasonal adjustments, and the science behind perfect bread." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://bakinggreatbread.blog" />
        <meta property="og:image" content="https://bakinggreatbread.blog/wp-content/uploads/2023/blog-featured.jpg" />
        <meta property="og:site_name" content="Baking Great Bread" />
        
        {/* Twitter Card meta tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Blog - Baking Great Bread" />
        <meta name="twitter:description" content="Discover the latest bread baking tips, techniques, and recipes from Henry's blog." />
        <meta name="twitter:image" content="https://bakinggreatbread.blog/wp-content/uploads/2023/blog-featured.jpg" />
        
        {/* RSS Feed Link */}
        <link rel="alternate" type="application/rss+xml" title="Baking Great Bread RSS Feed" href="https://ojyckskucneljvuqzrsw.supabase.co/functions/v1/rss-feed" />
        
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: generateBlogListingSchema()
          }}
        />
      </Helmet>

      <div className="bg-background text-foreground min-h-screen">
        <Header />
        <main>
          {/* Hero Section */}
          <section className="py-20 px-4 bg-gradient-hero">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-5xl md:text-6xl font-bold text-primary mb-6">
                Baking Great Bread Blog
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Dive deep into the art and science of bread baking with expert tips, troubleshooting guides, and seasonal insights to elevate your craft.
              </p>
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
              <div className="mb-8 max-w-md mx-auto">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    type="text"
                    placeholder="Search blog posts..."
                    value={searchQuery}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className="pl-10 bg-card border-primary/20 focus:border-primary"
                  />
                </div>
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
              {/* Newsletter Signup */}
              <div className="mt-20">
                <NewsletterSignup />
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Blog;