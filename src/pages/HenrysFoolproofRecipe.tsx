import { useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { RecipeHero } from '@/components/recipe-page/RecipeHero';
import { RecipeStats } from '@/components/recipe-page/RecipeStats';
import { RecipeIntroduction } from '@/components/recipe-page/RecipeIntroduction';
import { IngredientsEquipment } from '@/components/recipe-page/IngredientsEquipment';
import { RecipeMethod } from '@/components/recipe-page/RecipeMethod';
import { RecipeTroubleshooting } from '@/components/recipe-page/RecipeTroubleshooting';
import { FinalThoughtsNutrition } from '@/components/recipe-page/FinalThoughtsNutrition';
import { RecipeResources } from '@/components/recipe-page/RecipeResources';

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

  const introductionContent = [
    "When I first started baking sourdough, I was determined to master the perfect loaf—a balance of crisp crust, soft crumb, and deep, complex flavor. I experimented endlessly, trying different methods, flour blends, and hydration levels, and what I discovered was that simplicity often wins.",
    "This recipe is the culmination of years of trial and error. It's been tested in kitchens around the world, shared by thousands of bakers, and designed to eliminate guesswork. Whether you're a beginner or an experienced sourdough enthusiast, this loaf is approachable and consistent.",
    "With 75% hydration and a method that prioritizes fermentation and structure, it's as rewarding to make as it is to eat. Let's bake!"
  ];

  const finalThoughts = [
    "This sourdough recipe is my pride and joy. It's the loaf I bake when I want to impress or just enjoy something familiar and comforting. Sourdough baking is a journey, and every loaf teaches you something new.",
    "If you bake this, I'd love to see your results! Share your photos and tips in the Baking Great Bread at Home group, and don't forget to tag me. Let's keep inspiring each other to bake our best!"
  ];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-background text-foreground min-h-screen">
      <Header />
      
      <main className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <RecipeHero
            title="Henry's Foolproof Sourdough Loaf"
            date="January 29, 2025"
            author="Henry Hunter"
            description="A beautifully sliced sourdough loaf with an open crumb structure, golden crust, and airy interior, showcasing the results of Henry's Foolproof Sourdough Recipe."
            imageUrl="/lovable-uploads/21d4d7bb-e47a-434d-b2c3-a7c787e13e07.png"
            imageAlt="Henry's Foolproof Sourdough Loaf with perfect crumb structure"
          />

          <RecipeStats
            totalTime="12-24 hours"
            serves="8-10 slices"
            difficulty="Intermediate"
            hydration="75%"
          />

          <p className="text-lg text-center text-primary font-serif italic mb-12">
            A simple, reliable, and flavorful sourdough recipe that delivers great results every time.
          </p>

          <RecipeIntroduction content={introductionContent} />

          <IngredientsEquipment ingredients={ingredients} equipment={equipment} />

          <RecipeMethod />

          <RecipeTroubleshooting troubleshooting={troubleshooting} />

          <FinalThoughtsNutrition 
            finalThoughts={finalThoughts}
            nutritionFacts={nutritionFacts}
          />

          <RecipeResources />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default HenrysFoolproofRecipe;