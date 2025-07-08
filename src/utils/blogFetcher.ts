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

const API_BASE = 'https://bakinggreatbread.blog/wp-json/wp/v2';

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
  perPage: number = 6
): Promise<FetchPostsResponse> => {
  try {
    let url = `${API_BASE}/posts?_embed&page=${page}&per_page=${perPage}`;
    
    if (categoryId) {
      url += `&categories=${categoryId}`;
    }
    
    console.log('Fetching blog posts from:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      mode: 'cors'
    });
    
    if (!response.ok) {
      console.error('HTTP error:', response.status, response.statusText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const posts: WordPressPost[] = await response.json();
    const totalPages = parseInt(response.headers.get('X-WP-TotalPages') || '1');
    
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
    console.log('Fetching categories from:', `${API_BASE}/categories?per_page=100`);
    
    const response = await fetch(`${API_BASE}/categories?per_page=100`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      mode: 'cors'
    });
    
    if (!response.ok) {
      console.error('Categories HTTP error:', response.status, response.statusText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const categories: WordPressCategory[] = await response.json();
    return categories.filter(cat => cat.count > 0); // Only show categories with posts
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

export type { BlogPost, WordPressCategory, FetchPostsResponse };