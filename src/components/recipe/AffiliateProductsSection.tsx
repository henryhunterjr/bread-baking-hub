import { Card, CardContent } from '@/components/ui/card';
import { ExternalLink, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import affiliateProducts from '@/data/affiliate-products.json';

interface AffiliateProductsSectionProps {
  productIds: string[];
  recipeTitle?: string;
}

export const AffiliateProductsSection = ({ productIds, recipeTitle }: AffiliateProductsSectionProps) => {
  if (!productIds || productIds.length === 0) {
    return null;
  }

  const selectedProducts = productIds
    .map(id => affiliateProducts.products.find(p => p.id === id))
    .filter(Boolean);

  if (selectedProducts.length === 0) {
    return null;
  }

  return (
    <div className="mt-12 space-y-6 print:hidden">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-primary">Henry's Picks</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          These are the tools I personally use and recommend for {recipeTitle ? `making ${recipeTitle}` : 'this recipe'}.
          Support the site by using these affiliate links!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {selectedProducts.map((product: any) => (
          <Card key={product.id} className="shadow-warm overflow-hidden hover:shadow-lg transition-shadow">
            <div className="aspect-video relative overflow-hidden bg-muted">
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-xl font-bold text-primary">{product.name}</h3>
                  {product.featured && (
                    <Badge variant="default" className="shrink-0">
                      Featured
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground font-medium">
                  {product.brand}
                </p>
              </div>

              <div className="prose prose-sm max-w-none">
                <p className="text-foreground leading-relaxed">
                  {product.description}
                </p>
              </div>

              {product.coupon && (
                <div className="flex items-center gap-2 p-3 bg-primary/10 rounded-lg">
                  <Tag className="h-4 w-4 text-primary shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-primary">
                      Use code: <span className="font-mono">{product.coupon}</span>
                    </p>
                    <p className="text-xs text-muted-foreground">for exclusive savings</p>
                  </div>
                </div>
              )}

              <Button
                asChild
                variant="hero"
                className="w-full"
                size="lg"
              >
                <a
                  href={`${product.affiliate_link}${product.utm_params ? '&' + product.utm_params : ''}`}
                  target="_blank"
                  rel="noopener noreferrer sponsored"
                  className="flex items-center justify-center gap-2"
                >
                  Get {product.name}
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>

              <p className="text-xs text-muted-foreground text-center">
                As an affiliate partner, I earn from qualifying purchases. This helps support the site at no extra cost to you.
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};