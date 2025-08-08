import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Save, Share2, Tag, FolderOpen, Globe, Lock } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import type { FormattedRecipe } from '@/types/recipe-workspace';

interface RecipeActionsToolbarProps {
  recipe: FormattedRecipe;
  imageUrl?: string;
  onSaved?: (recipeId: string) => void;
}


export const RecipeActionsToolbar = ({ recipe, imageUrl, onSaved }: RecipeActionsToolbarProps) => {
  const [isPublic, setIsPublic] = useState(false);
  const [folder, setFolder] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSave = async () => {
    if (!user || !recipe) {
      toast({
        title: "Authentication required",
        description: "Please log in to save recipes.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);

    try {
      // First, generate a slug if making public
      let slug = null;
      if (isPublic) {
        const { data: slugData, error: slugError } = await supabase
          .rpc('generate_recipe_slug', {
            recipe_title: recipe.title,
            recipe_user_id: user.id
          });

        if (slugError) {
          console.error('Error generating slug:', slugError);
        } else {
          slug = slugData as string | null;
        }
      }

      const { data, error } = await supabase
        .from('recipes')
        .insert({
          user_id: user.id,
          title: recipe.title,
          data: recipe as any,
          image_url: imageUrl || null,
          folder: folder.trim() || null,
          tags: tags.length > 0 ? tags : null,
          is_public: isPublic,
          slug: slug
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      toast({
        title: "Success",
        description: "Recipe saved successfully!",
      });

      onSaved?.(data.id);

    } catch (error) {
      console.error('Error saving recipe:', error);
      toast({
        title: "Save failed",
        description: "Failed to save recipe. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleShare = async () => {
    if (!isPublic) {
      toast({
        title: "Recipe not public",
        description: "Make the recipe public first to share it.",
        variant: "destructive",
      });
      return;
    }

    // For now, just copy to clipboard (would need actual recipe URL)
    toast({
      title: "Coming soon",
      description: "Sharing functionality will be available after saving.",
    });
  };

  return (
    <Card className="shadow-warm">
      <CardContent className="pt-6 space-y-6">
        {/* Save Section */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-primary">Save Recipe</h3>
            <p className="text-sm text-muted-foreground">
              Save to your recipe collection
            </p>
          </div>
          <Button 
            onClick={handleSave}
            variant="hero"
            disabled={!user || isSaving}
            className="touch-manipulation"
          >
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? 'Saving...' : 'Save Recipe'}
          </Button>
        </div>

        {/* Public/Private Toggle */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {isPublic ? <Globe className="h-4 w-4 text-primary" /> : <Lock className="h-4 w-4 text-muted-foreground" />}
            <div>
              <Label htmlFor="public-toggle" className="font-semibold">
                {isPublic ? 'Public Recipe' : 'Private Recipe'}
              </Label>
              <p className="text-sm text-muted-foreground">
                {isPublic ? 'Anyone can view this recipe' : 'Only you can view this recipe'}
              </p>
            </div>
          </div>
          <Switch
            id="public-toggle"
            checked={isPublic}
            onCheckedChange={setIsPublic}
          />
        </div>

        {/* Folder */}
        <div className="space-y-2">
          <Label htmlFor="folder" className="flex items-center gap-2 font-semibold">
            <FolderOpen className="h-4 w-4" />
            Folder (optional)
          </Label>
          <Input
            id="folder"
            value={folder}
            onChange={(e) => setFolder(e.target.value)}
            placeholder="e.g., Breads, Desserts, Quick Bakes"
            className="touch-manipulation"
          />
        </div>

        {/* Tags */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2 font-semibold">
            <Tag className="h-4 w-4" />
            Tags
          </Label>
          <div className="flex gap-2">
            <Input
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
              placeholder="Add a tag..."
              className="flex-1 touch-manipulation"
            />
            <Button 
              onClick={handleAddTag}
              variant="outline"
              disabled={!newTag.trim()}
              className="touch-manipulation"
            >
              Add
            </Button>
          </div>
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {tags.map((tag, index) => (
                <Badge 
                  key={index} 
                  variant="secondary" 
                  className="cursor-pointer"
                  onClick={() => handleRemoveTag(tag)}
                >
                  {tag} ×
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Share Section */}
        <div className="flex items-center justify-between pt-4 border-t">
          <div>
            <h3 className="font-semibold text-primary">Share Recipe</h3>
            <p className="text-sm text-muted-foreground">
              Share your recipe with others
            </p>
          </div>
          <Button 
            onClick={handleShare}
            variant="outline"
            disabled={!isPublic}
            className="touch-manipulation"
          >
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};