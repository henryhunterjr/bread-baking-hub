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
            {/* Vitale Logo */}
            <div className="flex justify-center">
              <img 
                src="/lovable-uploads/fff984e8-765a-4f2a-94dc-c79799d4b371.png"
                alt="Vitale Logo"
                className="h-40 md:h-48"
                loading="eager"
              />
            </div>
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

          {/* Right side - Success Images */}
          <div className="space-y-6">
            {/* Beautiful bread cross-section */}
            <div className="relative">
              <img 
                src="/lovable-uploads/24966444-25da-4770-ba7a-701e9c733a89.png"
                alt="Beautiful sourdough bread made with Vitale starter - perfect crumb structure"
                className="rounded-2xl shadow-warm w-full"
                loading="eager"
              />
              <div className="absolute bottom-4 left-4 bg-black/70 text-white px-3 py-1 rounded-lg text-sm">
                Made with Vitale
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {/* Two golden loaves */}
              <img 
                src="/lovable-uploads/09251f62-4b32-40a7-bfb1-92fb1c4bd710.png"
                alt="Two golden sourdough loaves baked with Vitale starter"
                className="rounded-xl shadow-stone w-full"
                loading="lazy"
              />
              {/* Vitale starter package with beautiful presentation */}
              <img 
                src="/lovable-uploads/eff7994a-acf1-4b30-9e68-1d09a3b5b33f.png"
                alt="Vitale sourdough starter package beautifully presented with flowers and bread slices"
                className="rounded-xl shadow-stone w-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground italic">
                Bakers around the world are creating beautiful bread with Vitale
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};