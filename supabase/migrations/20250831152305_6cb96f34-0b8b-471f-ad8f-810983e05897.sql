-- Insert Classic Challah Recipe into recipes table using auth system
INSERT INTO public.recipes (
  title,
  slug,
  data,
  image_url,
  tags,
  is_public,
  user_id
) VALUES (
  'Classic Challah Recipe',
  'classic-challah-recipe',
  '{
    "title": "Classic Challah Recipe",
    "introduction": "A traditional, rich challah with a golden crust and tender crumb. This recipe yields about 1650g (3.6 lbs) of dough, perfect for making one large challah or dividing into multiple smaller loaves.",
    "prep_time": "30 minutes",
    "cook_time": "25-30 minutes",
    "total_time": "2 hours 30 minutes",
    "servings": "1 large challah, 2 medium challahs, or 3 smaller challahs",
    "course": "Bread",
    "cuisine": "Jewish",
    "equipment": [
      "Kitchen scale (highly recommended)",
      "Large mixing bowl or stand mixer with dough hook",
      "Clean kitchen towens or plastic wrap",
      "Baking sheet",
      "Parchment paper"
    ],
    "ingredients": [
      {
        "ingredient": "Bread flour or all-purpose flour",
        "amount": "1 kg",
        "volume": "7 cups"
      },
      {
        "ingredient": "Granulated sugar",
        "amount": "100g",
        "volume": "1/2 cup"
      },
      {
        "ingredient": "Salt",
        "amount": "20g",
        "volume": "1 tablespoon"
      },
      {
        "ingredient": "Active dry yeast",
        "amount": "14g",
        "volume": "2 teaspoons"
      },
      {
        "ingredient": "Sunflower oil, canola oil, or olive oil",
        "amount": "100ml",
        "volume": "1/2 cup"
      },
      {
        "ingredient": "Cold water",
        "amount": "440-460ml",
        "volume": "1 3/4 cups plus 2 tablespoons"
      },
      {
        "ingredient": "Large egg yolks (for egg wash)",
        "amount": "2",
        "volume": "2"
      },
      {
        "ingredient": "Sesame seeds (for topping)",
        "amount": "2 tablespoons",
        "volume": "2 tablespoons"
      }
    ],
    "method": [
      {
        "step": 1,
        "title": "Making the Dough",
        "instruction": "Pour all dry ingredients (flour, sugar, salt, and yeast) into a large mixing bowl or the bowl of a stand mixer."
      },
      {
        "step": 2,
        "title": "",
        "instruction": "Add the water and oil to the dry ingredients. If using a stand mixer, attach the dough hook and knead at slow speed for about 2 minutes until the water is completely absorbed."
      },
      {
        "step": 3,
        "title": "",
        "instruction": "For hand kneading: Use one hand to stir the mixture while the other holds the bowl steady. Focus your attention on the dough at this stage, being present is part of the process."
      },
      {
        "step": 4,
        "title": "",
        "instruction": "Once ingredients are fully incorporated, continue kneading at medium speed for 10-13 minutes until you get a flexible, smooth, and soft dough. The dough should not be sticky and not too dry."
      },
      {
        "step": 5,
        "title": "First Rise",
        "instruction": "Shape the dough into a smooth ball and place in a lightly greased bowl. Rub some oil on top of the ball before covering with plastic wrap or a damp kitchen towel."
      },
      {
        "step": 6,
        "title": "",
        "instruction": "Let rise at room temperature until doubled in size. A humid environment will support fermentation and prevent the dough from drying out. A cold room will slow down yeast activity and might extend this stage."
      },
      {
        "step": 7,
        "title": "Dividing the Dough",
        "instruction": "Divide the risen dough into evenly weighted smooth balls. You can make one large challah (use all the dough), two medium challahs (divide in half), or three smaller challahs (divide into thirds). The weight of each portion determines your final loaf size."
      },
      {
        "step": 8,
        "title": "",
        "instruction": "For multiple loaves, divide each portion into the number of strands needed for braiding (typically 3, 4, or 6 strands). For a single large loaf, divide into your desired number of strands. Cover the balls with plastic wrap or a towel for an additional 15-25 minutes."
      },
      {
        "step": 9,
        "title": "Rolling and Braiding",
        "instruction": "Release air from each ball by gently pressing and folding with your hands, then roll into strands."
      },
      {
        "step": 10,
        "title": "",
        "instruction": "If the dough doesn''t roll or stretch properly, don''t force it. This will likely tear the dough and damage the gluten structure. Give it another 3-4 minutes of rest while covered."
      },
      {
        "step": 11,
        "title": "",
        "instruction": "Braid the strands into your desired challah shape. For multiple loaves, repeat the rolling and braiding process for each portion."
      },
      {
        "step": 12,
        "title": "Second Rise and Bake",
        "instruction": "Place your braided challah(s) on a baking sheet lined with parchment paper, leaving space between multiple loaves. Cover with a clean towel and let rise for about 40 minutes until nearly doubled in size."
      },
      {
        "step": 13,
        "title": "",
        "instruction": "Preheat your oven to 180°C (360°F) while the challah rises. Have your oven ready by the time the challah is ready to bake."
      },
      {
        "step": 14,
        "title": "",
        "instruction": "Brush the challah(s) with egg yolk wash and sprinkle with sesame seeds. Using only the yolk gives your loaf a shine and darker golden color."
      },
      {
        "step": 15,
        "title": "",
        "instruction": "Bake for 25-30 minutes until the challah becomes golden brown around the surface. For multiple smaller loaves, check for doneness a few minutes earlier as they may bake faster. Baking temperature and time may vary depending on different ovens and the size of your final product."
      }
    ],
    "tips": [
      "Weighing ingredients with a kitchen scale gives more consistent results than volume measurements due to variations in how ingredients settle in measuring cups.",
      "Professional bakers use scales exclusively for accuracy and reproducibility.",
      "The dough should feel smooth and slightly tacky but not sticky when properly kneaded.",
      "Room temperature affects rising time. Warmer environments speed fermentation, while cooler rooms slow it down.",
      "Don''t rush the process. Proper fermentation develops flavor and texture.",
      "For multiple loaves, you can freeze one after the first rise. Thaw completely before shaping and completing the second rise."
    ],
    "troubleshooting": {
      "dough_too_sticky": "Add a small amount of flour gradually while kneading",
      "dough_too_dry": "Add water one tablespoon at a time",
      "slow_rising": "Check room temperature - move to a warmer location if needed",
      "dense_bread": "Ensure yeast is active and dough has properly doubled during rises"
    }
  }'::jsonb,
  'https://ojyckskucneljvuqzrsw.supabase.co/storage/v1/object/public/blog-images/2025-08/classic-challah-bread-recipe-traditional-six-strand-braid/a-still-life-photograph-capturing-a-beauepijgalorrus84tasukdfqt6w5xxihsb-2aosv7-pvng.png',
  ARRAY['challah recipe', 'homemade challah', 'traditional challah bread', 'jewish bread', 'braided bread'],
  true,
  -- Use the first admin user from profiles table as the recipe owner
  (SELECT user_id FROM public.profiles WHERE is_admin = true LIMIT 1)
);