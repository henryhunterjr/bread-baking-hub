import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, Share2, Copy, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface PublicSharingSectionProps {
  isPublic: boolean;
  slug: string;
  recipeTitle: string;
  userId: string;
  isOpen: boolean;
  onToggle: () => void;
  onUpdatePublic: (isPublic: boolean) => void;
  onUpdateSlug: (slug: string) => void;
}

export const PublicSharingSection = ({ 
  isPublic,
  slug,
  recipeTitle,
  userId,
  isOpen, 
  onToggle,
  onUpdatePublic,
  onUpdateSlug
}: PublicSharingSectionProps) => {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const generateSlug = async () => {
    try {
      const { data, error } = await supabase.rpc('generate_recipe_slug', {
        recipe_title: recipeTitle,
        recipe_user_id: userId
      });
      
      if (error) {
        console.error('Error generating slug:', error);
        toast({
          title: "Error",
          description: "Failed to generate URL slug",
          variant: "destructive",
        });
        return;
      }
      
      onUpdateSlug(data);
    } catch (error) {
      console.error('Error generating slug:', error);
      toast({
        title: "Error", 
        description: "Failed to generate URL slug",
        variant: "destructive",
      });
    }
  };

  const handlePublicToggle = async (checked: boolean) => {
    if (checked && !slug) {
      await generateSlug();
    }
    onUpdatePublic(checked);
  };

  const copyToClipboard = async () => {
    if (!slug) return;
    
    const url = `${window.location.origin}/recipes/${slug}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast({
        title: "Copied!",
        description: "Recipe link copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy link",
        variant: "destructive",
      });
    }
  };

  const shareUrl = slug ? `${window.location.origin}/recipes/${slug}` : '';

  return (
    <Collapsible open={isOpen} onOpenChange={onToggle}>
      <CollapsibleTrigger className="flex items-center justify-between w-full p-2 hover:bg-accent rounded">
        <h4 className="font-semibold flex items-center gap-2">
          <Share2 className="h-4 w-4" />
          Public Sharing
        </h4>
        <ChevronDown className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")} />
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-3 mt-2">
        <div className="flex items-center space-x-2">
          <Switch
            id="public-toggle"
            checked={isPublic}
            onCheckedChange={handlePublicToggle}
          />
          <Label htmlFor="public-toggle">Make this recipe public</Label>
        </div>
        
        {isPublic && (
          <div className="space-y-3 pt-2 border-t">
            <div>
              <Label htmlFor="slug">Custom URL slug (optional)</Label>
              <div className="flex gap-2">
                <Input
                  id="slug"
                  value={slug || ''}
                  onChange={(e) => onUpdateSlug(e.target.value)}
                  placeholder="my-recipe-name"
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={generateSlug}
                >
                  Auto-generate
                </Button>
              </div>
            </div>
            
            {shareUrl && (
              <div>
                <Label>Shareable Link</Label>
                <div className="flex gap-2">
                  <Input
                    value={shareUrl}
                    readOnly
                    className="flex-1 bg-muted"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={copyToClipboard}
                    className="min-w-[80px]"
                  >
                    {copied ? (
                      <>
                        <Check className="h-4 w-4 mr-1" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4 mr-1" />
                        Copy
                      </>
                    )}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Anyone with this link can view your recipe, even without an account.
                </p>
              </div>
            )}
          </div>
        )}
      </CollapsibleContent>
    </Collapsible>
  );
};