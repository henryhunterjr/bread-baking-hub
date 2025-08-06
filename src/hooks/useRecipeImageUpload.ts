import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface UploadResult {
  success: boolean;
  imageUrl?: string;
  error?: string;
}

export const useRecipeImageUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const uploadRecipeImage = async (file: File, recipeSlug: string): Promise<UploadResult> => {
    setIsUploading(true);
    
    try {
      // Validate file
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        throw new Error('Invalid file type. Only JPG, PNG, and WebP are allowed.');
      }

      if (file.size > 10 * 1024 * 1024) {
        throw new Error('File too large. Maximum size is 10MB.');
      }

      // Create form data
      const formData = new FormData();
      formData.append('file', file);
      formData.append('recipeSlug', recipeSlug);

      // Upload via edge function
      const { data, error } = await supabase.functions.invoke('upload-recipe-image', {
        body: formData,
      });

      if (error) {
        throw new Error(error.message || 'Upload failed');
      }

      if (!data.success) {
        throw new Error(data.error || 'Upload failed');
      }

      // Update recipe mapping
      const { error: mappingError } = await supabase.functions.invoke('update-recipe-mapping', {
        body: {
          recipeSlug,
          imageUrl: data.imageUrl
        }
      });

      if (mappingError) {
        console.warn('Failed to update mapping:', mappingError);
        toast({
          title: "Image uploaded",
          description: `Image uploaded successfully! Mapping update needed for ${recipeSlug}`,
          variant: "default"
        });
      } else {
        toast({
          title: "Success",
          description: `Recipe image updated for ${recipeSlug}`,
          variant: "default"
        });
      }

      return {
        success: true,
        imageUrl: data.imageUrl
      };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Upload failed';
      
      toast({
        title: "Upload failed",
        description: errorMessage,
        variant: "destructive"
      });

      return {
        success: false,
        error: errorMessage
      };
    } finally {
      setIsUploading(false);
    }
  };

  const detectRecipeFromText = (text: string): string | null => {
    // Simple recipe detection patterns
    const patterns = [
      /this (?:image )?is for (?:the )?(.+?)(?:\s*recipe)?$/i,
      /(?:update|fix) (?:the )?(.+?)(?:\s*recipe)?(?:\s*image)?$/i,
      /(.+?)(?:\s*recipe)?(?:\s*image)?$/i
    ];

    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        // Convert to slug format
        return match[1]
          .toLowerCase()
          .replace(/[^a-z0-9\s]/g, '')
          .replace(/\s+/g, '-')
          .trim();
      }
    }

    return null;
  };

  return {
    uploadRecipeImage,
    detectRecipeFromText,
    isUploading
  };
};