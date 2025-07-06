import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

export const VitaleHero = () => {
  const scrollToPurchase = () => {
    document.getElementById('purchase-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-[90vh] flex items-center">
      <div className="absolute inset-0 bg-gradient-hero"></div>
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl font-bold text-foreground leading-tight">
                Baking Bread in Just <span className="text-primary">3 Days</span> with Vitale
              </h1>
              <p className="text-xl text-muted-foreground">
                My 10-year kitchen companion, carefully dehydrated for your success
              </p>
            </div>

            {/* Key Benefits */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Check className="h-5 w-5 text-primary flex-shrink-0" />
                <span className="text-foreground">Baking bread in just 3 days, not weeks</span>
              </div>
              <div className="flex items-center space-x-3">
                <Check className="h-5 w-5 text-primary flex-shrink-0" />
                <span className="text-foreground">Enough starter for TWO builds - active + backup</span>
              </div>
              <div className="flex items-center space-x-3">
                <Check className="h-5 w-5 text-primary flex-shrink-0" />
                <span className="text-foreground">Dehydrated at perfect temperature using Brød & Taylor Sahara</span>
              </div>
              <div className="flex items-center space-x-3">
                <Check className="h-5 w-5 text-primary flex-shrink-0" />
                <span className="text-foreground">Monthly quality testing ensures reliability</span>
              </div>
            </div>

            {/* Price and CTA */}
            <div className="space-y-4">
              <div className="text-3xl font-bold text-primary">$14 per sachet</div>
              <Button 
                size="xl" 
                variant="hero" 
                onClick={scrollToPurchase}
                className="text-lg"
              >
                Get Your Vitale Starter
              </Button>
            </div>
          </div>

          {/* Right side - Product Images */}
          <div className="space-y-6">
            <div className="relative">
              <img 
                src="/lovable-uploads/154d14c0-76bd-47e3-b378-282823bda6fd.png"
                alt="Vitale Sourdough Starter Package on wooden counter"
                className="rounded-2xl shadow-warm w-full"
                loading="eager"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <img 
                src="/lovable-uploads/ad456380-83ab-4b4b-9dd6-e0fcdf10f398.png"
                alt="Three Vitale starter packages"
                className="rounded-xl shadow-stone w-full"
                loading="lazy"
              />
              <img 
                src="/lovable-uploads/a374f667-4314-42da-9466-8627518d052d.png"
                alt="Vitale starter package with flowers"
                className="rounded-xl shadow-stone w-full"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};