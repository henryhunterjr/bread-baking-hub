import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, BookOpen, Heart } from 'lucide-react';
import { ResponsiveImage } from '@/components/ResponsiveImage';

export const BreadBookHero = () => {
  return (
    <section className="py-20 bg-section-background">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold text-primary">
                Bread: A Journey
              </h2>
              <p className="text-xl text-muted-foreground">
                Through History, Science, Art, and Community
              </p>
            </div>

            <Card className="p-6">
              <CardContent className="space-y-4 p-0">
                <p className="text-muted-foreground">
                  Discover the fascinating story behind humanity's most fundamental food technology. 
                  From ancient grains to modern artisan techniques, this comprehensive guide weaves 
                  together history, science, and practical baking wisdom.
                </p>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <BookOpen className="h-4 w-4 text-primary" />
                    <span className="text-muted-foreground">280 pages</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Heart className="h-4 w-4 text-primary" />
                    <span className="text-muted-foreground">Cultural insights</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <Button 
                    size="lg" 
                    className="flex-1"
                    asChild
                  >
                    <a href="https://a.co/d/fDyKdyp" target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Buy on Amazon
                    </a>
                  </Button>
                  <Button variant="outline" size="lg" className="flex-1">
                    Read Preview
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="bg-primary/10 rounded-lg p-4">
              <p className="text-sm text-foreground font-medium">
                🌾 Perfect for bread enthusiasts wanting to understand the deeper story
              </p>
            </div>
          </div>

          {/* Right side - Book image */}
          <div className="relative">
            <ResponsiveImage 
              src="https://ojyckskucneljvuqzrsw.supabase.co/storage/v1/object/public/hero-images/video-poster.png"
              alt="Bread: A Journey Through History, Science, Art, and Community by Henry Hunter"
              className="rounded-2xl shadow-warm w-full animate-fade-in"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
};