import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ResponsiveImage } from '@/components/ResponsiveImage';
const recipeImage = '/lovable-uploads/november-challenge-2025.png';

const MonthlyChallenge = () => {
  return (
    <section className="py-20 px-4 bg-gradient-amber">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-block bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-semibold">
              November 2025 Challenge
            </div>
            <h2 className="text-4xl font-bold text-primary-foreground">
              Score the Season: Master Sourdough Techniques
            </h2>
            <p className="text-amber-100 text-lg leading-relaxed">
              Join our community this month as we master sourdough techniques together. 
              Follow along with our comprehensive guide, perfect your scoring, and share 
              your beautiful loaves with fellow bakers.
            </p>
            
            <div className="space-y-4">
              <div className="bg-primary-foreground/10 backdrop-blur-sm rounded-lg p-4 border border-primary-foreground/20">
                <h3 className="text-primary-foreground font-semibold mb-2">What You'll Learn:</h3>
                <ul className="space-y-1 text-amber-200 text-sm">
                  <li>• Essential sourdough starter maintenance</li>
                  <li>• Proper dough mixing and fermentation</li>
                  <li>• Shaping and scoring techniques</li>
                  <li>• Baking for the perfect crust</li>
                </ul>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="default" size="lg" asChild className="bg-primary-foreground text-primary hover:bg-primary-foreground/90">
                <Link to="/novemberchallenge">
                  View Challenge Guide
                </Link>
              </Button>
              <Button variant="heroOutline" size="lg" asChild className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                <a href="https://bit.ly/3srdSYS" target="_blank" rel="noopener noreferrer">
                  Join Community
                </a>
              </Button>
            </div>
          </div>
          
          <div className="relative">
            <ResponsiveImage 
              src={recipeImage} 
              alt="November 2025 Baking Challenge - Score the Season"
              className="rounded-2xl shadow-stone w-full h-auto"
              loading="lazy"
            />
            <div className="absolute -top-4 -right-4 bg-primary-foreground text-primary p-4 rounded-lg shadow-warm">
              <p className="font-bold text-2xl">15K+</p>
              <p className="text-sm">Bakers Love It</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MonthlyChallenge;