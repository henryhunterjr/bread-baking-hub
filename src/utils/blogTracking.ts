import { supabase } from '@/integrations/supabase/client';

interface BlogClickData {
  post_id: string;
  post_title: string;
  post_url: string;
  category_names?: string[];
  referrer_page?: string;
}

export const trackBlogClick = async (clickData: BlogClickData) => {
  try {
    // Get current page as referrer
    const referrerPage = window.location.pathname;
    
    await supabase.functions.invoke('track-blog-click', {
      body: {
        ...clickData,
        referrer_page: referrerPage
      }
    });
    
    console.log('Blog click tracked:', clickData.post_title);
  } catch (error) {
    console.error('Failed to track blog click:', error);
    // Don't throw - tracking failures shouldn't break user experience
  }
};