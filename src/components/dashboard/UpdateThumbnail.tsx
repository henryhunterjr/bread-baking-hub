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
  const [inlineImageUrl, setInlineImageUrl] = useState('');
  const [socialImageUrl, setSocialImageUrl] = useState('');
  const { toast } = useToast();

  const updateImages = async () => {
    if (!selectedPostId || (!inlineImageUrl && !socialImageUrl)) {
      toast({
        title: 'Error',
        description: 'Please select a post and enter at least one image URL',
        variant: 'destructive'
      });
      return;
    }

    setUpdating(true);
    try {
      const updateData: any = { id: selectedPostId };
      if (inlineImageUrl) updateData.inlineImageUrl = inlineImageUrl;
      if (socialImageUrl) updateData.socialImageUrl = socialImageUrl;

      const response = await supabase.functions.invoke('upsert-post', {
        body: updateData
      });
      
      if (response.error) {
        console.error(`Error updating post ${selectedPostId}:`, response.error);
        throw new Error('Failed to update post');
      }
      
      toast({
        title: 'Success',
        description: `Images updated for "${selectedPostTitle}"!`
      });
      setInlineImageUrl('');
      setSocialImageUrl('');
    } catch (error) {
      console.error('Failed to update images:', error);
      toast({
        title: 'Error',
        description: 'Failed to update images',
        variant: 'destructive'
      });
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg space-y-4">
      <h3 className="text-lg font-semibold">Update Post Images</h3>
      {selectedPostId ? (
        <p className="text-sm text-muted-foreground">
          Selected post: <span className="font-medium">{selectedPostTitle}</span>
        </p>
      ) : (
        <p className="text-sm text-muted-foreground">
          Select a post from the list below to update its images
        </p>
      )}
      
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Inline Thumbnail</label>
          <p className="text-xs text-muted-foreground">Main image that appears in the post content</p>
          <Input 
            placeholder="/lovable-uploads/your-inline-image.png"
            value={inlineImageUrl}
            onChange={(e) => setInlineImageUrl(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Social Preview</label>
          <p className="text-xs text-muted-foreground">Image shown when sharing on social media</p>
          <Input 
            placeholder="/lovable-uploads/your-social-image.png"
            value={socialImageUrl}
            onChange={(e) => setSocialImageUrl(e.target.value)}
          />
        </div>
      </div>
      
      <Button 
        onClick={updateImages}
        disabled={updating || !selectedPostId || (!inlineImageUrl && !socialImageUrl)}
      >
        {updating ? 'Updating...' : 'Update Images'}
      </Button>
    </div>
  );
};