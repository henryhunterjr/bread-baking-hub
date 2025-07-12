import { supabase } from '@/integrations/supabase/client';

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
      heroBannerCache = '/lovable-uploads/bd157eb8-d847-4f54-913a-8483144ecb46.png';
      return heroBannerCache;
    }

    heroBannerCache = data?.setting_value || '/lovable-uploads/bd157eb8-d847-4f54-913a-8483144ecb46.png';
    return heroBannerCache;
  } catch (error) {
    console.error('Failed to load hero banner:', error);
    // Fallback to default
    heroBannerCache = '/lovable-uploads/bd157eb8-d847-4f54-913a-8483144ecb46.png';
    return heroBannerCache;
  }
};

// Clear cache when hero banner is updated
export const clearHeroBannerCache = () => {
  heroBannerCache = null;
};

// Get the best social image for sharing (with fallback chain)
export const getSocialImageUrl = (
  socialImageUrl?: string,
  inlineImageUrl?: string,
  heroBannerUrl?: string
): string => {
  return socialImageUrl || 
         inlineImageUrl || 
         heroBannerUrl || 
         '/lovable-uploads/bd157eb8-d847-4f54-913a-8483144ecb46.png';
};