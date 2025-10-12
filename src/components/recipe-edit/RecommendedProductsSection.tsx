import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, ChevronUp, X, ShoppingCart, Search } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import affiliateProducts from '@/data/affiliate-products.json';

interface RecommendedProductsSectionProps {
  recommendedProducts: string[];
  isOpen: boolean;
  onToggle: () => void;
  onRemove: (index: number) => void;
  onQuickAdd: (productId: string) => void;
}

export const RecommendedProductsSection = ({
  recommendedProducts,
  isOpen,
  onToggle,
  onRemove,
  onQuickAdd
}: RecommendedProductsSectionProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const products = affiliateProducts.products;

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.keywords.some(keyword => keyword.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const availableProducts = filteredProducts.filter(product =>
    !recommendedProducts.includes(product.id)
  );

  return (
    <Card className="shadow-stone">
      <Collapsible open={isOpen} onOpenChange={onToggle}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold text-primary">
                  Recommended Products ({recommendedProducts.length})
                </h3>
              </div>
              {isOpen ? (
                <ChevronUp className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              )}
            </div>
          </CardHeader>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Manually select which affiliate products to recommend for this recipe. Leave empty for automatic recommendations based on ingredients and keywords.
            </p>

            {/* Selected Products */}
            {recommendedProducts.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-medium text-sm">Selected Products:</h4>
                <div className="space-y-2">
                  {recommendedProducts.map((productId, index) => {
                    const product = products.find(p => p.id === productId);
                    if (!product) return null;
                    
                    return (
                      <div key={index} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg border border-border">
                        <img 
                          src={product.image_url} 
                          alt={product.name}
                          className="w-12 h-12 object-cover rounded"
                          onError={(e) => {
                            e.currentTarget.src = '/lovable-uploads/default-product.png';
                          }}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{product.name}</p>
                          {product.offer_text && (
                            <Badge variant="secondary" className="text-xs mt-1">
                              {product.offer_text}
                            </Badge>
                          )}
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => onRemove(index)}
                          className="text-destructive hover:text-destructive flex-shrink-0"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Add Product - Visual Dropdown */}
            <div className="space-y-3">
              <h4 className="font-medium text-sm">Add Product:</h4>
              
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search products by name, brand, or category..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              
              {availableProducts.length > 0 && (
                <ScrollArea className="h-[400px] rounded-md border border-border">
                  <div className="p-2 space-y-2">
                    {availableProducts.map((product) => (
                      <button
                        key={product.id}
                        type="button"
                        onClick={() => {
                          onQuickAdd(product.id);
                          setSearchTerm('');
                        }}
                        className="w-full flex items-start gap-3 p-3 bg-card hover:bg-accent/50 rounded-lg border border-border transition-colors text-left"
                      >
                        <img 
                          src={product.image_url} 
                          alt={product.name}
                          className="w-16 h-16 object-cover rounded flex-shrink-0"
                          onError={(e) => {
                            e.currentTarget.src = '/lovable-uploads/default-product.png';
                          }}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm">{product.name}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{product.brand}</p>
                          {product.offer_text && (
                            <Badge variant="default" className="text-xs mt-1.5">
                              {product.offer_text}
                            </Badge>
                          )}
                          {product.price && (
                            <p className="text-xs font-medium mt-1">${product.price}</p>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </ScrollArea>
              )}
              
              {availableProducts.length === 0 && searchTerm && (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No products found. Try a different search term.
                </p>
              )}
              
              {availableProducts.length === 0 && !searchTerm && (
                <p className="text-sm text-muted-foreground text-center py-8">
                  All products have been added to this recipe.
                </p>
              )}
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};