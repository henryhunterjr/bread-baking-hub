import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const UpdateKaiserThumbnails = () => {
  const [updating, setUpdating] = useState(false);
  const { toast } = useToast();

  const kaiserPosts = [
    '365233f3-6d5c-400c-b2da-51277489533f',
    'bf0c1804-8258-46ee-8071-13171d804367', 
    'e81f0438-2b2d-4d64-80c7-bea69a2d9638',
    'dac85c19-8764-4ffe-ad43-3304594fbe91'
  ];

  const updateThumbnails = async () => {
    setUpdating(true);
    try {
      for (const postId of kaiserPosts) {
        const response = await supabase.functions.invoke('upsert-post', {
          body: {
            id: postId,
            heroImageUrl: '/lovable-uploads/a9ec437e-b37d-4689-8e28-e4e3d5347bdf.png'
          }
        });
        
        if (response.error) {
          console.error(`Error updating post ${postId}:`, response.error);
        }
      }
      
      toast({
        title: 'Success',
        description: 'Kaiser Roll post thumbnails updated successfully!'
      });
    } catch (error) {
      console.error('Failed to update thumbnails:', error);
      toast({
        title: 'Error',
        description: 'Failed to update thumbnails',
        variant: 'destructive'
      });
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg">
      <h3 className="text-lg font-semibold mb-2">Update Kaiser Roll Thumbnails</h3>
      <p className="text-sm text-muted-foreground mb-4">
        This will update all Kaiser Roll blog posts to use the new social sharing thumbnail.
      </p>
      <Button 
        onClick={updateThumbnails}
        disabled={updating}
      >
        {updating ? 'Updating...' : 'Update Thumbnails'}
      </Button>
    </div>
  );
};