import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronDown, Plus, X, Tag, Folder } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FullRecipeEditFormProps {
  recipe: any;
  onSave: (recipeId: string, updates: { data: any; image_url?: string; folder?: string; tags?: string[] }) => Promise<boolean>;
  onCancel: () => void;
  updating: boolean;
  allRecipes?: any[];
}

export const FullRecipeEditForm = ({ recipe, onSave, onCancel, updating, allRecipes = [] }: FullRecipeEditFormProps) => {
  const [formData, setFormData] = useState({
    introduction: recipe.data.introduction || '',
    prep_time: recipe.data.prep_time || '',
    cook_time: recipe.data.cook_time || '',
    total_time: recipe.data.total_time || '',
    servings: recipe.data.servings || '',
    ingredients: recipe.data.ingredients || [''],
    method: recipe.data.method || [''],
    tips: recipe.data.tips || [''],
    troubleshooting: recipe.data.troubleshooting || [{ issue: '', solution: '' }],
    image_url: recipe.image_url || '',
    folder: recipe.folder || '',
    tags: recipe.tags || []
  });

  const [openSections, setOpenSections] = useState({
    basics: true,
    ingredients: false,
    method: false,
    tips: false,
    troubleshooting: false,
    image: false,
    organization: false
  });

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addArrayItem = (field: string, item: any = '') => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], item]
    }));
  };

  const removeArrayItem = (field: string, index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const updateArrayItem = (field: string, index: number, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const handleSave = async () => {
    // Clean up data - remove empty strings and validate
    const cleanedData = {
      ...recipe.data,
      introduction: formData.introduction.trim(),
      prep_time: formData.prep_time.trim(),
      cook_time: formData.cook_time.trim(),
      total_time: formData.total_time.trim(),
      servings: formData.servings.trim(),
      ingredients: formData.ingredients.filter(item => item.trim() !== ''),
      method: formData.method.filter(item => item.trim() !== ''),
      tips: formData.tips.filter(item => item.trim() !== ''),
      troubleshooting: formData.troubleshooting.filter(item => 
        item.issue?.trim() !== '' || item.solution?.trim() !== ''
      )
    };

    const updates: any = { data: cleanedData };
    if (formData.image_url !== recipe.image_url) {
      updates.image_url = formData.image_url.trim() || null;
    }
    if (formData.folder !== recipe.folder) {
      updates.folder = formData.folder.trim() || null;
    }
    if (JSON.stringify(formData.tags) !== JSON.stringify(recipe.tags)) {
      updates.tags = formData.tags.filter(tag => tag.trim() !== '');
    }

    const success = await onSave(recipe.id, updates);
    if (success) {
      onCancel();
    }
  };

  return (
    <Card className="shadow-warm">
      <CardHeader>
        <CardTitle className="text-primary">Edit Recipe</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Basic Information */}
        <Collapsible open={openSections.basics} onOpenChange={() => toggleSection('basics')}>
          <CollapsibleTrigger className="flex items-center justify-between w-full p-2 hover:bg-accent rounded">
            <h4 className="font-semibold">Basic Information</h4>
            <ChevronDown className={cn("h-4 w-4 transition-transform", openSections.basics && "rotate-180")} />
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-3 mt-2">
            <div>
              <Label htmlFor="introduction">Introduction</Label>
              <Textarea
                id="introduction"
                value={formData.introduction}
                onChange={(e) => updateField('introduction', e.target.value)}
                placeholder="Recipe introduction..."
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div>
                <Label htmlFor="prep_time">Prep Time</Label>
                <Input
                  id="prep_time"
                  value={formData.prep_time}
                  onChange={(e) => updateField('prep_time', e.target.value)}
                  placeholder="15 mins"
                />
              </div>
              <div>
                <Label htmlFor="cook_time">Cook Time</Label>
                <Input
                  id="cook_time"
                  value={formData.cook_time}
                  onChange={(e) => updateField('cook_time', e.target.value)}
                  placeholder="30 mins"
                />
              </div>
              <div>
                <Label htmlFor="total_time">Total Time</Label>
                <Input
                  id="total_time"
                  value={formData.total_time}
                  onChange={(e) => updateField('total_time', e.target.value)}
                  placeholder="45 mins"
                />
              </div>
              <div>
                <Label htmlFor="servings">Servings</Label>
                <Input
                  id="servings"
                  value={formData.servings}
                  onChange={(e) => updateField('servings', e.target.value)}
                  placeholder="4-6"
                />
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Ingredients */}
        <Collapsible open={openSections.ingredients} onOpenChange={() => toggleSection('ingredients')}>
          <CollapsibleTrigger className="flex items-center justify-between w-full p-2 hover:bg-accent rounded">
            <h4 className="font-semibold">Ingredients</h4>
            <ChevronDown className={cn("h-4 w-4 transition-transform", openSections.ingredients && "rotate-180")} />
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-2 mt-2">
            {formData.ingredients.map((ingredient, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={ingredient}
                  onChange={(e) => updateArrayItem('ingredients', index, e.target.value)}
                  placeholder="1 cup flour"
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeArrayItem('ingredients', index)}
                  disabled={formData.ingredients.length === 1}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => addArrayItem('ingredients')}
              className="mt-2"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Ingredient
            </Button>
          </CollapsibleContent>
        </Collapsible>

        {/* Method */}
        <Collapsible open={openSections.method} onOpenChange={() => toggleSection('method')}>
          <CollapsibleTrigger className="flex items-center justify-between w-full p-2 hover:bg-accent rounded">
            <h4 className="font-semibold">Method</h4>
            <ChevronDown className={cn("h-4 w-4 transition-transform", openSections.method && "rotate-180")} />
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-2 mt-2">
            {formData.method.map((step, index) => (
              <div key={index} className="flex gap-2">
                <div className="flex-1">
                  <Label className="text-sm text-muted-foreground">Step {index + 1}</Label>
                  <Textarea
                    value={step}
                    onChange={(e) => updateArrayItem('method', index, e.target.value)}
                    placeholder="Describe this step..."
                    rows={2}
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeArrayItem('method', index)}
                  disabled={formData.method.length === 1}
                  className="mt-6"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => addArrayItem('method')}
              className="mt-2"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Step
            </Button>
          </CollapsibleContent>
        </Collapsible>

        {/* Tips */}
        <Collapsible open={openSections.tips} onOpenChange={() => toggleSection('tips')}>
          <CollapsibleTrigger className="flex items-center justify-between w-full p-2 hover:bg-accent rounded">
            <h4 className="font-semibold">Tips</h4>
            <ChevronDown className={cn("h-4 w-4 transition-transform", openSections.tips && "rotate-180")} />
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-2 mt-2">
            {formData.tips.map((tip, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={tip}
                  onChange={(e) => updateArrayItem('tips', index, e.target.value)}
                  placeholder="Pro tip..."
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeArrayItem('tips', index)}
                  disabled={formData.tips.length === 1}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => addArrayItem('tips')}
              className="mt-2"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Tip
            </Button>
          </CollapsibleContent>
        </Collapsible>

        {/* Troubleshooting */}
        <Collapsible open={openSections.troubleshooting} onOpenChange={() => toggleSection('troubleshooting')}>
          <CollapsibleTrigger className="flex items-center justify-between w-full p-2 hover:bg-accent rounded">
            <h4 className="font-semibold">Troubleshooting</h4>
            <ChevronDown className={cn("h-4 w-4 transition-transform", openSections.troubleshooting && "rotate-180")} />
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-3 mt-2">
            {formData.troubleshooting.map((item, index) => (
              <div key={index} className="border rounded p-3 space-y-2">
                <div className="flex justify-between items-center">
                  <Label className="text-sm font-medium">Issue & Solution {index + 1}</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeArrayItem('troubleshooting', index)}
                    disabled={formData.troubleshooting.length === 1}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <Input
                  value={item.issue || ''}
                  onChange={(e) => updateArrayItem('troubleshooting', index, { ...item, issue: e.target.value })}
                  placeholder="What's the issue?"
                />
                <Textarea
                  value={item.solution || ''}
                  onChange={(e) => updateArrayItem('troubleshooting', index, { ...item, solution: e.target.value })}
                  placeholder="How to solve it..."
                  rows={2}
                />
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => addArrayItem('troubleshooting', { issue: '', solution: '' })}
              className="mt-2"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Troubleshooting
            </Button>
          </CollapsibleContent>
        </Collapsible>

        {/* Image */}
        <Collapsible open={openSections.image} onOpenChange={() => toggleSection('image')}>
          <CollapsibleTrigger className="flex items-center justify-between w-full p-2 hover:bg-accent rounded">
            <h4 className="font-semibold">Recipe Image</h4>
            <ChevronDown className={cn("h-4 w-4 transition-transform", openSections.image && "rotate-180")} />
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-2 mt-2">
            <div>
              <Label htmlFor="image_url">Image URL</Label>
              <Input
                id="image_url"
                value={formData.image_url}
                onChange={(e) => updateField('image_url', e.target.value)}
                placeholder="https://example.com/recipe-image.jpg"
              />
            </div>
            {formData.image_url && (
              <div className="mt-2">
                <img 
                  src={formData.image_url} 
                  alt="Recipe preview" 
                  className="w-32 h-32 object-cover rounded border"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            )}
          </CollapsibleContent>
        </Collapsible>

        {/* Organization */}
        <Collapsible open={openSections.organization} onOpenChange={() => toggleSection('organization')}>
          <CollapsibleTrigger className="flex items-center justify-between w-full p-2 hover:bg-accent rounded">
            <h4 className="font-semibold flex items-center gap-2">
              <Folder className="h-4 w-4" />
              Organization
            </h4>
            <ChevronDown className={cn("h-4 w-4 transition-transform", openSections.organization && "rotate-180")} />
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-3 mt-2">
            <div>
              <Label htmlFor="folder">Folder</Label>
              <Select value={formData.folder} onValueChange={(value) => updateField('folder', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select or create folder" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">No Folder</SelectItem>
                  {[...new Set(allRecipes.map(r => r.folder).filter(Boolean))].map((folder) => (
                    <SelectItem key={folder} value={folder}>{folder}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                className="mt-2"
                value={formData.folder}
                onChange={(e) => updateField('folder', e.target.value)}
                placeholder="Or type new folder name"
              />
            </div>
            <div>
              <Label className="flex items-center gap-2">
                <Tag className="h-4 w-4" />
                Tags
              </Label>
              <div className="space-y-2">
                {formData.tags.map((tag, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={tag}
                      onChange={(e) => updateArrayItem('tags', index, e.target.value)}
                      placeholder="Tag name"
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeArrayItem('tags', index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addArrayItem('tags')}
                  className="mt-2"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Tag
                </Button>
              </div>
              <div className="mt-2">
                <Label className="text-sm text-muted-foreground">Existing tags:</Label>
                <div className="flex flex-wrap gap-1 mt-1">
                  {[...new Set(allRecipes.flatMap(r => r.tags || []))].filter(Boolean).map((tag) => (
                    <Button
                      key={tag}
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-6 text-xs"
                      onClick={() => {
                        if (!formData.tags.includes(tag)) {
                          updateField('tags', [...formData.tags, tag]);
                        }
                      }}
                    >
                      {tag}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-4 border-t">
          <Button 
            variant="hero" 
            onClick={handleSave}
            disabled={updating}
          >
            {updating ? 'Saving...' : 'Save All Changes'}
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