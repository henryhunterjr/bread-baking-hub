import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, BookOpen, Calendar, Award, Facebook, Instagram } from 'lucide-react';
import { OptimizedImage } from '@/components/OptimizedImage';

export const AuthorBioSection = () => {
  return (
    <section className="py-20 bg-background">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left - Image and Social Proof */}
          <div className="space-y-6">
            <div className="relative">
              <OptimizedImage
                src="/lovable-uploads/817f9119-54ab-4a7e-8906-143e981eac8a.png"
                alt="Henry Hunter - Master Baker and Author"
                width={500}
                height={500}
                className="rounded-2xl shadow-warm aspect-square gpu-accelerated"
                priority={false}
                sizes="(max-width: 768px) 100vw, 50vw"
                quality={70}
              />
              
              {/* Achievement Badges */}
              <div className="absolute bottom-4 left-4 flex gap-2">
                <Badge className="bg-primary text-primary-foreground">
                  <Award className="h-3 w-3 mr-1" />
                  Master Baker
                </Badge>
                <Badge variant="secondary">
                  <Users className="h-3 w-3 mr-1" />
                  38K+ Community
                </Badge>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="text-center p-4">
                <CardContent className="p-0">
                  <div className="text-2xl font-bold text-primary">10+</div>
                  <div className="text-sm text-muted-foreground">Years Teaching</div>
                </CardContent>
              </Card>
              <Card className="text-center p-4">
                <CardContent className="p-0">
                  <div className="text-2xl font-bold text-primary">50K+</div>
                  <div className="text-sm text-muted-foreground">Recipes Shared</div>
                </CardContent>
              </Card>
              <Card className="text-center p-4">
                <CardContent className="p-0">
                  <div className="text-2xl font-bold text-primary">4.9★</div>
                  <div className="text-sm text-muted-foreground">Avg Rating</div>
                </CardContent>
              </Card>
              <Card className="text-center p-4">
                <CardContent className="p-0">
                  <div className="text-2xl font-bold text-primary">5</div>
                  <div className="text-sm text-muted-foreground">Books Published</div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Right - Bio Content */}
          <div className="space-y-6">
            <div>
              <Badge variant="outline" className="mb-4">
                Meet Your Instructor
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
                Henry Hunter
              </h2>
              <h3 className="text-xl text-muted-foreground mb-6">
                Master Baker, Author & Community Builder
              </h3>
            </div>

            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                For over a decade, I've been obsessed with one thing: helping everyday people bake extraordinary bread at home. What started as personal frustration with complicated sourdough methods became a mission to democratize artisan bread-making.
              </p>
              
              <p>
                In 2020, I founded the "Baking Great Bread at Home" Facebook community with a simple promise: <strong className="text-foreground">no fluff, no gimmicks, just proven methods that work</strong>. Today, over 38,000 bakers from around the world call it home.
              </p>

              <p>
                My approach is different. Instead of intimidating techniques, I focus on understanding the fundamentals. My Vitale sourdough starter—refined over 10 years—represents this philosophy: consistent, reliable results that build confidence rather than frustration.
              </p>
            </div>

            {/* Credentials */}
            <div className="space-y-3">
              <h4 className="font-semibold text-foreground">Credentials & Achievements:</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <BookOpen className="h-4 w-4 text-primary" />
                  <span className="text-sm">Author of 5 bestselling bread-baking books</span>
                </div>
                <div className="flex items-center gap-3">
                  <Users className="h-4 w-4 text-primary" />
                  <span className="text-sm">Founder of 38,000+ member baking community</span>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-primary" />
                  <span className="text-sm">10+ years of teaching home bread-making</span>
                </div>
                <div className="flex items-center gap-3">
                  <Award className="h-4 w-4 text-primary" />
                  <span className="text-sm">Featured in Food & Wine, Serious Eats, King Arthur Baking</span>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button size="lg" asChild>
                <a href="https://www.facebook.com/groups/1082865755403754" target="_blank" rel="noopener noreferrer">
                  <Facebook className="h-4 w-4 mr-2" />
                  Join My Community
                </a>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <a href="/books">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Read My Books
                </a>
              </Button>
            </div>

            {/* Quote */}
            <blockquote className="border-l-4 border-primary pl-4 italic text-foreground">
              "Great bread isn't about perfect technique—it's about understanding your ingredients and building confidence through consistent success."
              <footer className="text-sm text-muted-foreground mt-2">— Henry Hunter</footer>
            </blockquote>
          </div>
        </div>
      </div>
    </section>
  );
};