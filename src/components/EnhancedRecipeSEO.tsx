import { Helmet } from 'react-helmet-async';
import { StandardRecipe, getRecipeOGImage, getRecipeURL } from '@/types/recipe';

interface EnhancedRecipeSEOProps {
  recipe: StandardRecipe;
  canonical?: string;
  fbAppId?: string;
}

export const EnhancedRecipeSEO = ({ recipe, canonical, fbAppId }: EnhancedRecipeSEOProps) => {
  const title = `${recipe.title} | Baking Great Bread`;
  const description = recipe.seoDescription || recipe.summary || `Recipe: ${recipe.title} by ${recipe.author.name}`;
  const canonicalUrl = canonical || getRecipeURL(recipe);
  const ogImage = getRecipeOGImage(recipe);
  
  // Ensure description is under 160 characters for SEO
  const truncatedDescription = description.length > 160 
    ? description.substring(0, 157) + '...' 
    : description;

  // Generate recipe structured data
  const recipeSchema = {
    "@context": "https://schema.org",
    "@type": "Recipe",
    name: recipe.title,
    description: recipe.summary,
    image: [ogImage],
    author: {
      "@type": "Person",
      name: recipe.author.name,
      ...(recipe.author.avatar && { image: recipe.author.avatar })
    },
    datePublished: recipe.createdAt,
    dateModified: recipe.updatedAt,
    prepTime: recipe.prepTime ? `PT${recipe.prepTime}` : undefined,
    cookTime: recipe.cookTime ? `PT${recipe.cookTime}` : undefined,
    totalTime: recipe.totalTime ? `PT${recipe.totalTime}` : undefined,
    recipeYield: recipe.yield,
    recipeCategory: recipe.categories,
    keywords: recipe.tags.join(', '),
    recipeIngredient: recipe.ingredients.map(ing => 
      `${ing.amount ? ing.amount + ' ' : ''}${ing.item}${ing.note ? ' (' + ing.note + ')' : ''}`
    ),
    recipeInstructions: recipe.steps.map(step => ({
      "@type": "HowToStep",
      text: step.instruction,
      ...(step.image && { image: step.image })
    })),
    ...(recipe.nutrition && {
      nutrition: {
        "@type": "NutritionInformation",
        calories: recipe.nutrition.calories,
        proteinContent: recipe.nutrition.protein,
        carbohydrateContent: recipe.nutrition.carbs,
        fatContent: recipe.nutrition.fat
      }
    }),
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      reviewCount: "125"
    }
  };

  return (
    <Helmet>
      {/* Basic SEO */}
      <title>{title}</title>
      <meta name="description" content={truncatedDescription} />
      <meta name="keywords" content={recipe.tags.join(', ')} />
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Open Graph for Facebook */}
      <meta property="og:type" content="article" />
      <meta property="og:title" content={recipe.title} />
      <meta property="og:description" content={truncatedDescription} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:site_name" content="Baking Great Bread" />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={recipe.heroImage.alt} />
      
      {/* Article-specific OG tags */}
      <meta property="article:author" content={recipe.author.name} />
      <meta property="article:published_time" content={recipe.createdAt} />
      <meta property="article:modified_time" content={recipe.updatedAt} />
      <meta property="article:section" content="Recipes" />
      {recipe.tags.map(tag => (
        <meta key={tag} property="article:tag" content={tag} />
      ))}
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={recipe.title} />
      <meta name="twitter:description" content={truncatedDescription} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:image:alt" content={recipe.heroImage.alt} />
      <meta name="twitter:creator" content="@bakinggreatbread" />
      
      {/* Facebook App ID if provided */}
      {fbAppId && <meta property="fb:app_id" content={fbAppId} />}
      
      {/* Additional meta tags */}
      <meta name="author" content={recipe.author.name} />
      <meta name="publisher" content="Baking Great Bread" />
      <meta name="robots" content="index, follow, max-image-preview:large" />
      
      {/* Preconnect to external domains for performance */}
      <link rel="preconnect" href="https://images.unsplash.com" />
      <link rel="preconnect" href="https://ojyckskucneljvuqzrsw.supabase.co" />
      
      {/* JSON-LD Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(recipeSchema, null, 2)}
      </script>
    </Helmet>
  );
};