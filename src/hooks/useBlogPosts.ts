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
    console.log('🔍 SEARCH FILTER EFFECT RUNNING:', { 
      debouncedSearchQuery, 
      postsCount: posts.length,
      selectedTags,
      currentTime: new Date().toISOString()
    });
    
    let filtered = posts;
    
    // Apply search filter
    if (debouncedSearchQuery.trim()) {
      const searchLower = debouncedSearchQuery.toLowerCase();
      console.log('🔍 APPLYING SEARCH FILTER for:', searchLower);
      console.log('🔍 Posts to filter:', posts.map(p => ({ title: p.title, tags: p.tags })));
      
      const beforeFilter = filtered.length;
      filtered = filtered.filter(post => {
        const titleMatch = post.title.toLowerCase().includes(searchLower);
        const excerptMatch = post.excerpt.toLowerCase().includes(searchLower);
        const tagMatch = post.tags.some(tag => tag.toLowerCase().includes(searchLower));
        
        const matches = titleMatch || excerptMatch || tagMatch;
        
        if (matches) {
          console.log('🔍 MATCH FOUND:', post.title, { titleMatch, excerptMatch, tagMatch });
        }
        
        return matches;
      });
      
      console.log('🔍 FILTER RESULTS:', {
        beforeFilter,
        afterFilter: filtered.length,
        searchQuery: searchLower,
        matchedTitles: filtered.map(p => p.title)
      });
    } else {
      console.log('🔍 NO SEARCH QUERY - showing all posts');
    }
    
    // Apply tag filter
    if (selectedTags.length > 0) {
      console.log('🔍 APPLYING TAG FILTER:', selectedTags);
      filtered = filtered.filter(post => 
        selectedTags.every(tag => post.tags.includes(tag))
      );
    }
    
    console.log('🔍 FINAL FILTERED POSTS:', filtered.length);
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

  const handleSearchChange = (query: string) => {
    console.log('🔍 SEARCH EVENT FIRED in useBlogPosts:', query);
    console.log('🔍 Current posts count:', posts.length);
    console.log('🔍 Current debouncedSearchQuery:', debouncedSearchQuery);
    setSearchQuery(query);
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