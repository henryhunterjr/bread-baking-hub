import { useState } from 'react';
import { Share2, Facebook, Twitter, Link, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';

interface SocialShareProps {
  url: string;
  title: string;
  description?: string;
  image?: string;
  className?: string;
  compact?: boolean;
}

export const SocialShare = ({ 
  url, 
  title, 
  description = '', 
  image = '',
  className = '',
  compact = false 
}: SocialShareProps) => {
  const [copied, setCopied] = useState(false);

  const shareData = {
    url: encodeURIComponent(url),
    title: encodeURIComponent(title),
    description: encodeURIComponent(description),
    image: encodeURIComponent(image)
  };

  const shareLinks = [
    {
      name: 'Twitter',
      icon: Twitter,
      url: `https://twitter.com/intent/tweet?text=${shareData.title}&url=${shareData.url}`,
      color: 'hover:text-blue-400'
    },
    {
      name: 'Facebook',
      icon: Facebook,
      url: `https://www.facebook.com/sharer/sharer.php?u=${shareData.url}`,
      color: 'hover:text-blue-600'
    },
    {
      name: 'Pinterest',
      icon: Share2, // Using Share2 as Pinterest icon isn't available
      url: `https://pinterest.com/pin/create/button/?url=${shareData.url}&description=${shareData.title}&media=${shareData.image}`,
      color: 'hover:text-red-600'
    }
  ];

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success('Link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy link');
    }
  };

  const handleShare = (shareUrl: string, platform: string) => {
    window.open(shareUrl, '_blank', 'noopener,noreferrer,width=600,height=400');
    
    // Track sharing event (could be enhanced with analytics)
    console.log(`Shared "${title}" on ${platform}`);
  };

  if (compact) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className={className}>
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          {shareLinks.map((platform) => {
            const Icon = platform.icon;
            return (
              <DropdownMenuItem
                key={platform.name}
                onClick={() => handleShare(platform.url, platform.name)}
                className="flex items-center gap-2 cursor-pointer"
              >
                <Icon className="h-4 w-4" />
                Share on {platform.name}
              </DropdownMenuItem>
            );
          })}
          <DropdownMenuItem
            onClick={copyToClipboard}
            className="flex items-center gap-2 cursor-pointer"
          >
            {copied ? (
              <Check className="h-4 w-4 text-green-600" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
            {copied ? 'Copied!' : 'Copy Link'}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="text-sm font-medium text-muted-foreground mr-2">Share:</span>
      {shareLinks.map((platform) => {
        const Icon = platform.icon;
        return (
          <Button
            key={platform.name}
            variant="ghost"
            size="sm"
            onClick={() => handleShare(platform.url, platform.name)}
            className={`p-2 ${platform.color} transition-colors`}
            title={`Share on ${platform.name}`}
          >
            <Icon className="h-4 w-4" />
          </Button>
        );
      })}
      <Button
        variant="ghost"
        size="sm"
        onClick={copyToClipboard}
        className="p-2 hover:text-primary transition-colors"
        title="Copy link"
      >
        {copied ? (
          <Check className="h-4 w-4 text-green-600" />
        ) : (
          <Link className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
};

export default SocialShare;