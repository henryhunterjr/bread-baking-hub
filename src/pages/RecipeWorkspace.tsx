import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/hooks/useAuth';
import { useRecipeWorkspace } from '@/hooks/useRecipeWorkspace';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { RecipeUploadSection } from '../components/RecipeUploadSection';
import { RecipeQuickAccessDrawer } from '../components/RecipeQuickAccessDrawer';
import { VoiceInterface } from '../components/VoiceInterface';
import { WorkflowProgress } from '../components/workspace/WorkflowProgress';
import { RecipeDisplaySection } from '../components/workspace/RecipeDisplaySection';
import { WorkspaceSuccessState } from '../components/workspace/WorkspaceSuccessState';
import { Sparkles } from 'lucide-react';

const RecipeWorkspace = () => {
  const isMobile = useIsMobile();
  const { user } = useAuth();
  const workspace = useRecipeWorkspace();

  return (
    <div className="bg-background text-foreground min-h-screen relative">
      <Header />
      <main className={`py-20 px-4 ${user ? 'pb-32' : ''}`}>
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
          <WorkflowProgress currentStep={workspace.currentStep} />

          {/* Upload Section */}
          {workspace.currentStep === 'upload' && (
            <RecipeUploadSection 
              onRecipeFormatted={workspace.handleRecipeFormatted}
              onError={workspace.handleError}
            />
          )}

          {/* Recipe Display and Editing */}
          {workspace.formattedRecipe && workspace.currentStep !== 'upload' && (
            <RecipeDisplaySection
              formattedRecipe={workspace.formattedRecipe}
              editedRecipe={workspace.editedRecipe}
              recipeImageUrl={workspace.recipeImageUrl}
              isEditMode={workspace.isEditMode}
              user={user}
              onEditToggle={workspace.handleEditToggle}
              onRecipeUpdate={workspace.handleRecipeUpdate}
              onImageUploaded={workspace.handleImageUploaded}
              onImageRemoved={workspace.handleImageRemoved}
              onRecipeSaved={workspace.handleRecipeSaved}
              onStartOver={workspace.handleStartOver}
            />
          )}

          {/* Success State */}
          {workspace.currentStep === 'save' && (
            <WorkspaceSuccessState onStartOver={workspace.handleStartOver} />
          )}
        </div>
      </main>
      
      <Footer />
      
      
      {/* Voice Interface */}
      <VoiceInterface
        onSpeakingChange={workspace.setIsSpeaking}
        recipeContext={workspace.editedRecipe || workspace.formattedRecipe?.recipe}
      />
      
      {/* Quick Access Drawer */}
      {user && (
        <RecipeQuickAccessDrawer onRecipeSelect={workspace.handleRecipeSelect} />
      )}
    </div>
  );
};

export default RecipeWorkspace;