import { useState, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Upload, Copy, Video as VideoIcon } from 'lucide-react';
import { logger } from '@/utils/logger';
import { Progress } from '@/components/ui/progress';

interface VideoMetadata {
  altText: string;
  description: string;
  postTitle: string;
}

interface UploadedVideo {
  id: string;
  filename: string;
  publicUrl: string;
  altText: string;
  description?: string;
  postTitle?: string;
  fileSize: number;
  duration?: number;
}

export const BlogVideoUploader = () => {
  const { user } = useAuth();
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedVideo, setUploadedVideo] = useState<UploadedVideo | null>(null);
  const [metadata, setMetadata] = useState<VideoMetadata>({
    altText: '',
    description: '',
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

  const getVideoDuration = (file: File): Promise<number> => {
    return new Promise((resolve) => {
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.onloadedmetadata = () => {
        window.URL.revokeObjectURL(video.src);
        resolve(video.duration);
      };
      video.onerror = () => resolve(0);
      video.src = URL.createObjectURL(file);
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
    if (!user) {
      logger.warn('No user found for file upload');
      return;
    }

    // Validate file type
    if (file.type !== 'video/mp4') {
      toast({
        title: "Invalid file type",
        description: "Only MP4 video files are supported.",
        variant: "destructive"
      });
      return;
    }

    // Validate file size (100MB)
    const maxSize = 100 * 1024 * 1024;
    if (file.size > maxSize) {
      toast({
        title: "File too large",
        description: "Video must be under 100MB.",
        variant: "destructive"
      });
      return;
    }
    
    if (!metadata.altText.trim()) {
      toast({
        title: "Alt text required",
        description: "Please provide alt text/title before uploading.",
        variant: "destructive"
      });
      return;
    }

    setUploading(true);
    setUploadProgress(0);
    
    try {
      // Get video duration
      const duration = await getVideoDuration(file);
      
      // Generate file path
      const filePath = generateFilePath(file.name, metadata.postTitle);
      
      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('blog-videos')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        logger.error('Storage upload error:', uploadError);
        throw uploadError;
      }

      setUploadProgress(100);

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('blog-videos')
        .getPublicUrl(filePath);

      // Save metadata to database
      const { data: metadataRecord, error: metadataError } = await supabase
        .from('blog_videos_metadata')
        .insert({
          user_id: user.id,
          file_path: filePath,
          filename: file.name,
          alt_text: metadata.altText || slugify(file.name.split('.')[0]),
          description: metadata.description || null,
          post_title: metadata.postTitle || null,
          file_size: file.size,
          duration,
          public_url: publicUrl
        })
        .select()
        .single();

      if (metadataError) {
        logger.error('Database metadata error:', metadataError);
        throw metadataError;
      }

      setUploadedVideo({
        id: metadataRecord.id,
        filename: file.name,
        publicUrl,
        altText: metadataRecord.alt_text,
        description: metadataRecord.description,
        postTitle: metadataRecord.post_title,
        fileSize: file.size,
        duration
      });

      toast({
        title: "Video uploaded successfully",
        description: `${file.name} has been uploaded to blog-videos.`
      });

    } catch (error) {
      logger.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: "Failed to upload video. Please try again.",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
      setUploadProgress(0);
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
    const videoFile = files.find(file => file.type === 'video/mp4');
    
    if (videoFile) {
      handleFileUpload(videoFile);
    } else {
      toast({
        title: "Invalid file type",
        description: "Please upload an MP4 video file.",
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

  const generateVideoEmbed = () => {
    if (!uploadedVideo) return '';
    return `<video controls width="100%" style="max-width: 800px; border-radius: 8px;">
  <source src="${uploadedVideo.publicUrl}" type="video/mp4" />
  Your browser does not support the video tag.
</video>`;
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return '';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const resetUpload = () => {
    setUploadedVideo(null);
    setMetadata({
      altText: '',
      description: '',
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
          <VideoIcon className="w-5 h-5" />
          Blog Video Uploader
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Metadata Form */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="video-alt-text">Video Title / Alt Text (required)</Label>
            <Input
              id="video-alt-text"
              value={metadata.altText}
              onChange={(e) => setMetadata(prev => ({ ...prev, altText: e.target.value }))}
              placeholder="Required - describe the video"
              required
            />
          </div>
          <div>
            <Label htmlFor="video-post-title">Post Title (for folder)</Label>
            <Input
              id="video-post-title"
              value={metadata.postTitle}
              onChange={(e) => setMetadata(prev => ({ ...prev, postTitle: e.target.value }))}
              placeholder="Optional post title"
            />
          </div>
          <div>
            <Label htmlFor="video-desc">Description</Label>
            <Input
              id="video-desc"
              value={metadata.description}
              onChange={(e) => setMetadata(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Optional description"
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
            <div className="space-y-4">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
              <p>Uploading video...</p>
              {uploadProgress > 0 && (
                <Progress value={uploadProgress} className="w-full max-w-xs mx-auto" />
              )}
            </div>
          ) : uploadedVideo ? (
            <div className="space-y-4">
              <video
                src={uploadedVideo.publicUrl}
                controls
                className="max-h-64 mx-auto rounded border"
                preload="metadata"
              >
                Your browser does not support the video tag.
              </video>
              <div className="text-center space-y-3">
                <div className="flex items-center justify-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    {uploadedVideo.filename} • {Math.round(uploadedVideo.fileSize / (1024 * 1024))}MB
                    {uploadedVideo.duration && (
                      <> • {formatDuration(uploadedVideo.duration)}</>
                    )}
                  </span>
                </div>
                <Button 
                  variant="outline" 
                  onClick={resetUpload}
                  className="touch-manipulation"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Another Video
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <VideoIcon className="w-12 h-12 mx-auto text-muted-foreground" />
              <div>
                <p className="text-lg font-medium">Drop MP4 video here or click to upload</p>
                <p className="text-sm text-muted-foreground">Maximum size: 100MB</p>
              </div>
              <Button 
                variant="outline" 
                onClick={() => {
                  if (!metadata.altText.trim()) {
                    toast({
                      title: "Alt text required",
                      description: "Please provide a title/alt text before selecting a file.",
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
                accept="video/mp4"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
          )}
        </div>

        {/* Copy Actions */}
        {uploadedVideo && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Label className="text-sm font-medium">Direct URL:</Label>
              <code className="flex-1 text-xs bg-muted p-2 rounded border overflow-x-auto">
                {uploadedVideo.publicUrl}
              </code>
              <Button
                size="sm"
                variant="outline"
                onClick={() => copyToClipboard(uploadedVideo.publicUrl, 'URL')}
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex items-start gap-2">
              <Label className="text-sm font-medium mt-2">HTML Embed:</Label>
              <code className="flex-1 text-xs bg-muted p-2 rounded border overflow-x-auto whitespace-pre-wrap">
                {generateVideoEmbed()}
              </code>
              <Button
                size="sm"
                variant="outline"
                onClick={() => copyToClipboard(generateVideoEmbed(), 'HTML Embed')}
                className="mt-1"
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