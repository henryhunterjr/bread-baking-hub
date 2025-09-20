import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { absoluteUrl, socialImageUrl } from '@/utils/absoluteUrl';
import { getBestSocialImage, processSocialImage } from '@/utils/socialImageOptimizer';
import { enableMetadataDebugMode } from '@/utils/metadataDebugger';
import { resolveSocialImage } from '@/utils/resolveSocialImage';

interface MetadataManagerProps {
  // Basic page info
  title?: string;
  description?: string;
  canonical?: string;
  
  // Images (in priority order)
  socialImageUrl?: string;
  inlineImageUrl?: string;
  heroImageUrl?: string;
  imageAlt?: string;
  
  // Content info
  type?: 'website' | 'article' | 'product' | 'book';
  updatedAt?: string;
  publishedAt?: string;
  
  // Article specific
  author?: string;
  tags?: string[];
  section?: string;
  
  // Additional metadata
  keywords?: string;
  robots?: string;
  
  // Recipe specific (for structured data)
  recipe?: {
    ingredients: string[];
    instructions: string[];
    prepTime?: string;
    cookTime?: string;
    totalTime?: string;
    recipeYield?: string;
    nutrition?: {
      calories?: string;
    };
    aggregateRating?: {
      ratingValue: string;
      reviewCount: string;
    };
  };
  
  // Debug mode
  debug?: boolean;
}

// Default values
const DEFAULTS = {
  title: 'Baking Great Bread',
  description: 'Master the art of bread baking with expert recipes, troubleshooting guides, and a vibrant community led by Henry Hunter.',
  image: '/lovable-uploads/f2a6c7d6-5a78-4068-94bd-1810dd3ebd96.png',
  siteName: 'Baking Great Bread',
  twitterHandle: '@henrysbread'
};

export const MetadataManager: React.FC<MetadataManagerProps> = ({
  title,
  description,
  canonical,
  socialImageUrl: socialImage,
  inlineImageUrl,
  heroImageUrl,
  imageAlt,
  type = 'website',
  updatedAt,
  publishedAt,
  author,
  tags = [],
  section,
  keywords,
  robots = 'index, follow, max-image-preview:large',
  recipe,
  debug = false
}) => {
  const location = useLocation();
  
  // Don't render metadata on /share/* or /blog/* routes when accessed by bots - let server handle it
  if (location.pathname.startsWith('/share/')) {
    return null;
  }
  // Enable debug mode if requested
  React.useEffect(() => {
    if (debug && import.meta.env.DEV) {
      enableMetadataDebugMode();
    }
  }, [debug]);

  // Generate final values
  const finalTitle = title ? `${title} | ${DEFAULTS.title}` : DEFAULTS.title;
  const finalDescription = description || DEFAULTS.description;
  const finalCanonical = canonical ? absoluteUrl(canonical) : absoluteUrl(location.pathname);
  
  // Use unified social image resolver - extract slug from pathname
  const pathSlug = location.pathname.startsWith('/blog/') ? 
    location.pathname.replace('/blog/', '') : 
    location.pathname.replace(/^\//, '');
  
  const finalImage = resolveSocialImage({
    social: socialImage,
    inline: inlineImageUrl,
    hero: heroImageUrl,
    updatedAt,
    slug: pathSlug
  });
  
  const finalImageAlt = imageAlt || finalTitle;
  
  // Generate structured data for recipes
  const recipeJsonLd = recipe ? {
    "@context": "https://schema.org/",
    "@type": "Recipe",
    "name": title,
    "description": finalDescription,
    "image": [finalImage],
    "author": {
      "@type": "Person",
      "name": author || "Henry Hunter"
    },
    "datePublished": publishedAt,
    "dateModified": updatedAt,
    "recipeCategory": "Bread",
    "recipeCuisine": "American",
    "recipeYield": recipe.recipeYield,
    "prepTime": recipe.prepTime,
    "cookTime": recipe.cookTime,
    "totalTime": recipe.totalTime,
    "recipeIngredient": recipe.ingredients,
    "recipeInstructions": recipe.instructions.map(instruction => ({
      "@type": "HowToStep",
      "text": instruction
    })),
    ...(recipe.nutrition && {
      "nutrition": {
        "@type": "NutritionInformation",
        "calories": recipe.nutrition.calories
      }
    }),
    ...(recipe.aggregateRating && {
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": recipe.aggregateRating.ratingValue,
        "reviewCount": recipe.aggregateRating.reviewCount
      }
    })
  } : null;

  // Generate article structured data
  const articleJsonLd = type === 'article' ? {
    "@context": "https://schema.org/",
    "@type": "BlogPosting",
    "headline": title,
    "description": finalDescription,
    "image": [finalImage],
    "author": {
      "@type": "Person",
      "name": author || "Henry Hunter"
    },
    "publisher": {
      "@type": "Organization",
      "name": DEFAULTS.siteName,
      "logo": {
        "@type": "ImageObject",
        "url": absoluteUrl(DEFAULTS.image)
      }
    },
    "datePublished": publishedAt,
    "dateModified": updatedAt,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": finalCanonical
    },
    ...(section && { "articleSection": section }),
    ...(tags.length > 0 && { "keywords": tags.join(', ') })
  } : null;

  return (
    <Helmet>
      {/* Basic SEO */}
      <title>{finalTitle}</title>
      <meta name="description" content={finalDescription} />
      {keywords && <meta name="keywords" content={keywords} />}
      <meta name="robots" content={robots} />
      <link rel="canonical" href={finalCanonical} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={finalTitle} />
      <meta property="og:description" content={finalDescription} />
      <meta property="og:url" content={finalCanonical} />
      <meta property="og:site_name" content={DEFAULTS.siteName} />
      <meta property="og:image" content={finalImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={finalImageAlt} />
      <meta property="og:locale" content="en_US" />
      
      {/* Article specific Open Graph */}
      {type === 'article' && publishedAt && (
        <meta property="article:published_time" content={publishedAt} />
      )}
      {type === 'article' && updatedAt && (
        <meta property="article:modified_time" content={updatedAt} />
      )}
      {type === 'article' && author && (
        <meta property="article:author" content={author} />
      )}
      {type === 'article' && section && (
        <meta property="article:section" content={section} />
      )}
      {type === 'article' && tags.map(tag => (
        <meta key={tag} property="article:tag" content={tag} />
      ))}
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={finalTitle} />
      <meta name="twitter:description" content={finalDescription} />
      <meta name="twitter:image" content={finalImage} />
      <meta name="twitter:image:alt" content={finalImageAlt} />
      <meta name="twitter:site" content={DEFAULTS.twitterHandle} />
      <meta name="twitter:creator" content={DEFAULTS.twitterHandle} />
      
      {/* Additional meta tags */}
      {author && <meta name="author" content={author} />}
      <meta name="publisher" content={DEFAULTS.siteName} />
      
      {/* Mobile optimization */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
      <meta name="theme-color" content="#D97706" />
      
      {/* JSON-LD Structured Data */}
      {recipeJsonLd && (
        <script type="application/ld+json">
          {JSON.stringify(recipeJsonLd)}
        </script>
      )}
      {articleJsonLd && (
        <script type="application/ld+json">
          {JSON.stringify(articleJsonLd)}
        </script>
      )}
    </Helmet>
  );
};

export default MetadataManager;