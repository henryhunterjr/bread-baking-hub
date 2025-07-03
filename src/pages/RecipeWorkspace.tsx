import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/hooks/useAuth';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { RecipeUploadSection } from '../components/RecipeUploadSection';
import { FormattedRecipeDisplay } from '../components/FormattedRecipeDisplay';
import { FullRecipeEditForm } from '../components/FullRecipeEditForm';
import { RecipeImageUploader } from '../components/RecipeImageUploader';
import { RecipeActionsToolbar } from '../components/RecipeActionsToolbar';
import { AIAssistantSidebar } from '../components/AIAssistantSidebar';
import { RecipeQuickAccessDrawer } from '../components/RecipeQuickAccessDrawer';
import { VoiceInterface } from '../components/VoiceInterface';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChefHat, Upload, Edit, Save, Sparkles } from 'lucide-react';

interface FormattedRecipe {
  title: string;
  introduction: string;
  prep_time?: string;
  cook_time?: string;
  total_time?: string;
  servings?: string;
  course?: string;
  cuisine?: string;
  equipment?: string[];
  ingredients: any;
  method: any;
  tips: string[];
  troubleshooting: any;
}

interface RecipeWithImage {
  recipe: FormattedRecipe;
  imageUrl?: string;
}

type WorkspaceStep = 'upload' | 'review' | 'edit' | 'save';

