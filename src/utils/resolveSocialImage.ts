/**
 * Unified social image resolver for both SPA and Edge functions
 * Priority: social_image_url → inline_image_url → hero_image_url → default
 * Returns absolute HTTPS URL with cache-busting timestamp
 */

interface SocialImageOptions {
  social?: string | null;
  inline?: string | null;
  hero?: string | null;
  updatedAt?: string | null;
}

// Get absolute URL for both client and server environments
function absUrl(pathOrUrl: string): string {
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  
  // Try different environment variables based on context
  const base = 
    (typeof window !== 'undefined' ? window.location.origin : '') ||
    process.env.SITE_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : '') ||
    'https://bread-baking-hub.vercel.app';
                
  const normalizedPath = pathOrUrl.startsWith('/') ? pathOrUrl : `/${pathOrUrl}`;
  return new URL(normalizedPath, base).toString();
}

export function resolveSocialImage({ social, inline, hero, updatedAt }: SocialImageOptions): string {
  // Priority order: social → inline → hero → default
  const pick = social || inline || hero || '/og/default.jpg';
  const absolute = absUrl(pick);
  
  // Add cache-busting timestamp (epoch seconds for smaller URLs)
  const v = updatedAt ? `?v=${Math.floor(new Date(updatedAt).getTime() / 1000)}` : '';
  
  return absolute + v;
}

// Helper function to get social image with proper dimensions and format
export function getOptimizedSocialImageUrl(baseUrl: string): string {
  if (!baseUrl) return absUrl('/og/default.jpg');
  
  // If it's already a Supabase/Lovable image, add optimization params
  if (baseUrl.includes('lovable-uploads') || baseUrl.includes('supabase.co')) {
    const url = new URL(baseUrl);
    if (!url.searchParams.has('width')) {
      url.searchParams.set('width', '1200');
      url.searchParams.set('height', '630');
      url.searchParams.set('format', 'webp');
      url.searchParams.set('quality', '85');
    }
    return url.toString();
  }
  
  return absUrl(baseUrl);
}

// For backward compatibility with existing code
export default resolveSocialImage;