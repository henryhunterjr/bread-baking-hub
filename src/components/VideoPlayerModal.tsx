import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface VideoPlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl: string;
  title: string;
  description: string;
}

const VideoPlayerModal = ({ isOpen, onClose, videoUrl, title, description }: VideoPlayerModalProps) => {
  if (!isOpen) return null;

  // Extract YouTube video ID from URL
  const extractYouTubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  // Extract Google Drive video ID from URL
  const extractGoogleDriveId = (url: string) => {
    const regExp = /\/file\/d\/([a-zA-Z0-9_-]+)/;
    const match = url.match(regExp);
    return match ? match[1] : null;
  };

  const youtubeId = extractYouTubeId(videoUrl);
  const googleDriveId = extractGoogleDriveId(videoUrl);
  
  let embedUrl = null;
  if (youtubeId) {
    embedUrl = `https://www.youtube.com/embed/${youtubeId}`;
  } else if (googleDriveId) {
    embedUrl = `https://drive.google.com/file/d/${googleDriveId}/preview`;
  }

  return (
    <div 
      className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="bg-background rounded-2xl max-w-4xl w-full max-h-[90vh] shadow-stone animate-scale-in overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex justify-between items-start p-6 pb-4 border-b">
            <div className="flex-1 pr-4">
              <h1 className="text-xl font-bold text-foreground mb-1">
                {title}
              </h1>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {description}
              </p>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-6 w-6" />
            </Button>
          </div>

          {/* Video Player */}
          <div className="flex-1 p-6">
            {embedUrl ? (
              <div className="relative w-full h-0 pb-[56.25%] rounded-lg overflow-hidden">
                <iframe
                  src={embedUrl}
                  title={title}
                  className="absolute top-0 left-0 w-full h-full"
                  allowFullScreen
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  sandbox="allow-scripts allow-same-origin allow-presentation"
                />
              </div>
            ) : (
              <div className="flex items-center justify-center h-64 bg-muted rounded-lg">
                <p className="text-muted-foreground">Unable to load video</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayerModal;