import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '../components/Header';
import Footer from '../components/Footer';
import NewsletterSignup from '../components/NewsletterSignup';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowRight, ChevronLeft, ChevronRight, Filter, Search } from 'lucide-react';
import { fetchBlogPosts, fetchCategories, BlogPost, WordPressCategory, FetchPostsResponse } from '@/utils/blogFetcher';
import { useDebounce } from '@/hooks/useDebounce';

const Blog = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<WordPressCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | undefined>();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

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

  const handleCategoryChange = (categoryId: number | undefined) => {
    setSelectedCategory(categoryId);
    setCurrentPage(1); // Reset to first page when filtering
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Smooth scroll to top of blog section
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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

  return (
    <>
      <Helmet>
        <title>Blog - Baking Great Bread</title>
        <meta name="description" content="Discover the latest bread baking tips, techniques, and recipes from Henry's blog. Learn troubleshooting methods, seasonal adjustments, and the science behind perfect bread." />
        <meta name="keywords" content="bread baking blog, sourdough tips, bread troubleshooting, baking techniques, Henry's bread recipes" />
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
            <div className="max-w-7xl mx-auto">
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
                <div className="flex flex-wrap items-center gap-4 justify-center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center gap-2"
                  >
                    <Filter className="w-4 h-4" />
                    Filter by Category
                  </Button>
                  
                  {showFilters && (
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant={selectedCategory === undefined ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleCategoryChange(undefined)}
                      >
                        All Posts
                      </Button>
                      {categoriesLoading ? (
                        <Skeleton className="h-8 w-24" />
                      ) : (
                        categories.map((category) => (
                          <Button
                            key={category.id}
                            variant={selectedCategory === category.id ? "default" : "outline"}
                            size="sm"
                            onClick={() => handleCategoryChange(category.id)}
                          >
                            {category.name} ({category.count})
                          </Button>
                        ))
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Error State */}
              {error && (
                <div className="text-center py-8">
                  <p className="text-red-500 mb-4">{error}</p>
                  <Button onClick={() => window.location.reload()}>
                    Try Again
                  </Button>
                </div>
              )}

              {/* Posts Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {loading ? (
                  Array.from({ length: 9 }).map((_, index) => (
                    <BlogPostSkeleton key={index} />
                  ))
                ) : posts.length === 0 ? (
                  <div className="col-span-full text-center py-12">
                    <p className="text-muted-foreground text-lg">
                      No blog posts found{searchQuery ? ' matching your search' : selectedCategory ? ' in this category' : ''}.
                    </p>
                    {searchQuery && (
                      <Button 
                        variant="outline" 
                        onClick={() => handleSearchChange('')}
                        className="mt-4"
                      >
                        Clear Search
                      </Button>
                    )}
                  </div>
                ) : (
                  posts.map((post) => (
                    <article key={post.id} className="bg-card rounded-xl overflow-hidden shadow-stone hover:shadow-warm transition-all duration-300 group">
                      <div className="relative overflow-hidden">
                        {post.image ? (
                          <img 
                            src={post.image} 
                            alt={post.imageAlt || `Featured image for ${post.title}`}
                            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                            width={400}
                            height={192}
                            loading="lazy"
                            decoding="async"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              if (target.nextElementSibling) {
                                (target.nextElementSibling as HTMLElement).style.display = 'flex';
                              }
                            }}
                          />
                        ) : null}
                        <div 
                          className={`w-full h-48 bg-muted flex items-center justify-center ${post.image ? 'hidden' : ''}`}
                        >
                          <span className="text-muted-foreground">No Image</span>
                        </div>
                        <div className="absolute top-4 right-4 bg-black/70 text-foreground px-2 py-1 rounded text-sm">
                          {post.readTime}
                        </div>
                      </div>
                      <div className="p-6 space-y-4">
                        <div className="text-primary text-sm font-medium">{post.date}</div>
                        <h3 className="text-xl font-bold text-card-foreground line-clamp-2 group-hover:text-primary transition-colors">
                          {post.title}
                        </h3>
                        <p className="text-muted-foreground line-clamp-3">{post.excerpt}</p>
                        <a 
                          href={post.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-primary hover:text-primary/80 font-medium transition-colors group-hover:underline"
                        >
                          Read More
                          <ArrowRight className="ml-1 w-4 h-4" />
                        </a>
                      </div>
                    </article>
                  ))
                )}
              </div>

              {/* Pagination */}
              {!loading && totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 mt-12">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="flex items-center gap-2"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </Button>
                  
                  <div className="flex items-center gap-2">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const page = i + 1;
                      return (
                        <Button
                          key={page}
                          variant={currentPage === page ? "default" : "outline"}
                          size="sm"
                          onClick={() => handlePageChange(page)}
                          className="w-10"
                        >
                          {page}
                        </Button>
                      );
                    })}
                    {totalPages > 5 && (
                      <>
                        <span className="text-muted-foreground">...</span>
                        <Button
                          variant={currentPage === totalPages ? "default" : "outline"}
                          size="sm"
                          onClick={() => handlePageChange(totalPages)}
                          className="w-10"
                        >
                          {totalPages}
                        </Button>
                      </>
                    )}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="flex items-center gap-2"
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              )}
              
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