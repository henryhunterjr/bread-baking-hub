import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Upload, Mail } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { submitContentDraft } from '@/utils/submitContent';

interface RecipeData {
  title: string;
  description?: string;
  ingredients: any[];
  method: any[];
  prepTime?: string;
  cookTime?: string;
  servings?: string;
}

interface RecipeToNewsletterConverterProps {
  onNewsletterCreated?: (newsletterData: { subject: string; content: string; preheader: string }) => void;
}

export const RecipeToNewsletterConverter: React.FC<RecipeToNewsletterConverterProps> = ({ 
  onNewsletterCreated 
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [recipeText, setRecipeText] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const { toast } = useToast();

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const uploadImage = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `newsletter-recipe-${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('hero-images')
      .upload(filePath, file);

    if (uploadError) {
      throw new Error(`Failed to upload image: ${uploadError.message}`);
    }

    const { data: { publicUrl } } = supabase.storage
      .from('hero-images')
      .getPublicUrl(filePath);

    return publicUrl;
  };

  const convertToNewsletter = async () => {
    if (!recipeText.trim()) {
      toast({
        title: "Error",
        description: "Please provide recipe content",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      let imageUrl = '';
      if (selectedImage) {
        imageUrl = await uploadImage(selectedImage);
      }

      // Call the edge function to convert recipe to newsletter
      const { data, error } = await supabase.functions.invoke('convert-recipe-to-newsletter', {
        body: {
          recipeText,
          imageUrl
        }
      });

      if (error) {
        throw new Error(error.message);
      }

      // Try to save as draft, but don't fail if it doesn't work
      try {
        await submitContentDraft('newsletter', {
          subject: data.subject,
          content: data.content,
          preheader: data.preheader
        });
      } catch (draftError) {
        console.warn('Failed to save draft to database, but conversion succeeded:', draftError);
      }

      toast({
        title: "Success",
        description: "Recipe converted to newsletter! Check the editor below to review and customize.",
      });

      // Pass the converted newsletter data to parent
      onNewsletterCreated?.({
        subject: data.subject,
        content: data.content,
        preheader: data.preheader
      });

      // Reset form
      setRecipeText('');
      setSelectedImage(null);
      setPreviewUrl('');

    } catch (error: any) {
      console.error('Error converting recipe to newsletter:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to convert recipe to newsletter",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          Recipe to Newsletter Converter
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="recipe-image">Recipe Image (Optional)</Label>
          <div className="flex items-center gap-4">
            <Input
              id="recipe-image"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="flex-1"
            />
            {previewUrl && (
              <div className="relative">
                <img
                  src={previewUrl}
                  alt="Recipe preview"
                  className="w-20 h-20 object-cover rounded-md border"
                />
              </div>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="recipe-content">Recipe Content</Label>
          <Textarea
            id="recipe-content"
            placeholder="Paste your complete recipe here including title, ingredients, instructions, and any additional notes..."
            value={recipeText}
            onChange={(e) => setRecipeText(e.target.value)}
            className="min-h-[300px] resize-vertical"
          />
          <p className="text-sm text-muted-foreground">
            Include the full recipe with title, ingredients list, instructions, prep/cook times, and any tips or notes.
          </p>
        </div>

        <Button 
          onClick={convertToNewsletter}
          disabled={isLoading || !recipeText.trim()}
          className="w-full"
          size="lg"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Converting Recipe to Newsletter...
            </>
          ) : (
            <>
              <Mail className="mr-2 h-4 w-4" />
              Convert to Newsletter
            </>
          )}
        </Button>

        <p className="text-sm text-muted-foreground text-center">
          This will automatically format your recipe into a professional newsletter with engaging copy, 
          proper structure, and save it as a draft ready for review and sending.
        </p>
      </CardContent>
    </Card>
  );
};