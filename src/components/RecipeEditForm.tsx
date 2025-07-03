import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface RecipeEditFormProps {
  recipe: any;
  onSave: (recipeId: string, title: string) => Promise<boolean>;
  onCancel: () => void;
  updating: boolean;
}

export const RecipeEditForm = ({ recipe, onSave, onCancel, updating }: RecipeEditFormProps) => {
  const [editTitle, setEditTitle] = useState(recipe.title);

  const handleSave = async () => {
    if (!editTitle.trim()) return;
    const success = await onSave(recipe.id, editTitle);
    if (success) {
      onCancel(); // Close edit form on success
    }
  };

  return (
    <Card className="shadow-warm">
      <CardHeader>
        <CardTitle className="text-primary">Edit Recipe</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor={`edit-title-${recipe.id}`}>Recipe Title</Label>
          <Input
            id={`edit-title-${recipe.id}`}
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            placeholder="Enter recipe title"
            disabled={updating}
          />
        </div>
        <div className="flex gap-2">
          <Button 
            variant="hero" 
            onClick={handleSave}
            disabled={updating || !editTitle.trim()}
          >
            {updating ? 'Updating...' : 'Save Changes'}
          </Button>
          <Button 
            variant="outline" 
            onClick={onCancel}
            disabled={updating}
          >
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};