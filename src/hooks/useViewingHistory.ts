import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface UseViewingHistoryProps {
  contentId: string;
  contentType: 'recipe' | 'blog_post' | 'glossary_term';
  contentTitle: string;
  contentUrl?: string;
}

export const useViewingHistory = ({ 
  contentId, 
  contentType, 
  contentTitle, 
  contentUrl 
}: UseViewingHistoryProps) => {
  const { user } = useAuth();

  useEffect(() => {
    if (!user || !contentId || !contentTitle) return;

    const startTime = Date.now();

    // Track page view on mount
    const trackView = async () => {
      try {
        await supabase
          .from('user_viewing_history')
          .upsert({
            user_id: user.id,
            content_type: contentType,
            content_id: contentId,
            content_title: contentTitle,
            content_url: contentUrl || window.location.href,
            viewed_at: new Date().toISOString()
          }, {
            onConflict: 'user_id,content_type,content_id'
          });
      } catch (error) {
        console.error('Error tracking view:', error);
      }
    };

    trackView();

    // Update view duration on unmount
    return () => {
      const viewDuration = Math.round((Date.now() - startTime) / 1000);
      
      if (viewDuration > 5) { // Only track if viewed for more than 5 seconds
        supabase
          .from('user_viewing_history')
          .update({ 
            view_duration: viewDuration,
            viewed_at: new Date().toISOString() // Update to latest view time
          })
          .eq('user_id', user.id)
          .eq('content_type', contentType)
          .eq('content_id', contentId)
          .then(() => {
            // Silently update, no error handling needed
          });
      }
    };
  }, [user, contentId, contentType, contentTitle, contentUrl]);
};

export default useViewingHistory;