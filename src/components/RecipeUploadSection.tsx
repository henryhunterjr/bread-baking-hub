import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface RecipeUploadSectionProps {
  onRecipeFormatted: (recipe: any) => void;
  onError: (message: string) => void;
}

export const RecipeUploadSection = ({ onRecipeFormatted, onError }: RecipeUploadSectionProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

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

      const response = await fetch('https://ojyckskucneljvuqzrsw.supabase.co/functions/v1/format-recipe', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9qeWNrc2t1Y25lbGp2dXF6cnN3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY3NDI0MTUsImV4cCI6MjA1MjMxODQxNX0.-Bx7Y0d_aMcHakE27Z5QKriY6KPpG1m8n0uuLaamFfY`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to format recipe');
      }

      const data = await response.json();
      onRecipeFormatted(data.recipe);
    } catch (error) {
      console.error('Error formatting recipe:', error);
      onError("Failed to format your recipe. Please try again or check if your image is clear and readable.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="shadow-warm">
      <CardHeader>
        <CardTitle className="text-primary">Recipe Upload</CardTitle>
        <CardDescription>
          Supported formats: JPG, PNG, PDF (max 10MB)
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
              accept="image/*,.pdf"
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