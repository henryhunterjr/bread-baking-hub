/**
 * WordPress Integration for OG/Content Signals
 * Server-side only integration with WordPress REST API via Supabase Edge Functions
 */

import { supabase } from '@/integrations/supabase/client';

interface WordPressPost {
  id: number;
  title: { rendered: string };
  excerpt: { rendered: string };
  content: { rendered: string };
  slug: string;
  date: string;
  modified: string;
  featured_media: number;
  categories: number[];
  tags: number[];
  _embedded?: {
    'wp:featuredmedia'?: Array<{
      id: number;
      source_url: string;
      alt_text: string;
      media_details: {
        width: number;
        height: number;
        sizes: Record<string, {
          source_url: string;
          width: number;
          height: number;
        }>;
      };
    }>;
    'wp:term'?: Array<Array<{
      id: number;
      name: string;
      slug: string;
    }>>;
  };
}

interface WordPressCategory {
  id: number;
  name: string;
  slug: string;
  description: string;
  count: number;
}

interface WordPressResponse {
  data: WordPressPost[] | WordPressCategory[];
  totalPages: number;
  currentPage: number;
  cached: boolean;
}

interface OGSignals {
  title: string;
  description: string;
  image?: string;
  imageAlt?: string;
  url: string;
  siteName: string;
  type: 'article' | 'website';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  section?: string;
  tags?: string[];
}

/**
 * Fetch WordPress data via Supabase Edge Function (blog-proxy)
 */
const fetchWordPressData = async (
  endpoint: 'posts' | 'categories',
  options: {
    page?: number;
    perPage?: number;
    categories?: number;
    search?: string;
  } = {}
): Promise<WordPressResponse> => {
  const { page = 1, perPage = 6, categories, search } = options;
  
  try {
    // Use Supabase function to proxy WordPress calls
    const { data, error } = await supabase.functions.invoke('blog-proxy', {
      body: {
        endpoint,
        page: page.toString(),
        per_page: perPage.toString(),
        ...(categories && { categories: categories.toString() }),
        ...(search && { search })
      }
    });

    if (error) {
      console.error('WordPress proxy error:', error);
      throw new Error(`Failed to fetch from WordPress: ${error.message}`);
    }

    return data as WordPressResponse;
  } catch (error) {
    console.error('WordPress integration error:', error);
    
    // Fallback: Direct WordPress REST API call with timeout (server-side only)
    if (typeof window === 'undefined') {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2000); // 2s timeout
        
        let fetchUrl = `https://bakinggreatbread.blog/wp-json/wp/v2/${endpoint}`;
        
        if (endpoint === 'posts') {
          const params = new URLSearchParams({
            _embed: '1',
            page: page.toString(),
            per_page: perPage.toString(),
            ...(categories && { categories: categories.toString() }),
            ...(search && { search })
          });
          fetchUrl += `?${params.toString()}`;
        } else if (endpoint === 'categories') {
          fetchUrl += '?per_page=100';
        }

        const response = await fetch(fetchUrl, {
          signal: controller.signal,
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'BakingGreatBread-Site/1.0'
          }
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`WordPress API error: ${response.status}`);
        }

        const data = await response.json();
        const totalPages = parseInt(response.headers.get('X-WP-TotalPages') || '1');

        return {
          data,
          totalPages,
          currentPage: page,
          cached: false
        };
      } catch (fallbackError) {
        console.error('WordPress fallback failed:', fallbackError);
        throw new Error('WordPress content unavailable');
      }
    }

    throw error;
  }
};

/**
 * Get WordPress posts for OG signals and content discovery
 */
export const getWordPressPosts = async (options?: {
  page?: number;
  perPage?: number;
  categories?: number;
  search?: string;
}): Promise<{
  posts: WordPressPost[];
  totalPages: number;
  currentPage: number;
  cached: boolean;
}> => {
  const response = await fetchWordPressData('posts', options);
  
  return {
    posts: response.data as WordPressPost[],
    totalPages: response.totalPages,
    currentPage: response.currentPage,
    cached: response.cached
  };
};

/**
 * Get WordPress categories for content organization
 */
export const getWordPressCategories = async (): Promise<{
  categories: WordPressCategory[];
  cached: boolean;
}> => {
  const response = await fetchWordPressData('categories');
  
  return {
    categories: response.data as WordPressCategory[],
    cached: response.cached
  };
};

