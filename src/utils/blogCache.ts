import { BlogPost } from '@/utils/blogFetcher';

const CACHE_NAME = 'blog-posts-cache-v1';
const CACHE_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours
const MAX_CACHED_POSTS = 5;

interface CachedPost extends BlogPost {
  cachedAt: number;
}

interface CacheEntry {
  posts: CachedPost[];
  categories: any[];
  cachedAt: number;
}

export class BlogCacheManager {
  private static instance: BlogCacheManager;
  
  static getInstance(): BlogCacheManager {
    if (!BlogCacheManager.instance) {
      BlogCacheManager.instance = new BlogCacheManager();
    }
    return BlogCacheManager.instance;
  }

  // Cache blog posts
  async cachePosts(posts: BlogPost[], categories: any[] = []): Promise<void> {
    try {
      const cache = await caches.open(CACHE_NAME);
      const now = Date.now();
      
      // Limit to latest posts
      const postsToCache = posts.slice(0, MAX_CACHED_POSTS).map(post => ({
        ...post,
        cachedAt: now
      }));

      const cacheEntry: CacheEntry = {
        posts: postsToCache,
        categories,
        cachedAt: now
      };

      // Store in cache
      const response = new Response(JSON.stringify(cacheEntry));
      await cache.put('/blog-cache', response);

      // Cache post images
      await this.cacheImages(postsToCache);
      
      if (import.meta.env.DEV) console.log(`Cached ${postsToCache.length} blog posts`);
    } catch (error) {
      console.error('Failed to cache blog posts:', error);
    }
  }

  // Retrieve cached posts
  async getCachedPosts(): Promise<{ posts: BlogPost[]; categories: any[] } | null> {
    try {
      const cache = await caches.open(CACHE_NAME);
      const response = await cache.match('/blog-cache');
      
      if (!response) {
        return null;
      }

      const cacheEntry: CacheEntry = await response.json();
      const now = Date.now();

      // Check if cache is expired
      if (now - cacheEntry.cachedAt > CACHE_EXPIRY) {
        await this.clearCache();
        return null;
      }

      // Remove individual post expiry check since we have global expiry
      const validPosts = cacheEntry.posts.map(post => {
        const { cachedAt, ...blogPost } = post;
        return blogPost;
      });

      return {
        posts: validPosts,
        categories: cacheEntry.categories || []
      };
    } catch (error) {
      console.error('Failed to retrieve cached posts:', error);
      return null;
    }
  }

  // Cache images for offline viewing
  private async cacheImages(posts: CachedPost[]): Promise<void> {
    try {
      const cache = await caches.open(CACHE_NAME);
      
      for (const post of posts) {
        if (post.image) {
          try {
            // Check if image is already cached
            const cachedResponse = await cache.match(post.image);
            if (!cachedResponse) {
              const response = await fetch(post.image, { mode: 'no-cors' });
              if (response.ok) {
                await cache.put(post.image, response);
              }
            }
          } catch (error) {
            console.warn(`Failed to cache image for post ${post.id}:`, error);
          }
        }

        // Cache author avatar
        if (post.author?.avatar) {
          try {
            const cachedResponse = await cache.match(post.author.avatar);
            if (!cachedResponse) {
              const response = await fetch(post.author.avatar, { mode: 'no-cors' });
              if (response.ok) {
                await cache.put(post.author.avatar, response);
              }
            }
          } catch (error) {
            console.warn(`Failed to cache avatar for post ${post.id}:`, error);
          }
        }
      }
    } catch (error) {
      console.error('Failed to cache images:', error);
    }
  }

  // Clear expired cache
  async clearCache(): Promise<void> {
    try {
      await caches.delete(CACHE_NAME);
      if (import.meta.env.DEV) console.log('Blog cache cleared');
    } catch (error) {
      console.error('Failed to clear cache:', error);
    }
  }

  // Check if we're online
  isOnline(): boolean {
    return navigator.onLine;
  }

  // Get cache size for debugging
  async getCacheSize(): Promise<number> {
    try {
      const cache = await caches.open(CACHE_NAME);
      const keys = await cache.keys();
      return keys.length;
    } catch (error) {
      console.error('Failed to get cache size:', error);
      return 0;
    }
  }
}

// Deprecated: service worker registration is handled by VitePWA via virtual:pwa-register in main.tsx
// export const registerServiceWorker = (): void => {
//   if ('serviceWorker' in navigator) {
//     window.addEventListener('load', async () => {
//       try {
//         // Register a basic service worker for caching
//         const registration = await navigator.serviceWorker.register('/sw.js');
//         console.log('ServiceWorker registered:', registration);
//       } catch (error) {
//         console.log('ServiceWorker registration failed:', error);
//       }
//     });
//   }
// };

// Hook for using cached posts
export const useBlogCache = () => {
  const cacheManager = BlogCacheManager.getInstance();
  
  return {
    cachePosts: cacheManager.cachePosts.bind(cacheManager),
    getCachedPosts: cacheManager.getCachedPosts.bind(cacheManager),
    clearCache: cacheManager.clearCache.bind(cacheManager),
    isOnline: cacheManager.isOnline.bind(cacheManager),
    getCacheSize: cacheManager.getCacheSize.bind(cacheManager)
  };
};