import { ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import affiliateProducts from '@/data/affiliate-products.json';

interface EquipmentWithAffiliatesProps {
  equipment: string[];
  affiliateProductIds?: string[];
}

export const EquipmentWithAffiliates = ({ equipment, affiliateProductIds }: EquipmentWithAffiliatesProps) => {
  const affiliateItems = affiliateProductIds
    ? affiliateProductIds
        .map(id => affiliateProducts.products.find(p => p.id === id))
        .filter(Boolean)
    : [];

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Equipment</h3>
      <ul className="space-y-3">
        {/* Regular equipment items */}
        {equipment.map((item: string, index: number) => (
          <li key={`equipment-${index}`} className="flex items-start gap-2">
            <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
            <span>{item}</span>
          </li>
        ))}
        
        {/* Affiliate product equipment */}
        {affiliateItems.map((product: any) => (
          <li key={product.id} className="flex items-start gap-2 group">
            <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
            <div className="flex-1 flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-2">
                <span className="font-medium">{product.name}</span>
                <Badge variant="secondary" className="text-xs">
                  Henry's Pick
                </Badge>
              </div>
              <a
                href={`${product.affiliate_link}${product.utm_params ? '&' + product.utm_params : ''}`}
                target="_blank"
                rel="noopener noreferrer sponsored"
                className="text-sm text-primary hover:underline flex items-center gap-1 group-hover:text-primary/80 transition-colors"
              >
                View Product
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};