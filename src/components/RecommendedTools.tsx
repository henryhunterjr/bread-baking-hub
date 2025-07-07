import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ExternalLink } from 'lucide-react';

interface Product {
  icon: string;
  name: string;
  description: string;
  coupon: string;
  url: string;
  image: string;
}

const products: Product[] = [
  {
    icon: '🥖',
    name: 'Vitale Sourdough Co. Dehydrated Sourdough Starter',
    description: "You'll be baking bread in 3 days with Vitale's easy-rehydrate starter.",
    coupon: 'none',
    url: 'https://example.com/vitale-starter',
    image: '/lovable-uploads/544551ff-397f-4f33-bf2f-daff4ddffe46.png'
  },
  {
    icon: '🧂',
    name: 'SourHouse Goldie Starter Home',
    description: 'A warm, safe home for your sourdough starter.',
    coupon: 'Code HBK23',
    url: 'https://example.com/sourhouse-goldie',
    image: '/lovable-uploads/5745a0fa-5ff0-4d05-b59a-8668b5ab8ca5.png'
  },
  {
    icon: '🍞',
    name: 'ModKitchn Bread Baking Kit',
    description: 'Essential tools to elevate your bread-baking game.',
    coupon: 'Code BAKINGGREATBREAD10',
    url: 'https://example.com/modkitchn-kit',
    image: '/lovable-uploads/6f937c37-592f-4516-8414-a82a3c9dc838.png'
  },
  {
    icon: '🔥',
    name: 'Challenger Breadware Cast-Iron Bread Pan',
    description: 'Perfectly bake artisan loaves with even heat.',
    coupon: 'none',
    url: 'https://example.com/challenger-pan',
    image: '/lovable-uploads/720e215c-73f1-4bb7-891c-c2fa41588f09.png'
  },
  {
    icon: '🔨',
    name: 'Wire Monkey Bread Lame',
    description: 'Precision scoring tool for beautiful ear-forming designs.',
    coupon: 'none',
    url: 'https://example.com/wire-monkey-lame',
    image: '/lovable-uploads/76e9c007-a2f2-4cab-af0c-d85d24bc619d.png'
  },
  {
    icon: '🪵',
    name: 'Holland Bowl Mill Wooden Mixing Bowls',
    description: 'Hand-carved bowls perfect for proofing and serving.',
    coupon: 'Code BREAD',
    url: 'https://example.com/holland-bowls',
    image: '/lovable-uploads/83cde278-edfc-4a30-98f4-79f37c79346e.png'
  },
  {
    icon: '🛏️',
    name: 'SourHouse Dough Bed',
    description: 'Creates a warm, humid home for perfect dough proofs.',
    coupon: 'none',
    url: 'https://example.com/sourhouse-dough-bed',
    image: '/lovable-uploads/87e73552-babd-4f00-b0e5-cc0a7f23e155.png'
  },
  {
    icon: '🌡️',
    name: 'Brod & Taylor Sourdough Home Proofer',
    description: 'Precise temperature & humidity control for reliable proofs.',
    coupon: 'none',
    url: 'https://example.com/brodtaylor-proofer',
    image: '/lovable-uploads/901585f4-68ad-4944-ac87-dae24175df7d.png'
  },
  {
    icon: '🍲',
    name: 'Slow Cooker',
    description: 'Versatile cooker—perfect for steam-proofing dough or one-pot meals.',
    coupon: 'none',
    url: 'https://example.com/slow-cooker',
    image: '/lovable-uploads/9087fac4-9b4e-4823-928d-1d6231bbe8b7.png'
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
                  {/* Top Row: Icon and Coupon */}
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-2xl">{product.icon}</span>
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