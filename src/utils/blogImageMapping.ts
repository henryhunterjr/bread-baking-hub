/**
 * Blog Post Image Mapping
 * Maps blog post slugs to their correct social/hero images
 */

export const blogImageMapping: Record<string, string> = {
  "the-man-behind-wire-monkey": "/blog/interview-with-tyley.png",
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
    console.log(`[getBlogImage] Using mapping for ${slug}:`, blogImageMapping[slug]);
    return blogImageMapping[slug];
  }
  
  // Fall back to provided URLs in priority order
  const candidates = [socialImageUrl, heroImageUrl, inlineImageUrl].filter(
    url => url && url.trim() !== ""
  );
  
  return candidates[0] || "/og/default.jpg";
}
