import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BasicInfoSection } from './recipe-edit/BasicInfoSection';
import { IngredientsSection } from './recipe-edit/IngredientsSection';
import { MethodSection } from './recipe-edit/MethodSection';
import { TipsSection } from './recipe-edit/TipsSection';
import { TroubleshootingSection } from './recipe-edit/TroubleshootingSection';
import { ImageSection } from './recipe-edit/ImageSection';
import { OrganizationSection } from './recipe-edit/OrganizationSection';

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
        <BasicInfoSection
          formData={{
            introduction: formData.introduction,
            prep_time: formData.prep_time,
            cook_time: formData.cook_time,
            total_time: formData.total_time,
            servings: formData.servings
          }}
          isOpen={openSections.basics}
          onToggle={() => toggleSection('basics')}
          onUpdate={updateField}
        />

        <IngredientsSection
          ingredients={formData.ingredients}
          isOpen={openSections.ingredients}
          onToggle={() => toggleSection('ingredients')}
          onAdd={() => addArrayItem('ingredients')}
          onRemove={(index) => removeArrayItem('ingredients', index)}
          onUpdate={(index, value) => updateArrayItem('ingredients', index, value)}
        />

        <MethodSection
          method={formData.method}
          isOpen={openSections.method}
          onToggle={() => toggleSection('method')}
          onAdd={() => addArrayItem('method')}
          onRemove={(index) => removeArrayItem('method', index)}
          onUpdate={(index, value) => updateArrayItem('method', index, value)}
        />

        <TipsSection
          tips={formData.tips}
          isOpen={openSections.tips}
          onToggle={() => toggleSection('tips')}
          onAdd={() => addArrayItem('tips')}
          onRemove={(index) => removeArrayItem('tips', index)}
          onUpdate={(index, value) => updateArrayItem('tips', index, value)}
        />

        <TroubleshootingSection
          troubleshooting={formData.troubleshooting}
          isOpen={openSections.troubleshooting}
          onToggle={() => toggleSection('troubleshooting')}
          onAdd={() => addArrayItem('troubleshooting', { issue: '', solution: '' })}
          onRemove={(index) => removeArrayItem('troubleshooting', index)}
          onUpdate={(index, value) => updateArrayItem('troubleshooting', index, value)}
        />

        <ImageSection
          imageUrl={formData.image_url}
          isOpen={openSections.image}
          onToggle={() => toggleSection('image')}
          onUpdate={(value) => updateField('image_url', value)}
        />

        <OrganizationSection
          folder={formData.folder}
          tags={formData.tags}
          allRecipes={allRecipes}
          isOpen={openSections.organization}
          onToggle={() => toggleSection('organization')}
          onUpdateFolder={(value) => updateField('folder', value)}
          onAddTag={() => addArrayItem('tags')}
          onRemoveTag={(index) => removeArrayItem('tags', index)}
          onUpdateTag={(index, value) => updateArrayItem('tags', index, value)}
          onQuickAddTag={(tag) => {
            if (!formData.tags.includes(tag)) {
              updateField('tags', [...formData.tags, tag]);
            }
          }}
        />

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