import { supabase } from '@/integrations/supabase/client';
import { getHeroImageBySlug } from './heroImageMapping';

// Cache for hero banner URL to avoid repeated DB calls
let heroBannerCache: string | null = null;

export const getHeroBannerUrl = async (): Promise<string> => {
  if (heroBannerCache) {
    return heroBannerCache;
  }

  try {
    const { data, error } = await supabase
      .from('site_settings')
      .select('setting_value')
      .eq('setting_key', 'hero_banner_url')
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 is "not found" error
      console.error('Error loading hero banner:', error);
      // Fallback to default
    heroBannerCache = '/lovable-uploads/f2a6c7d6-5a78-4068-94bd-1810dd3ebd96.png';
      return heroBannerCache;
    }

    heroBannerCache = data?.setting_value || '/lovable-uploads/f2a6c7d6-5a78-4068-94bd-1810dd3ebd96.png';
    return heroBannerCache;
  } catch (error) {
    console.error('Failed to load hero banner:', error);
    // Fallback to default
    heroBannerCache = '/lovable-uploads/f2a6c7d6-5a78-4068-94bd-1810dd3ebd96.png';
    return heroBannerCache;
  }
};

// Clear cache when hero banner is updated
export const clearHeroBannerCache = () => {
  heroBannerCache = null;
};

// Get the best blog post hero image (with slug mapping and fallback chain)
export const getBlogPostHeroImage = (
  slug: string,
  heroImageUrl?: string,
  socialImageUrl?: string,
  inlineImageUrl?: string,
  heroBannerUrl?: string
): string => {
  console.log('getBlogPostHeroImage called with:', { slug, heroImageUrl, socialImageUrl, inlineImageUrl, heroBannerUrl });
  
  // First check the slug mapping for local hero images
  const mappedHeroImage = getHeroImageBySlug(slug);
  
  const result = mappedHeroImage || 
                 heroImageUrl || 
                 socialImageUrl || 
                 inlineImageUrl || 
                 heroBannerUrl || 
                 '/lovable-uploads/f2a6c7d6-5a78-4068-94bd-1810dd3ebd96.png';
  
  console.log('getBlogPostHeroImage returning:', result);
  return result;
};

import { getBlogImage } from './blogImageMapping';

// Get the best social image for sharing (with fallback chain) including hero image mapping
export const getSocialImageUrl = (
  socialImageUrl?: string,
  inlineImageUrl?: string,
  heroBannerUrl?: string,
  updatedAt?: string,
  slug?: string
): string => {
  console.log('getSocialImageUrl called with:', { socialImageUrl, inlineImageUrl, heroBannerUrl, updatedAt, slug });
  
  // Check blog image mapping first if slug is provided
  if (slug) {
    const mappedImage = getBlogImage(slug, socialImageUrl, heroBannerUrl, inlineImageUrl);
    if (mappedImage !== "/og/default.jpg") {
      console.log('getSocialImageUrl using mapped image:', mappedImage);
      return mappedImage;
    }
  }
  
  // Direct implementation to avoid circular dependencies and browser compatibility issues
  const defaultImageUrl = '/lovable-uploads/f2a6c7d6-5a78-4068-94bd-1810dd3ebd96.png';
  
  // Check hero image mapping by slug first if slug is provided
  let mappedHeroImage = null;
  if (slug) {
    mappedHeroImage = getHeroImageBySlug(slug);
    console.log('Hero image mapping result for slug:', slug, mappedHeroImage);
  }
  
  // Priority order for best social image: socialImageUrl > mappedHeroImage > inlineImageUrl > heroBannerUrl > default
  const candidates = [socialImageUrl, mappedHeroImage, inlineImageUrl, heroBannerUrl, defaultImageUrl].filter(Boolean);
  
  if (candidates.length === 0) {
    console.log('getSocialImageUrl returning default:', defaultImageUrl);
    return defaultImageUrl;
  }

  // Use the first available image
  const selectedImage = candidates[0];
  
  // Add cache busting if updatedAt is provided
  let result = selectedImage;
  if (updatedAt && selectedImage) {
    const separator = selectedImage.includes('?') ? '&' : '?';
    result = `${selectedImage}${separator}v=${new Date(updatedAt).getTime()}`;
  }
  
  console.log('getSocialImageUrl returning:', result);
  return result;
};