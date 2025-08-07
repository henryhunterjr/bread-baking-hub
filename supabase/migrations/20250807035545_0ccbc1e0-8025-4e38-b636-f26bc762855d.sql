-- Insert Henry's Braided Round Challah recipe
INSERT INTO public.recipes (
  user_id,
  title,
  slug,
  folder,
  is_public,
  image_url,
  tags,
  data
) VALUES (
  '5e21e6bd-e67b-42e3-8ae5-76aad55b5d37'::uuid,
  'Henry''s Braided Round Challah',
  'special-round-challah',
  'Seasonal',
  true,
  '/lovable-uploads/4f6e652b-3a86-4d5b-88df-09a47e2fe7f7.png',
  ARRAY['challah', 'braided bread', 'holiday bread', 'traditional bread', 'sesame seeds'],
  '{
    "season": "Winter",
    "holidays": ["Shabbat", "Holidays", "Traditional Celebrations"],
    "featuredDates": {"start": "11-01", "end": "02-28"},
    "category": ["enriched", "holiday bread"],
    "occasion": ["Shabbat", "Holiday Dinners", "Family Gatherings"],
    "prepTime": "20 minutes (plus rising)",
    "bakeTime": "30-35 minutes", 
    "totalTime": "3 hours",
    "difficulty": "intermediate",
    "yield": "1 large braided loaf",
    "ingredients": [
      "500g (4 cups) bread flour",
      "10g (2 tsp) kosher salt",
      "50g (1/4 cup) sugar", 
      "10g (2 tsp) instant yeast",
      "2 large eggs, room temperature",
      "1 egg yolk (reserve white for egg wash)",
      "60ml (1/4 cup) vegetable oil",
      "175ml (3/4 cup) warm water",
      "2 tbsp black sesame seeds",
      "2 tbsp white sesame seeds",
      "Optional: flaky sea salt",
      "For egg wash: 1 egg white + 1 tbsp water"
    ],
    "method": [
      "**Prepare the Dough:** In a large bowl, mix flour, salt, sugar, and yeast. Add eggs, egg yolk, oil, and warm water. Stir until it forms a shaggy dough. Knead by hand or with a stand mixer (6–8 minutes) until smooth and elastic.",
      "**Let It Rise:** Place the dough in a greased bowl, cover it, and let it rise in a warm place for 1.5 hours, or until doubled.",
      "**Divide and Braid:** Punch down the dough and divide it into three equal portions. Roll each piece into a rope. Coat one rope with black sesame seeds, another with white sesame seeds, and leave one plain. Braid the ropes, then shape them into a circle, pinching the ends together.",
      "**Second Rise:** Place the braided circle on a parchment-lined baking sheet, cover loosely, and let it rise for 45–60 minutes.", 
      "**Egg Wash and Bake:** Preheat your oven to 375°F (190°C). Mix the egg white with 1 tbsp water and brush it over the dough. Bake for 30–35 minutes, until golden brown and hollow-sounding when tapped.",
      "**Cool and Serve:** Let the challah cool completely before slicing."
    ],
    "notes": "**The Story Behind My Challah:** When I was stationed in Germany, my landlord Mr. Sherman ran the bakery downstairs. He taught me that the braids represent unity, community, and connection. Shaping it into a circle symbolizes the unending cycle of life, renewal, and continuity. The small piece of dough wrapped in aluminum foil and tossed into the back of the oven is an offering, a way to give thanks and honor tradition. Today, I still say that same prayer and toss a piece of dough wrapped in foil into the back of my oven. **Why a Circle?** The round shape represents the unending cycle of life, unity, and the connection between tradition and modernity. The contrasting sesame braids add both beauty and meaning, celebrating diversity within unity.",
    "equipment": ["Large mixing bowl", "Stand mixer (optional)", "Clean kitchen towels", "Parchment paper", "Baking sheet", "Pastry brush"]
  }'::jsonb
);