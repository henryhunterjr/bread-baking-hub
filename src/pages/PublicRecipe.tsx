import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { usePublicRecipe } from '@/hooks/usePublicRecipe';
import { SimpleRecipeDisplay } from '@/components/SimpleRecipeDisplay';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Globe } from 'lucide-react';

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

  return (
    <div className="bg-background text-foreground min-h-screen">
      <Helmet>
        <title>{`${recipe.title} | Baking Great Bread`}</title>
        <meta name="description" content={(recipe.data?.notes as string) || `Recipe: ${recipe.title} by Henry Hunter.`} />
        <link rel="canonical" href={`https://bread-baking-hub.vercel.app/r/${slug}`} />
        <meta property="og:type" content="article" />
        <meta property="og:title" content={`${recipe.title} | Baking Great Bread`} />
        <meta property="og:description" content={(recipe.data?.notes as string) || `Recipe: ${recipe.title} by Henry Hunter.`} />
        <meta property="og:image" content={recipe.image_url || 'https://ojyckskucneljvuqzrsw.supabase.co/storage/v1/object/public/hero-images/default-recipe.jpg'} />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Recipe",
            name: recipe.title,
            image: recipe.image_url ? [recipe.image_url] : undefined,
            description: (recipe.data?.notes as string) || undefined,
            author: { "@type": "Person", name: "Henry Hunter" },
            datePublished: recipe.created_at,
            recipeIngredient: Array.isArray((recipe.data as any)?.ingredients)
              ? (recipe.data as any).ingredients
              : [],
            recipeInstructions: Array.isArray((recipe.data as any)?.method)
              ? (recipe.data as any).method.map((m: any) => ({ "@type": "HowToStep", text: m }))
              : []
          })}
        </script>
      </Helmet>
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
              recipe={recipe.data} 
              imageUrl={recipe.image_url}
              title={recipe.title}
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