import React from 'react';
import { Button } from '@/components/ui/button';

interface RecipeAnalysisSectionProps {
  recipeText: string;
  setRecipeText: (text: string) => void;
  onAnalyze: () => void;
}

export default function RecipeAnalysisSection({ recipeText, setRecipeText, onAnalyze }: RecipeAnalysisSectionProps) {
  return (
    <div className="mb-8 p-6 bg-card border border-border rounded-lg">
      <label htmlFor="recipe-text" className="block text-lg font-semibold mb-3 text-primary">
        Analyze Your Recipe
      </label>
      <textarea
        id="recipe-text"
        value={recipeText}
        onChange={e => setRecipeText(e.target.value)}
        placeholder="Paste your recipe here or describe the problem you're experiencing..."
        className="w-full p-4 border border-input rounded-lg h-32 resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-background text-foreground placeholder:text-muted-foreground"
      />
      <Button 
        onClick={onAnalyze}
        disabled={!recipeText.trim()}
        className="mt-3 bg-primary hover:bg-primary/80 text-primary-foreground font-medium focus:ring-2 focus:ring-primary"
      >
        Analyze Recipe
      </Button>
    </div>
  );
}