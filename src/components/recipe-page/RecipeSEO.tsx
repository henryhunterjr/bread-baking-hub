import React from 'react';
import MetadataManager from '@/components/MetadataManager';

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
  return (
    <MetadataManager
      title={title}
      description={description}
      canonical={url}
      socialImageUrl={imageUrl}
      imageAlt={`${title} recipe`}
      type="article"
      author={author}
      publishedAt={datePublished}
      keywords="sourdough, bread recipe, baking, Henry Hunter, foolproof recipe"
      recipe={{
        ingredients,
        instructions,
        prepTime,
        cookTime,
        totalTime,
        recipeYield,
        nutrition: {
          calories: "110 calories per slice"
        },
        aggregateRating: {
          ratingValue: "4.8",
          reviewCount: "1250"
        }
      }}
    />
  );
};