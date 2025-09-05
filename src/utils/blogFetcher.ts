import { supabase } from '@/integrations/supabase/client';

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

interface SupabasePost {
  id: string;
  slug: string;
  title: string;
  content?: string;
  hero_image_url?: string;
  inline_image_url?: string;
  social_image_url?: string;
  published_at: string;
  updated_at: string;
  is_draft: boolean;
  tags: string[];
}

interface WordPressCategory {
  id: number;
  name: string;
  slug: string;
  count: number;
}

interface BlogPost {
  id: number | string;
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
  source: 'supabase' | 'wordpress';
  published_at: string;
}

interface FetchPostsResponse {
  posts: BlogPost[];
  totalPages: number;
  currentPage: number;
}

const BLOG_PROXY_URL = 'https://ojyckskucneljvuqzrsw.supabase.co/functions/v1/blog-proxy';

// Cache for deduplicating blog fetches
const cache = new Map<string, Promise<any>>();

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

// Map Supabase post to BlogPost interface
const mapSupabasePost = (post: SupabasePost): BlogPost => {
  const publishedDate = new Date(post.published_at);
  const updatedDate = new Date(post.updated_at);
  
  return {
    id: post.id,
    title: post.title,
    excerpt: stripHtml(post.content || '', 20),
    date: publishedDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }),
    modified: post.updated_at,
    image: post.hero_image_url || post.inline_image_url || post.social_image_url || '',
    imageAlt: post.title,
    link: `/blog/${post.slug}`,
    readTime: calculateReadTime(post.content || ''),
    categories: [],
    tags: post.tags || [],
    author: {
      id: 1,
      name: 'Henry',
      description: '',
      avatar: '/placeholder-avatar.png'
    },
    freshness: calculateFreshness(post.updated_at, post.published_at),
    source: 'supabase',
    published_at: post.published_at
  };
};

// Fetch blog posts with optional filters
export const fetchBlogPosts = async (
  page: number = 1,
  categoryId?: number,
  perPage: number = 6,
  searchQuery?: string,
  force: boolean = false
): Promise<FetchPostsResponse> => {
  const cacheKey = `posts-${page}-${categoryId || 'all'}-${perPage}-${searchQuery || ''}`;
  
  // Return cached promise if exists and not forced
  if (!force && cache.has(cacheKey)) {
    return cache.get(cacheKey);
  }
  
  try {
    console.log('🔍 Fetching merged blog posts - Supabase + WordPress');
    
    // Fetch from Supabase first
    const { data: supabasePosts, error: supabaseError } = await supabase
      .from('blog_posts')
      .select('id, slug, title, content, hero_image_url, inline_image_url, social_image_url, published_at, updated_at, is_draft, tags')
      .order('published_at', { ascending: false })
      .limit(20);
    
    const publishedSupabase = (supabasePosts || []).filter(p => !p.is_draft && p.published_at);
    const supabaseCount = publishedSupabase.length;
    console.log(`📊 Supabase posts: ${supabaseCount} published posts found`);
    
    // Transform Supabase posts
    const supabaseMapped: BlogPost[] = publishedSupabase.map(mapSupabasePost);
    
    // Fetch WordPress posts (page 1 only for merging)
    let wordPressMapped: BlogPost[] = [];
    let wpTotalPages = 1;
    
    try {
      let url = `${BLOG_PROXY_URL}?endpoint=posts&page=1&per_page=20`;
      
      if (categoryId) {
        url += `&categories=${categoryId}`;
      }
      
      if (searchQuery) {
        url += `&search=${encodeURIComponent(searchQuery)}`;
      }
      
      console.log('🔍 Fetching WordPress posts via proxy:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      });
      
      if (response.ok) {
        const result = await response.json();
        const wpPosts: WordPressPost[] = result.data;
        wpTotalPages = result.totalPages;
        
        wordPressMapped = wpPosts.map(post => {
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
            freshness: calculateFreshness(post.modified, post.date),
            source: 'wordpress' as const,
            published_at: post.date
          };
        });
        
        console.log(`📊 WordPress posts: ${wordPressMapped.length} posts fetched`);
      }
    } catch (wpError) {
      console.warn('⚠️ WordPress fetch failed, using Supabase only:', wpError);
    }
    
    // Create a Set of existing slugs from Supabase to avoid duplicates
    const supabaseSlugs = new Set(publishedSupabase.map(p => p.slug));
    
    // Filter out WordPress posts that have the same slug as Supabase posts
    const deduplicatedWordPress = wordPressMapped.filter(post => {
      const slug = post.link.split('/').pop()?.replace(/\/$/, '') || '';
      return !supabaseSlugs.has(slug);
    });
    
    // Merge and sort by published_at (descending)
    const merged = [...supabaseMapped, ...deduplicatedWordPress]
      .sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime());
    
    console.log(`📊 Final merged count: ${merged.length} posts (${supabaseCount} Supabase + ${deduplicatedWordPress.length} WordPress after dedup)`);
    
    // Paginate the merged results
    const startIndex = (page - 1) * perPage;
    const endIndex = startIndex + perPage;
    const paginatedPosts = merged.slice(startIndex, endIndex);
    const totalMergedPages = Math.ceil(merged.length / perPage);
    
    const result = {
      posts: paginatedPosts,
      totalPages: Math.max(totalMergedPages, wpTotalPages),
      currentPage: page
    };
    
    // Cache the result
    cache.set(cacheKey, Promise.resolve(result));
    setTimeout(() => cache.delete(cacheKey), 1000);
    
    return result;
  } catch (error) {
    console.error('Error fetching merged blog posts:', error);
    cache.delete(cacheKey);
    throw error;
  }
};

// Fetch categories
export const fetchCategories = async (force: boolean = false): Promise<WordPressCategory[]> => {
  const cacheKey = 'categories';
  
  // Return cached promise if exists and not forced
  if (!force && cache.has(cacheKey)) {
    return cache.get(cacheKey);
  }
  
  try {
    const url = `${BLOG_PROXY_URL}?endpoint=categories`;
    if (import.meta.env.DEV) console.log('Fetching categories via proxy:', url);
    
    const fetchPromise = fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    })
    .then(response => {
      if (!response.ok) {
        console.error('Categories proxy HTTP error:', response.status, response.statusText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(result => {
      const categories: WordPressCategory[] = result.data;
      return categories.filter(cat => cat.count > 0); // Only show categories with posts
    })
    .finally(() => {
      // Clear cache after 5 seconds (categories change less frequently)
      setTimeout(() => cache.delete(cacheKey), 5000);
    });
    
    // Cache the promise
    cache.set(cacheKey, fetchPromise);
    return fetchPromise;
  } catch (error) {
    console.error('Error fetching categories:', error);
    cache.delete(cacheKey);
    throw error;
  }
};

export type { BlogPost, WordPressCategory, FetchPostsResponse };