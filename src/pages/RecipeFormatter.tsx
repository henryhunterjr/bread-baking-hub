import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { RecipeUploadSection } from '../components/RecipeUploadSection';
import { FormattedRecipeDisplay } from '../components/FormattedRecipeDisplay';
import { AIAssistantSidebar } from '../components/AIAssistantSidebar';
import { VoiceInterface } from '../components/VoiceInterface';

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

interface RecipeWithImage {
  recipe: FormattedRecipe;
  imageUrl?: string;
}

const RecipeFormatter = () => {
  const isMobile = useIsMobile();
  const [formattedRecipe, setFormattedRecipe] = useState<RecipeWithImage | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const { toast } = useToast();

  const handleRecipeFormatted = (recipe: FormattedRecipe, imageUrl?: string) => {
    setFormattedRecipe({ recipe, imageUrl });
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
    <div className="bg-background text-foreground min-h-screen relative">
      <Header />
      <main className={`py-20 px-4 transition-all duration-300 ${isSidebarOpen && !isMobile ? 'mr-96' : ''}`}>
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-3xl sm:text-4xl font-bold text-primary">Upload Your Recipe</h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
              Upload a photo of your handwritten recipe and our AI will format it into a beautiful, 
              easy-to-follow digital recipe with metric and volume measurements.
            </p>
          </div>

          <RecipeUploadSection 
            onRecipeFormatted={handleRecipeFormatted}
            onError={handleError}
          />

          {formattedRecipe && (
            <FormattedRecipeDisplay 
              recipe={formattedRecipe.recipe} 
              imageUrl={formattedRecipe.imageUrl}
            />
          )}
        </div>
      </main>
      <Footer />
      
      <AIAssistantSidebar
        recipeContext={formattedRecipe?.recipe}
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
      />
      
      <VoiceInterface
        onSpeakingChange={setIsSpeaking}
        recipeContext={formattedRecipe?.recipe}
      />
    </div>
  );
};

export default RecipeFormatter;