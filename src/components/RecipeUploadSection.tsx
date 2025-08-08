import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useIsMobile } from '@/hooks/use-mobile';
import { useToast } from '@/hooks/use-toast';
import { Upload, FileText, Image, AlertCircle, CheckCircle2 } from 'lucide-react';
import type { FormattedRecipe } from '@/types/recipe-workspace';

interface RecipeUploadSectionProps {
  onRecipeFormatted: (recipe: FormattedRecipe, imageUrl?: string) => void;
  onError: (message: string) => void;
}


export const RecipeUploadSection = ({ onRecipeFormatted, onError }: RecipeUploadSectionProps) => {
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [validationError, setValidationError] = useState<string | null>(null);
  const { user } = useAuth();

  // File validation constants
  const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB
  const ALLOWED_TYPES = {
    'image/jpeg': 'JPEG Image',
    'image/jpg': 'JPG Image', 
    'image/png': 'PNG Image',
    'application/pdf': 'PDF Document'
  };

  const validateFile = (file: File): string | null => {
    // Check file type
    if (!Object.keys(ALLOWED_TYPES).includes(file.type)) {
      return `Unsupported file type. Please upload: ${Object.values(ALLOWED_TYPES).join(', ')}`;
    }
    
    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      return `File too large. Maximum size is ${(MAX_FILE_SIZE / (1024 * 1024)).toFixed(0)}MB`;
    }
    
    return null;
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const error = validateFile(file);
      if (error) {
        setValidationError(error);
        setSelectedFile(null);
        toast({
          title: "Invalid File",
          description: error,
          variant: "destructive",
        });
        return;
      }
      
      setValidationError(null);
      setSelectedFile(file);
      toast({
        title: "File Selected",
        description: `${file.name} (${formatFileSize(file.size)})`,
        variant: "default",
      });
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedFile) return;

    // Re-validate file before upload
    const validationError = validateFile(selectedFile);
    if (validationError) {
      setValidationError(validationError);
      toast({
        title: "Upload Failed",
        description: validationError,
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setUploadProgress(0);
    
    try {
      // Simulate progress stages
      setUploadProgress(10);
      
      const formData = new FormData();
      formData.append('file', selectedFile);

      console.log('Uploading file:', selectedFile.name, selectedFile.type, selectedFile.size);
      setUploadProgress(20);

      toast({
        title: "Upload Started",
        description: "Processing your recipe file...",
      });

      setUploadProgress(40);
      const response = await fetch('https://ojyckskucneljvuqzrsw.supabase.co/functions/v1/format-recipe', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9qeWNrc2t1Y25lbGp2dXF6cnN3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY3NDI0MTUsImV4cCI6MjA1MjMxODQxNX0.-Bx7Y0d_aMcHakE27Z5QKriY6KPpG1m8n0uuLaamFfY`,
        },
        body: formData,
      });

      setUploadProgress(60);

      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Response error:', errorText);
        
        let errorMessage = `Failed to format recipe: ${response.status} ${response.statusText}`;
        
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.error || errorMessage;
        } catch (parseError) {
          errorMessage = errorText || errorMessage;
        }
        
        toast({
          title: "Upload Failed",
          description: errorMessage,
          variant: "destructive",
        });
        
        throw new Error(errorMessage);
      }

      setUploadProgress(80);

      const data = await response.json();
      console.log('Received recipe data:', data);
      
      let imageUrl = null;
      
      // Save recipe to database if user is logged in
      if (user && data.recipe) {
        try {
          console.log('Saving recipe to database for user:', user.id);
          
          // Upload file to storage if user is logged in (images or PDFs)
          if (selectedFile.type.startsWith('image/') || selectedFile.type === 'application/pdf') {
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
      
      setUploadProgress(100);
      
      toast({
        title: "Success!",
        description: "Recipe formatted successfully",
        variant: "default",
      });
      
      onRecipeFormatted(data.recipe, imageUrl);
    } catch (error) {
      console.error('Error formatting recipe:', error);
      const errorMessage = error.message || "Failed to format your recipe. Please try again or check if your image is clear and readable.";
      
      toast({
        title: "Upload Error", 
        description: errorMessage,
        variant: "destructive",
      });
      
      onError(errorMessage);
    } finally {
      setIsLoading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="space-y-6">
      {/* Instructions Card */}
      <Card className="shadow-warm border-primary/20">
        <CardHeader className="pb-4">
          <CardTitle className="text-primary flex items-center gap-2">
            <Upload className="h-5 w-5" />
            How to Upload Your Recipe
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <h4 className="font-semibold flex items-center gap-2">
                <Image className="h-4 w-4 text-primary" />
                Image Files
              </h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• JPG, JPEG, PNG formats</li>
                <li>• Clear, readable text</li>
                <li>• Good lighting and focus</li>
                <li>• Maximum 20MB file size</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary" />
                PDF Documents
              </h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Text-based PDFs preferred</li>
                <li>• Scanned images also supported</li>
                <li>• Single or multi-page</li>
                <li>• Maximum 20MB file size</li>
              </ul>
            </div>
          </div>
          
          {validationError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{validationError}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Upload Card */}
      <Card className="shadow-warm">
        <CardHeader>
          <CardTitle className="text-primary">Upload Your Recipe</CardTitle>
          <CardDescription>
            Our AI will extract and format your recipe automatically
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="recipe-file" className="text-base font-semibold">
                Choose Recipe File
              </Label>
              <div className="relative">
                <Input
                  id="recipe-file"
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,application/pdf"
                  onChange={handleFileChange}
                  className="cursor-pointer touch-manipulation file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                  disabled={isLoading}
                />
              </div>
              
              {selectedFile && (
                <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <span className="font-medium">File Ready:</span>
                    <span>{selectedFile.name}</span>
                  </div>
                  <div className="text-xs text-muted-foreground flex gap-4">
                    <span>Type: {ALLOWED_TYPES[selectedFile.type as keyof typeof ALLOWED_TYPES]}</span>
                    <span>Size: {formatFileSize(selectedFile.size)}</span>
                  </div>
                </div>
              )}
            </div>
            
            <Button 
              type="submit" 
              variant="hero" 
              size="lg" 
              disabled={!selectedFile || isLoading || !!validationError}
              className="w-full touch-manipulation"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Formatting Recipe...
                </div>
              ) : (
                'Format My Recipe'
              )}
            </Button>
          </form>

          {isLoading && (
            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Processing your recipe...</span>
                <span className="text-primary font-semibold">{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} className="h-3" />
              <div className="text-center space-y-1">
                <p className="text-sm font-medium">
                  {uploadProgress < 20 && "Preparing file..."}
                  {uploadProgress >= 20 && uploadProgress < 60 && "Uploading to AI processor..."}
                  {uploadProgress >= 60 && uploadProgress < 80 && "Extracting recipe data..."}
                  {uploadProgress >= 80 && uploadProgress < 100 && "Finalizing recipe..."}
                  {uploadProgress >= 100 && "Complete!"}
                </p>
                <p className="text-xs text-muted-foreground">
                  This may take a few moments while our AI analyzes your recipe
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};