import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface RecipeUploadSectionProps {
  onRecipeFormatted: (recipe: any, imageUrl?: string) => void;
  onError: (message: string) => void;
}

export const RecipeUploadSection = ({ onRecipeFormatted, onError }: RecipeUploadSectionProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedFile) return;

    setIsLoading(true);
    
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      console.log('Uploading file:', selectedFile.name, selectedFile.type, selectedFile.size);

      const response = await fetch('https://ojyckskucneljvuqzrsw.supabase.co/functions/v1/format-recipe', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9qeWNrc2t1Y25lbGp2dXF6cnN3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY3NDI0MTUsImV4cCI6MjA1MjMxODQxNX0.-Bx7Y0d_aMcHakE27Z5QKriY6KPpG1m8n0uuLaamFfY`,
        },
        body: formData,
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Response error:', errorText);
        
        try {
          const errorData = JSON.parse(errorText);
          throw new Error(errorData.error || `Failed to format recipe: ${response.status} ${response.statusText}`);
        } catch (parseError) {
          throw new Error(`Failed to format recipe: ${response.status} ${response.statusText}`);
        }
      }

      const data = await response.json();
      console.log('Received recipe data:', data);
      
      let imageUrl = null;
      
      // Save recipe to database if user is logged in
      if (user && data.recipe) {
        try {
          console.log('Saving recipe to database for user:', user.id);
          
          // Upload image to storage if user is logged in
          if (selectedFile.type.startsWith('image/')) {
            console.log('Uploading image to storage...');
            const fileExt = selectedFile.name.split('.').pop();
            const fileName = `${user.id}/${Date.now()}.${fileExt}`;
            
            const { data: uploadData, error: uploadError } = await supabase.storage
              .from('recipe-uploads')
              .upload(fileName, selectedFile);
            
            if (uploadError) {
              console.error('Error uploading image:', uploadError);
            } else {
              console.log('Image uploaded successfully:', uploadData.path);
              
              // Get public URL for the uploaded image
              const { data: { publicUrl } } = supabase.storage
                .from('recipe-uploads')
                .getPublicUrl(uploadData.path);
              
              imageUrl = publicUrl;
              console.log('Image public URL:', imageUrl);
            }
          }
          
          const { error: saveError } = await supabase
            .from('recipes')
            .insert({
              user_id: user.id,
              title: data.recipe.title,
              data: data.recipe,
              image_url: imageUrl
            });
          
          if (saveError) {
            console.error('Error saving recipe:', saveError);
            // Don't fail the whole operation if saving fails
          } else {
            console.log('Recipe saved successfully to database');
          }
        } catch (saveError) {
          console.error('Error saving recipe:', saveError);
          // Don't fail the whole operation if saving fails
        }
      }
      
      onRecipeFormatted(data.recipe, imageUrl);
    } catch (error) {
      console.error('Error formatting recipe:', error);
      onError(error.message || "Failed to format your recipe. Please try again or check if your image is clear and readable.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="shadow-warm">
      <CardHeader>
        <CardTitle className="text-primary">Recipe Upload</CardTitle>
        <CardDescription>
          Supported formats: JPG, PNG (max 10MB). Convert PDFs to images first.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="recipe-file" className="text-base font-semibold">
              Choose Recipe File
            </Label>
            <Input
              id="recipe-file"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="cursor-pointer"
              disabled={isLoading}
            />
            {selectedFile && (
              <p className="text-sm text-muted-foreground">
                Selected: {selectedFile.name}
              </p>
            )}
          </div>
          
          <Button 
            type="submit" 
            variant="hero" 
            size="lg" 
            disabled={!selectedFile || isLoading}
            className="w-full"
          >
            {isLoading ? 'Formatting Recipe...' : 'Format My Recipe'}
          </Button>
        </form>

        {isLoading && (
          <div className="mt-6 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Processing your recipe...</span>
              <span className="text-primary font-semibold">Please wait</span>
            </div>
            <Progress value={33} className="h-2" />
            <p className="text-xs text-muted-foreground text-center">
              This may take a few moments while our AI analyzes your recipe
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};