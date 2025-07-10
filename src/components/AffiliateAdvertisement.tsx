import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink } from 'lucide-react';

interface AffiliateAdvertisementProps {
  title: string;
  description: string;
  productImage: string;
  ctaText: string;
  affiliateLink: string;
  context?: string; // For contextual messaging
}

export const AffiliateAdvertisement = ({
  title,
  description,
  productImage,
  ctaText,
  affiliateLink,
  context
}: AffiliateAdvertisementProps) => {
  const handleClick = () => {
    window.open(affiliateLink, '_blank', 'noopener,noreferrer');
  };

  return (
    <Card className="border-2 border-amber-200 bg-amber-50/50 dark:bg-amber-900/10 dark:border-amber-800">
      <CardContent className="p-6">
        {/* Advertisement Label */}
        <div className="flex justify-center mb-4">
          <Badge variant="outline" className="text-xs text-muted-foreground border-amber-300">
            ADVERTISEMENT
          </Badge>
        </div>

        <div className="grid md:grid-cols-2 gap-6 items-center">
          {/* Product Image */}
          <div className="relative">
            <img 
              src={productImage}
              alt={title}
              className="w-full h-48 md:h-56 object-cover rounded-lg shadow-md"
            />
          </div>

          {/* Content */}
          <div className="space-y-4">
            {context && (
              <p className="text-sm text-muted-foreground italic border-l-4 border-amber-300 pl-4">
                {context}
              </p>
            )}
            
            <h3 className="text-xl font-bold text-foreground font-serif">
              {title}
            </h3>
            
            <p className="text-muted-foreground leading-relaxed">
              {description}
            </p>
            
            <Button 
              onClick={handleClick}
              className="w-full md:w-auto bg-amber-600 hover:bg-amber-700 text-white"
              size="lg"
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              {ctaText}
            </Button>
            
            <p className="text-xs text-muted-foreground">
              As an affiliate, Henry earns from qualifying purchases.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};