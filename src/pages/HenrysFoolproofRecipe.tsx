import { useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { RecipeHeader } from '@/components/recipe-page/RecipeHeader';
import { RecipeImage } from '@/components/recipe-page/RecipeImage';
import { RecipeMeta } from '@/components/recipe-page/RecipeMeta';
import { IngredientsEquipment } from '@/components/recipe-page/IngredientsEquipment';
import { MethodSteps } from '@/components/recipe-page/MethodSteps';
import { Troubleshooting } from '@/components/recipe-page/Troubleshooting';
import { FinalThoughtsNutrition } from '@/components/recipe-page/FinalThoughtsNutrition';
import { Resources } from '@/components/recipe-page/Resources';
import { RecipeSEO } from '@/components/recipe-page/RecipeSEO';

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

  const methodSteps = [
    {
      title: "1. Mix & Fermentolyse (10 minutes active, 45 minutes rest)",
      description: "We're skipping the traditional autolyse and going straight to mixing everything upfront.",
      instructions: [
        "• In a large bowl, mix flour, water, and sourdough starter until no dry flour remains. Cover and let the mixture rest for 45 minutes.",
        "• After resting, add the salt and mix by hand using the Rubaud method:",
        "  ◦ Cup your hand and scoop from underneath the dough.",
        "  ◦ Lift the dough upward, allowing it to fall back on itself.",
        "  ◦ Repeat for about 10 minutes until the dough looks smooth and holds its shape."
      ]
    },
    {
      title: "2. Stretch & Fold (or Coil Fold) – 3 sets every 45 minutes",
      description: "Building dough strength is essential, especially for high-hydration recipes like this one. Choose between stretch and folds or the gentler coil fold method:",
      instructions: [],
      subSteps: [
        {
          title: "Stretch & Fold:",
          content: "Lift one side of the dough upward and fold it over itself. Rotate the bowl and repeat on all four sides."
        },
        {
          title: "Coil Fold:",
          content: [
            "• Wet your hands to prevent sticking.",
            "• Gently lift the center of the dough with both hands.",
            "• Allow the dough to naturally coil under itself as you lift and fold."
          ]
        }
      ]
    },
    {
      title: "3. Shape the Dough",
      description: "After the final fold, let the dough rest in the bowl for 30 minutes, then shape it directly.",
      instructions: [
        "• Turn the dough out onto a lightly floured surface, letting gravity help pull it out of the bowl.",
        "• Gently stretch the dough into a square without pressing out the gas.",
        "• Fold it like a letter:",
        "  ◦ Take the bottom edge and fold it up to the center.",
        "  ◦ Stretch the bottom corners outward and fold them inward to slightly overlap.",
        "  ◦ Take the top edge, stretch slightly, and fold it down towards the bottom to create a square bundle.",
        "• Place the shaped dough seam-side up in a floured proofing basket. Cover and let it rest on the counter for 1 hour, then refrigerate for 8–24 hours."
      ]
    },
    {
      title: "4. Preheat & Score",
      instructions: [
        "• Preheat your oven to 475°F (245°C) with your baking vessel inside.",
        "• Pro Tip: If you plan intricate scoring, place the dough in the freezer for 15 minutes during the preheat. This firms up the surface, making it easier to score, especially in warm weather."
      ]
    },
    {
      title: "5. Bake",
      instructions: [
        "• Remove the dough from the fridge, transfer it to a piece of parchment paper or bread sling, and score the top using a lame or sharp knife.",
        "• Using the parchment or sling, carefully lower the dough into the preheated baking vessel.",
        "• Bake:",
        "  ◦ Covered for 22 minutes.",
        "  ◦ Uncovered for 10–15 minutes, or until the crust is golden brown and the internal temperature reaches 200°F (93°C).",
        "• Let the loaf cool completely before slicing—it's worth the wait!"
      ]
    }
  ];

  const resourceLinks = [
    { url: "#", text: "Sourdough Starter Guide", description: "Learn to keep your starter strong.", external: false },
    { url: "#", text: "Brød & Taylor Baking Shell", description: "My favorite tool for consistent results.", external: false },
    { url: "https://bit.ly/3srdSYS", text: "Join the Facebook Group", description: "Connect with thousands of bakers for tips and feedback!", external: true },
    { url: "#", text: "My sourdough baking process", description: "", external: false }
  ];

  const seoData = {
    title: "Henry's Foolproof Sourdough Loaf",
    description: "A beautifully sliced sourdough loaf with an open crumb structure, golden crust, and airy interior. This simple, reliable, and flavorful sourdough recipe delivers great results every time using proven techniques and 75% hydration.",
    imageUrl: `${window.location.origin}/lovable-uploads/21d4d7bb-e47a-434d-b2c3-a7c787e13e07.png`,
    author: "Henry Hunter",
    datePublished: "2025-01-29",
    cookTime: "PT45M",
    prepTime: "PT30M", 
    totalTime: "PT18H",
    recipeYield: "8-10 slices",
    ingredients: ingredients.map(ing => `${ing.metric} ${ing.ingredient}`),
    instructions: methodSteps.flatMap(step => step.instructions),
    url: `${window.location.origin}/henrys-foolproof-recipe`
  };

  // Remove auto-scroll to top to prevent unwanted scrolling behavior
  // useEffect(() => {
  //   window.scrollTo(0, 0);
  // }, []);

  return (
    <div className="bg-background text-foreground min-h-screen">
      <RecipeSEO {...seoData} />
      <Header />
      
      <main className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-12">
            <RecipeHeader
              title="Henry's Foolproof Sourdough Loaf"
              date="January 29, 2025"
              author="Henry Hunter"
              description="A beautifully sliced sourdough loaf with an open crumb structure, golden crust, and airy interior, showcasing the results of Henry's Foolproof Sourdough Recipe."
            />

            <RecipeImage
              src="/lovable-uploads/21d4d7bb-e47a-434d-b2c3-a7c787e13e07.png"
              alt="Henry's Foolproof Sourdough Loaf with perfect crumb structure"
            />

            <RecipeMeta
              totalTime="12-24 hours"
              serves="8-10 slices"
              difficulty="Intermediate"
              hydration="75%"
            />

            <p className="text-lg text-center text-primary font-serif italic">
              A simple, reliable, and flavorful sourdough recipe that delivers great results every time.
            </p>

            <Card className="p-8">
              <h2 className="text-2xl font-bold mb-4 text-primary">Introduction</h2>
              <div className="prose prose-lg max-w-none text-foreground">
                {introductionContent.map((paragraph, index) => (
                  <p key={index} className="mb-4">
                    {paragraph}
                  </p>
                ))}
              </div>
            </Card>

            <IngredientsEquipment ingredients={ingredients} equipment={equipment} />

            <MethodSteps steps={methodSteps} />

            <Troubleshooting items={troubleshooting} />

            <FinalThoughtsNutrition 
              finalThoughts={finalThoughts}
              nutritionFacts={nutritionFacts}
            />

            <Resources links={resourceLinks} />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default HenrysFoolproofRecipe;