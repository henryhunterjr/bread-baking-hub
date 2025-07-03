import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronUp, ExternalLink, ShoppingCart } from 'lucide-react';
import affiliateProducts from '@/data/affiliate-products.json';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface Product {
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

interface ProductRecommendationsProps {
  recipeContent?: string;
  recipeTitle?: string;
  userRegion?: string;
  manualOverrides?: string[];
}

export const ProductRecommendations = ({ 
  recipeContent = '', 
  recipeTitle = '',
  userRegion = 'US',
  manualOverrides = []
}: ProductRecommendationsProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();

  const recommendedProducts = useMemo(() => {
    const products = affiliateProducts.products as Product[];
    
    // If manual overrides are provided, use those
    if (manualOverrides.length > 0) {
      return products
        .filter(product => manualOverrides.includes(product.id) && product.regions.includes(userRegion))
        .slice(0, 4);
    }

    // Otherwise, use automatic matching
    const allText = `${recipeTitle} ${recipeContent}`.toLowerCase();
    
    // Score products based on keyword matches
    const scoredProducts = products
      .filter(product => product.regions.includes(userRegion))
      .map(product => {
        let score = 0;
        product.keywords.forEach(keyword => {
          const regex = new RegExp(`\\b${keyword.toLowerCase()}\\b`, 'g');
          const matches = allText.match(regex);
          if (matches) {
            score += matches.length;
          }
        });
        return { ...product, score };
      })
      .filter(product => product.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3); // Show top 3 most relevant products

    return scoredProducts;
  }, [recipeContent, recipeTitle, userRegion, manualOverrides]);

  if (recommendedProducts.length === 0) {
    return null;
  }

  const handleProductClick = async (product: Product) => {
    // Log click for analytics
    try {
      await supabase.from('product_clicks').insert({
        product_id: product.id,
        product_name: product.name,
        recipe_title: recipeTitle,
        user_id: user?.id || null,
        clicked_at: new Date().toISOString()
      });
    } catch (error) {
      // Silently fail if logging doesn't work
      console.warn('Failed to log product click:', error);
    }

    const fullUrl = `${product.affiliate_link}${product.affiliate_link.includes('?') ? '&' : '?'}${product.utm_params}`;
    window.open(fullUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <Card className="shadow-warm mt-6">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
            <CardTitle className="flex items-center justify-between text-primary">
              <div className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                Recommended Tools ({recommendedProducts.length})
              </div>
              {isOpen ? (
                <ChevronUp className="h-5 w-5" />
              ) : (
                <ChevronDown className="h-5 w-5" />
              )}
            </CardTitle>
          </CardHeader>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <CardContent className="pt-0">
            <p className="text-sm text-muted-foreground mb-4">
              {manualOverrides.length > 0 
                ? "Hand-picked tools for this recipe:"
                : "Based on your recipe, these tools can help you achieve professional results:"
              }
            </p>
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {recommendedProducts.map((product) => (
                <Card 
                  key={product.id}
                  className="hover:shadow-warm transition-all duration-300 cursor-pointer group"
                  onClick={() => handleProductClick(product)}
                >
                  <div className="relative overflow-hidden">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <Badge 
                      variant="secondary" 
                      className="absolute top-2 left-2 text-xs"
                    >
                      {product.category}
                    </Badge>
                  </div>
                  
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-sm text-card-foreground mb-2 line-clamp-2">
                      {product.name}
                    </h4>
                    <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                      {product.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-primary text-sm">
                        {product.price}
                      </span>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="text-xs h-7 px-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleProductClick(product);
                        }}
                      >
                        <ExternalLink className="h-3 w-3 mr-1" />
                        Shop
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="mt-4 pt-4 border-t border-border">
              <p className="text-xs text-muted-foreground text-center">
                As an affiliate, Henry earns from qualifying purchases. These are tools he personally uses and recommends.
              </p>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};