import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { RecipeUploadSection } from '../components/RecipeUploadSection';
import { FormattedRecipeDisplay } from '../components/FormattedRecipeDisplay';

interface FormattedRecipe {
  title: string;
  introduction: string;
  ingredients: {
    metric: string[];
    volume: string[];
  };
  method: string[];
  tips: string[];
  troubleshooting: string[];
}

const RecipeFormatter = () => {
  const [formattedRecipe, setFormattedRecipe] = useState<FormattedRecipe | null>(null);
  const { toast } = useToast();

  const handleRecipeFormatted = (recipe: FormattedRecipe) => {
    setFormattedRecipe(recipe);
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

  return (
    <div className="bg-background text-foreground min-h-screen">
      <Header />
      <main className="py-20 px-4">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-primary">Upload Your Recipe</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Upload a photo or PDF of your handwritten recipe and our AI will format it into a beautiful, 
              easy-to-follow digital recipe with metric and volume measurements.
            </p>
          </div>

          <RecipeUploadSection 
            onRecipeFormatted={handleRecipeFormatted}
            onError={handleError}
          />

          {formattedRecipe && (
            <FormattedRecipeDisplay recipe={formattedRecipe} />
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default RecipeFormatter;