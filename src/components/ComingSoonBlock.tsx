import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Bell, ArrowLeft, Clock, Star } from "lucide-react";

interface ComingSoonBlockProps {
  title?: string;
  description?: string;
  subtitle?: string;
  featureList?: string[];
  showNavigation?: boolean;
  showNotifyButton?: boolean;
  backgroundImage?: string;
}

const ComingSoonBlock = ({ 
  title = "Baking Great Bread at Home",
  description = "Henry's most ambitious work yet. Equal parts cookbook, memoir, and cultural history. Recipes that span generations. Stories that trace the soul of bread.",
  subtitle = "A Journey Through the Seasons",
  featureList = [],
  showNavigation = false,
  showNotifyButton = true,
  backgroundImage = "https://ojyckskucneljvuqzrsw.supabase.co/storage/v1/object/public/blog-images/seasonal-baking-cover.png"
}: ComingSoonBlockProps) => {
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Blurred background image */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          filter: 'blur(8px) brightness(0.3)',
          transform: 'scale(1.1)'
        }}
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60" />
      
      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto text-center px-4">
        <div className="mb-8">
          <div className="inline-block px-6 py-2 rounded-full bg-primary/20 border border-primary/30 mb-6">
            <span className="text-primary font-medium">Coming December 2025</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            {title}
          </h2>
          
          {subtitle && (
            <p className="text-xl md:text-2xl text-orange-200 font-serif italic mb-8">
              {subtitle}
            </p>
          )}
        </div>
        
        <div className="max-w-2xl mx-auto mb-10">
          <p className="text-lg text-gray-200 leading-relaxed mb-6">
            {description}
          </p>
          
          {/* Feature list if provided */}
          {featureList.length > 0 && (
            <div className="bg-black/40 backdrop-blur-sm border border-white/20 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-white flex items-center justify-center gap-2 mb-4">
                <Star className="w-5 h-5 text-primary" />
                What's Coming
              </h3>
              <ul className="space-y-2 text-left max-w-md mx-auto">
                {featureList.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <span className="text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          {showNavigation && (
            <>
              <Button asChild variant="outline" className="border-white/30 text-white hover:bg-white/10">
                <Link to="/" className="flex items-center gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Back to Home
                </Link>
              </Button>
              <Button asChild className="bg-white/10 hover:bg-white/20 text-white border border-white/30">
                <Link to="/recipes">
                  Explore Public Recipes
                </Link>
              </Button>
            </>
          )}
          
          {showNotifyButton && (
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-white px-8 py-3">
              <Bell className="mr-2 h-5 w-5" />
              Notify Me When It Drops
            </Button>
          )}
        </div>
        
        {/* Decorative elements */}
        <div className="flex justify-center items-center gap-8 mt-12 opacity-60">
          <div className="w-16 h-px bg-gradient-to-r from-transparent to-primary"></div>
          <div className="w-2 h-2 rounded-full bg-primary"></div>
          <div className="w-16 h-px bg-gradient-to-l from-transparent to-primary"></div>
        </div>
      </div>
    </section>
  );
};

export default ComingSoonBlock;