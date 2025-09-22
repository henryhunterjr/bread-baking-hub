import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOMetaTagsProps {
  title?: string;
  description?: string;
  keywords?: string[];
  author?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product' | 'recipe';
  publishedTime?: string;
  modifiedTime?: string;
  section?: string;
  tags?: string[];
  recipe?: {
    name: string;
    description: string;
    image: string;
    prepTime?: string;
    cookTime?: string;
    totalTime?: string;
    recipeYield?: string;
    recipeCategory?: string;
    recipeCuisine?: string;
    ingredients?: string[];
    instructions?: Array<{ text: string }>;
    nutrition?: {
      calories?: string;
      protein?: string;
      carbohydrates?: string;
      fat?: string;
    };
    author?: {
      name: string;
      url?: string;
    };
  };
  breadcrumb?: Array<{ name: string; url: string }>;
}

export const SEOMetaTags: React.FC<SEOMetaTagsProps> = ({
  title = 'Baking Great Bread at Home',
  description = 'Learn to bake amazing bread at home with our comprehensive guides, recipes, and expert tips.',
  keywords = ['bread baking', 'sourdough', 'recipes', 'baking tips', 'artisan bread'],
  author = 'Henry Hunter',
  image = '/hero/fallback.jpg',
  url,
  type = 'website',
  publishedTime,
  modifiedTime,
  section,
  tags,
  recipe,
  breadcrumb
}) => {
  const siteUrl = 'https://bakinggreatbread.com';
  const fullUrl = url ? `${siteUrl}${url}` : siteUrl;
  const fullImageUrl = image.startsWith('http') ? image : `${siteUrl}${image}`;

  const structuredData: any = {
    '@context': 'https://schema.org',
    '@type': type === 'recipe' ? 'Recipe' : 'WebPage',
    name: title,
    description: description,
    url: fullUrl,
    image: fullImageUrl,
    author: {
      '@type': 'Person',
      name: author,
      url: `${siteUrl}/about`
    },
    publisher: {
      '@type': 'Organization',
      name: 'Baking Great Bread at Home',
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/lovable-uploads/82d8e259-f73d-4691-958e-1dd4d0bf240d.png`
      }
    }
  };

  // Add recipe-specific structured data
  if (recipe && type === 'recipe') {
    structuredData['@type'] = 'Recipe';
    structuredData.name = recipe.name;
    structuredData.description = recipe.description;
    structuredData.image = recipe.image.startsWith('http') ? recipe.image : `${siteUrl}${recipe.image}`;
    
    if (recipe.prepTime) structuredData.prepTime = recipe.prepTime;
    if (recipe.cookTime) structuredData.cookTime = recipe.cookTime;
    if (recipe.totalTime) structuredData.totalTime = recipe.totalTime;
    if (recipe.recipeYield) structuredData.recipeYield = recipe.recipeYield;
    if (recipe.recipeCategory) structuredData.recipeCategory = recipe.recipeCategory;
    if (recipe.recipeCuisine) structuredData.recipeCuisine = recipe.recipeCuisine;
    
    if (recipe.ingredients) {
      structuredData.recipeIngredient = recipe.ingredients;
    }
    
    if (recipe.instructions) {
      structuredData.recipeInstructions = recipe.instructions.map((instruction, index) => ({
        '@type': 'HowToStep',
        position: index + 1,
        text: instruction.text
      }));
    }
    
    if (recipe.nutrition) {
      structuredData.nutrition = {
        '@type': 'NutritionInformation',
        ...(recipe.nutrition.calories && { calories: recipe.nutrition.calories }),
        ...(recipe.nutrition.protein && { proteinContent: recipe.nutrition.protein }),
        ...(recipe.nutrition.carbohydrates && { carbohydrateContent: recipe.nutrition.carbohydrates }),
        ...(recipe.nutrition.fat && { fatContent: recipe.nutrition.fat })
      };
    }
    
    if (recipe.author) {
      structuredData.author = {
        '@type': 'Person',
        name: recipe.author.name,
        ...(recipe.author.url && { url: recipe.author.url })
      };
    }
  }

  // Add breadcrumb structured data
  const breadcrumbStructuredData = breadcrumb ? {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumb.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${siteUrl}${item.url}`
    }))
  } : null;

  // Add article structured data
  const articleStructuredData = type === 'article' ? {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description: description,
    image: fullImageUrl,
    url: fullUrl,
    datePublished: publishedTime,
    dateModified: modifiedTime || publishedTime,
    author: {
      '@type': 'Person',
      name: author
    },
    publisher: structuredData.publisher,
    ...(section && { articleSection: section }),
    ...(tags && { keywords: tags.join(', ') })
  } : null;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(', ')} />
      <meta name="author" content={author} />
      <link rel="canonical" href={fullUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImageUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="Baking Great Bread at Home" />
      <meta property="og:locale" content="en_US" />

      {/* Article specific */}
      {type === 'article' && publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      {type === 'article' && modifiedTime && (
        <meta property="article:modified_time" content={modifiedTime} />
      )}
      {type === 'article' && section && (
        <meta property="article:section" content={section} />
      )}
      {type === 'article' && tags && tags.map(tag => (
        <meta key={tag} property="article:tag" content={tag} />
      ))}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={fullUrl} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImageUrl} />
      <meta name="twitter:creator" content="@henrysbread" />
      <meta name="twitter:site" content="@henrysbread" />

      {/* Additional SEO Tags */}
      <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
      <meta name="googlebot" content="index, follow" />
      <meta name="bingbot" content="index, follow" />

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>

      {/* Breadcrumb Structured Data */}
      {breadcrumbStructuredData && (
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbStructuredData)}
        </script>
      )}

      {/* Article Structured Data */}
      {articleStructuredData && (
        <script type="application/ld+json">
          {JSON.stringify(articleStructuredData)}
        </script>
      )}

      {/* Mobile Optimization */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="format-detection" content="telephone=no" />
      
      {/* Performance Hints */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="dns-prefetch" href="//fonts.googleapis.com" />
      <link rel="dns-prefetch" href="//fonts.gstatic.com" />

      {/* Theme Color */}
      <meta name="theme-color" content="#E0B243" />
      <meta name="msapplication-TileColor" content="#E0B243" />
    </Helmet>
  );
};

export default SEOMetaTags;