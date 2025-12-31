import { ArrowRight, Users, Globe, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const YearReviewSection = () => {
  return (
    <section className="py-16 px-4 bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 dark:from-amber-950/30 dark:via-orange-950/20 dark:to-amber-900/30">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Content */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 bg-amber-200/50 dark:bg-amber-800/30 px-3 py-1 rounded-full text-amber-800 dark:text-amber-200 text-sm font-medium">
              <span>🎉</span>
              <span>Year in Review</span>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              2025: The Year We Rose Together
            </h2>
            
            <p className="text-lg text-muted-foreground">
              From "Can I do this?" to "What happens if I try this?" — see how our community of home bakers built something extraordinary this year.
            </p>
            
            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="flex items-center justify-center mb-1">
                  <Users className="h-5 w-5 text-amber-600" />
                </div>
                <div className="text-2xl font-bold text-foreground">14,438</div>
                <div className="text-xs text-muted-foreground">Members</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-1">
                  <MessageCircle className="h-5 w-5 text-amber-600" />
                </div>
                <div className="text-2xl font-bold text-foreground">69,699</div>
                <div className="text-xs text-muted-foreground">Interactions</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-1">
                  <Globe className="h-5 w-5 text-amber-600" />
                </div>
                <div className="text-2xl font-bold text-foreground">18+</div>
                <div className="text-xs text-muted-foreground">Countries</div>
              </div>
            </div>
            
            <Button 
              asChild
              size="lg"
              className="bg-amber-600 hover:bg-amber-700 text-white"
            >
              <a href="/year-review-2025/index.html">
                View Full Review
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </div>
          
          {/* Image/Visual */}
          <div className="relative">
            <div className="aspect-square max-w-md mx-auto rounded-2xl overflow-hidden shadow-2xl transform rotate-2 hover:rotate-0 transition-transform duration-500">
              <img 
                src="/year-review-2025/images/logo.png" 
                alt="2025 Year in Review - Baking Great Bread at Home"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-amber-300/30 rounded-full blur-2xl" />
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-orange-300/30 rounded-full blur-2xl" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default YearReviewSection;
