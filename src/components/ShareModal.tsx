import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Copy, Mail, Share2, Check } from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  url: string;
  description?: string;
}

export const ShareModal = ({ isOpen, onClose, title, url, description }: ShareModalProps) => {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast({
        title: "Link copied!",
        description: "The link has been copied to your clipboard.",
      });
      
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
      toast({
        title: "Copy failed",
        description: "Please copy the link manually.",
        variant: "destructive"
      });
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: description || title,
          url
        });
      } catch (error) {
        if (error instanceof Error && error.name !== 'AbortError') {
          console.error('Share failed:', error);
          handleCopyLink(); // Fallback to copy
        }
      }
    } else {
      handleCopyLink(); // Fallback if native share not available
    }
  };

  const handleEmailShare = () => {
    const subject = encodeURIComponent(`Check out: ${title}`);
    const body = encodeURIComponent(
      `I thought you might be interested in this recipe:\n\n${title}\n\n${description || ''}\n\n${url}`
    );
    const mailtoUrl = `mailto:?subject=${subject}&body=${body}`;
    
    try {
      window.open(mailtoUrl, '_self');
    } catch (error) {
      console.error('Email share failed:', error);
      handleCopyLink(); // Fallback to copy
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="w-5 h-5" />
            Share Recipe
          </DialogTitle>
          <DialogDescription>
            Share "{title}" with others
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* URL Display */}
          <div className="flex items-center space-x-2">
            <Input
              value={url}
              readOnly
              className="flex-1"
            />
            <Button
              size="sm"
              onClick={handleCopyLink}
              className="shrink-0"
            >
              {copied ? (
                <Check className="w-4 h-4" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </Button>
          </div>

          {/* Share Options */}
          <div className="grid grid-cols-1 gap-3">
            <Button 
              onClick={handleNativeShare} 
              variant="outline" 
              className="w-full justify-start"
            >
              <Share2 className="w-4 h-4 mr-2" />
              {navigator.share ? 'Share' : 'Copy Link'}
            </Button>
            
            <Button 
              onClick={handleEmailShare} 
              variant="outline" 
              className="w-full justify-start"
            >
              <Mail className="w-4 h-4 mr-2" />
              Share via Email
            </Button>
          </div>

          <div className="pt-2">
            <Button onClick={onClose} variant="secondary" className="w-full">
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};