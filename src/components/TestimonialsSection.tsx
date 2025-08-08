import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Quote, Facebook, Instagram } from 'lucide-react';
import { ResponsiveImage } from './ResponsiveImage';

interface Testimonial {
  id: string;
  name: string;
  avatar?: string;
  location: string;
  rating: number;
  text: string;
  source: 'facebook' | 'instagram' | 'email' | 'website';
  verified?: boolean;
  recipeUsed?: string;
  bakingExperience?: 'beginner' | 'intermediate' | 'expert';
}

const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Sarah M.',
    location: 'Atlanta, GA',
    rating: 5,
    text: "Henry's foolproof method finally got me baking beautiful sourdough! After years of failed attempts, Vitale starter and his clear instructions made all the difference. My family can't believe I made this bread!",
    source: 'facebook',
    verified: true,
    recipeUsed: "Henry's Foolproof Sourdough",
    bakingExperience: 'beginner'
  },
  {
    id: '2', 
    name: 'Michael K.',
    location: 'Portland, OR',
    rating: 5,
    text: "The Facebook group and Henry's teaching style transformed my baking. I've gone from store-bought bread to making artisan loaves that would cost $8+ at bakeries. Worth every penny of the Vitale starter!",
    source: 'facebook',
    verified: true,
    recipeUsed: 'Classic Sourdough Boule',
    bakingExperience: 'intermediate'
  },
  {
    id: '3',
    name: 'Emily R.',
    location: 'Chicago, IL', 
    rating: 5,
    text: "I was intimidated by sourdough until I found Henry's community. The step-by-step guidance and 38,000+ supportive bakers made learning fun instead of frustrating. Now I bake fresh bread weekly!",
    source: 'instagram',
    verified: true,
    recipeUsed: 'Weekend Sourdough',
    bakingExperience: 'beginner'
  },
  {
    id: '4',
    name: 'David L.',
    location: 'Austin, TX',
    rating: 5,
    text: "Henry's books and online content are game-changers. His Vitale starter revived my passion for baking after years away. The community support and proven methods make success inevitable.",
    source: 'email',
    verified: true,
    recipeUsed: 'Country Loaf',
    bakingExperience: 'expert'
  },
  {
    id: '5',
    name: 'Jessica T.',
    location: 'Denver, CO',
    rating: 5,
    text: "Three failed starters and countless dense loaves later, I found Henry's method. Vitale starter was active in 24 hours and I had my first perfect loaf in 3 days. Life-changing!",
    source: 'facebook',
    verified: true,
    recipeUsed: 'Beginner Sourdough',
    bakingExperience: 'beginner'
  },
  {
    id: '6',
    name: 'Robert H.',
    location: 'Seattle, WA',
    rating: 5,
    text: "As a professional chef, I was skeptical about online bread courses. Henry's expertise and the community's results speak for themselves. This is the real deal - no gimmicks, just great bread.",
    source: 'website',
    verified: true,
    recipeUsed: 'Artisan Whole Wheat',
    bakingExperience: 'expert'
  }
];

const sourceIcons = {
  facebook: Facebook,
  instagram: Instagram,
  email: null,
  website: null
};

export const TestimonialsSection = () => {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'
        }`}
      />
    ));
  };

  return (
    <section className="py-20 bg-section-background" aria-labelledby="testimonials-heading">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4" aria-hidden="true">
            Verified Reviews
          </Badge>
          <h2 id="testimonials-heading" className="text-3xl md:text-4xl font-bold text-primary mb-4">
            What Our Bakers Are Saying
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Join thousands of home bakers who've transformed their bread-making with proven methods and community support
          </p>
          
          {/* Social Proof Numbers */}
          <div className="flex justify-center gap-8 mt-8" role="group" aria-label="Community statistics">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">38,000+</div>
              <div className="text-sm text-muted-foreground">Community Members</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">4.9★</div>
              <div className="text-sm text-muted-foreground">Average Rating</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">500+</div>
              <div className="text-sm text-muted-foreground">Success Stories</div>
            </div>
          </div>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6" role="list" aria-label="Customer testimonials">
          {testimonials.map((testimonial) => {
            const SourceIcon = sourceIcons[testimonial.source];
            
            return (
              <Card key={testimonial.id} className="h-full shadow-warm" role="listitem">
                <CardContent className="p-6 space-y-4">
                  {/* Quote */}
                  <div className="relative">
                    <Quote className="h-8 w-8 text-primary/20 absolute -top-2 -left-2" aria-hidden="true" />
                    <blockquote className="text-muted-foreground italic leading-relaxed pl-6">
                      {testimonial.text}
                    </blockquote>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-1" role="group" aria-label={`Rating: ${testimonial.rating} out of 5 stars`}>
                    {renderStars(testimonial.rating)}
                    <span className="sr-only">{testimonial.rating} out of 5 stars</span>
                  </div>

                  {/* Recipe Used */}
                  {testimonial.recipeUsed && (
                    <Badge variant="secondary" className="text-xs">
                      Used: {testimonial.recipeUsed}
                    </Badge>
                  )}

                  {/* Author Info */}
                  <div className="flex items-center justify-between pt-4 border-t">
                    <div>
                      <div className="font-semibold text-foreground flex items-center gap-2">
                        {testimonial.name}
                        {testimonial.verified && (
                          <Badge variant="default" className="text-xs h-5">
                            ✓ Verified
                          </Badge>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {testimonial.location}
                      </div>
                      {testimonial.bakingExperience && (
                        <div className="text-xs text-muted-foreground capitalize">
                          {testimonial.bakingExperience} baker
                        </div>
                      )}
                    </div>
                    
                    {/* Source Icon */}
                    {SourceIcon && (
                      <SourceIcon className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-4">
            Ready to join thousands of successful home bakers?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://bit.ly/3srdSYS"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors inline-flex items-center justify-center gap-2"
            >
              <Facebook className="h-4 w-4" />
              Join Our Community
            </a>
            <a
              href="https://vitalesourdoughco.etsy.com/listing/1647278386"
              target="_blank"
              rel="noopener noreferrer"
              className="border border-primary text-primary px-6 py-3 rounded-lg hover:bg-primary/10 transition-colors inline-flex items-center justify-center"
            >
              Get Vitale Starter
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};