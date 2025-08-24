import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { AlertCircle, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { FormattedRecipe } from '@/types/recipe-workspace';
import { logger } from '@/utils/logger';
import { recipeApiClient } from '@/utils/recipeApiClient';

interface RecipeTextInputProps {
  onRecipeFormatted: (recipe: FormattedRecipe, imageUrl?: string) => void;
}

export const RecipeTextInput = ({ onRecipeFormatted }: RecipeTextInputProps) => {
  const [recipeText, setRecipeText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!recipeText.trim()) {
      toast({
        title: "No content",
        description: "Please paste some recipe text to process.",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    setProgress(0);
    setError(null);

    try {
      setProgress(20);
      
      toast({
        title: "Processing...",
        description: "Formatting your recipe text with AI..."
      });

      setProgress(40);

      // Use the API client for text processing (no file/MIME handling)
      const result = await recipeApiClient.formatRecipe({
        source_type: 'text',
        text: recipeText.trim()
      });

      setProgress(70);

      if (!result.ok) {
        // Show user-friendly error message and auto-save draft
        toast({
          title: "Processing failed",
          description: result.message,
          variant: "destructive"
        });
        
        // Auto-save the text as a draft so user never loses work
        await recipeApiClient.saveDraft({
          source: 'text',
          raw_text: recipeText
        });
        
        setError(result.message || 'Failed to process recipe text');
        return;
      }

      setProgress(100);

      if (!result.recipe) {
        throw new Error('No recipe data returned from processing');
      }

      toast({
        title: "Success!",
        description: "Recipe text processed successfully"
      });

      // Show "Review recipe" modal and save draft immediately
      onRecipeFormatted(result.recipe);
      setRecipeText(''); // Clear the input
    } catch (error: any) {
      logger.error('Error processing recipe text:', error);
      const errorMessage = error?.message || 'Failed to process recipe text';
      setError(errorMessage);
      toast({
        title: "Processing failed",
        description: errorMessage,
        variant: "destructive"
      });
      
      // Auto-save draft on any error
      try {
        await recipeApiClient.saveDraft({
          source: 'text',
          raw_text: recipeText
        });
      } catch {}
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  };

  const exampleText = `Classic Sourdough Bread

Ingredients:
- 500g bread flour
- 100g active sourdough starter
- 350ml water
- 10g salt

Method:
1. Mix flour and water, let rest 30 minutes
2. Add starter and salt, mix well
3. Knead for 10 minutes until smooth
4. First rise: 4-6 hours at room temperature
5. Shape and place in banneton
6. Final rise: overnight in refrigerator
7. Bake at 450°F for 45 minutes`;

  return (
    <div className="space-y-4">
      <div>
        <Textarea
          value={recipeText}
          onChange={(e) => setRecipeText(e.target.value)}
          placeholder={`Paste your recipe text here...\n\nExample format:\n${exampleText}`}
          className="min-h-[300px] font-mono text-sm"
          disabled={isProcessing}
        />
        <div className="mt-2 text-xs text-muted-foreground">
          {recipeText.length} characters • Supports any text format with ingredients and method sections
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {isProcessing && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Processing recipe text...</span>
            <span className="text-primary font-semibold">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
          <p className="text-xs text-muted-foreground text-center">
            AI is analyzing your recipe and formatting it into a structured format
          </p>
        </div>
      )}

      <Button 
        onClick={handleSubmit}
        disabled={!recipeText.trim() || isProcessing}
        className="w-full"
        variant="hero"
      >
        {isProcessing ? (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            Processing Recipe...
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Format Recipe Text
          </div>
        )}
      </Button>

      <div className="text-xs text-muted-foreground">
        <p className="font-medium mb-1">Tips for best results:</p>
        <ul className="space-y-1">
          <li>• Include clear "Ingredients" and "Method" sections</li>
          <li>• Use bullet points or numbers for lists</li>
          <li>• Include quantities and measurements</li>
          <li>• Add cooking times and temperatures when available</li>
        </ul>
      </div>
    </div>
  );
};