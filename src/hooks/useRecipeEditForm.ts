import { useState } from 'react';

interface UseRecipeEditFormProps {
  recipe: any;
  allRecipes?: any[];
}

export const useRecipeEditForm = ({ recipe, allRecipes = [] }: UseRecipeEditFormProps) => {
  const [formData, setFormData] = useState({
    introduction: recipe.data.introduction || '',
    author_name: recipe.author_name || recipe.data.author_name || '',
    prep_time: recipe.data.prep_time || '',
    cook_time: recipe.data.cook_time || '',
    total_time: recipe.data.total_time || '',
    servings: recipe.data.servings || '',
    ingredients: Array.isArray(recipe.data.ingredients) 
      ? recipe.data.ingredients.map(ing => 
          typeof ing === 'object' ? `${ing.amount_volume || ing.amount_metric || ''} ${ing.item || ''}`.trim() : String(ing || '')
        )
      : [''],
    method: Array.isArray(recipe.data.method) 
      ? recipe.data.method.map(step => 
          typeof step === 'object' ? step.instruction || '' : String(step || '')
        )
      : [''],
    tips: Array.isArray(recipe.data.tips) 
      ? recipe.data.tips.map(tip => String(tip || ''))
      : [''],
    troubleshooting: Array.isArray(recipe.data.troubleshooting) 
      ? recipe.data.troubleshooting.map(item => 
          typeof item === 'object' ? item : { issue: String(item || ''), solution: '' }
        )
      : [{ issue: '', solution: '' }],
    image_url: recipe.image_url || '',
    folder: recipe.folder || '',
    tags: recipe.tags || [],
    is_public: recipe.is_public || false,
    slug: recipe.slug || '',
    recommended_products: Array.isArray(recipe.data.recommended_products) 
      ? recipe.data.recommended_products.map(prod => String(prod || ''))
      : []
  });

  const [openSections, setOpenSections] = useState({
    basics: true,
    ingredients: false,
    method: false,
    tips: false,
    troubleshooting: false,
    image: false,
    organization: false,
    sharing: false,
    products: true
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

  const prepareFormDataForSave = () => {
    // Clean up data - remove empty strings and validate
    const cleanedData = {
      ...recipe.data,
      introduction: formData.introduction.trim(),
      author_name: formData.author_name.trim(),
      prep_time: formData.prep_time.trim(),
      cook_time: formData.cook_time.trim(),
      total_time: formData.total_time.trim(),
      servings: formData.servings.trim(),
      ingredients: formData.ingredients.filter(item => String(item || '').trim() !== ''),
      method: formData.method.filter(item => String(item || '').trim() !== ''),
      tips: formData.tips.filter(item => String(item || '').trim() !== ''),
      troubleshooting: formData.troubleshooting.filter(item => 
        (typeof item === 'object' && (String(item.issue || '').trim() !== '' || String(item.solution || '').trim() !== '')) ||
        (typeof item === 'string' && String(item).trim() !== '')
      ),
      recommended_products: formData.recommended_products.filter(id => String(id || '').trim() !== '')
    };

    const updates: any = { data: cleanedData };
    
    // Always save author_name as a top-level field for proper attribution
    updates.author_name = formData.author_name.trim() || null;
    if (formData.image_url !== recipe.image_url) {
      updates.image_url = formData.image_url.trim() || null;
    }
    if (formData.folder !== recipe.folder) {
      updates.folder = formData.folder.trim() || null;
    }
    if (JSON.stringify(formData.tags) !== JSON.stringify(recipe.tags)) {
      updates.tags = formData.tags.filter(tag => tag.trim() !== '');
    }
    if (formData.is_public !== recipe.is_public) {
      updates.is_public = formData.is_public;
    }
    if (formData.slug !== recipe.slug) {
      updates.slug = formData.slug.trim() || null;
    }

    return updates;
  };

  return {
    formData,
    openSections,
    toggleSection,
    updateField,
    addArrayItem,
    removeArrayItem,
    updateArrayItem,
    prepareFormDataForSave,
  };
};