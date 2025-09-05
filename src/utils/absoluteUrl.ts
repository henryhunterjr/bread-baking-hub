/**
 * Centralized URL utility for creating absolute URLs across the application
 * Ensures consistent URL generation for social media scrapers and SEO
 */

// Get the base site URL from environment or fallback
const getBaseUrl = (): string => {
  // Check for explicit site URL first
  const siteUrl = import.meta.env.VITE_SITE_URL;
  if (siteUrl) {
    return siteUrl.replace(/\/$/, ''); // Remove trailing slash
  }

  // Server-side check for Vercel URL
  if (typeof process !== 'undefined' && process.env?.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  // Fallback to current origin if available (client-side)
  if (typeof window !== 'undefined' && window.location?.origin) {
    return window.location.origin;
  }

  // Production fallback
  return 'https://bread-baking-hub.vercel.app';
};

/**
 * Convert a relative or absolute path to an absolute URL
 * @param pathOrUrl - Path (/blog/post) or full URL (https://...)
 * @returns Absolute URL string
 */
export function absoluteUrl(pathOrUrl: string): string {
  // If already absolute URL, return as-is
  if (/^https?:\/\//i.test(pathOrUrl)) {
    return pathOrUrl;
  }

  const base = getBaseUrl();
  
  // Ensure path starts with /
  const normalizedPath = pathOrUrl.startsWith('/') ? pathOrUrl : `/${pathOrUrl}`;
  
  return `${base}${normalizedPath}`;
}

/**
 * Get the current base URL for the site
 */
export function getBaseUrlSafe(): string {
  return getBaseUrl();
}

/**
 * Create a stable cache-busting parameter based on content update time
 * @param updatedAt - ISO date string or timestamp of when content was last updated
 * @returns Cache-busting query parameter
 */
export function createCacheBuster(updatedAt?: string | number): string {
  if (!updatedAt) return '';
  
  const timestamp = typeof updatedAt === 'string' 
    ? new Date(updatedAt).getTime() 
    : updatedAt;
  return `?v=${Math.floor(timestamp / 1000)}`; // Use seconds for stability
}

/**
 * Add version parameter to URL for cache busting
 * @param url - Base URL
 * @param updatedAt - Content update timestamp (string or number)
 * @returns URL with version parameter
 */
export function versioned(url: string, updatedAt?: string | number): string {
  if (!updatedAt) return url;
  
  const timestamp = typeof updatedAt === 'string' 
    ? new Date(updatedAt).getTime() 
    : updatedAt;
  const version = Math.floor(timestamp / 1000);
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}v=${version}`;
}

/**
 * Ensure an image URL is absolute and optimized for social sharing
 * @param imageUrl - Image URL (relative or absolute)
 * @param updatedAt - When the content was last updated
 * @returns Absolute image URL with cache busting
 */
export function socialImageUrl(imageUrl: string, updatedAt?: string | number): string {
  if (!imageUrl) return '';
  
  const absoluteImageUrl = absoluteUrl(imageUrl);
  return versioned(absoluteImageUrl, updatedAt);
}