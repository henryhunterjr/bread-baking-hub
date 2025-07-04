import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, Upload, Wand2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface ImageSectionProps {
  imageUrl: string;
  isOpen: boolean;
  onToggle: () => void;
  onUpdate: (value: string) => void;
}

export const ImageSection = ({ imageUrl, isOpen, onToggle, onUpdate }: ImageSectionProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
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
    try {
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}_recipe.${fileExt}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('recipe-uploads')
        .upload(fileName, selectedFile);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('recipe-uploads')
        .getPublicUrl(uploadData.path);

      onUpdate(publicUrl);
      setSelectedFile(null);

      toast({
        title: "Success",
        description: "Image uploaded successfully!",
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
    }
  };

  const handleGenerateImage = async () => {
    if (!aiPrompt.trim()) {
      toast({
        title: "Prompt required",
        description: "Please enter a description for the image you want to generate.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      // This would need an AI image generation service
      toast({
        title: "Coming soon",
        description: "AI image generation will be available soon!",
      });
    } catch (error) {
      toast({
        title: "Generation failed",
        description: "Failed to generate image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Collapsible open={isOpen} onOpenChange={onToggle}>
      <CollapsibleTrigger className="flex items-center justify-between w-full p-2 hover:bg-accent rounded">
        <h4 className="font-semibold">Recipe Image</h4>
        <ChevronDown className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")} />
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-4 mt-2">
        {/* Current Image */}
        {imageUrl && (
          <div className="relative">
            <img 
              src={imageUrl} 
              alt="Recipe preview" 
              className="w-full h-48 object-cover rounded border"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            <Button
              variant="destructive"
              size="sm"
              className="absolute top-2 right-2"
              onClick={() => onUpdate('')}
            >
              Remove
            </Button>
          </div>
        )}

        {/* Upload from Device */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Upload from Device</Label>
          <div className="flex gap-2">
            <Input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="cursor-pointer flex-1"
              disabled={isUploading}
            />
            <Button 
              onClick={handleUpload}
              disabled={!selectedFile || isUploading}
              className="shrink-0"
            >
              <Upload className="h-4 w-4 mr-1" />
              {isUploading ? 'Uploading...' : 'Upload'}
            </Button>
          </div>
          {selectedFile && (
            <p className="text-sm text-muted-foreground">
              Selected: {selectedFile.name}
            </p>
          )}
        </div>

        {/* AI Generation */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Generate with AI</Label>
          <div className="flex gap-2">
            <Input
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              placeholder="Describe the image you want (e.g., 'freshly baked sourdough bread')"
              className="flex-1"
              disabled={isGenerating}
            />
            <Button 
              onClick={handleGenerateImage}
              disabled={!aiPrompt.trim() || isGenerating}
              className="shrink-0"
            >
              <Wand2 className="h-4 w-4 mr-1" />
              {isGenerating ? 'Generating...' : 'Generate'}
            </Button>
          </div>
        </div>

        {/* Manual URL Entry */}
        <div className="space-y-2">
          <Label htmlFor="image_url" className="text-sm font-medium">Or enter image URL</Label>
          <Input
            id="image_url"
            value={imageUrl}
            onChange={(e) => onUpdate(e.target.value)}
            placeholder="https://example.com/recipe-image.jpg"
          />
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};