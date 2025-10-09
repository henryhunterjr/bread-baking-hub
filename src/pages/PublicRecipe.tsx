import { useParams } from 'react-router-dom';
import { usePublicRecipe } from '@/hooks/usePublicRecipe';
import { SimpleRecipeDisplay } from '@/components/SimpleRecipeDisplay';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Globe } from 'lucide-react';
import { EnhancedRecipeSEO } from '@/components/EnhancedRecipeSEO';
import { mapLegacyToStandard } from '@/types/recipe';
import { normalizeRecipe } from '@/lib/normalizeRecipe';
import { getRecipeImage } from '@/utils/recipeImageMapping';

const PublicRecipe = () => {
  const { slug } = useParams<{ slug: string }>();
  const { recipe, loading, error } = usePublicRecipe(slug || '');

  if (loading) {
    return (
      <div className="bg-background text-foreground min-h-screen">
        <Header />
        <main className="py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-xl text-muted-foreground">Loading recipe...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className="bg-background text-foreground min-h-screen">
        <Header />
        <main className="py-20 px-4">
          <div className="max-w-4xl mx-auto text-center space-y-4">
            <h1 className="text-4xl font-bold text-primary">Recipe Not Found</h1>
            <p className="text-xl text-muted-foreground">
              {error || 'This recipe does not exist or is no longer public.'}
            </p>
            <Button variant="hero" size="lg" asChild>
              <Link to="/">Go Home</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Convert legacy recipe to standard format for consistent handling
  const standardRecipe = mapLegacyToStandard(recipe);
  // Also normalize data to prevent crashes
  const normalizedRecipe = normalizeRecipe(recipe);
  
  // Get the recipe introduction for social media
  const recipeIntroduction = recipe.data?.introduction || recipe.data?.summary || standardRecipe.summary;
  // Use the mapping function to get the correct image for problematic recipes
  const recipeImageUrl = getRecipeImage(slug!, recipe.image_url || standardRecipe.heroImage.url);
  const canonicalUrl = `https://bakinggreatbread.com/recipes/${slug}`;
  
  // Debug logging for social media image
  console.log('Recipe SEO Debug:', {
    slug,
    title: recipe.title,
    introduction: recipeIntroduction,
    author_name: recipe.data?.author_name,
    'recipe.image_url': recipe.image_url,
    'standardRecipe.heroImage.url': standardRecipe.heroImage.url,
    'final recipeImageUrl': recipeImageUrl,
    'has introduction': !!recipe.data?.introduction,
    'has author_name': !!recipe.data?.author_name
  });

  return (
    <div className="bg-background text-foreground min-h-screen">
      <EnhancedRecipeSEO 
        recipe={{
          ...standardRecipe,
          summary: recipeIntroduction,
          heroImage: {
            ...standardRecipe.heroImage,
            url: recipeImageUrl
          }
        }}
        canonical={canonicalUrl}
        fbAppId={process.env.REACT_APP_FB_APP_ID}
      />
      <Header />
      <main className="py-20 px-4">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Public Recipe Header */}
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <Badge variant="secondary" className="mb-4">
                <Globe className="h-4 w-4 mr-2" />
                Public Recipe
              </Badge>
            </div>
            <h1 className="text-4xl font-bold text-primary">{recipe.title}</h1>
            <p className="text-muted-foreground">
              Shared on {new Date(recipe.created_at).toLocaleDateString()}
            </p>
          </div>

          {/* Recipe Content */}
          <div className="border rounded-lg p-6 bg-card">
            <SimpleRecipeDisplay 
              recipe={normalizedRecipe.data} 
              imageUrl={normalizedRecipe.heroImage.url}
              title={normalizedRecipe.title}
              recipeId={normalizedRecipe.id}
              slug={normalizedRecipe.slug}
            />
          </div>

          {/* Call to Action */}
          <div className="text-center space-y-4 pt-8 border-t">
            <h3 className="text-lg font-semibold">Like this recipe?</h3>
            <p className="text-muted-foreground">
              Create your own account to save and organize your favorite recipes.
            </p>
            <div className="flex gap-4 justify-center">
              <Button variant="hero" size="lg" asChild>
                <Link to="/auth">Sign Up Free</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/">Browse More Recipes</Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PublicRecipe;