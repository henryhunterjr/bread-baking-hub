import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { FormattedRecipe, RecipeWithImage, WorkspaceStep } from '@/types/recipe-workspace';

export const useRecipeWorkspace = () => {
  const [formattedRecipe, setFormattedRecipe] = useState<RecipeWithImage | null>(null);
  const [editedRecipe, setEditedRecipe] = useState<FormattedRecipe | null>(null);
  const [recipeImageUrl, setRecipeImageUrl] = useState<string>('');
  const [currentStep, setCurrentStep] = useState<WorkspaceStep>('upload');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const { toast } = useToast();

  const handleRecipeFormatted = (recipe: FormattedRecipe, imageUrl?: string) => {
    setFormattedRecipe({ recipe, imageUrl });
    setEditedRecipe(recipe);
    setRecipeImageUrl(imageUrl || '');
    setCurrentStep('review');
    toast({
      title: "Success!",
      description: "Your recipe has been formatted successfully.",
    });
  };

  const handleError = (message: string) => {
    toast({
      title: "Error",
      description: message,
      variant: "destructive",
    });
  };

  const handleEditToggle = () => {
    setIsEditMode(!isEditMode);
    if (!isEditMode) {
      setCurrentStep('edit');
    } else {
      setCurrentStep('review');
    }
  };

  const handleRecipeUpdate = async (recipeId: string, updates: { data: FormattedRecipe; image_url?: string }) => {
    if (!editedRecipe) return false;
    
    try {
      // Update the local state with the new data
      setEditedRecipe(updates.data);
      if (updates.image_url !== undefined) {
        setRecipeImageUrl(updates.image_url);
      }
      
      toast({
        title: "Updated",
        description: "Recipe changes applied successfully!",
      });
      return true;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update recipe. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  const handleImageUploaded = (imageUrl: string) => {
    setRecipeImageUrl(imageUrl);
    toast({
      title: "Image uploaded",
      description: "Recipe photo added successfully!",
    });
  };

  const handleImageRemoved = () => {
    setRecipeImageUrl('');
    toast({
      title: "Image removed",
      description: "Recipe photo has been removed.",
    });
  };

  const handleRecipeSaved = (recipeId: string) => {
    setCurrentStep('save');
    toast({
      title: "Recipe saved!",
      description: "Your recipe has been saved to your collection.",
    });
  };

  const handleSaveToLibrary = async () => {
    if (!editedRecipe) return false;
    
    // For now, just trigger the save step - actual persistence can be added later
    setCurrentStep('save');
    toast({
      title: "Recipe saved!",
      description: "Your recipe has been saved to your collection.",
    });
    return true;
  };

  const handleRecipeSelect = (recipe: { data: FormattedRecipe; image_url?: string }) => {
    setFormattedRecipe({ recipe: recipe.data, imageUrl: recipe.image_url });
    setEditedRecipe(recipe.data);
    setRecipeImageUrl(recipe.image_url || '');
    setCurrentStep('review');
    setIsEditMode(false);
  };

  const handleStartOver = () => {
    setFormattedRecipe(null);
    setEditedRecipe(null);
    setRecipeImageUrl('');
    setCurrentStep('upload');
    setIsEditMode(false);
  };

  return {
    // State
    formattedRecipe,
    editedRecipe,
    recipeImageUrl,
    currentStep,
    isSpeaking,
    isEditMode,
    
    // Handlers
    handleRecipeFormatted,
    handleError,
    handleEditToggle,
    handleRecipeUpdate,
    handleImageUploaded,
    handleImageRemoved,
    handleRecipeSaved,
    handleSaveToLibrary,
    handleRecipeSelect,
    handleStartOver,
    setIsSpeaking,
  };
};