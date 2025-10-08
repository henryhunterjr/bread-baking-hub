import { supabase } from "@/integrations/supabase/client";

export const addPeachGaletteRecipe = async () => {
  const recipeData = {
    title: "Rustic Peach Galette",
    slug: "rustic-peach-galette",
    imageUrl: "https://ojyckskucneljvuqzrsw.supabase.co/storage/v1/object/public/blog-images/2025-10/peach-gillette/img5129.JPG",
    tags: ["peach", "galette", "dessert", "summer", "fall", "stone fruit", "rustic"],
    folder: "Seasonal",
    isPublic: true,
    data: {
      introduction: "This free-form peach galette delivers summer in every bite with tender, flaky crust wrapped around sweet cinnamon peaches. Made with affordable Jiffy Pie Crust Mix and fresh peaches, it's bakery-quality results without the stress. The secret weapon? A touch of banana extract that brightens the fruit in an unexpected way.",
      summary: "This free-form peach galette delivers summer in every bite with tender, flaky crust wrapped around sweet cinnamon peaches. Made with affordable Jiffy Pie Crust Mix and fresh peaches, it's bakery-quality results without the stress. The secret weapon? A touch of banana extract that brightens the fruit in an unexpected way.",
      description: "This free-form peach galette delivers summer in every bite with tender, flaky crust wrapped around sweet cinnamon peaches. Made with affordable Jiffy Pie Crust Mix and fresh peaches, it's bakery-quality results without the stress. The secret weapon? A touch of banana extract that brightens the fruit in an unexpected way.",
      author_name: "Henry Hunter",
      prepTime: "20 minutes",
      cookTime: "35 minutes",
      totalTime: "55 minutes (plus cooling)",
      serves: "6-8",
      difficulty: "Easy",
      
      ingredients: [
        { section: "For the Filling", items: [
          { ingredient: "ripe peaches, sliced into wedges", metric: "600g", volume: "4 medium" },
          { ingredient: "granulated sugar", metric: "25g", volume: "2 tbsp" },
          { ingredient: "ground cinnamon", metric: "1 tsp", volume: "1 tsp" },
          { ingredient: "cornstarch", metric: "1½ tsp", volume: "1½ tsp" },
          { ingredient: "salt", metric: "pinch", volume: "pinch" },
          { ingredient: "vanilla extract (or banana extract)", metric: "½ tsp", volume: "½ tsp" },
          { ingredient: "cold unsalted butter, cut into small cubes", metric: "15g", volume: "1 tbsp" }
        ]},
        { section: "For the Crust", items: [
          { ingredient: "Jiffy Pie Crust Mix", metric: "255g", volume: "1 box (9 oz)" },
          { ingredient: "cold water", metric: "as directed", volume: "as directed" },
          { ingredient: "all-purpose flour, for rolling", metric: "2-3 tbsp", volume: "2-3 tbsp" }
        ]},
        { section: "For Finishing", items: [
          { ingredient: "large egg, beaten", metric: "1", volume: "1" },
          { ingredient: "turbinado sugar (or coarse sugar)", metric: "2 tbsp", volume: "2 tbsp" }
        ]}
      ],
      
      equipment: [
        "Medium mixing bowl",
        "Rolling pin",
        "Parchment paper",
        "Baking sheet",
        "Pastry brush",
        "Measuring cups and spoons"
      ],
      
      method: [
        {
          title: "Make the crust",
          instructions: [
            "Prepare the Jiffy Pie Crust Mix according to package directions using cold water. Form the dough into a ball, wrap in plastic, and refrigerate for at least 15 minutes while you prepare the filling."
          ]
        },
        {
          title: "Prepare the filling",
          instructions: [
            "In a medium bowl, combine the sliced peaches, sugar, cinnamon, cornstarch, salt, and vanilla or banana extract. Toss gently until the peaches are evenly coated. Set aside."
          ]
        },
        {
          title: "Roll out the dough",
          instructions: [
            "On a lightly floured surface or directly on a sheet of parchment paper, roll the chilled dough into a rough 12-inch circle, about ⅛-inch thick. The edges don't need to be perfect. If using parchment, transfer the whole sheet to a baking sheet."
          ]
        },
        {
          title: "Preheat the oven",
          instructions: [
            "Set your oven to 400°F (200°C)."
          ]
        },
        {
          title: "Assemble the galette",
          instructions: [
            "Spoon the peach filling into the center of the dough, leaving a 2-inch border all around. Arrange the peaches in a single layer if possible. Using the parchment paper to help lift the edges, fold the border of dough up and over the fruit, pleating naturally as you go around. The center should remain open with the peaches visible."
          ]
        },
        {
          title: "Add finishing touches",
          instructions: [
            "Dot the exposed peaches with the small cubes of cold butter. Brush the folded crust edges with the beaten egg, then sprinkle generously with turbinado sugar."
          ]
        },
        {
          title: "Bake",
          instructions: [
            "Place in the preheated oven and bake for 30-40 minutes, until the crust is deep golden brown and the peaches are bubbling. If the crust begins browning too quickly, tent loosely with aluminum foil for the last 10-15 minutes."
          ]
        },
        {
          title: "Cool before serving",
          instructions: [
            "Remove from the oven and let the galette cool completely on the baking sheet, at least 45 minutes to 1 hour. This allows the filling to set properly. Serve at room temperature with vanilla ice cream or whipped cream if desired."
          ]
        }
      ],
      
      notes: [
        "About Jiffy Pie Crust Mix: This budget-friendly mix (usually under a dollar) is made with real lard, which creates an incredibly tender, flaky crust. It's a secret weapon for home bakers who want professional results without making pastry from scratch.",
        "Banana extract: This is the surprise ingredient that makes this galette special. Just a few drops brighten the peach flavor in a way vanilla can't quite match. You can find it in the baking aisle near the vanilla extract. Don't skip it if you can help it.",
        "Peach selection: Choose peaches that are ripe but still slightly firm. Overripe peaches will release too much liquid and make the galette soggy.",
        "Make ahead: You can prepare the dough and filling separately up to a day ahead. Assemble and bake when ready to serve.",
        "Fruit substitutions: Try this with nectarines, plums, apricots, or a mix of stone fruits. Apples and pears work beautifully in fall.",
        "Serving temperature: While warm galette is tempting, it really does need to cool completely so the filling sets. Plan accordingly.",
        "Storage: Cover loosely and store at room temperature for up to 2 days, or refrigerate for up to 4 days. The crust will soften slightly when refrigerated but is still delicious.",
        "Baker's tip: That fold-and-pleat technique is what makes a galette look rustic and handmade. Don't stress about making it perfect. The irregular pleats are part of the charm, and they'll crisp up beautifully in the oven."
      ],
      
      nutrition: {
        servingSize: "1 slice (1/8 of galette)",
        calories: 240,
        carbohydrates: "34g",
        protein: "3g",
        fat: "11g",
        saturatedFat: "4g",
        fiber: "2g",
        sugar: "16g",
        sodium: "180mg"
      }
    }
  };

  const { data, error } = await supabase.functions.invoke('upsert-recipe', {
    body: recipeData
  });

  if (error) {
    console.error('Error adding recipe:', error);
    throw error;
  }

  console.log('Recipe added successfully:', data);
  return data;
};