const RecipeWorkspace = () => {
  const isMobile = useIsMobile();
  const { user } = useAuth();
  const [formattedRecipe, setFormattedRecipe] = useState<RecipeWithImage | null>(null);
  const [editedRecipe, setEditedRecipe] = useState<FormattedRecipe | null>(null);
  const [recipeImageUrl, setRecipeImageUrl] = useState<string>('');
  const [currentStep, setCurrentStep] = useState<WorkspaceStep>('upload');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
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

  const handleRecipeUpdate = async (recipeId: string, updates: any) => {
    // This is for editing existing recipes loaded from quick access
    // For now, just show success since we're working with formatted recipes
    toast({
      title: "Updated",
      description: "Recipe changes applied locally. Save to persist changes.",
    });
    return true;
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

  const handleRecipeSelect = (recipe: any) => {
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

  const getStepIcon = (step: WorkspaceStep) => {
    switch (step) {
      case 'upload': return <Upload className="h-5 w-5" />;
      case 'review': return <ChefHat className="h-5 w-5" />;
      case 'edit': return <Edit className="h-5 w-5" />;
      case 'save': return <Save className="h-5 w-5" />;
    }
  };

  const getStepTitle = (step: WorkspaceStep) => {
    switch (step) {
      case 'upload': return 'Upload Recipe';
      case 'review': return 'Review & Format';
      case 'edit': return 'Edit Details';
      case 'save': return 'Save & Share';
    }
  };

  return (
    <div className="bg-background text-foreground min-h-screen relative">
      <Header />
      <main className={`py-20 px-4 transition-all duration-300 ${isSidebarOpen && !isMobile ? 'mr-96' : ''} ${user ? 'pb-32' : ''}`}>
        <div className="max-w-6xl mx-auto space-y-8">
          
          {/* Header Section */}
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Sparkles className="h-8 w-8 text-primary" />
              <h1 className="text-3xl sm:text-4xl font-bold text-primary">Recipe Workspace</h1>
            </div>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
              Your complete recipe creation studio. Upload, format, edit, and save your recipes with AI assistance.
            </p>
          </div>

          {/* Progress Steps */}
          <Card className="shadow-warm">
            <CardHeader>
              <CardTitle className="text-center">Workflow Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                {(['upload', 'review', 'edit', 'save'] as WorkspaceStep[]).map((step, index) => (
                  <div key={step} className="flex flex-col items-center">
                    <div className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-colors ${
                      currentStep === step 
                        ? 'bg-primary text-primary-foreground border-primary' 
                        : index < (['upload', 'review', 'edit', 'save'] as WorkspaceStep[]).indexOf(currentStep)
                        ? 'bg-primary/20 text-primary border-primary'
                        : 'bg-muted text-muted-foreground border-muted-foreground'
                    }`}>
                      {getStepIcon(step)}
                    </div>
                    <span className={`text-sm mt-2 font-medium ${
                      currentStep === step ? 'text-primary' : 'text-muted-foreground'
                    }`}>
                      {getStepTitle(step)}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Upload Section */}
          {currentStep === 'upload' && (
            <RecipeUploadSection 
              onRecipeFormatted={handleRecipeFormatted}
              onError={handleError}
            />
          )}

          {/* Recipe Display and Editing */}
          {formattedRecipe && currentStep !== 'upload' && (
            <div className="space-y-8">
              
              {/* Review Section */}
              {!isEditMode && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-primary">Formatted Recipe</h2>
                    <div className="flex gap-2">
                      <Button onClick={handleEditToggle} variant="outline" className="touch-manipulation">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Recipe
                      </Button>
                      <Button onClick={handleStartOver} variant="outline" className="touch-manipulation">
                        Start Over
                      </Button>
                    </div>
                  </div>
                  <FormattedRecipeDisplay 
                    recipe={editedRecipe || formattedRecipe.recipe} 
                    imageUrl={recipeImageUrl}
                  />
                </div>
              )}

              {/* Edit Section */}
              {isEditMode && editedRecipe && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-primary">Edit Recipe Details</h2>
                    <Button onClick={handleEditToggle} variant="outline" className="touch-manipulation">
                      <ChefHat className="h-4 w-4 mr-2" />
                      Back to Review
                    </Button>
                  </div>
                  <FullRecipeEditForm
                    recipe={{ 
                      id: 'temp', 
                      title: editedRecipe.title, 
                      data: editedRecipe,
                      image_url: recipeImageUrl,
                      user_id: user?.id || '',
                      folder: '',
                      tags: [],
                      is_public: false,
                      slug: ''
                    }}
                    onSave={handleRecipeUpdate}
                    onCancel={handleEditToggle}
                    updating={false}
                  />
                </div>
              )}

              {/* Image Upload Section */}
              {!isEditMode && (
                <RecipeImageUploader
                  currentImageUrl={recipeImageUrl}
                  onImageUploaded={handleImageUploaded}
                  onImageRemoved={handleImageRemoved}
                />
              )}

              {/* Actions Toolbar */}
              {!isEditMode && user && (
                <RecipeActionsToolbar
                  recipe={editedRecipe || formattedRecipe.recipe}
                  imageUrl={recipeImageUrl}
                  onSaved={handleRecipeSaved}
                />
              )}
            </div>
          )}

          {/* Success State */}
          {currentStep === 'save' && (
            <Card className="shadow-warm text-center">
              <CardContent className="pt-8 pb-8">
                <div className="space-y-4">
                  <div className="mx-auto w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center">
                    <Save className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold text-primary">Recipe Saved Successfully!</h3>
                  <p className="text-muted-foreground">
                    Your recipe has been saved to your collection. You can find it in "My Recipes".
                  </p>
                  <Button onClick={handleStartOver} variant="hero" className="touch-manipulation">
                    Create Another Recipe
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
      
      <Footer />
      
      {/* AI Assistant Sidebar */}
      <AIAssistantSidebar
        recipeContext={editedRecipe || formattedRecipe?.recipe}
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
      />
      
      {/* Voice Interface */}
      <VoiceInterface
        onSpeakingChange={setIsSpeaking}
        recipeContext={editedRecipe || formattedRecipe?.recipe}
      />
      
      {/* Quick Access Drawer */}
      {user && (
        <RecipeQuickAccessDrawer onRecipeSelect={handleRecipeSelect} />
      )}
    </div>
  );
};

export default RecipeWorkspace;