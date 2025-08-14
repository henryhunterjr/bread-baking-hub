import { Button } from '@/components/ui/button';
import EnhancedNewsletterSignup from './enhanced/EnhancedNewsletterSignup';
import CategoryFilter from './blog/CategoryFilter';
import BlogPostGrid from './blog/BlogPostGrid';
import BlogPagination from './blog/BlogPagination';
import TagFilter from './blog/TagFilter';
import SimpleSearch from './blog/SimpleSearch';
import ErrorBoundary from './ErrorBoundary';
import OfflineBanner from './OfflineBanner';
import ProgressiveLoading from './blog/ProgressiveLoading';
import { useBlogPosts } from '@/hooks/useBlogPosts';

const LatestBlogPosts = () => {
  const {
    posts,
    filteredPosts,
    categories,
    selectedCategory,
    selectedTags,
    currentPage,
    totalPages,
    loading,
    categoriesLoading,
    error,
    showFilters,
    searchQuery,
    useProgressiveLoading,
    handleCategoryChange,
    handleTagChange,
    handlePageChange,
    handleSearchChange,
    setShowFilters,
    setFilteredPosts
  } = useBlogPosts();

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

          <SimpleSearch
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
            className="mb-8"
          />

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
            <a href="/blog">
              View All Posts
            </a>
          </Button>
        </div>
        
        {/* Newsletter Signup */}
        <div className="mt-20">
          <EnhancedNewsletterSignup />
        </div>
      </div>
    </section>
  );
};

export default LatestBlogPosts;