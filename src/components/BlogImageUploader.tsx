import { useState, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Upload, Copy, X, Image as ImageIcon } from 'lucide-react';

interface ImageMetadata {
  altText: string;
  metaDescription: string;
  postTitle: string;
}

interface UploadedImage {
  id: string;
  filename: string;
  publicUrl: string;
  altText: string;
  metaDescription?: string;
  postTitle?: string;
  dimensions?: { width: number; height: number };
  fileSize: number;
}

export const BlogImageUploader = () => {
  const { user } = useAuth();
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<UploadedImage | null>(null);
  const [metadata, setMetadata] = useState<ImageMetadata>({
    altText: '',
    metaDescription: '',
    postTitle: ''
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const slugify = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  };

  const getImageDimensions = (file: File): Promise<{ width: number; height: number }> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        resolve({ width: img.naturalWidth, height: img.naturalHeight });
      };
      img.src = URL.createObjectURL(file);
    });
  };

  const generateFilePath = (filename: string, postTitle?: string) => {
    const now = new Date();
    const yearMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const slugifiedTitle = postTitle ? slugify(postTitle) : 'general';
    const slugifiedFilename = slugify(filename.split('.')[0]) + '.' + filename.split('.').pop();
    
    return `${yearMonth}/${slugifiedTitle}/${slugifiedFilename}`;
  };

  const handleFileUpload = async (file: File) => {
    console.log('handleFileUpload called with file:', file.name);
    if (!user) {
      console.log('No user found');
      return;
    }
    
    if (!metadata.altText.trim()) {
      console.log('No alt text provided');
      toast({
        title: "Alt text required",
        description: "Please provide alt text for accessibility before uploading.",
        variant: "destructive"
      });
      return;
    }

    console.log('Starting upload process...');
    setUploading(true);
    try {
      // Get image dimensions
      console.log('Getting image dimensions...');
      const dimensions = await getImageDimensions(file);
      console.log('Dimensions:', dimensions);
      
      // Generate file path
      const filePath = generateFilePath(file.name, metadata.postTitle);
      console.log('Generated file path:', filePath);
      
      // Upload to Supabase Storage
      console.log('Uploading to Supabase storage...');
      const { error: uploadError } = await supabase.storage
        .from('blog-images')
        .upload(filePath, file);

      if (uploadError) {
        console.error('Storage upload error:', uploadError);
        throw uploadError;
      }
      console.log('File uploaded successfully to storage');

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('blog-images')
        .getPublicUrl(filePath);
      console.log('Public URL:', publicUrl);

      // Save metadata to database
      console.log('Saving metadata to database...');
      const { data: metadataRecord, error: metadataError } = await supabase
        .from('blog_images_metadata')
        .insert({
          user_id: user.id,
          file_path: filePath,
          filename: file.name,
          alt_text: metadata.altText || slugify(file.name.split('.')[0]),
          meta_description: metadata.metaDescription || null,
          post_title: metadata.postTitle || null,
          file_size: file.size,
          dimensions,
          public_url: publicUrl
        })
        .select()
        .single();

      if (metadataError) {
        console.error('Database metadata error:', metadataError);
        throw metadataError;
      }
      console.log('Metadata saved:', metadataRecord);

      setUploadedImage({
        id: metadataRecord.id,
        filename: file.name,
        publicUrl,
        altText: metadataRecord.alt_text,
        metaDescription: metadataRecord.meta_description,
        postTitle: metadataRecord.post_title,
        dimensions,
        fileSize: file.size
      });

      toast({
        title: "Image uploaded successfully",
        description: `${file.name} has been uploaded to blog-images.`
      });

    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: "Failed to upload image. Please try again.",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find(file => file.type.startsWith('image/'));
    
    if (imageFile) {
      handleFileUpload(imageFile);
    } else {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file.",
        variant: "destructive"
      });
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: `${type} copied`,
      description: "Copied to clipboard successfully."
    });
  };

  const generateMarkdown = () => {
    if (!uploadedImage) return '';
    return `![${uploadedImage.altText}](${uploadedImage.publicUrl})`;
  };

  const resetUpload = () => {
    setUploadedImage(null);
    setMetadata({
      altText: '',
      metaDescription: '',
      postTitle: ''
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ImageIcon className="w-5 h-5" />
          Blog Image Uploader
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Metadata Form */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="alt-text">Alt Text (required for accessibility)</Label>
            <Input
              id="alt-text"
              value={metadata.altText}
              onChange={(e) => setMetadata(prev => ({ ...prev, altText: e.target.value }))}
              placeholder="Required - describe the image"
              required
            />
          </div>
          <div>
            <Label htmlFor="post-title">Post Title (for folder)</Label>
            <Input
              id="post-title"
              value={metadata.postTitle}
              onChange={(e) => setMetadata(prev => ({ ...prev, postTitle: e.target.value }))}
              placeholder="Optional post title"
            />
          </div>
          <div>
            <Label htmlFor="meta-desc">Meta Description</Label>
            <Input
              id="meta-desc"
              value={metadata.metaDescription}
              onChange={(e) => setMetadata(prev => ({ ...prev, metaDescription: e.target.value }))}
              placeholder="Optional SEO description"
            />
          </div>
        </div>

        {/* Upload Area */}
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            isDragging
              ? 'border-primary bg-primary/5'
              : 'border-muted-foreground/25 hover:border-primary/50'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {uploading ? (
            <div className="space-y-2">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
              <p>Uploading image...</p>
            </div>
          ) : uploadedImage ? (
            <div className="space-y-4">
              <img
                src={uploadedImage.publicUrl}
                alt={uploadedImage.altText}
                className="max-h-48 mx-auto rounded border"
              />
              <div className="flex items-center justify-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {uploadedImage.filename} • {Math.round(uploadedImage.fileSize / 1024)}KB
                  {uploadedImage.dimensions && (
                    <> • {uploadedImage.dimensions.width}×{uploadedImage.dimensions.height}</>
                  )}
                </span>
                <Button variant="ghost" size="sm" onClick={resetUpload}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <Upload className="w-12 h-12 mx-auto text-muted-foreground" />
              <div>
                <p className="text-lg font-medium">Drop image here or click to upload</p>
                <p className="text-sm text-muted-foreground">Supports JPG, PNG, WebP, GIF</p>
              </div>
              <Button 
                variant="outline" 
                onClick={() => {
                  if (!metadata.altText.trim()) {
                    toast({
                      title: "Alt text required",
                      description: "Please provide alt text before selecting a file.",
                      variant: "destructive"
                    });
                    return;
                  }
                  fileInputRef.current?.click();
                }}
              >
                Choose File
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
          )}
        </div>

        {/* Copy Actions */}
        {uploadedImage && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Label className="text-sm font-medium">Direct URL:</Label>
              <code className="flex-1 text-xs bg-muted p-2 rounded border">
                {uploadedImage.publicUrl}
              </code>
              <Button
                size="sm"
                variant="outline"
                onClick={() => copyToClipboard(uploadedImage.publicUrl, 'URL')}
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Label className="text-sm font-medium">Markdown:</Label>
              <code className="flex-1 text-xs bg-muted p-2 rounded border">
                {generateMarkdown()}
              </code>
              <Button
                size="sm"
                variant="outline"
                onClick={() => copyToClipboard(generateMarkdown(), 'Markdown')}
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};