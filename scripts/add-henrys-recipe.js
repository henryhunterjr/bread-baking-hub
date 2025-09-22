// Script to add Henry's Foolproof Sourdough Loaf to Supabase
const SUPABASE_URL = 'https://your-project.supabase.co'; // Will be replaced with actual URL
const UPSERT_RECIPE_URL = '/api/upsert-recipe';

const recipeData = {
  title: "Henry's Foolproof Sourdough Loaf",
  slug: "henrys-foolproof-sourdough-loaf", 
  imageUrl: "/henrys-foolproof-sourdough-crumb.jpg",
  tags: ["sourdough", "bread", "artisan", "fermentation", "high hydration", "foolproof"],
  folder: "Seasonal",
  isPublic: true,
  data: {
    summary: "A simple, reliable, and flavorful sourdough recipe that delivers great results every time. With 75% hydration and a method that prioritizes fermentation and structure, it's as rewarding to make as it is to eat.",
    prepTime: "30 minutes",
    cookTime: "37 minutes", 
    totalTime: "24 hours (including fermentation)",
    serves: "1 loaf (about 16 slices)",
    difficulty: "Intermediate",
    hydration: "75%",
    
    ingredients: [
      { ingredient: "bread flour", metric: "500g", volume: "4 cups" },
      { ingredient: "water, warm", metric: "375g", volume: "1½ cups" },
      { ingredient: "active sourdough starter", metric: "100g", volume: "½ cup" },
      { ingredient: "salt", metric: "10g", volume: "2 tsp" }
    ],
    
    equipment: [
      "Large mixing bowl",
      "Bench scraper",
      "Proofing basket (banneton)", 
      "Dutch oven or Brød & Taylor Baking Shell",
      "Digital scale",
      "Lame or sharp knife for scoring"
    ],
    
    method: [
      {
        title: "Mix & Fermentolyse",
        description: "(10 minutes active, 45 minutes rest)",
        instructions: [
          "In a large bowl, mix flour, water, and sourdough starter until no dry flour remains. Cover and let rest for 45 minutes.",
          "After resting, add the salt and mix by hand using the Rubaud method: Cup your hand and scoop from underneath the dough, lift the dough upward, allowing it to fall back on itself. Repeat for about 10 minutes until the dough looks smooth and holds its shape."
        ]
      },
      {
        title: "Stretch & Fold",
        description: "3 sets every 45 minutes",
        instructions: [
          "Choose between stretch and folds or coil fold method.",
          "Stretch & Fold: Lift one side of the dough upward and fold it over itself. Rotate the bowl and repeat on all four sides.",
          "Coil Fold: Wet your hands, gently lift the center of the dough with both hands, allow the dough to naturally coil under itself as you lift and fold. Rotate the bowl 180 degrees and repeat.",
          "Perform 3 sets, with 45 minutes between each set. By the end, the dough should feel strong, elastic, and less sticky."
        ]
      },
      {
        title: "Shape the Dough",
        instructions: [
          "After the final fold, let the dough rest in the bowl for 30 minutes.",
          "Turn the dough out onto a lightly floured surface, letting gravity help pull it out of the bowl.",
          "Gently stretch the dough into a square without pressing out the gas.",
          "Fold it like a letter: Take the bottom edge and fold it up to the center, stretch the bottom corners outward and fold them inward to slightly overlap, take the top edge, stretch slightly, and fold it down towards the bottom to create a square bundle.",
          "For extra tension: Fold the top corners to the center, repeat with the middle and bottom, then roll the dough up tightly, bottom to top, to form a taut package.",
          "Place the shaped dough seam-side up in a floured proofing basket.",
          "Cover and let it rest on the counter for 1 hour, then refrigerate for 8–24 hours."
        ]
      },
      {
        title: "Preheat & Score", 
        instructions: [
          "Preheat your oven to 475°F (245°C) with your baking vessel inside.",
          "Pro Tip: If you plan intricate scoring, place the dough in the freezer for 15 minutes during the preheat to firm up the surface."
        ]
      },
      {
        title: "Bake",
        instructions: [
          "Remove the dough from the fridge, transfer it to parchment paper or bread sling, and score the top using a lame or sharp knife.",
          "Using the parchment or sling, carefully lower the dough into the preheated baking vessel.",
          "Bake covered for 22 minutes.",
          "Remove the lid and bake uncovered for 10–15 minutes, or until the crust is golden brown and the internal temperature reaches 200°F (93°C).",
          "Let the loaf cool completely before slicing."
        ]
      }
    ],
    
    troubleshooting: [
      { issue: "Dough too sticky", solution: "Use wet hands for handling, practice coil folds" },
      { issue: "Dense loaf", solution: "Underproofed - allow more time during bulk fermentation, ensure starter is active" },
      { issue: "Flat loaf", solution: "Poor shaping or weak gluten - focus on creating tension during shaping, ensure enough stretch & folds" },
      { issue: "Pale crust", solution: "Oven not hot enough - preheat oven and baking vessel thoroughly" }
    ],
    
    nutrition: {
      servingSize: "1 slice (approximately 50g)",
      calories: 110,
      carbohydrates: "22g",
      protein: "4g", 
      fat: "0.5g"
    },
    
    notes: [
      "Hydration: This recipe uses 75% hydration (375g water ÷ 500g flour = 75%), which creates an open crumb structure while remaining manageable.",
      "Timing Flexibility: The cold retard can be extended up to 48 hours for enhanced flavor development."
    ],
    
    categories: ["Bread", "Sourdough", "Artisan Baking"],
    keywords: ["sourdough", "bread", "artisan", "fermentation", "high hydration", "foolproof"]
  }
};

// Function to call the upsert-recipe API
async function addRecipe() {
  try {
    const response = await fetch('/api/upsert-recipe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(recipeData)
    });
    
    if (response.ok) {
      const result = await response.json();
      console.log('Recipe added successfully:', result);
    } else {
      console.error('Failed to add recipe:', response.statusText);
    }
  } catch (error) {
    console.error('Error adding recipe:', error);
  }
}

// Call the function
addRecipe();