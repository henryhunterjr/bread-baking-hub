-- Insert Henry's Braided Round Challah recipe
INSERT INTO public.recipes (
  user_id,
  title,
  slug,
  data,
  image_url,
  tags,
  is_public,
  folder
) VALUES (
  (SELECT user_id FROM profiles LIMIT 1),
  'Henry''s Braided Round Challah',
  'henrys-braided-round-challah',
  '{
    "story": "When I was stationed in Germany, my landlord, Mr. Sherman, ran the bakery downstairs. He was stout, spirited, and full of life—and a bit too smart for his own good. I was a young, healthy, muscular soldier, and he decided to put me to work. He claimed it was to \"keep my rent low,\" but I''m pretty sure he just saw me as cheap labor.\n\nA few days a week, I worked for him in the bakery. It may as well have been Home Depot for all I knew about bread at first. But every Thursday, I''d watch him make his challah, a braided bread so beautiful it practically flew off the shelves.\n\nOne day, I asked him, \"What''s so special about this bread, and why do people only come for it once a week?\"\n\nMr. Sherman paused, looking at me as if he were deciding my fate. Then he said, \"Come here, Henry. Wash your hands.\"\n\nHe put me to work shaping and braiding loaves of challah. I was terrible—clumsy and slow—but he was patient. As we worked, he explained the bread''s significance:\n\n• The braids represent unity, community, and connection.\n• Shaping it into a circle symbolizes the unending cycle of life, renewal, and continuity.\n• The small piece of dough wrapped in aluminum foil and tossed into the back of the oven? It''s an offering, a way to give thanks and honor tradition.\n\nMr. Sherman would say a quiet prayer over the bread before it went into the oven. I had no idea at the time how much this simple act would influence me.\n\nToday, I still say that same prayer and toss a piece of dough wrapped in foil into the back of my oven. It''s my offering, my remembrance of him, and my way of honoring the traditions he shared with me.\n\nMr. Sherman planted a seed in me, and it grew into my passion for baking. I have him to thank for every loaf of bread I make today.\n\nNow, I want to share this special loaf of challah with you—a beautiful braided circle to celebrate life, unity, and tradition. Let''s bake together!",
    "prepTime": "20 minutes (plus rising)",
    "cookTime": "30 minutes", 
    "totalTime": "3 hours",
    "servings": "1 large braided loaf",
    "ingredients": [
      {
        "ingredient": "Bread flour",
        "metric": "500g",
        "volume": "4 cups"
      },
      {
        "ingredient": "Kosher salt",
        "metric": "10g", 
        "volume": "2 tsp"
      },
      {
        "ingredient": "Sugar",
        "metric": "50g",
        "volume": "1/4 cup"
      },
      {
        "ingredient": "Instant yeast",
        "metric": "10g",
        "volume": "2 tsp"
      },
      {
        "ingredient": "Large eggs, room temperature",
        "metric": "2",
        "volume": "2"
      },
      {
        "ingredient": "Egg yolk (reserve white for wash)",
        "metric": "1",
        "volume": "1"
      },
      {
        "ingredient": "Vegetable oil",
        "metric": "60ml",
        "volume": "1/4 cup"
      },
      {
        "ingredient": "Warm water",
        "metric": "175ml",
        "volume": "3/4 cup"
      },
      {
        "ingredient": "Black sesame seeds",
        "metric": "2 tbsp",
        "volume": "2 tbsp"
      },
      {
        "ingredient": "White sesame seeds", 
        "metric": "2 tbsp",
        "volume": "2 tbsp"
      },
      {
        "ingredient": "Flaky sea salt (optional)",
        "metric": "to taste",
        "volume": "to taste"
      },
      {
        "ingredient": "Egg white (for wash)",
        "metric": "1",
        "volume": "1"
      },
      {
        "ingredient": "Water (for wash)",
        "metric": "1 tbsp",
        "volume": "1 tbsp"
      }
    ],
    "equipment": [
      "Large mixing bowl",
      "Stand mixer with dough hook (optional)",
      "Kitchen scale",
      "Measuring cups and spoons",
      "Clean kitchen towel",
      "Parchment paper",
      "Baking sheet",
      "Pastry brush",
      "Aluminum foil (for traditional offering)"
    ],
    "method": [
      {
        "title": "Prepare the Dough",
        "description": "Mix dry ingredients and combine with wet ingredients to form dough.",
        "instructions": [
          "In a large bowl, mix flour, salt, sugar, and yeast.",
          "Add eggs, egg yolk, oil, and warm water. Stir until it forms a shaggy dough.",
          "Knead by hand or with a stand mixer (6–8 minutes) until smooth and elastic."
        ]
      },
      {
        "title": "Let It Rise", 
        "description": "First rise until doubled in size.",
        "instructions": [
          "Place the dough in a greased bowl, cover it, and let it rise in a warm place for 1.5 hours, or until doubled."
        ]
      },
      {
        "title": "Divide and Braid",
        "description": "Shape the dough into a beautiful round braided challah.",
        "instructions": [
          "Punch down the dough and divide it into three equal portions.",
          "Roll each piece into a rope. Coat one rope with black sesame seeds, another with white sesame seeds, and leave one plain.",
          "Braid the ropes, then shape them into a circle, pinching the ends together."
        ]
      },
      {
        "title": "Second Rise",
        "description": "Final rise before baking.",
        "instructions": [
          "Place the braided circle on a parchment-lined baking sheet, cover loosely, and let it rise for 45–60 minutes."
        ]
      },
      {
        "title": "Egg Wash and Bake",
        "description": "Apply egg wash and bake until golden.",
        "instructions": [
          "Preheat your oven to 375°F (190°C).",
          "Mix the egg white with 1 tbsp water and brush it over the dough.",
          "Wrap a small piece of dough in aluminum foil and place in the back of the oven as an offering (traditional).",
          "Bake for 30–35 minutes, until golden brown and hollow-sounding when tapped."
        ]
      },
      {
        "title": "Cool and Serve",
        "description": "Cool completely before slicing.",
        "instructions": [
          "Let the challah cool completely before slicing.",
          "Serve with reverence for the tradition and the hands that taught you."
        ]
      }
    ],
    "nutritionFacts": [
      {
        "nutrient": "Calories",
        "value": "180"
      },
      {
        "nutrient": "Carbs",
        "value": "32g"
      },
      {
        "nutrient": "Protein", 
        "value": "6g"
      },
      {
        "nutrient": "Fat",
        "value": "3g"
      },
      {
        "nutrient": "Fiber",
        "value": "2g"
      },
      {
        "nutrient": "Sugar",
        "value": "4g"
      }
    ],
    "finalThoughts": [
      "The round shape represents the unending cycle of life, unity, and the connection between tradition and modernity. The contrasting sesame braids add both beauty and meaning, celebrating diversity within unity.",
      "This challah carries the memory of Mr. Sherman and the lessons he taught me about bread, tradition, and gratitude. Each loaf is a connection to that sacred moment in a German bakery where my love for baking began.",
      "Bake this challah with intention, and let it carry on the legacy of bread, tradition, and gratitude. 💛"
    ]
  }',
  '/lovable-uploads/7a1809d3-ce2e-4634-b8cb-1c5e9b572bd1.png',
  ARRAY['challah', 'braided', 'holiday', 'traditional', 'sesame'],
  true,
  'Holiday Breads'
);