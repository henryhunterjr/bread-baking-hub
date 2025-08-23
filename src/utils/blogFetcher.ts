interface WordPressPost {
  id: number;
  date: string;
  modified: string;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
  };
  excerpt: {
    rendered: string;
  };
  link: string;
  categories: number[];
  tags: number[];
  author: number;
  _embedded?: {
    'wp:featuredmedia'?: Array<{
      source_url: string;
      alt_text: string;
    }>;
    'wp:term'?: Array<Array<{
      id: number;
      name: string;
      slug: string;
      taxonomy: 'category' | 'post_tag';
    }>>;
    'author'?: Array<{
      id: number;
      name: string;
      description: string;
      avatar_urls: {
        [key: string]: string;
      };
    }>;
  };
}

interface WordPressCategory {
  id: number;
  name: string;
  slug: string;
  count: number;
}

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  date: string;
  modified: string;
  image: string;
  imageAlt: string;
  link: string;
  readTime: string;
  categories: number[];
  tags: string[];
  author: {
    id: number;
    name: string;
    description: string;
    avatar: string;
  };
  freshness: {
    daysAgo: number;
    label: string;
  };
}

interface FetchPostsResponse {
  posts: BlogPost[];
  totalPages: number;
  currentPage: number;
}

const BLOG_PROXY_URL = 'https://ojyckskucneljvuqzrsw.supabase.co/functions/v1/blog-proxy';

// Decode HTML entities
const decodeHtmlEntities = (text: string): string => {
  const textarea = document.createElement('textarea');
  textarea.innerHTML = text;
  return textarea.value;
};

// Strip HTML tags and limit to specified word count
export const stripHtml = (html: string, wordLimit: number = 20): string => {
  const text = html.replace(/<[^>]*>/g, '');
  const decodedText = decodeHtmlEntities(text);
  const words = decodedText.split(' ').filter(word => word.length > 0);
  
  if (words.length <= wordLimit) {
    return decodedText;
  }
  
  return words.slice(0, wordLimit).join(' ') + '...';
};

// Calculate post freshness
const calculateFreshness = (modifiedDate: string, publishedDate: string): { daysAgo: number; label: string } => {
  const modified = new Date(modifiedDate);
  const published = new Date(publishedDate);
  const now = new Date();
  
  // Use the more recent date (modified or published)
  const relevantDate = modified > published ? modified : published;
  const daysDiff = Math.floor((now.getTime() - relevantDate.getTime()) / (1000 * 60 * 60 * 24));
  
  let label = '';
  if (daysDiff === 0) {
    label = 'Today';
  } else if (daysDiff === 1) {
    label = 'Yesterday';
  } else if (daysDiff < 7) {
    label = `${daysDiff} days ago`;
  } else if (daysDiff < 30) {
    const weeks = Math.floor(daysDiff / 7);
    label = weeks === 1 ? '1 week ago' : `${weeks} weeks ago`;
  } else if (daysDiff < 365) {
    const months = Math.floor(daysDiff / 30);
    label = months === 1 ? '1 month ago' : `${months} months ago`;
  } else {
    const years = Math.floor(daysDiff / 365);
    label = years === 1 ? '1 year ago' : `${years} years ago`;
  }
  
  return { daysAgo: daysDiff, label };
};

// Calculate estimated reading time
const calculateReadTime = (content: string): string => {
  const text = content.replace(/<[^>]*>/g, '');
  const words = text.split(' ').filter(word => word.length > 0).length;
  const minutes = Math.ceil(words / 200); // Average reading speed
  return `${minutes} min read`;
};

// Fetch blog posts with optional filters
// Request deduplication cache to prevent multiple simultaneous requests
const requestCache = new Map<string, Promise<FetchPostsResponse>>();

export const fetchBlogPosts = async (
  page: number = 1,
  categoryId?: number,
  perPage: number = 6,
  searchQuery?: string
): Promise<FetchPostsResponse> => {
  // Create cache key for request deduplication
  const cacheKey = `${page}-${categoryId || 'all'}-${perPage}-${searchQuery || ''}`;
  
  // Return existing promise if request is already in flight
  if (requestCache.has(cacheKey)) {
    return requestCache.get(cacheKey)!;
  }
  // Create the actual request promise
  const requestPromise = (async (): Promise<FetchPostsResponse> => {
    try {
      let url = `${BLOG_PROXY_URL}?endpoint=posts&page=${page}&per_page=${perPage}`;
      
      if (categoryId) {
        url += `&categories=${categoryId}`;
      }
      
      if (searchQuery) {
        url += `&search=${encodeURIComponent(searchQuery)}`;
      }
      
      console.log('Fetching blog posts via proxy:', url);
      
      const response = await fetch(url, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        console.error('Proxy HTTP error:', response.status, response.statusText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      const posts: WordPressPost[] = result.data;
      const totalPages = result.totalPages;
      
      const transformedPosts: BlogPost[] = posts.map(post => {
        // Extract tags from embedded terms
        const tags = post._embedded?.['wp:term']?.[1]
          ?.filter(term => term.taxonomy === 'post_tag')
          ?.map(tag => tag.name) || [];
        
        // Extract author info
        const authorData = post._embedded?.['author']?.[0];
        const author = {
          id: post.author,
          name: authorData?.name || 'Henry',
          description: authorData?.description || '',
          avatar: authorData?.avatar_urls?.['48'] || authorData?.avatar_urls?.['96'] || '/placeholder-avatar.png'
        };
        
        return {
          id: post.id,
          title: decodeHtmlEntities(post.title.rendered),
          excerpt: stripHtml(post.excerpt.rendered, 20),
          date: new Date(post.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }),
          modified: post.modified,
          image: post._embedded?.['wp:featuredmedia']?.[0]?.source_url || '',
          imageAlt: post._embedded?.['wp:featuredmedia']?.[0]?.alt_text || post.title.rendered,
          link: post.link,
          readTime: calculateReadTime(post.content.rendered),
          categories: post.categories,
          tags,
          author,
          freshness: calculateFreshness(post.modified, post.date)
        };
      });
      
      console.log(`Cached ${transformedPosts.length} blog posts`);
      
      return {
        posts: transformedPosts,
        totalPages: totalPages,
        currentPage: page
      };
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      throw error;
    }
  })();
  
  // Cache the promise to prevent duplicate requests
  requestCache.set(cacheKey, requestPromise);
  
  // Clean up cache after request completes (success or failure)
  requestPromise.finally(() => {
    // Remove from cache after a short delay to allow for quick subsequent requests
    setTimeout(() => requestCache.delete(cacheKey), 1000);
  });
  
  return requestPromise;
};

// Fetch categories
export const fetchCategories = async (): Promise<WordPressCategory[]> => {
  try {
    const url = `${BLOG_PROXY_URL}?endpoint=categories`;
    console.log('Fetching categories via proxy:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    });
    
    if (!response.ok) {
      console.error('Categories proxy HTTP error:', response.status, response.statusText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    const categories: WordPressCategory[] = result.data;
    return categories.filter(cat => cat.count > 0); // Only show categories with posts
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

export type { BlogPost, WordPressCategory, FetchPostsResponse };