import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import imageCompression from 'browser-image-compression';

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

      // Optionally compress images for performance
      let fileToSend: File = file;
      if (file.type.startsWith('image/')) {
        try {
          const compressedBlob = await imageCompression(file, {
            maxWidthOrHeight: 1600,
            initialQuality: 0.8,
            fileType: 'image/webp',
            maxSizeMB: 1.2,
            useWebWorker: true,
          });
          fileToSend = new File(
            [compressedBlob],
            file.name.replace(/\.[^.]+$/, '.webp'),
            { type: 'image/webp' }
          );
        } catch (e) {
          console.warn('Compression failed, uploading original file');
        }
      }

      // Create form data
      const formData = new FormData();
      formData.append('file', fileToSend);
      formData.append('recipeSlug', recipeSlug);

      // Upload via edge function (multipart/form-data)
      const resp = await fetch('https://ojyckskucneljvuqzrsw.supabase.co/functions/v1/upload-recipe-image', {
        method: 'POST',
        body: formData,
      });
      const data = await resp.json().catch(() => ({} as any));

      if (!resp.ok || !data?.success) {
        throw new Error(data?.error || data?.details || `Upload failed (${resp.status})`);
      }

      const uploadedUrl = data.uploadedUrl || data.imageUrl;
      const { error: mappingError } = await supabase.functions.invoke('update-recipe-mapping', {
        body: {
          recipeSlug,
          imageUrl: uploadedUrl
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
        imageUrl: uploadedUrl
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