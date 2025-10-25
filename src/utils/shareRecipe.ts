import { toast } from '@/hooks/use-toast';

export interface ShareableRecipe {
  id: string;
  title: string;
  slug?: string;
  description?: string;
}

export const shareRecipe = async (recipe: ShareableRecipe) => {
  const baseUrl = 'https://bakinggreatbread.com';
  const recipeUrl = recipe.slug 
    ? `${baseUrl}/recipes/${recipe.slug}` 
    : `${baseUrl}/recipes/${recipe.id}`;
    
  const subject = `Recipe: ${recipe.title}`;
  const body = `I found this fantastic fall recipe!\n\nCheck out the ${recipe.title} here: ${recipeUrl}`;

  // Try native share first (mobile devices)
  if (navigator.share && navigator.canShare) {
    try {
      const shareData = {
        title: subject,
        text: `Check out this recipe: ${recipe.title}`,
        url: recipeUrl
      };
      
      if (navigator.canShare(shareData)) {
        await navigator.share(shareData);
        toast({
          title: "Recipe shared!",
          description: "Recipe shared successfully"
        });
        return true;
      }
    } catch (error) {
      // User cancelled or error occurred, fall through to modal
      if (error instanceof Error && error.name !== 'AbortError') {
        console.warn('Native share failed:', error);
      }
    }
  }

  // Return share data for modal fallback
  return {
    url: recipeUrl,
    subject: encodeURIComponent(subject),
    body: encodeURIComponent(body),
    mailtoUrl: `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  };
};

export const copyToClipboard = async (text: string, successMessage = "Link copied!") => {
  try {
    await navigator.clipboard.writeText(text);
    toast({
      title: successMessage,
      description: "The link has been copied to your clipboard."
    });
    return true;
  } catch (error) {
    console.error('Failed to copy:', error);
    toast({
      title: "Copy failed",
      description: "Please copy the link manually.",
      variant: "destructive"
    });
    return false;
  }
};

export const openEmailClient = (mailtoUrl: string) => {
  try {
    window.open(mailtoUrl, '_self');
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