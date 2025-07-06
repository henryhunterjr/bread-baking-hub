import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Clock, Users, ChefHat, Thermometer } from 'lucide-react';

const HenrysFoolproofRecipe = () => {
  const ingredients = [
    { ingredient: 'Bread flour', metric: '500g', volume: '4 cups' },
    { ingredient: 'Water (warm)', metric: '375g', volume: '1 ½ cups' },
    { ingredient: 'Active sourdough starter', metric: '100g', volume: '½ cup' },
    { ingredient: 'Salt', metric: '10g', volume: '2 tsp' }
  ];

  const equipment = [
    'Mixing bowl',
    'Bench scraper',
    'Proofing basket (banneton)',
    'Dutch oven or Brød & Taylor Baking Shell',
    'Digital scale',
    'Lame or sharp knife for scoring'
  ];

  const troubleshooting = [
    { issue: 'Dough is too sticky', cause: 'High hydration', solution: 'Use wet hands for handling, and practice coil folds.' },
    { issue: 'Dense loaf', cause: 'Underproofed', solution: 'Allow more time during bulk fermentation, and ensure your starter is active.' },
    { issue: 'Flat loaf', cause: 'Poor shaping or weak gluten', solution: 'Focus on creating tension during shaping, and ensure enough stretch & folds.' },
    { issue: 'Pale crust', cause: 'Oven not hot enough', solution: 'Preheat your oven and baking vessel thoroughly.' }
  ];

  const nutritionFacts = [
    { nutrient: 'Calories', value: '110' },
    { nutrient: 'Carbs', value: '22g' },
    { nutrient: 'Protein', value: '4g' },
    { nutrient: 'Fat', value: '0.5g' }
  ];

  return (
    <div className="bg-background text-foreground min-h-screen">
      <Header />
      
      <main className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center space-y-6 mb-12">
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <span>Home</span>
              <span>»</span>
              <span>Henry's Foolproof Sourdough Loaf</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-primary">
              Henry's Foolproof Sourdough Loaf
            </h1>
            
            <div className="flex items-center justify-center gap-4 text-muted-foreground">
              <Badge variant="outline">January 29, 2025</Badge>
              <Badge variant="outline">Henry Hunter</Badge>
            </div>
            
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              A beautifully sliced sourdough loaf with an open crumb structure, golden crust, and airy interior, 
              showcasing the results of Henry's Foolproof Sourdough Recipe.
            </p>

            <div className="relative max-w-2xl mx-auto">
              <img 
                src="/lovable-uploads/21d4d7bb-e47a-434d-b2c3-a7c787e13e07.png"
                alt="Henry's Foolproof Sourdough Loaf with perfect crumb structure"
                className="rounded-2xl shadow-warm w-full h-auto"
              />
            </div>
          </div>

          {/* Recipe Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            <Card className="p-4 text-center">
              <Clock className="h-6 w-6 mx-auto mb-2 text-primary" />
              <div className="text-sm font-medium">Total Time</div>
              <div className="text-xs text-muted-foreground">12-24 hours</div>
            </Card>
            <Card className="p-4 text-center">
              <Users className="h-6 w-6 mx-auto mb-2 text-primary" />
              <div className="text-sm font-medium">Serves</div>
              <div className="text-xs text-muted-foreground">8-10 slices</div>
            </Card>
            <Card className="p-4 text-center">
              <ChefHat className="h-6 w-6 mx-auto mb-2 text-primary" />
              <div className="text-sm font-medium">Difficulty</div>
              <div className="text-xs text-muted-foreground">Intermediate</div>
            </Card>
            <Card className="p-4 text-center">
              <Thermometer className="h-6 w-6 mx-auto mb-2 text-primary" />
              <div className="text-sm font-medium">Hydration</div>
              <div className="text-xs text-muted-foreground">75%</div>
            </Card>
          </div>

          <p className="text-lg text-center text-primary font-serif italic mb-12">
            A simple, reliable, and flavorful sourdough recipe that delivers great results every time.
          </p>

          {/* Introduction */}
          <Card className="p-8 mb-8">
            <h2 className="text-2xl font-bold mb-4 text-primary">Introduction</h2>
            <div className="prose prose-lg max-w-none text-foreground">
              <p className="mb-4">
                When I first started baking sourdough, I was determined to master the perfect loaf—a balance of crisp crust, 
                soft crumb, and deep, complex flavor. I experimented endlessly, trying different methods, flour blends, and 
                hydration levels, and what I discovered was that simplicity often wins.
              </p>
              <p className="mb-4">
                This recipe is the culmination of years of trial and error. It's been tested in kitchens around the world, 
                shared by thousands of bakers, and designed to eliminate guesswork. Whether you're a beginner or an experienced 
                sourdough enthusiast, this loaf is approachable and consistent.
              </p>
              <p>
                With 75% hydration and a method that prioritizes fermentation and structure, it's as rewarding to make as it 
                is to eat. Let's bake!
              </p>
            </div>
          </Card>

          {/* Ingredients & Equipment */}
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-4 text-primary">Ingredients</h2>
              <p className="text-sm text-muted-foreground mb-4">(Yields one loaf)</p>
              <div className="space-y-3">
                {ingredients.map((item, index) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b border-border">
                    <span className="font-medium">{item.ingredient}</span>
                    <div className="text-right">
                      <div className="font-semibold">{item.metric}</div>
                      <div className="text-sm text-muted-foreground">{item.volume}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-4 text-primary">Equipment</h2>
              <ul className="space-y-2">
                {equipment.map((item, index) => (
                  <li key={index} className="flex items-start">
                    <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    {item}
                  </li>
                ))}
              </ul>
            </Card>
          </div>

          {/* Method */}
          <Card className="p-8 mb-8">
            <h2 className="text-2xl font-bold mb-6 text-primary">Method</h2>
            
            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-semibold mb-3">1. Mix & Fermentolyse (10 minutes active, 45 minutes rest)</h3>
                <p className="text-muted-foreground mb-3">
                  We're skipping the traditional autolyse and going straight to mixing everything upfront.
                </p>
                <ul className="space-y-2 ml-4">
                  <li>• In a large bowl, mix flour, water, and sourdough starter until no dry flour remains. Cover and let the mixture rest for 45 minutes.</li>
                  <li>• After resting, add the salt and mix by hand using the Rubaud method:</li>
                  <li className="ml-4">◦ Cup your hand and scoop from underneath the dough.</li>
                  <li className="ml-4">◦ Lift the dough upward, allowing it to fall back on itself.</li>
                  <li className="ml-4">◦ Repeat for about 10 minutes until the dough looks smooth and holds its shape.</li>
                </ul>
              </div>

              <Separator />

              <div>
                <h3 className="text-xl font-semibold mb-3">2. Stretch & Fold (or Coil Fold) – 3 sets every 45 minutes</h3>
                <p className="text-muted-foreground mb-3">
                  Building dough strength is essential, especially for high-hydration recipes like this one. Choose between stretch and folds or the gentler coil fold method:
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2">Stretch & Fold:</h4>
                    <p className="text-sm">Lift one side of the dough upward and fold it over itself. Rotate the bowl and repeat on all four sides.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Coil Fold:</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Wet your hands to prevent sticking.</li>
                      <li>• Gently lift the center of the dough with both hands.</li>
                      <li>• Allow the dough to naturally coil under itself as you lift and fold.</li>
                    </ul>
                  </div>
                </div>
                <p className="mt-3">Perform 3 sets, with 45 minutes between each set. By the end, the dough should feel strong, elastic, and less sticky.</p>
              </div>

              <Separator />

              <div>
                <h3 className="text-xl font-semibold mb-3">3. Shape the Dough</h3>
                <p className="mb-3">After the final fold, let the dough rest in the bowl for 30 minutes, then shape it directly.</p>
                <ul className="space-y-2 ml-4">
                  <li>• Turn the dough out onto a lightly floured surface, letting gravity help pull it out of the bowl.</li>
                  <li>• Gently stretch the dough into a square without pressing out the gas.</li>
                  <li>• Fold it like a letter:</li>
                  <li className="ml-4">◦ Take the bottom edge and fold it up to the center.</li>
                  <li className="ml-4">◦ Stretch the bottom corners outward and fold them inward to slightly overlap.</li>
                  <li className="ml-4">◦ Take the top edge, stretch slightly, and fold it down towards the bottom to create a square bundle.</li>
                  <li>• Place the shaped dough seam-side up in a floured proofing basket. Cover and let it rest on the counter for 1 hour, then refrigerate for 8–24 hours.</li>
                </ul>
              </div>

              <Separator />

              <div>
                <h3 className="text-xl font-semibold mb-3">4. Preheat & Score</h3>
                <ul className="space-y-2 ml-4">
                  <li>• Preheat your oven to 475°F (245°C) with your baking vessel inside.</li>
                  <li>• <strong>Pro Tip:</strong> If you plan intricate scoring, place the dough in the freezer for 15 minutes during the preheat. This firms up the surface, making it easier to score, especially in warm weather.</li>
                </ul>
              </div>

              <Separator />

              <div>
                <h3 className="text-xl font-semibold mb-3">5. Bake</h3>
                <ul className="space-y-2 ml-4">
                  <li>• Remove the dough from the fridge, transfer it to a piece of parchment paper or bread sling, and score the top using a lame or sharp knife.</li>
                  <li>• Using the parchment or sling, carefully lower the dough into the preheated baking vessel.</li>
                  <li>• Bake:</li>
                  <li className="ml-4">◦ Covered for 22 minutes.</li>
                  <li className="ml-4">◦ Uncovered for 10–15 minutes, or until the crust is golden brown and the internal temperature reaches 200°F (93°C).</li>
                  <li>• Let the loaf cool completely before slicing—it's worth the wait!</li>
                </ul>
              </div>
            </div>
          </Card>

          {/* Troubleshooting */}
          <Card className="p-6 mb-8">
            <h2 className="text-2xl font-bold mb-4 text-primary">Troubleshooting & Common Mistakes</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-2 font-semibold">Issue</th>
                    <th className="text-left py-2 px-2 font-semibold">Cause</th>
                    <th className="text-left py-2 px-2 font-semibold">Solution</th>
                  </tr>
                </thead>
                <tbody>
                  {troubleshooting.map((item, index) => (
                    <tr key={index} className="border-b">
                      <td className="py-3 px-2 font-medium">{item.issue}</td>
                      <td className="py-3 px-2">{item.cause}</td>
                      <td className="py-3 px-2">{item.solution}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Final Thoughts & Nutrition */}
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-4 text-primary">Final Thoughts</h2>
              <p className="mb-4">
                This sourdough recipe is my pride and joy. It's the loaf I bake when I want to impress or just enjoy 
                something familiar and comforting. Sourdough baking is a journey, and every loaf teaches you something new.
              </p>
              <p>
                If you bake this, I'd love to see your results! Share your photos and tips in the Baking Great Bread at 
                Home group, and don't forget to tag me. Let's keep inspiring each other to bake our best!
              </p>
            </Card>

            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-4 text-primary">Nutrition Facts</h2>
              <p className="text-sm text-muted-foreground mb-4">(per slice, ~50g)</p>
              <div className="grid grid-cols-2 gap-3">
                {nutritionFacts.map((item, index) => (
                  <div key={index} className="text-center p-3 bg-muted rounded-lg">
                    <div className="font-semibold text-lg">{item.value}</div>
                    <div className="text-sm text-muted-foreground">{item.nutrient}</div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Links & Resources */}
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4 text-primary">Links & Resources</h2>
            <ul className="space-y-2">
              <li>• <a href="#" className="text-primary hover:underline">Sourdough Starter Guide</a> – Learn to keep your starter strong.</li>
              <li>• <a href="#" className="text-primary hover:underline">Brød & Taylor Baking Shell</a> – My favorite tool for consistent results.</li>
              <li>• <a href="https://bit.ly/3srdSYS" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Join the Facebook Group</a> – Connect with thousands of bakers for tips and feedback!</li>
              <li>• <a href="#" className="text-primary hover:underline">My sourdough baking process</a></li>
            </ul>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default HenrysFoolproofRecipe;