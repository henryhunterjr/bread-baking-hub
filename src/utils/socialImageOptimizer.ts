/**
 * Social Image Optimization Utilities
 * Handles image sizing, format optimization, and social media requirements
 */

import { absoluteUrl, socialImageUrl } from './absoluteUrl';

// Social media image requirements
export const SOCIAL_IMAGE_DIMENSIONS = {
  width: 1200,
  height: 630,
  ratio: 1.91 // 1200/630 ≈ 1.91:1
} as const;

/**
 * Check if an image URL is likely to be properly sized for social sharing
 * @param imageUrl - Image URL to check
 * @returns Boolean indicating if image is likely social-ready
 */
export function isSocialOptimized(imageUrl: string): boolean {
  if (!imageUrl) return false;
  
  // Check for common social media sizing patterns
  const socialPatterns = [
    /1200.*630/,
    /og.*image/i,
    /social.*image/i,
    /twitter.*card/i,
    /facebook.*image/i
  ];
  
  return socialPatterns.some(pattern => pattern.test(imageUrl));
}

/**
 * Get the best available social image from multiple sources
 * Priority: social_image_url > inline_image_url > hero_image_url > default
 * @param options - Image options with fallbacks
 * @returns Optimized social image URL
 */
export function getBestSocialImage(options: {
  socialImageUrl?: string;
  inlineImageUrl?: string;
  heroImageUrl?: string;
  defaultImageUrl?: string;
  updatedAt?: string;
}): string {
  const {
    socialImageUrl: social,
    inlineImageUrl: inline,
    heroImageUrl: hero,
    defaultImageUrl = '/lovable-uploads/f2a6c7d6-5a78-4068-94bd-1810dd3ebd96.png',
    updatedAt
  } = options;

  // Priority order for best social image
  const candidates = [social, inline, hero, defaultImageUrl].filter(Boolean);
  
  if (candidates.length === 0) {
    return socialImageUrl(defaultImageUrl, updatedAt);
  }

  // Use the first available image
  const selectedImage = candidates[0];
  return socialImageUrl(selectedImage, updatedAt);
}

/**
 * Generate Supabase image transformations for social sharing
 * @param supabaseUrl - Supabase storage URL
 * @returns URL with social media optimizations
 */
export function optimizeSupabaseImage(supabaseUrl: string): string {
  if (!supabaseUrl.includes('supabase.co/storage')) {
    return supabaseUrl;
  }

  // Add Supabase image transformations for social sharing
  const separator = supabaseUrl.includes('?') ? '&' : '?';
  const transforms = [
    'width=1200',
    'height=630',
    'resize=fill',
    'quality=85',
    'format=webp'
  ].join('&');

  return `${supabaseUrl}${separator}${transforms}`;
}

/**
 * Validate that an image is accessible and returns proper headers
 * @param imageUrl - Image URL to validate
 * @returns Promise<boolean> indicating if image is accessible
 */
export async function validateImageAccessibility(imageUrl: string): Promise<boolean> {
  try {
    const response = await fetch(imageUrl, { method: 'HEAD' });
    
    // Check if image is accessible
    if (!response.ok) return false;
    
    // Check content type
    const contentType = response.headers.get('content-type');
    if (!contentType?.startsWith('image/')) return false;
    
    // Check if publicly accessible (no auth required)
    const cacheControl = response.headers.get('cache-control');
    if (cacheControl?.includes('private')) return false;
    
    return true;
  } catch (error) {
    console.warn('Image accessibility check failed:', imageUrl, error);
    return false;
  }
}

/**
 * Process and optimize an image URL for social media sharing
 * @param imageUrl - Original image URL
 * @param updatedAt - Content update timestamp
 * @returns Optimized and validated social image URL
 */
export function processSocialImage(imageUrl: string, updatedAt?: string): string {
  if (!imageUrl) return '';

  let processedUrl = imageUrl;

  // Apply Supabase optimizations if applicable
  if (imageUrl.includes('supabase.co/storage')) {
    processedUrl = optimizeSupabaseImage(imageUrl);
  }

  // Ensure absolute URL with cache busting
  return socialImageUrl(processedUrl, updatedAt);
}