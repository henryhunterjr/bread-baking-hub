/**
 * Blog Post Image Mapping
 * Maps blog post slugs to their correct social/hero images
 */

export const blogImageMapping: Record<string, string> = {
  "the-man-behind-wire-monkey": "https://ojyckskucneljvuqzrsw.supabase.co/storage/v1/object/public/blog-images/2025-12/the-man-behind-wire-monkey/tyler.png",
};

/**
 * Get the correct image for a blog post based on its slug
 * Falls back to provided URLs if no mapping exists
 */
export function getBlogImage(
  slug: string,
  socialImageUrl?: string,
  heroImageUrl?: string,
  inlineImageUrl?: string
): string {
  // Check mapping first
  if (blogImageMapping[slug]) {
    const mappedPath = blogImageMapping[slug];
    console.log(`[getBlogImage] Using mapping for ${slug}:`, mappedPath);
    // Ensure absolute URL for social media
    if (!mappedPath.startsWith('http')) {
      return `${window.location.origin}${mappedPath.startsWith('/') ? '' : '/'}${mappedPath}`;
    }
    return mappedPath;
  }
  
  // Fall back to provided URLs in priority order
  const candidates = [socialImageUrl, heroImageUrl, inlineImageUrl].filter(
    url => url && url.trim() !== ""
  );
  
  return candidates[0] || "/og/default.jpg";
}
