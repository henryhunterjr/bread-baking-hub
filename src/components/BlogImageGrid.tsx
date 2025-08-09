import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  Search, 
  Copy, 
  Trash2, 
  Image as ImageIcon, 
  Calendar,
  FileText,
  ExternalLink
} from 'lucide-react';

interface BlogImage {
  id: string;
  filename: string;
  altText: string;
  metaDescription?: string;
  postTitle?: string;
  publicUrl: string;
  uploadDate: string;
  fileSize: number;
  dimensions?: { width: number; height: number };
}

export const BlogImageGrid = () => {
  const { user } = useAuth();
  const [images, setImages] = useState<BlogImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState('');

  useEffect(() => {
    if (user) {
      fetchImages();
    }
  }, [user]);

  const fetchImages = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('blog_images_metadata')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setImages(data.map(item => ({
        id: item.id,
        filename: item.filename,
        altText: item.alt_text,
        metaDescription: item.meta_description,
        postTitle: item.post_title,
        publicUrl: item.public_url,
        uploadDate: item.upload_date,
        fileSize: item.file_size,
        dimensions: item.dimensions as { width: number; height: number } | undefined
      })));
    } catch (error) {
      console.error('Error fetching images:', error);
      toast({
        title: "Error",
        description: "Failed to load images.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteImage = async (image: BlogImage) => {
    try {
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('blog-images')
        .remove([image.publicUrl.split('/blog-images/')[1]]);

      if (storageError) throw storageError;

      // Delete metadata
      const { error: metadataError } = await supabase
        .from('blog_images_metadata')
        .delete()
        .eq('id', image.id);

      if (metadataError) throw metadataError;

      setImages(prev => prev.filter(img => img.id !== image.id));
      
      toast({
        title: "Image deleted",
        description: `${image.filename} has been deleted.`
      });
    } catch (error) {
      console.error('Delete error:', error);
      toast({
        title: "Delete failed",
        description: "Failed to delete image. Please try again.",
        variant: "destructive"
      });
    }
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: `${type} copied`,
      description: "Copied to clipboard successfully."
    });
  };

  const generateMarkdown = (image: BlogImage) => {
    return `![${image.altText}](${image.publicUrl})`;
  };

  const filteredImages = images.filter(image => {
    const matchesSearch = searchTerm === '' || 
      image.filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
      image.altText.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (image.postTitle && image.postTitle.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesDate = selectedDate === '' || image.uploadDate.startsWith(selectedDate);
    
    return matchesSearch && matchesDate;
  });

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p>Loading images...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ImageIcon className="w-5 h-5" />
          Blog Image Library ({images.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search by filename, alt text, or post title..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="w-full sm:w-auto">
            <Input
              type="month"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full sm:w-48"
            />
          </div>
        </div>

        {/* Images Grid */}
        {filteredImages.length === 0 ? (
          <div className="text-center py-12">
            <ImageIcon className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <p className="text-lg font-medium">No images found</p>
            <p className="text-muted-foreground">
              {searchTerm || selectedDate ? 'Try adjusting your filters' : 'Upload your first blog image above'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredImages.map((image) => (
              <Card key={image.id} className="overflow-hidden">
                <div className="aspect-video relative group">
                  <img
                    src={image.publicUrl}
                    alt={image.altText}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => window.open(image.publicUrl, '_blank')}
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                <CardContent className="p-4 space-y-3">
                  <div>
                    <h4 className="font-medium truncate" title={image.filename}>
                      {image.filename}
                    </h4>
                    <p className="text-sm text-muted-foreground truncate" title={image.altText}>
                      {image.altText}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {image.postTitle && (
                      <Badge variant="secondary" className="text-xs">
                        <FileText className="w-3 h-3 mr-1" />
                        {image.postTitle}
                      </Badge>
                    )}
                    <Badge variant="outline" className="text-xs">
                      <Calendar className="w-3 h-3 mr-1" />
                      {new Date(image.uploadDate).toLocaleDateString()}
                    </Badge>
                  </div>

                  <div className="text-xs text-muted-foreground">
                    {Math.round(image.fileSize / 1024)}KB
                    {image.dimensions && (
                      <> • {image.dimensions.width}×{image.dimensions.height}</>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={() => copyToClipboard(image.publicUrl, 'URL')}
                    >
                      <Copy className="w-3 h-3 mr-1" />
                      URL
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={() => copyToClipboard(generateMarkdown(image), 'Markdown')}
                    >
                      <Copy className="w-3 h-3 mr-1" />
                      MD
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => deleteImage(image)}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};