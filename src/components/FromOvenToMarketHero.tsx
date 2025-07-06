import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, BookOpen, ShoppingCart } from 'lucide-react';

export const FromOvenToMarketHero = () => {
  return (
    <section className="py-20 bg-section-background">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Book image */}
          <div className="relative">
            <img 
              src="/lovable-uploads/95d3ead0-8c78-4ab5-9710-a0d28e1cb0e7.png"
              alt="From Oven to Market - The Ultimate Guide to Selling Your Artisan Bread by Henry Hunter"
              className="rounded-2xl shadow-warm w-full animate-fade-in"
              loading="lazy"
            />
          </div>

          {/* Right side - Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold text-primary">
                From Oven to Market
              </h2>
              <p className="text-xl text-muted-foreground">
                The Ultimate Guide to Selling Your Artisan Bread
              </p>
            </div>

            <Card className="p-6">
              <CardContent className="space-y-4 p-0">
                <p className="text-muted-foreground">
                  Transform your passion for baking into a thriving business. This comprehensive guide 
                  covers everything from perfecting your recipes to building a customer base, pricing 
                  strategies, and scaling your artisan bread operation.
                </p>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <BookOpen className="h-4 w-4 text-primary" />
                    <span className="text-muted-foreground">320 pages</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <ShoppingCart className="h-4 w-4 text-primary" />
                    <span className="text-muted-foreground">Business strategies</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <Button size="lg" className="flex-1">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Pre-order Now
                  </Button>
                  <Button variant="outline" size="lg" className="flex-1">
                    Learn More
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="bg-primary/10 rounded-lg p-4">
              <p className="text-sm text-foreground font-medium">
                💡 Perfect for home bakers ready to turn their craft into income
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};