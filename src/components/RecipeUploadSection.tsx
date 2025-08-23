import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RecipeImportExport } from '@/components/RecipeImportExport';
import { RecipeTextInput } from '@/components/RecipeTextInput';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useIsMobile } from '@/hooks/use-mobile';
import { useToast } from '@/hooks/use-toast';
import { Upload, FileText, Image, AlertCircle, CheckCircle2 } from 'lucide-react';
import type { FormattedRecipe } from '@/types/recipe-workspace';
import imageCompression from 'browser-image-compression';
import { useNavigate } from 'react-router-dom';
import { logger } from '@/utils/logger';

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

      setUploadProgress(20);

      toast({
        title: "Upload Started",
        description: "Processing your recipe file...",
      });

      setUploadProgress(40);
      
      // Call format-recipe edge function with proper authorization
      const formatResp = await fetch('https://ojyckskucneljvuqzrsw.supabase.co/functions/v1/format-recipe', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9qeWNrc2t1Y25lbGp2dXF6cnN3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY3NDI0MTUsImV4cCI6MjA1MjMxODQxNX0.-Bx7Y0d_aMcHakE27Z5QKriY6KPpG1m8n0uuLaamFfY'}`
        },
        body: formData,
      });

      setUploadProgress(60);

      if (!formatResp.ok) {
        const errJson = await formatResp.json().catch(() => ({}));
        const errorMessage = errJson?.error || errJson?.message || `Failed to format recipe (${formatResp.status})`;
        
        // Log the detailed error for debugging
        logger.error('Format recipe error:', {
          status: formatResp.status,
          statusText: formatResp.statusText,
          error: errJson,
          headers: Object.fromEntries(formatResp.headers.entries())
        });
        
        setServerError(errorMessage);
        toast({
          title: 'Upload Failed',
          description: errorMessage,
          variant: 'destructive',
        });
        throw new Error(errorMessage);
      }

      setUploadProgress(80);

      const data = await formatResp.json() as any;
      
      let imageUrl = null;
      
      // Save recipe to database if user is logged in
      if (user && data.recipe) {
        try {
          
          // Compute a slug from the recipe title
          const slugFromTitle = data.recipe.title
            ?.toLowerCase()
            ?.replace(/[^a-z0-9\s-]/g, '')
            ?.trim()
            ?.replace(/\s+/g, '-');

          // Upload image via Edge Function (uses service role) so we don't depend on Storage RLS
          if (selectedFile.type.startsWith('image/') || selectedFile.type === 'application/pdf') {

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
              } catch (compressErr) {
                logger.warn('Image compression failed, sending original file', compressErr);
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
                logger.error('Image upload error:', msg);
                setServerError(msg);
                toast({ title: 'Image upload failed', description: msg, variant: 'destructive' });
              } else if (imgData?.uploadedUrl || imgData?.imageUrl) {
                imageUrl = imgData.uploadedUrl || imgData.imageUrl;
              }
            } catch (imgErr: any) {
              const msg = imgErr?.message || 'Image upload failed';
              logger.error('Image upload exception:', imgErr);
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
            logger.error('Error saving recipe via edge function:', msg);
            setServerError(msg);
            toast({ title: 'Save failed', description: msg, variant: 'destructive' });
          } else {
            toast({ title: 'Recipe saved!', description: 'Redirecting to your recipes...', variant: 'default' });
            navigate('/recipes');
          }
        } catch (saveError) {
          logger.error('Error saving recipe:', saveError);
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
      logger.error('Error formatting recipe:', error);
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
            How to Add Your Recipe
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <h4 className="font-semibold flex items-center gap-2">
                <Image className="h-4 w-4 text-primary" />
                Upload Files
              </h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• JPG, JPEG, PNG, PDF formats</li>
                <li>• Clear, readable text</li>
                <li>• Maximum 20MB file size</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary" />
                Type or Paste
              </h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Copy from websites or books</li>
                <li>• Type directly into the text area</li>
                <li>• JSON format also supported</li>
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

      {/* Upload/Import Tabs */}
      <Card className="shadow-warm">
        <CardHeader>
          <CardTitle className="text-primary">Add Your Recipe</CardTitle>
          <CardDescription>
            Choose to upload a file or manually enter your recipe
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="upload" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="upload">Upload File</TabsTrigger>
              <TabsTrigger value="manual">Type/Paste Recipe</TabsTrigger>
            </TabsList>
            
            <TabsContent value="upload" className="space-y-6">
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
            </TabsContent>
            
            <TabsContent value="manual" className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="recipe-text-input" className="text-base font-semibold">
                    Paste Recipe Text
                  </Label>
                  <p className="text-sm text-muted-foreground mb-3">
                    Copy and paste recipe text from websites, books, or your notes. Include ingredients and method sections.
                  </p>
                  <RecipeTextInput onRecipeFormatted={onRecipeFormatted} />
                </div>
                
                <div className="mt-6">
                  <RecipeImportExport 
                    onImport={(recipe) => {
                      console.log('Manual recipe imported:', recipe);
                      onRecipeFormatted(recipe);
                    }}
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {serverError && (
        <Alert variant="destructive" className="flex items-start gap-3">
          <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
          <div className="flex-1 space-y-3">
            <AlertDescription className="text-sm">
              <strong>Upload Failed:</strong> {serverError}
            </AlertDescription>
            <div className="flex flex-wrap gap-2">
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => {
                  setServerError(null);
                  if (selectedFile) {
                    handleSubmit({ preventDefault: () => {} } as React.FormEvent);
                  }
                }}
                disabled={!selectedFile || isLoading}
                className="h-8 text-xs"
              >
                Try Again
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                asChild
                className="h-8 text-xs"
              >
                <a href={`mailto:support@bakinggreatbread.com?subject=Recipe Format Error&body=I'm having trouble formatting a recipe. Error: ${encodeURIComponent(serverError)}`}>
                  Contact Support
                </a>
              </Button>
            </div>
          </div>
        </Alert>
      )}
    </div>
  );
};