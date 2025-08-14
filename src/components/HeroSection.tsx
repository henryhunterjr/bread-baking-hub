import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ResponsiveImage } from './ResponsiveImage';
import heroBreadImage from '@/assets/hero-bread.jpg';

const HeroSection = () => {
  return (
    <section className="relative bg-gradient-hero py-20 px-4" aria-labelledby="hero-heading">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h1 id="hero-heading" className="text-4xl md:text-6xl font-bold leading-tight">
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
            <ResponsiveImage
              src="https://ojyckskucneljvuqzrsw.supabase.co/storage/v1/object/public/hero-images/hero-main.png"
              alt="Beautiful artisan bread with perfect crumb structure showing heart-shaped pattern"
              className="rounded-2xl shadow-stone w-full aspect-[4/3]"
              priority={true}
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute -bottom-4 -right-4 bg-primary text-primary-foreground p-4 rounded-lg shadow-warm" aria-label="Community stats">
              <p className="font-semibold">Join 38,000+ Bakers</p>
              <p className="text-sm">Learning Together</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;