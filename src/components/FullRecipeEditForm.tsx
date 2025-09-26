import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BasicInfoSection } from './recipe-edit/BasicInfoSection';
import { IngredientsSection } from './recipe-edit/IngredientsSection';
import { MethodSection } from './recipe-edit/MethodSection';
import { TipsSection } from './recipe-edit/TipsSection';
import { TroubleshootingSection } from './recipe-edit/TroubleshootingSection';
import { ImageSection } from './recipe-edit/ImageSection';
import { OrganizationSection } from './recipe-edit/OrganizationSection';
import { PublicSharingSection } from './recipe-edit/PublicSharingSection';
import { RecommendedProductsSection } from './recipe-edit/RecommendedProductsSection';
import { useRecipeEditForm } from '@/hooks/useRecipeEditForm';
import { Recipe, RecipeUpdateData } from '@/types';

interface FullRecipeEditFormProps {
  recipe: Recipe;
  onSave: (recipeId: string, updates: RecipeUpdateData) => Promise<boolean>;
  onCancel: () => void;
  updating: boolean;
  allRecipes?: Recipe[];
}


export const FullRecipeEditForm = ({ recipe, onSave, onCancel, updating, allRecipes = [] }: FullRecipeEditFormProps) => {
  const {
    formData,
    openSections,
    toggleSection,
    updateField,
    addArrayItem,
    removeArrayItem,
    updateArrayItem,
    prepareFormDataForSave,
  } = useRecipeEditForm({ recipe, allRecipes });

  const handleSave = async () => {
    const updates = prepareFormDataForSave();
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
            author_name: formData.author_name || '',
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

        <PublicSharingSection
          isPublic={formData.is_public}
          slug={formData.slug}
          recipeTitle={recipe.title}
          userId={recipe.user_id}
          isOpen={openSections.sharing}
          onToggle={() => toggleSection('sharing')}
          onUpdatePublic={(value) => updateField('is_public', value)}
          onUpdateSlug={(value) => updateField('slug', value)}
        />

        <RecommendedProductsSection
          recommendedProducts={formData.recommended_products}
          isOpen={openSections.products}
          onToggle={() => toggleSection('products')}
          onAdd={() => addArrayItem('recommended_products')}
          onRemove={(index) => removeArrayItem('recommended_products', index)}
          onUpdate={(index, value) => updateArrayItem('recommended_products', index, value)}
          onQuickAdd={(productId) => {
            if (!formData.recommended_products.includes(productId)) {
              updateField('recommended_products', [...formData.recommended_products, productId]);
            }
          }}
        />

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2 pt-4 border-t">
          <Button 
            variant="hero" 
            onClick={handleSave}
            disabled={updating}
            className="w-full sm:w-auto touch-manipulation"
          >
            {updating ? 'Saving...' : 'Save All Changes'}
          </Button>
          <Button 
            variant="outline" 
            onClick={onCancel}
            disabled={updating}
            className="w-full sm:w-auto touch-manipulation"
          >
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};