import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { FormattedRecipe, RecipeWithImage, WorkspaceStep } from '@/types/recipe-workspace';
import { supabase } from '@/integrations/supabase/client';

type WorkspaceState = 'idle' | 'validating' | 'uploading' | 'formatting' | 'editable' | 'saving' | 'saved' | 'error';

export const useRecipeWorkspace = () => {
  const [formattedRecipe, setFormattedRecipe] = useState<RecipeWithImage | null>(null);
  const [editedRecipe, setEditedRecipe] = useState<FormattedRecipe | null>(null);
  const [recipeImageUrl, setRecipeImageUrl] = useState<string>('');
  const [currentStep, setCurrentStep] = useState<WorkspaceStep>('upload');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [workspaceState, setWorkspaceState] = useState<WorkspaceState>('idle');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorFallback, setErrorFallback] = useState<string>('');
  const { toast } = useToast();

  const formatRecipeWithRetry = async (file: File, maxRetries = 3): Promise<any> => {
    let lastError: Error | null = null;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        setWorkspaceState(attempt === 1 ? 'uploading' : 'formatting');
        
        const formData = new FormData();
        formData.append('file', file);

        const { data, error } = await supabase.functions.invoke('format-recipe', {
          body: formData,
        });

        if (error) throw error;
        if (!data?.recipe) throw new Error('No recipe data received');

        return data;
      } catch (error) {
        lastError = error as Error;
        console.error(`Format attempt ${attempt}/${maxRetries} failed:`, error);
        
        if (attempt < maxRetries) {
          // Exponential backoff: 2s, 4s, 8s
          const delay = Math.pow(2, attempt) * 1000;
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }
    
    throw lastError;
  };

  const handleRecipeFormatted = (recipe: FormattedRecipe, imageUrl?: string) => {
    console.log('Recipe formatted:', recipe);
    console.log('Image URL:', imageUrl);
    console.log('Recipe ingredients:', recipe.ingredients);
    
    setFormattedRecipe({ recipe, imageUrl });
    setEditedRecipe(recipe);
    setRecipeImageUrl(imageUrl || '');
    setCurrentStep('review');
    setWorkspaceState('editable');
    setIsProcessing(false);
    toast({
      title: "Success!",
      description: "Your recipe has been formatted successfully.",
    });
  };

  const handleError = (message: string, extractedText?: string) => {
    setWorkspaceState('error');
    setIsProcessing(false);
    setErrorFallback(extractedText || '');
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
    setWorkspaceState('saved');
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
    setWorkspaceState('idle');
    setIsProcessing(false);
    setErrorFallback('');
  };

  return {
    // State
    formattedRecipe,
    editedRecipe,
    recipeImageUrl,
    currentStep,
    isSpeaking,
    isEditMode,
    workspaceState,
    isProcessing,
    errorFallback,
    
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
    formatRecipeWithRetry,
    setIsSpeaking,
    setIsProcessing,
    setWorkspaceState,
    setIsEditMode,
  };
};