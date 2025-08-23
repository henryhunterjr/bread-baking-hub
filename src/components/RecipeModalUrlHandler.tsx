import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface RecipeModalUrlHandlerProps {
  onRecipeSelect: (recipeSlug: string) => void;
}

export const RecipeModalUrlHandler = ({ onRecipeSelect }: RecipeModalUrlHandlerProps) => {
  const location = useLocation();

  useEffect(() => {
    // Check for recipe parameter in URL
    const urlParams = new URLSearchParams(location.search);
    const recipeParam = urlParams.get('recipe');
    
    if (recipeParam) {
      // Open the recipe modal
      onRecipeSelect(recipeParam);
      
      // Clean up the URL without triggering navigation
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete('recipe');
      window.history.replaceState({}, document.title, newUrl.toString());
    }
  }, [location.search, onRecipeSelect]);

  return null; // This component only handles URL logic
};