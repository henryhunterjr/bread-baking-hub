import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Share2, Copy, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface RecipeShareButtonProps {
  recipe: {
    id: string;
    title: string;
    slug?: string;
  };
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'default' | 'lg';
  className?: string;
}

export const RecipeShareButton = ({ 
  recipe, 
  variant = 'outline', 
  size = 'sm',
  className = '' 
}: RecipeShareButtonProps) => {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const getRecipeUrl = () => {
    const baseUrl = window.location.origin;
    // Use canonical recipe URL for proper social sharing
    if (recipe.slug) {
      return `${baseUrl}/recipes/${recipe.slug}`;
    }
    return `${baseUrl}/recipes/${recipe.id}`;
  };

  const handleShare = async () => {
    const shareUrl = getRecipeUrl();
    const shareData = {
      title: `${recipe.title} - Baking Great Bread at Home`,
      text: `Check out this recipe: ${recipe.title}`,
      url: shareUrl
    };

    // Try native Web Share API first (mobile)
    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
        toast({
          title: "Recipe shared!",
          description: "Recipe shared successfully"
        });
        return;
      } catch (error) {
        // User cancelled or error occurred, fall back to copy
      }
    }

    // Fallback: copy URL to clipboard
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      
      toast({
        title: "Link copied!",
        description: "Recipe link copied to clipboard"
      });
    } catch (error) {
      toast({
        title: "Share failed",
        description: "Could not copy link. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <Button
      onClick={handleShare}
      variant={variant}
      size={size}
      className={`flex items-center gap-2 ${className}`}
      aria-label="Share recipe"
    >
      {copied ? (
        <>
          <Check className="h-4 w-4" />
          Copied!
        </>
      ) : (
        <>
          <Share2 className="h-4 w-4" />
          Share
        </>
      )}
    </Button>
  );
};