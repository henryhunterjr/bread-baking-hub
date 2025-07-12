import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface UpdateThumbnailProps {
  selectedPostId?: string;
  selectedPostTitle?: string;
}

export const UpdateThumbnail = ({ selectedPostId, selectedPostTitle }: UpdateThumbnailProps) => {
  const [updating, setUpdating] = useState(false);
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const { toast } = useToast();

  const updateThumbnail = async () => {
    if (!selectedPostId || !thumbnailUrl) {
      toast({
        title: 'Error',
        description: 'Please select a post and enter a thumbnail URL',
        variant: 'destructive'
      });
      return;
    }

    setUpdating(true);
    try {
      const response = await supabase.functions.invoke('upsert-post', {
        body: {
          id: selectedPostId,
          heroImageUrl: thumbnailUrl
        }
      });
      
      if (response.error) {
        console.error(`Error updating post ${selectedPostId}:`, response.error);
        throw new Error('Failed to update post');
      }
      
      toast({
        title: 'Success',
        description: `Thumbnail updated for "${selectedPostTitle}"!`
      });
      setThumbnailUrl('');
    } catch (error) {
      console.error('Failed to update thumbnail:', error);
      toast({
        title: 'Error',
        description: 'Failed to update thumbnail',
        variant: 'destructive'
      });
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg space-y-4">
      <h3 className="text-lg font-semibold">Update Post Thumbnail</h3>
      {selectedPostId ? (
        <p className="text-sm text-muted-foreground">
          Selected post: <span className="font-medium">{selectedPostTitle}</span>
        </p>
      ) : (
        <p className="text-sm text-muted-foreground">
          Select a post from the list below to update its thumbnail
        </p>
      )}
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Thumbnail URL</label>
        <Input 
          placeholder="/lovable-uploads/your-image.png"
          value={thumbnailUrl}
          onChange={(e) => setThumbnailUrl(e.target.value)}
        />
      </div>
      
      <Button 
        onClick={updateThumbnail}
        disabled={updating || !selectedPostId || !thumbnailUrl}
      >
        {updating ? 'Updating...' : 'Update Thumbnail'}
      </Button>
    </div>
  );
};