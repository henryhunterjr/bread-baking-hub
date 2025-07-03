import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Image, Upload, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface RecipeImageUploaderProps {
  recipeId?: string;
  currentImageUrl?: string;
  onImageUploaded: (imageUrl: string) => void;
  onImageRemoved: () => void;
}

export const RecipeImageUploader = ({ 
  recipeId, 
  currentImageUrl, 
  onImageUploaded, 
  onImageRemoved 
}: RecipeImageUploaderProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast({
          title: "File too large",
          description: "Please select an image under 10MB.",
          variant: "destructive",
        });
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !user) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}_recipe.${fileExt}`;

      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 100);

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('recipe-uploads')
        .upload(fileName, selectedFile);

      clearInterval(progressInterval);

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('recipe-uploads')
        .getPublicUrl(uploadData.path);

      setUploadProgress(100);
      onImageUploaded(publicUrl);
      setSelectedFile(null);

      toast({
        title: "Success",
        description: "Recipe image uploaded successfully!",
      });

    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Upload failed",
        description: "Failed to upload image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleRemove = () => {
    onImageRemoved();
    setSelectedFile(null);
  };

  return (
    <Card className="shadow-warm">
      <CardHeader>
        <CardTitle className="text-primary flex items-center gap-2">
          <Image className="h-5 w-5" />
          Recipe Photo
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {currentImageUrl && (
          <div className="relative">
            <img 
              src={currentImageUrl} 
              alt="Recipe" 
              className="w-full h-48 object-cover rounded-lg"
            />
            <Button
              variant="destructive"
              size="sm"
              className="absolute top-2 right-2"
              onClick={handleRemove}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}

        {!currentImageUrl && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="recipe-image" className="text-base font-semibold">
                Upload Recipe Photo
              </Label>
              <Input
                id="recipe-image"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="cursor-pointer touch-manipulation"
                disabled={isUploading}
              />
              {selectedFile && (
                <p className="text-sm text-muted-foreground">
                  Selected: {selectedFile.name}
                </p>
              )}
            </div>

            <Button 
              onClick={handleUpload}
              variant="outline" 
              disabled={!selectedFile || isUploading}
              className="w-full touch-manipulation"
            >
              <Upload className="h-4 w-4 mr-2" />
              {isUploading ? 'Uploading...' : 'Upload Photo'}
            </Button>

            {isUploading && (
              <div className="space-y-2">
                <Progress value={uploadProgress} className="h-2" />
                <p className="text-xs text-muted-foreground text-center">
                  Uploading image...
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};