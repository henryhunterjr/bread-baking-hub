import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/hooks/useAuth';
import { useRecipeWorkspace } from '@/hooks/useRecipeWorkspace';
import { Hero } from '@/components/ui/Hero';
import { Helmet } from 'react-helmet-async';
import { Suspense, lazy, useState } from 'react';

import Header from '../components/Header';
import Footer from '../components/Footer';
import { RecipeUploadSection } from '../components/RecipeUploadSection';
import { RecipeQuickAccessDrawer } from '../components/RecipeQuickAccessDrawer';

import { WorkflowProgress } from '../components/workspace/WorkflowProgress';
import { RecipeDisplaySection } from '../components/workspace/RecipeDisplaySection';
import { WorkspaceSuccessState } from '../components/workspace/WorkspaceSuccessState';
import { Sparkles } from 'lucide-react';

const LazyAIAssistantSidebar = lazy(() => import('@/components/AIAssistantSidebar').then(m => ({ default: m.AIAssistantSidebar })));

const RecipeWorkspace = () => {
  const isMobile = useIsMobile();
  const { user } = useAuth();
  const workspace = useRecipeWorkspace();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <>
      <Helmet>
        <title>Recipe Workspace | Baking Great Bread at Home</title>
        <meta name="description" content="Your complete recipe creation studio. Upload, format, edit, and save your recipes with AI assistance. Create professional recipe cards and organize your baking collection." />
        <link rel="canonical" href="https://the-bakers-bench.lovable.app/workspace" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Recipe Workspace | Baking Great Bread at Home" />
        <meta property="og:description" content="Your complete recipe creation studio. Upload, format, edit, and save your recipes with AI assistance. Create professional recipe cards and organize your baking collection." />
        <meta property="og:url" content="https://the-bakers-bench.lovable.app/workspace" />
        <meta property="og:image" content="https://the-bakers-bench.lovable.app/lovable-uploads/7c954928-23fe-4169-bec1-ffa0629d80f2.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Recipe workspace - kitchen counter with tablet, notebook, and baking tools" />
        <meta property="og:site_name" content="Baking Great Bread at Home" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Recipe Workspace | Baking Great Bread at Home" />
        <meta name="twitter:description" content="Your complete recipe creation studio. Upload, format, edit, and save your recipes with AI assistance. Create professional recipe cards and organize your baking collection." />
        <meta name="twitter:image" content="https://the-bakers-bench.lovable.app/lovable-uploads/7c954928-23fe-4169-bec1-ffa0629d80f2.png" />
        <meta name="twitter:image:alt" content="Recipe workspace - kitchen counter with tablet, notebook, and baking tools" />
      </Helmet>
      
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
          <WorkflowProgress 
            currentStep={workspace.currentStep} 
            onStepClick={(step) => {
              // Allow navigation to previous steps or current step
              const steps: ('upload' | 'review' | 'edit' | 'save')[] = ['upload', 'review', 'edit', 'save'];
              const currentIndex = steps.indexOf(workspace.currentStep);
              const targetIndex = steps.indexOf(step);
              
              if (targetIndex <= currentIndex) {
                // Enable step navigation logic here if needed
                console.log(`Navigate to step: ${step}`);
              }
            }}
          />

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

          {/* Quick Access Drawer - Moved up from footer */}
          {user && (
            <div className="mt-8">
              <RecipeQuickAccessDrawer onRecipeSelect={workspace.handleRecipeSelect} />
            </div>
          )}

          {/* Success State */}
          {workspace.currentStep === 'save' && (
            <WorkspaceSuccessState onStartOver={workspace.handleStartOver} />
          )}
        </div>
      </main>
      
      <Footer />
      
      {/* Krusty AI Assistant */}
      <Suspense fallback={null}>
        <LazyAIAssistantSidebar
          recipeContext={workspace.editedRecipe || workspace.formattedRecipe?.recipe}
          isOpen={isSidebarOpen}
          onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        />
      </Suspense>
      </div>
    </>
  );
};

export default RecipeWorkspace;