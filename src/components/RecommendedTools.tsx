import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ExternalLink } from 'lucide-react';

interface Product {
  name: string;
  description: string;
  coupon: string;
  url: string;
  image: string;
}

const products: Product[] = [
  {
    name: 'Vitale Sourdough Co. Dehydrated Sourdough Starter',
    description: "You'll be baking bread in 3 days with Vitale's easy-rehydrate starter.",
    coupon: 'none',
    url: 'https://example.com/vitale-starter',
    image: '/lovable-uploads/2f2d5173-d3d4-47f6-990b-402e68e42818.png'
  },
  {
    name: 'SourHouse Goldie Starter',
    description: 'A warm, safe home for your sourdough starter.',
    coupon: 'Code HBK23',
    url: 'https://example.com/sourhouse-goldie',
    image: '/lovable-uploads/6cda5f41-4056-43fc-951f-589a64de6f9f.png'
  },
  {
    name: 'ModKitchn Bread Baking Kit',
    description: 'Essential tools to elevate your bread-baking game.',
    coupon: 'Code BAKINGGREATBREAD10',
    url: 'https://example.com/modkitchn-kit',
    image: '/lovable-uploads/42fff4a1-254b-430a-a0aa-87933904ca43.png'
  },
  {
    name: 'Challenger Breadware Cast-Iron Bread Pan',
    description: 'Perfectly bake artisan loaves with even heat.',
    coupon: 'none',
    url: 'https://example.com/challenger-pan',
    image: '/lovable-uploads/43f2f3c6-9f65-4f67-919d-706560f7ddfc.png'
  },
  {
    name: 'Wire Monkey Bread Lame',
    description: 'Precision scoring tool for beautiful ear-forming designs.',
    coupon: 'none',
    url: 'https://example.com/wire-monkey-lame',
    image: '/lovable-uploads/8d24dc9f-ff7c-4187-a585-dcef056c2317.png'
  },
  {
    name: 'Holland Bowl Mill Wooden Mixing Bowls',
    description: 'Hand-carved bowls perfect for proofing and serving.',
    coupon: 'Code BREAD',
    url: 'https://example.com/holland-bowls',
    image: '/lovable-uploads/d7d9aabf-6578-4161-8a58-e01cac43a3e2.png'
  },
  {
    name: 'SourHouse Dough Bed',
    description: 'Creates a warm, humid home for perfect dough proofs.',
    coupon: 'none',
    url: 'https://example.com/sourhouse-dough-bed',
    image: '/lovable-uploads/8c468b20-a99a-4585-ac57-5f00763c34be.png'
  },
  {
    name: 'Brød & Taylor Sourdough Home',
    description: 'Precise temperature & humidity control for reliable proofs.',
    coupon: 'none',
    url: 'https://example.com/brodtaylor-proofer',
    image: '/lovable-uploads/d5f6cf60-2b45-421d-852b-81cfd14d5725.png'
  },
  {
    name: 'The Brød and Taylor Proofer and Slow Cooker',
    description: 'Versatile cooker—perfect for steam-proofing dough or one-pot meals.',
    coupon: 'none',
    url: 'https://example.com/slow-cooker',
    image: '/lovable-uploads/f9b89cbe-2ee9-441d-afbc-85a25c35ea7e.png'
  }
];

const RecommendedTools = () => {
  const handleProductClick = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <section className="py-16 bg-gradient-to-br from-stone-50 to-stone-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <p className="text-lg text-stone-600 italic mb-4">
            If I don't use it, I don't recommend it. These are the tools in my kitchen—and in my hands every week.
          </p>
          <h2 className="text-4xl font-bold text-stone-900 font-serif">
            Tools I Use Every Week
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {products.map((product, index) => (
            <Card 
              key={index} 
              className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 bg-transparent border-0"
            >
              <div className="flex flex-col sm:flex-row h-full">
                {/* Product Image */}
                <div className="sm:w-1/2 relative">
                  <img 
                    src={product.image}
                    alt={`Photo of ${product.name}`}
                    className="w-full h-48 sm:h-full object-cover"
                  />
                </div>

                {/* Product Info */}
                <div className="sm:w-1/2 bg-stone-800 text-stone-100 p-6 flex flex-col justify-between relative">
                  {/* Top Row: Coupon Badge */}
                  <div className="flex justify-end items-start mb-4">
                    {product.coupon !== 'none' && (
                      <Badge className="bg-amber-500 text-stone-900 font-semibold text-xs px-3 py-1 rounded-full">
                        {product.coupon}
                      </Badge>
                    )}
                  </div>

                  {/* Product Details */}
                  <div className="flex-grow">
                    <h3 className="text-xl font-bold font-serif text-stone-100 mb-3 leading-tight">
                      {product.name}
                    </h3>
                    <p className="text-stone-300 text-sm leading-relaxed mb-6">
                      {product.description}
                    </p>
                  </div>

                  {/* Shop Button */}
                  <Button 
                    onClick={() => handleProductClick(product.url)}
                    className="bg-stone-200 text-stone-800 hover:bg-stone-100 font-semibold py-2 px-4 rounded-md transition-colors duration-200 flex items-center justify-center gap-2 mt-auto"
                  >
                    Shop Now
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Bottom Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
          <Button 
            variant="stone"
            size="lg"
            className="font-semibold"
          >
            View All Products →
          </Button>
          <Button 
            variant="outline"
            size="lg"
            className="border-stone-600 text-stone-700 hover:bg-stone-100"
          >
            Testimonials →
          </Button>
        </div>
      </div>
    </section>
  );
};

export default RecommendedTools;