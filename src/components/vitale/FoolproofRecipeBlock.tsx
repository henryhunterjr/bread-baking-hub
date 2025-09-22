import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ResponsiveImage } from '@/components/ResponsiveImage';
const recipeImage = '/henrys-foolproof-sourdough-crumb.jpg';

const FoolproofRecipeBlock = () => {
  return (
    <section className="py-20 px-4 bg-gradient-amber">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-block bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-semibold">
              January 29, 2025
            </div>
            <h2 className="text-4xl font-bold text-primary-foreground">
              Henry's Foolproof Sourdough Loaf
            </h2>
            <p className="text-amber-100 text-lg leading-relaxed">
              A beautifully sliced sourdough loaf with an open crumb structure, golden crust, 
              and airy interior. This simple, reliable, and flavorful sourdough recipe delivers 
              great results every time using proven techniques and 75% hydration.
            </p>
            
            <div className="space-y-4">
              <div className="bg-primary-foreground/10 backdrop-blur-sm rounded-lg p-4 border border-primary-foreground/20">
                <h3 className="text-primary-foreground font-semibold mb-2">Recipe Highlights:</h3>
                <ul className="space-y-1 text-amber-200 text-sm">
                  <li>• 75% hydration for perfect texture</li>
                  <li>• Simplified fermentolyse method</li>
                  <li>• Foolproof shaping techniques</li>
                  <li>• Complete troubleshooting guide</li>
                </ul>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="default" size="lg" asChild className="bg-primary-foreground text-primary hover:bg-primary-foreground/90">
                <Link to="/henrys-foolproof-recipe">Go to Recipe</Link>
              </Button>
              <Button variant="heroOutline" size="lg" asChild className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                <a href="https://bit.ly/3srdSYS" target="_blank" rel="noopener noreferrer">Join Community</a>
              </Button>
            </div>
          </div>
          
          <div className="relative">
            <ResponsiveImage 
              src={recipeImage} 
              alt="Henry's Foolproof Sourdough Loaf with perfect crumb structure"
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

export default FoolproofRecipeBlock;