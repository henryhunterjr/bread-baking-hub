import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Video, Copy, Trash2, Calendar } from 'lucide-react';
import { logger } from '@/utils/logger';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface VideoMetadata {
  id: string;
  filename: string;
  alt_text: string;
  description: string | null;
  post_title: string | null;
  file_size: number;
  duration: number | null;
  public_url: string;
  upload_date: string;
  created_at: string;
}

export const BlogVideoGrid = () => {
  const { user } = useAuth();
  const [videos, setVideos] = useState<VideoMetadata[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteVideoId, setDeleteVideoId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (user) {
      fetchVideos();
    }
  }, [user]);

  const fetchVideos = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_videos_metadata')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setVideos(data || []);
    } catch (error) {
      logger.error('Error fetching videos:', error);
      toast({
        title: "Failed to load videos",
        description: "Could not retrieve video library.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: `${type} copied`,
      description: "Copied to clipboard successfully."
    });
  };

  const generateVideoEmbed = (video: VideoMetadata) => {
    return `<video controls width="100%" style="max-width: 800px; border-radius: 8px;">
  <source src="${video.public_url}" type="video/mp4" />
  Your browser does not support the video tag.
</video>`;
  };

  const handleDelete = async () => {
    if (!deleteVideoId) return;

    setDeleting(true);
    try {
      const video = videos.find(v => v.id === deleteVideoId);
      if (!video) throw new Error('Video not found');

      // Extract file path from the metadata
      const { data: metadataData } = await supabase
        .from('blog_videos_metadata')
        .select('file_path')
        .eq('id', deleteVideoId)
        .single();

      if (metadataData?.file_path) {
        // Delete from storage
        const { error: storageError } = await supabase.storage
          .from('blog-videos')
          .remove([metadataData.file_path]);

        if (storageError) {
          logger.error('Storage delete error:', storageError);
        }
      }

      // Delete metadata from database
      const { error: dbError } = await supabase
        .from('blog_videos_metadata')
        .delete()
        .eq('id', deleteVideoId);

      if (dbError) throw dbError;

      setVideos(prev => prev.filter(v => v.id !== deleteVideoId));
      toast({
        title: "Video deleted",
        description: "Video has been removed successfully."
      });
    } catch (error) {
      logger.error('Delete error:', error);
      toast({
        title: "Delete failed",
        description: "Could not delete video. Please try again.",
        variant: "destructive"
      });
    } finally {
      setDeleting(false);
      setDeleteVideoId(null);
    }
  };

  const formatDuration = (seconds: number | null) => {
    if (!seconds) return 'Unknown';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatFileSize = (bytes: number) => {
    return `${Math.round(bytes / (1024 * 1024))}MB`;
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Video className="w-5 h-5" />
            Video Library
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Video className="w-5 h-5" />
            Video Library ({videos.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {videos.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Video className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No videos uploaded yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {videos.map((video) => (
                <div
                  key={video.id}
                  className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="relative aspect-video bg-muted">
                    <video
                      src={video.public_url}
                      className="w-full h-full object-cover"
                      preload="metadata"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 pointer-events-none">
                      <Video className="w-12 h-12 text-white/80" />
                    </div>
                  </div>
                  
                  <div className="p-4 space-y-3">
                    <div>
                      <h3 className="font-medium text-sm line-clamp-1" title={video.alt_text}>
                        {video.alt_text}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                        {video.filename}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span>{formatFileSize(video.file_size)}</span>
                      <span>•</span>
                      <span>{formatDuration(video.duration)}</span>
                    </div>

                    {video.upload_date && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        {new Date(video.upload_date).toLocaleDateString()}
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1"
                        onClick={() => copyToClipboard(video.public_url, 'URL')}
                      >
                        <Copy className="w-3 h-3 mr-1" />
                        URL
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1"
                        onClick={() => copyToClipboard(generateVideoEmbed(video), 'HTML')}
                      >
                        <Copy className="w-3 h-3 mr-1" />
                        HTML
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setDeleteVideoId(video.id)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={!!deleteVideoId} onOpenChange={() => setDeleteVideoId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Video</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this video? This action cannot be undone and will remove both the file and its metadata.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};