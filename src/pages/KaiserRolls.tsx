import { RecipeHeader } from '@/components/recipe-page/RecipeHeader';
import { RecipeImage } from '@/components/recipe-page/RecipeImage';
import { IngredientsEquipment } from '@/components/recipe-page/IngredientsEquipment';
import { MethodSteps } from '@/components/recipe-page/MethodSteps';
import { FinalThoughtsNutrition } from '@/components/recipe-page/FinalThoughtsNutrition';
import Footer from '@/components/Footer';

export default function KaiserRolls() {
  const ingredients = [
    {
      ingredient: "King Arthur Unbleached All-Purpose Flour",
      metric: "360g",
      volume: "3 cups"
    },
    {
      ingredient: "Instant yeast",
      metric: "3g",
      volume: "1½ tsp"
    },
    {
      ingredient: "Granulated sugar",
      metric: "6g",
      volume: "1½ tsp"
    },
    {
      ingredient: "Table salt",
      metric: "8g",
      volume: "1¼ tsp"
    },
    {
      ingredient: "Large egg",
      metric: "1",
      volume: "1 large"
    },
    {
      ingredient: "Unsalted butter, softened",
      metric: "28g",
      volume: "2 tbsp"
    },
    {
      ingredient: "Water, lukewarm",
      metric: "170g",
      volume: "¾ cup"
    },
    {
      ingredient: "Milk (for topping)",
      metric: "14g",
      volume: "1 tbsp"
    },
    {
      ingredient: "Poppy seeds or sesame seeds",
      metric: "18g",
      volume: "2 tbsp"
    }
  ];

  const equipment = [
    "Stand mixer or mixing bowl",
    "Kitchen scale",
    "Measuring cups and spoons",
    "Large mixing bowl",
    "Clean kitchen towel",
    "Baking sheet",
    "Parchment paper",
    "Kaiser roll stamp (optional)",
    "Wire cooling rack"
  ];

  const methodSteps = [
    {
      title: "Prepare the Dough",
      description: "Create a smooth, supple dough foundation",
      instructions: [
        "Weigh your flour; or measure it by gently spooning it into a cup, then sweeping off any excess.",
        "Mix, then knead together all of the dough ingredients — by hand, stand mixer, or in the bucket of a bread machine programmed for the dough cycle — to make a smooth, supple dough."
      ]
    },
    {
      title: "First Rise",
      description: "Allow the dough to develop flavor and structure",
      instructions: [
        "Transfer the dough to a lightly greased bowl or dough-rising bucket.",
        "Cover the bowl or bucket, and allow the dough to rise until noticeably puffy, about 1 hour."
      ]
    },
    {
      title: "Shape the Rolls",
      description: "Divide and shape into kaiser roll form",
      instructions: [
        "Gently deflate the dough, and transfer it to a lightly greased work surface.",
        "Divide the dough into six equal pieces.",
        "Shape the pieces into round balls, and place them on a lightly greased or parchment-lined baking sheet."
      ]
    },
    {
      title: "Create Kaiser Shape",
      description: "Use a kaiser stamp or alternative method",
      instructions: [
        "Center a kaiser stamp over one ball of dough.",
        "Press down firmly, cutting nearly to the bottom but not all the way through.",
        "Repeat with the remaining rolls.",
        "If you don't have a kaiser roll stamp, shape the dough into knots that resemble the classic kaiser roll."
      ]
    },
    {
      title: "Second Rise",
      description: "Final proofing before baking",
      instructions: [
        "Place the rolls cut-side down (this helps them retain their shape) onto a lightly greased or parchment-lined baking sheet.",
        "Cover the rolls, and allow them to rise for 45 minutes to 1 hour, or until they've almost doubled in volume.",
        "Towards the end of the rising time, preheat the oven to 425°F."
      ]
    },
    {
      title: "Final Preparation and Baking",
      description: "Add toppings and bake to perfection",
      instructions: [
        "Turn the rolls cut-side up.",
        "Dip their tops in milk, and coat with poppy or sesame seeds.",
        "Bake the rolls for 15 to 17 minutes, or until they're golden brown and feel light to the touch.",
        "Remove them from the oven, and cool on a rack."
      ]
    }
  ];

  const finalThoughts = [
    "These traditional Kaiser rolls bring authentic European bakery flavor to your kitchen. The distinctive star-shaped pattern isn't just for looks—it helps the rolls maintain their shape and creates the perfect texture.",
    "Serve them warm from the oven or at room temperature. They're perfect for sandwiches, burgers, or simply enjoyed with butter. Store leftover rolls, well wrapped, at room temperature for a couple of days; freeze for longer storage."
  ];

  const nutritionFacts = [
    { nutrient: "Calories", value: "245" },
    { nutrient: "Protein", value: "8g" },
    { nutrient: "Carbs", value: "45g" },
    { nutrient: "Fat", value: "4g" },
    { nutrient: "Fiber", value: "2g" },
    { nutrient: "Sugar", value: "3g" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <RecipeHeader 
          title="Kaiser Rolls"
          date="January 12, 2025"
          author="Terri Briede"
          description="Traditional Austrian-style rolls with their distinctive star-shaped pattern. Perfect for sandwiches or enjoying fresh from the oven with butter."
        />
        
        <div className="my-12">
          <RecipeImage 
            src="/lovable-uploads/fce61684-fea2-4c54-86b5-2e05b69655d5.png"
            alt="Freshly baked Kaiser rolls with golden brown crust and poppy seed topping"
          />
        </div>

        <IngredientsEquipment 
          ingredients={ingredients}
          equipment={equipment}
        />

        <MethodSteps steps={methodSteps} />

        <FinalThoughtsNutrition 
          finalThoughts={finalThoughts}
          nutritionFacts={nutritionFacts}
        />

        <div className="mt-12 p-6 bg-muted rounded-lg">
          <h3 className="text-lg font-semibold mb-3 text-primary">Tips from our Bakers</h3>
          <ul className="space-y-2 text-muted-foreground">
            <li>• If you don't cut the unbaked rolls deeply enough, the shape disappears as they bake; if you cut too deeply (all the way through), the rolls will form "petals" as they rise and look like a daisy, not a kaiser roll.</li>
            <li>• Note that the simplest way to give these rolls their traditional shape is with a kaiser roll stamp. If you don't have a stamp, shape the dough into knots that resemble the classic kaiser roll.</li>
          </ul>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}