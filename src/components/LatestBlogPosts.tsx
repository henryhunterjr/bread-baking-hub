import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { fetchBlogPosts, fetchCategories, BlogPost, WordPressCategory, FetchPostsResponse } from '@/utils/blogFetcher';
import NewsletterSignup from './NewsletterSignup';
import CategoryFilter from './blog/CategoryFilter';
import BlogPostGrid from './blog/BlogPostGrid';
import BlogPagination from './blog/BlogPagination';

const LatestBlogPosts = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<WordPressCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | undefined>();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

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

  // Load posts when page or category changes
  useEffect(() => {
    const loadPosts = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('Loading blog posts for homepage...', { currentPage, selectedCategory });
        const response: FetchPostsResponse = await fetchBlogPosts(currentPage, selectedCategory, 6);
        console.log('Blog posts loaded successfully:', response);
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
  }, [currentPage, selectedCategory]);

  const handleCategoryChange = (categoryId: number | undefined) => {
    setSelectedCategory(categoryId);
    setCurrentPage(1); // Reset to first page when filtering
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

        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          showFilters={showFilters}
          categoriesLoading={categoriesLoading}
          onToggleFilters={() => setShowFilters(!showFilters)}
          onCategoryChange={handleCategoryChange}
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

        <BlogPostGrid
          posts={posts}
          loading={loading}
          skeletonCount={6}
          selectedCategory={selectedCategory}
        />

        <BlogPagination
          currentPage={currentPage}
          totalPages={totalPages}
          loading={loading}
          onPageChange={handlePageChange}
        />
        
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