/**
 * Generate Open Graph signals from WordPress post
 */
export const generateOGSignalsFromPost = (post: WordPressPost, baseUrl = 'https://bakinggreatbread.com'): OGSignals => {
  // Extract featured image
  const featuredMedia = post._embedded?.['wp:featuredmedia']?.[0];
  const image = featuredMedia?.source_url;
  const imageAlt = featuredMedia?.alt_text || post.title.rendered;

  // Extract categories for section
  const categories = post._embedded?.['wp:term']?.[0] || [];
  const primaryCategory = categories[0]?.name;

  // Extract tags
  const tags = post._embedded?.['wp:term']?.[1]?.map(tag => tag.name) || [];

  // Clean up excerpt (remove HTML tags)
  const description = post.excerpt.rendered
    .replace(/<[^>]*>/g, '')
    .replace(/\[\&hellip;\]$/, '...')
    .trim();

  return {
    title: post.title.rendered,
    description: description.substring(0, 160), // OG description limit
    image,
    imageAlt,
    url: `${baseUrl}/blog/${post.slug}`,
    siteName: 'Baking Great Bread',
    type: 'article',
    publishedTime: post.date,
    modifiedTime: post.modified,
    section: primaryCategory,
    tags
  };
};

/**
 * Generate structured data (JSON-LD) for WordPress post
 */
export const generateStructuredDataFromPost = (post: WordPressPost, baseUrl = 'https://bakinggreatbread.com') => {
  const ogSignals = generateOGSignalsFromPost(post, baseUrl);
  const featuredMedia = post._embedded?.['wp:featuredmedia']?.[0];

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: ogSignals.title,
    description: ogSignals.description,
    image: ogSignals.image ? {
      '@type': 'ImageObject',
      url: ogSignals.image,
      width: featuredMedia?.media_details?.width,
      height: featuredMedia?.media_details?.height
    } : undefined,
    author: {
      '@type': 'Person',
      name: 'Henry Onyeiwu'
    },
    publisher: {
      '@type': 'Organization',
      name: 'Baking Great Bread',
      url: baseUrl
    },
    datePublished: post.date,
    dateModified: post.modified,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': ogSignals.url
    },
    keywords: ogSignals.tags?.join(', ')
  };
};

/**
 * Get latest posts for homepage/sidebar content signals
 */
export const getLatestPostsForSignals = async (limit = 3): Promise<{
  posts: Array<{
    title: string;
    excerpt: string;
    url: string;
    image?: string;
    publishedDate: string;
  }>;
  cached: boolean;
}> => {
  try {
    const { posts, cached } = await getWordPressPosts({ perPage: limit });
    
    const processedPosts = posts.map(post => {
      const ogSignals = generateOGSignalsFromPost(post);
      return {
        title: ogSignals.title,
        excerpt: ogSignals.description,
        url: ogSignals.url,
        image: ogSignals.image,
        publishedDate: post.date
      };
    });

    return {
      posts: processedPosts,
      cached
    };
  } catch (error) {
    console.error('Failed to fetch latest posts for signals:', error);
    return {
      posts: [],
      cached: false
    };
  }
};

/**
 * Search WordPress content (for internal linking signals)
 */
export const searchWordPressContent = async (query: string, limit = 5): Promise<{
  posts: Array<{
    title: string;
    excerpt: string;
    url: string;
    relevance: number;
  }>;
  cached: boolean;
}> => {
  try {
    const { posts, cached } = await getWordPressPosts({ 
      search: query, 
      perPage: limit 
    });
    
    const processedPosts = posts.map(post => {
      const ogSignals = generateOGSignalsFromPost(post);
      
      // Simple relevance scoring based on title/excerpt match
      const titleMatch = ogSignals.title.toLowerCase().includes(query.toLowerCase()) ? 2 : 0;
      const excerptMatch = ogSignals.description.toLowerCase().includes(query.toLowerCase()) ? 1 : 0;
      const relevance = titleMatch + excerptMatch;
      
      return {
        title: ogSignals.title,
        excerpt: ogSignals.description,
        url: ogSignals.url,
        relevance
      };
    }).sort((a, b) => b.relevance - a.relevance);

    return {
      posts: processedPosts,
      cached
    };
  } catch (error) {
    console.error('WordPress search failed:', error);
    return {
      posts: [],
      cached: false
    };
  }
};