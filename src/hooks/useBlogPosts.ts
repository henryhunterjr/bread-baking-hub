import { useState, useEffect } from 'react';
import { fetchBlogPosts, fetchCategories, BlogPost, WordPressCategory, FetchPostsResponse } from '@/utils/blogFetcher';
import { useBlogCache } from '@/utils/blogCache';
import { useDebounce } from '@/hooks/useDebounce';

export const useBlogPosts = () => {
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

  // Load posts when page, category, or search changes
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
            if (import.meta.env.DEV) console.debug('Loaded cached blog posts');
            return;
          }
        }

        if (import.meta.env.DEV) console.debug('Loading blog posts for homepage...', { currentPage, selectedCategory, searchQuery: debouncedSearchQuery });
        const response: FetchPostsResponse = await fetchBlogPosts(currentPage, selectedCategory, 6, debouncedSearchQuery);
        if (import.meta.env.DEV) console.debug('Blog posts loaded successfully:', response);
        
        setPosts(response.posts);
        setTotalPages(response.totalPages);
        
        // Cache the posts for offline use
        if (currentPage === 1 && !debouncedSearchQuery) {
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
  }, [currentPage, selectedCategory, debouncedSearchQuery]);

  // Filter posts by tags only (search is now handled server-side)
  useEffect(() => {
    let filtered = posts;
    
    // Apply tag filter only
    if (selectedTags.length > 0) {
      filtered = filtered.filter(post => 
        selectedTags.every(tag => post.tags.includes(tag))
      );
    }
    
    setFilteredPosts(filtered);
  }, [posts, selectedTags]);

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

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page when searching
    setSelectedTags([]); // Clear tag filters when searching
  };

  return {
    // State
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
    
    // Actions
    handleCategoryChange,
    handleTagChange,
    handlePageChange,
    handleSearchChange,
    setShowFilters,
    setFilteredPosts
  };
};