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
import imageCompression from 'browser-image-compression';
import { useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);

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
    setServerError(null);

    try {
      // Progress stages
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
      const formatResp = await fetch('https://ojyckskucneljvuqzrsw.supabase.co/functions/v1/format-recipe', {
        method: 'POST',
        body: formData,
      });

      setUploadProgress(60);

      if (!formatResp.ok) {
        const errJson = await formatResp.json().catch(() => ({} as any));
        const errorMessage = errJson?.error || errJson?.message || `Failed to format recipe (${formatResp.status})`;
        toast({
          title: 'Upload Failed',
          description: errorMessage,
          variant: 'destructive',
        });
        throw new Error(errorMessage);
      }

      setUploadProgress(80);

      const data = await formatResp.json() as any;
      console.log('Received recipe data:', data);
      
      let imageUrl = null;
      
      // Save recipe to database if user is logged in
      if (user && data.recipe) {
        try {
          console.log('Saving recipe to database for user:', user.id);
          
          // Compute a slug from the recipe title
          const slugFromTitle = data.recipe.title
            ?.toLowerCase()
            ?.replace(/[^a-z0-9\s-]/g, '')
            ?.trim()
            ?.replace(/\s+/g, '-');

          // Upload image via Edge Function (uses service role) so we don't depend on Storage RLS
          if (selectedFile.type.startsWith('image/') || selectedFile.type === 'application/pdf') {
            console.log('Uploading image via edge function...');

            // Compress images client-side for performance (keep original for AI processing)
            let fileToSend: File = selectedFile;
            if (selectedFile.type.startsWith('image/')) {
              try {
                const compressedBlob = await imageCompression(selectedFile, {
                  maxWidthOrHeight: 1600,
                  initialQuality: 0.8,
                  fileType: 'image/webp',
                  maxSizeMB: 1.2,
                  useWebWorker: true,
                });
                fileToSend = new File([compressedBlob], selectedFile.name.replace(/\.[^.]+$/, '.webp'), {
                  type: 'image/webp',
                });
                console.log('Compressed image from', selectedFile.size, 'to', fileToSend.size, 'bytes');
              } catch (compressErr) {
                console.warn('Image compression failed, sending original file', compressErr);
              }
            }

            const uploadForm = new FormData();
            uploadForm.append('file', fileToSend);
            uploadForm.append('recipeSlug', slugFromTitle || `recipe-${Date.now()}`);

            try {
              const resp = await fetch('https://ojyckskucneljvuqzrsw.supabase.co/functions/v1/upload-recipe-image', {
                method: 'POST',
                body: uploadForm,
              });
              const imgData = await resp.json().catch(() => ({}));
              if (!resp.ok || !imgData?.success) {
                const msg = imgData?.error || imgData?.details || `Upload failed (${resp.status})`;
                console.error('Image upload error:', msg);
                setServerError(msg);
                toast({ title: 'Image upload failed', description: msg, variant: 'destructive' });
              } else if (imgData?.uploadedUrl || imgData?.imageUrl) {
                imageUrl = imgData.uploadedUrl || imgData.imageUrl;
                console.log('Edge function file URL:', imageUrl);
              }
            } catch (imgErr: any) {
              const msg = imgErr?.message || 'Image upload failed';
              console.error('Image upload exception:', imgErr);
              setServerError(msg);
              toast({ title: 'Image upload failed', description: msg, variant: 'destructive' });
            }
          }
          
          const tags: string[] = [];
          if (data.recipe.course) tags.push(String(data.recipe.course));
          if (data.recipe.cuisine) tags.push(String(data.recipe.cuisine));

          const { data: upsertData, error: upsertError } = await supabase.functions.invoke('upsert-recipe', {
            body: {
              title: data.recipe.title,
              slug: slugFromTitle || null,
              data: data.recipe,
              imageUrl: imageUrl,
              tags,
              folder: null,
              isPublic: false,
              userId: user.id,
            },
          });
          
          if (upsertError || !upsertData?.success) {
            const msg = (upsertError as any)?.message || (upsertData as any)?.error || 'Failed to save recipe';
            console.error('Error saving recipe via edge function:', msg);
            setServerError(msg);
            toast({ title: 'Save failed', description: msg, variant: 'destructive' });
          } else {
            console.log('Recipe saved successfully via edge function');
            toast({ title: 'Recipe saved!', description: 'Redirecting to your recipes...', variant: 'default' });
            navigate('/recipes');
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
    } catch (error: any) {
      console.error('Error formatting recipe:', error);
      const errorMessage = error?.message || 'Unexpected error';
      setServerError(errorMessage);
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
                  {uploadProgress < 25 && "Uploading…"}
                  {uploadProgress >= 25 && uploadProgress < 60 && "Extracting…"}
                  {uploadProgress >= 60 && uploadProgress < 100 && "Formatting…"}
                  {uploadProgress >= 100 && "Done"}
                </p>
                <p className="text-xs text-muted-foreground">
                  This may take a few moments while our AI analyzes your recipe
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {serverError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{serverError}</AlertDescription>
        </Alert>
      )}
    </div>
  );
};