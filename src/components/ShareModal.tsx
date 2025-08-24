import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Copy, Mail, Share2, Check, QrCode } from 'lucide-react';
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
    const subject = `${title} – Baking Great Bread`;
    const body = `I thought you might be interested in this recipe:\n\n${title}\n\n${description || ''}\n\nView the recipe: ${url}`;
    const mailtoUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    openEmailClient(mailtoUrl);
  };

  const generateQRCode = () => {
    // Simple QR code generation using Google Charts API as fallback
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(url)}`;
    window.open(qrUrl, '_blank');
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

            <Button 
              onClick={generateQRCode} 
              variant="outline" 
              className="w-full justify-start"
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