import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Copy, Mail, Share2, Check, QrCode, MessageCircle } from 'lucide-react';
import { copyToClipboard, openEmailClient } from '@/utils/shareRecipe';

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
    const success = await copyToClipboard(url);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
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
    const subject = `Recipe: ${title}`;
    const body = `I found this fantastic fall recipe!\n\nCheck out the ${title} here: ${url}`;
    const mailtoUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    try {
      window.location.href = mailtoUrl;
      toast({
        title: "Email client opened",
        description: "Your email client should open with the recipe details."
      });
    } catch (error) {
      console.error('Email share failed:', error);
      toast({
        title: "Email failed", 
        description: "Please copy the link manually and share via email.",
        variant: "destructive"
      });
    }
  };

  const handleFacebookShare = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    window.open(facebookUrl, '_blank', 'width=600,height=400');
  };

  const handleMessengerShare = () => {
    const messengerUrl = `https://www.facebook.com/dialog/send?link=${encodeURIComponent(url)}&app_id=YOUR_APP_ID&redirect_uri=${encodeURIComponent(url)}`;
    window.open(messengerUrl, '_blank', 'width=600,height=400');
  };

  const generateQRCode = () => {
    // Simple QR code generation using Google Charts API as fallback
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(url)}`;
    window.open(qrUrl, '_blank');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md" data-testid="share-modal">
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
              aria-label={copied ? "Link copied" : "Copy link to clipboard"}
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
            {navigator.share ? (
              <Button 
                onClick={handleNativeShare} 
                variant="outline" 
                className="w-full justify-start"
                aria-label="Share recipe using device's share feature"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            ) : (
              <>
                <Button 
                  onClick={handleFacebookShare} 
                  variant="outline" 
                  className="w-full justify-start"
                  aria-label="Share recipe on Facebook"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Share on Facebook
                </Button>
                
                <Button 
                  onClick={handleMessengerShare} 
                  variant="outline" 
                  className="w-full justify-start"
                  aria-label="Share recipe on Messenger"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Share on Messenger
                </Button>
              </>
            )}
            
            <Button 
              onClick={handleEmailShare} 
              variant="outline" 
              className="w-full justify-start"
              aria-label="Email recipe to someone"
            >
              <Mail className="w-4 h-4 mr-2" />
              Email Recipe
            </Button>

            <Button 
              onClick={generateQRCode} 
              variant="outline" 
              className="w-full justify-start"
              aria-label="Generate QR code for recipe URL"
            >
              <QrCode className="w-4 h-4 mr-2" />
              Generate QR Code
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