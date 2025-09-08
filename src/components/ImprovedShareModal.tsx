import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  Copy, 
  Mail, 
  Share2, 
  Check, 
  QrCode, 
  MessageCircle, 
  Facebook,
  Twitter,
  AlertCircle,
  Printer,
  ExternalLink
} from 'lucide-react';
import { getShareLinks, openShareLink, copyToClipboard, validateShareData } from '@/lib/share';

interface ImprovedShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  url?: string;
  description?: string;
  recipeSlug?: string;
}

export const ImprovedShareModal = ({ 
  isOpen, 
  onClose, 
  title, 
  url, 
  description,
  recipeSlug 
}: ImprovedShareModalProps) => {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  
  const validation = validateShareData(title, url);
  const shareLinks = validation.isValid && title && url ? getShareLinks({ url, title }) : null;

  const handleCopyLink = async () => {
    if (!url) return;
    
    const success = await copyToClipboard(url);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({
        title: "Link copied!",
        description: "Recipe link copied to clipboard"
      });
    } else {
      toast({
        title: "Copy failed",
        description: "Please select and copy the URL manually",
        variant: "destructive"
      });
    }
  };

  const handleNativeShare = async () => {
    if (!navigator.share || !title || !url) {
      handleCopyLink();
      return;
    }

    try {
      await navigator.share({
        title,
        text: description || title,
        url
      });
    } catch (error) {
      if (error instanceof Error && error.name !== 'AbortError') {
        console.error('Share failed:', error);
        handleCopyLink();
      }
    }
  };

  const handleShareClick = (platform: keyof typeof shareLinks) => {
    if (!shareLinks) return;
    
    const shareUrl = shareLinks[platform];
    
    if (platform === 'copy') {
      handleCopyLink();
    } else {
      openShareLink(shareUrl, platform);
      toast({
        title: `Opening ${platform}`,
        description: `Sharing "${title}" via ${platform}`
      });
    }
  };

  const handlePrint = () => {
    if (recipeSlug) {
      window.open(`/print/${recipeSlug}`, '_blank', 'noopener');
      toast({
        title: "Print page opened",
        description: "Use your browser's print function to save as PDF"
      });
    }
  };

  const generateQRCode = () => {
    if (!url) return;
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(url)}`;
    window.open(qrUrl, '_blank', 'noopener,noreferrer');
  };

  const shareButtons = [
    { 
      key: 'facebook' as const, 
      label: 'Facebook', 
      icon: Facebook, 
      color: 'text-blue-600' 
    },
    { 
      key: 'x' as const, 
      label: 'X (Twitter)', 
      icon: Twitter, 
      color: 'text-gray-900' 
    },
    { 
      key: 'email' as const, 
      label: 'Email', 
      icon: Mail, 
      color: 'text-green-600' 
    },
    { 
      key: 'gmail' as const, 
      label: 'Gmail', 
      icon: Mail, 
      color: 'text-red-600' 
    }
  ];

  if (!validation.isValid) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertCircle className="w-5 h-5" />
              Cannot Share Recipe
            </DialogTitle>
            <DialogDescription>
              {validation.message}
            </DialogDescription>
          </DialogHeader>
          <Button onClick={onClose} variant="secondary" className="w-full">
            Close
          </Button>
        </DialogContent>
      </Dialog>
    );
  }

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
          {/* URL Display with Copy */}
          <div className="flex items-center space-x-2">
            <Input
              value={url || ''}
              readOnly
              className="flex-1 text-sm"
            />
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="sm"
                    onClick={handleCopyLink}
                    className="shrink-0"
                    disabled={!url}
                  >
                    {copied ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {copied ? "Copied!" : "Copy link"}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          {/* Native Share (Mobile) */}
          {navigator.share && (
            <Button 
              onClick={handleNativeShare} 
              variant="outline" 
              className="w-full justify-start"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share via Device
            </Button>
          )}

          {/* Social Share Buttons */}
          <div className="grid grid-cols-2 gap-2">
            {shareButtons.map((button) => (
              <TooltipProvider key={button.key}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={() => handleShareClick(button.key)}
                      variant="outline"
                      className="justify-start"
                      disabled={!shareLinks}
                    >
                      <button.icon className={`w-4 h-4 mr-2 ${button.color}`} />
                      {button.label}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    Share on {button.label}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
          </div>

          {/* Additional Actions */}
          <div className="border-t pt-4 space-y-2">
            {recipeSlug && (
              <Button 
                onClick={handlePrint} 
                variant="outline" 
                className="w-full justify-start"
              >
                <Printer className="w-4 h-4 mr-2" />
                Print Recipe
              </Button>
            )}
            
            <Button 
              onClick={generateQRCode} 
              variant="outline" 
              className="w-full justify-start"
              disabled={!url}
            >
              <QrCode className="w-4 h-4 mr-2" />
              Generate QR Code
            </Button>
          </div>

          <Button onClick={onClose} variant="secondary" className="w-full">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};