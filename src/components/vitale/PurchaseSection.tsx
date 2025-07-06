import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Minus, Plus, Shield, Truck, Clock } from 'lucide-react';

export const PurchaseSection = () => {
  const [quantity, setQuantity] = useState(1);

  const handleQuantityChange = (change: number) => {
    setQuantity(Math.max(1, quantity + change));
  };

  const handlePurchase = () => {
    // Placeholder for Stripe integration
    alert(`Adding ${quantity} Vitale starter sachet(s) to cart - $${(14 * quantity).toFixed(2)}`);
  };

  return (
    <section id="purchase-section" className="py-20">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            Get Your Vitale Starter
          </h2>
          <p className="text-xl text-muted-foreground">
            Start baking amazing bread in just 3 days
          </p>
        </div>

        <Card className="p-8 max-w-2xl mx-auto">
          <CardHeader className="text-center">
            <div className="mb-4">
              <img 
                src="/lovable-uploads/154d14c0-76bd-47e3-b378-282823bda6fd.png"
                alt="Vitale Sourdough Starter Package"
                className="w-32 h-32 mx-auto rounded-xl object-cover"
                loading="lazy"
              />
            </div>
            <CardTitle className="text-2xl text-foreground">
              Vitale Sourdough Starter
            </CardTitle>
            <p className="text-muted-foreground">
              Professional dehydrated starter - builds 2 complete starters
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Pricing */}
            <div className="text-center">
              <div className="text-4xl font-bold text-primary">$14</div>
              <p className="text-muted-foreground">per sachet</p>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center justify-center space-x-4">
              <span className="text-foreground font-medium">Quantity:</span>
              <div className="flex items-center space-x-2">
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center font-semibold text-lg">
                  {quantity}
                </span>
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => handleQuantityChange(1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Total */}
            <div className="text-center py-4 border-t border-b">
              <div className="text-2xl font-bold text-foreground">
                Total: ${(14 * quantity).toFixed(2)}
              </div>
            </div>

            {/* Purchase Button */}
            <Button 
              size="xl" 
              variant="hero" 
              className="w-full text-lg"
              onClick={handlePurchase}
            >
              Add to Cart - ${(14 * quantity).toFixed(2)}
            </Button>

            {/* Trust Signals */}
            <div className="grid grid-cols-3 gap-4 text-center text-sm">
              <div className="flex flex-col items-center space-y-2">
                <Shield className="h-6 w-6 text-primary" />
                <span className="text-muted-foreground">100% Satisfaction Guarantee</span>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <Truck className="h-6 w-6 text-primary" />
                <span className="text-muted-foreground">Fast Shipping</span>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <Clock className="h-6 w-6 text-primary" />
                <span className="text-muted-foreground">3-Day Results</span>
              </div>
            </div>

            {/* Additional Info */}
            <div className="space-y-2 text-center">
              <Badge variant="outline" className="mb-2">
                In Stock - Ships within 1-2 business days
              </Badge>
              <p className="text-xs text-muted-foreground">
                Secure checkout powered by Stripe. Email confirmation and tracking included.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};