import { useState, useEffect } from 'react';

export interface AffiliateProduct {
  id: string;
  name: string;
  description: string;
  image: string;
  price: string;
  affiliate_link: string;
  utm_params: string;
  category: string;
  keywords: string[];
  regions: string[];
}

export interface AffiliateProductsData {
  products: AffiliateProduct[];
}

export const useAffiliateProducts = () => {
  const [products, setProducts] = useState<AffiliateProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await fetch('/src/data/affiliate-products.json');
        if (!response.ok) {
          throw new Error('Failed to load affiliate products');
        }
        const data: AffiliateProductsData = await response.json();
        setProducts(data.products);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        console.error('Error loading affiliate products:', err);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const getRecommendedProducts = (
    recipeTitle: string = '',
    ingredients: string[] | any = [],
    tags: string[] = [],
    manualOverrides: string[] = [],
    limit: number = 4
  ): AffiliateProduct[] => {
    if (manualOverrides.length > 0) {
      return products.filter(product => manualOverrides.includes(product.id)).slice(0, limit);
    }

    // Normalize ingredients to array of strings
    let ingredientStrings: string[] = [];
    if (Array.isArray(ingredients)) {
      if (ingredients.length > 0 && typeof ingredients[0] === 'object') {
        // New format: array of objects with item property
        ingredientStrings = ingredients.map(ing => ing.item || '').filter(Boolean);
      } else if (ingredients.length > 0 && typeof ingredients[0] === 'string') {
        // Old format: array of strings
        ingredientStrings = ingredients;
      }
    } else if (ingredients && typeof ingredients === 'object') {
      // Very old format: object with metric/volume arrays
      ingredientStrings = [...(ingredients.metric || []), ...(ingredients.volume || [])];
    }

    const searchText = [
      recipeTitle,
      ...ingredientStrings,
      ...tags
    ].join(' ').toLowerCase();

    const scored = products.map(product => {
      let score = 0;
      
      // Score based on keyword matches
      product.keywords.forEach(keyword => {
        if (searchText.includes(keyword.toLowerCase())) {
          score += 10;
        }
      });

      // Score based on category relevance
      if (searchText.includes('sourdough') && product.category === 'sourdough') score += 15;
      if (searchText.includes('proof') && product.category === 'proofing') score += 15;
      if (searchText.includes('bake') && product.category === 'baking') score += 15;
      if (searchText.includes('mix') && product.category === 'mixing') score += 15;
      if (searchText.includes('measure') && product.category === 'measuring') score += 15;

      // Partial matches for common bread terms
      if (searchText.includes('bread') || searchText.includes('loaf')) {
        if (product.category === 'baking' || product.category === 'proofing') score += 5;
      }

      return { product, score };
    });

    return scored
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(item => item.product);
  };

  return {
    products,
    loading,
    error,
    getRecommendedProducts
  };
};