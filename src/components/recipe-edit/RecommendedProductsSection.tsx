import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, ChevronUp, Plus, X, ShoppingCart } from 'lucide-react';
import affiliateProducts from '@/data/affiliate-products.json';

interface RecommendedProductsSectionProps {
  recommendedProducts: string[];
  isOpen: boolean;
  onToggle: () => void;
  onAdd: () => void;
  onRemove: (index: number) => void;
  onUpdate: (index: number, value: string) => void;
  onQuickAdd: (productId: string) => void;
}

export const RecommendedProductsSection = ({
  recommendedProducts,
  isOpen,
  onToggle,
  onAdd,
  onRemove,
  onUpdate,
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
                    return (
                      <div key={index} className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg">
                        <Input
                          type="text"
                          placeholder="Product ID"
                          value={productId}
                          onChange={(e) => onUpdate(index, e.target.value)}
                          className="flex-1"
                        />
                        {product && (
                          <Badge variant="secondary" className="text-xs">
                            {product.name}
                          </Badge>
                        )}
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => onRemove(index)}
                          className="text-destructive hover:text-destructive"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Add Product */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <h4 className="font-medium text-sm">Add Product:</h4>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={onAdd}
                  className="h-7 px-2"
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Add by ID
                </Button>
              </div>

              {/* Product Search & Quick Add */}
              {products.length > 0 && (
                <div className="space-y-3">
                  <Input
                    type="text"
                    placeholder="Search available products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && availableProducts.length > 0) {
                        onQuickAdd(availableProducts[0].id);
                        setSearchTerm('');
                      }
                    }}
                    className="w-full"
                  />
                  
                  {searchTerm && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-60 overflow-y-auto">
                      {availableProducts.slice(0, 6).map((product) => (
                        <div
                          key={product.id}
                          className="flex items-center justify-between p-2 bg-card border rounded-lg hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">{product.name}</p>
                            <p className="text-xs text-muted-foreground">{product.category}</p>
                          </div>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => onQuickAdd(product.id)}
                            className="h-7 px-2 ml-2"
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};