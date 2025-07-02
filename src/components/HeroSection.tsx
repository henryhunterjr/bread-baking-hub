import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import heroBreadImage from '@/assets/hero-bread.jpg';

const HeroSection = () => {
  return (
    <section className="relative bg-gradient-hero py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              Master the Art of 
              <span className="text-primary"> Baking Great Bread</span> at Home
            </h1>
            <p className="text-xl text-stone-300 leading-relaxed">
              Transform simple ingredients into artisan-quality bread with proven techniques, 
              expert guidance, and a community of passionate bakers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="hero" size="xl" asChild>
                <Link to="/recipes">Explore Recipes</Link>
              </Button>
              <Button variant="heroOutline" size="xl" asChild>
                <Link to="/about">Learn More</Link>
              </Button>
            </div>
          </div>
          <div className="relative">
            <img 
              src={heroBreadImage} 
              alt="Freshly baked artisan bread with golden crust" 
              className="rounded-2xl shadow-stone w-full h-auto"
            />
            <div className="absolute -bottom-4 -right-4 bg-primary text-primary-foreground p-4 rounded-lg shadow-warm">
              <p className="font-semibold">Join 15,000+ Bakers</p>
              <p className="text-sm">Learning Together</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;