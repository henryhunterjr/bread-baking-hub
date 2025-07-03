import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, Plus, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FullRecipeEditFormProps {
  recipe: any;
  onSave: (recipeId: string, updates: { data: any; image_url?: string }) => Promise<boolean>;
  onCancel: () => void;
  updating: boolean;
}

export const FullRecipeEditForm = ({ recipe, onSave, onCancel, updating }: FullRecipeEditFormProps) => {
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
    image_url: recipe.image_url || ''
  });

  const [openSections, setOpenSections] = useState({
    basics: true,
    ingredients: false,
    method: false,
    tips: false,
    troubleshooting: false,
    image: false
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