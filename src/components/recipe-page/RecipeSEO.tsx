import { Helmet } from 'react-helmet-async';

interface RecipeSEOProps {
  title: string;
  description: string;
  imageUrl: string;
  author: string;
  datePublished: string;
  cookTime: string;
  prepTime: string;
  totalTime: string;
  recipeYield: string;
  ingredients: string[];
  instructions: string[];
  url: string;
}

export const RecipeSEO = ({
  title,
  description,
  imageUrl,
  author,
  datePublished,
  cookTime,
  prepTime,
  totalTime,
  recipeYield,
  ingredients,
  instructions,
  url
}: RecipeSEOProps) => {
  const jsonLd = {
    "@context": "https://schema.org/",
    "@type": "Recipe",
    "name": title,
    "description": description,
    "image": [imageUrl],
    "author": {
      "@type": "Person",
      "name": author
    },
    "datePublished": datePublished,
    "cookTime": cookTime,
    "prepTime": prepTime,
    "totalTime": totalTime,
    "recipeCategory": "Bread",
    "recipeCuisine": "American",
    "recipeYield": recipeYield,
    "recipeIngredient": ingredients,
    "recipeInstructions": instructions.map(instruction => ({
      "@type": "HowToStep",
      "text": instruction
    })),
    "nutrition": {
      "@type": "NutritionInformation",
      "calories": "110 calories per slice"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "1250"
    }
  };

  return (
    <Helmet>
      <title>{title} | Henry Hunter's Baking</title>
      <meta name="description" content={description} />
      <meta name="keywords" content="sourdough, bread recipe, baking, Henry Hunter, foolproof recipe" />
      
      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content="article" />
      <meta property="og:site_name" content="Henry Hunter's Baking" />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
      
      {/* JSON-LD */}
      <script type="application/ld+json">
        {JSON.stringify(jsonLd)}
      </script>
    </Helmet>
  );
};