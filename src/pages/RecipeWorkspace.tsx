import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/hooks/useAuth';
import { useRecipeWorkspace } from '@/hooks/useRecipeWorkspace';
import { Hero } from '@/components/ui/Hero';

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
          
          {/* Hero Image Section */}
          <Hero 
            imageSrc="/lovable-uploads/7c954928-23fe-4169-bec1-ffa0629d80f2.png"
            imageAlt="Recipe workspace - kitchen counter with tablet, notebook, and baking tools"
            description="Your complete recipe creation studio. Upload, format, edit, and save your recipes with AI assistance."
            variant="below"
            rounded
            shadow
            priority
          />

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