interface WordPressPost {
  id: number;
  date: string;
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
  _embedded?: {
    'wp:featuredmedia'?: Array<{
      source_url: string;
      alt_text: string;
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
  image: string;
  imageAlt: string;
  link: string;
  readTime: string;
  categories: number[];
}

interface FetchPostsResponse {
  posts: BlogPost[];
  totalPages: number;
  currentPage: number;
}

const BLOG_PROXY_URL = 'https://ojyckskucneljvuqzrsw.supabase.co/functions/v1/blog-proxy';

// Strip HTML tags and limit to specified word count
export const stripHtml = (html: string, wordLimit: number = 20): string => {
  const text = html.replace(/<[^>]*>/g, '');
  const words = text.split(' ').filter(word => word.length > 0);
  
  if (words.length <= wordLimit) {
    return text;
  }
  
  return words.slice(0, wordLimit).join(' ') + '...';
};

// Calculate estimated reading time
const calculateReadTime = (content: string): string => {
  const text = content.replace(/<[^>]*>/g, '');
  const words = text.split(' ').filter(word => word.length > 0).length;
  const minutes = Math.ceil(words / 200); // Average reading speed
  return `${minutes} min read`;
};

// Fetch blog posts with optional filters
export const fetchBlogPosts = async (
  page: number = 1,
  categoryId?: number,
  perPage: number = 6,
  searchQuery?: string
): Promise<FetchPostsResponse> => {
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
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    });
    
    if (!response.ok) {
      console.error('Proxy HTTP error:', response.status, response.statusText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    const posts: WordPressPost[] = result.data;
    const totalPages = result.totalPages;
    
    const transformedPosts: BlogPost[] = posts.map(post => ({
      id: post.id,
      title: post.title.rendered,
      excerpt: stripHtml(post.excerpt.rendered, 20),
      date: new Date(post.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      image: post._embedded?.['wp:featuredmedia']?.[0]?.source_url || '',
      imageAlt: post._embedded?.['wp:featuredmedia']?.[0]?.alt_text || post.title.rendered,
      link: post.link,
      readTime: calculateReadTime(post.content.rendered),
      categories: post.categories
    }));
    
    return {
      posts: transformedPosts,
      totalPages,
      currentPage: page
    };
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    throw error;
  }
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