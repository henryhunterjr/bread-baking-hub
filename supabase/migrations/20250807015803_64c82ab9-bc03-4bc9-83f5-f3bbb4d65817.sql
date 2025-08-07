-- Add the cardamom cinnamon rolls recipe
INSERT INTO public.recipes (
  title,
  slug,
  image_url,
  user_id,
  data,
  is_public
) VALUES (
  'Cardamom-Infused Cinnamon Rolls with Yudane Method',
  'cardamom-cinnamon-rolls-yudane',
  '/lovable-uploads/bca1f5ec-c093-48fd-a358-8fb28129daf5.png',
  'your-user-id-here', -- This will need to be replaced with actual user ID
  '{
    "introduction": "This cardamom-infused cinnamon rolls recipe showcases the Yudane method for irresistibly soft, flavorful rolls. These aromatic, fluffy rolls blend the warmth of cardamom with the comfort of cinnamon for a bakery-quality result that stays fresh for days. Perfect for elevating any brunch or special occasion with a unique, handcrafted touch.",
    "prep_time": "2 hours 20 minutes",
    "cook_time": "23 minutes", 
    "total_time": "2 hours 43 minutes",
    "servings": "6 rolls",
    "course": "Dessert",
    "cuisine": "Fusion",
    "calories": "428 kcal",
    "equipment": [
      "Mixing bowls",
      "Measuring cups and spoons", 
      "Baking tray with non-stick paper",
      "Rolling Pin",
      "Pastry brush",
      "Oven"
    ],
    "ingredients": [
      {
        "section": "For the Yudane:",
        "items": [
          "100 g white bread flour",
          "100 ml boiling water"
        ]
      },
      {
        "section": "For the Dough:",
        "items": [
          "200 g white bread flour",
          "60 ml cold water",
          "30 g sugar",
          "4 g instant dry yeast / 4.8g active dry yeast / 12g fresh yeast",
          "5 g salt",
          "60 g softened butter",
          "1 egg yolk"
        ]
      },
      {
        "section": "For the Filling:",
        "items": [
          "70 g sugar",
          "6 g cinnamon",
          "4 g ground cardamom",
          "40 g softened butter"
        ]
      },
      {
        "section": "For the Frosting:",
        "items": [
          "160 g icing sugar",
          "50 g full-fat cream cheese",
          "20 g softened butter",
          "6 g vanilla paste",
          "2 ml water (optional)"
        ]
      }
    ],
    "instructions": [
      "Mix flour and boiling water for Yudane. Cover and cool.",
      "Combine cold water, yeast, salt, sugar, and egg yolk in a bowl.",
      "Add flour, mix into dough. Knead for 3 minutes.",
      "Incorporate butter, knead for 3 minutes.",
      "Add yudane, knead for 3 minutes.",
      "Rest covered dough for 30 minutes.",
      "Roll dough, brush with butter, sprinkle sugar, cinnamon, and cardamom.",
      "Roll up, cut into 6 pieces.",
      "Place on tray, proof for 2 hours.",
      "Preheat oven to 160°C (320°F) in final fermentation hour.",
      "Brush rolls with egg white, bake for 23 minutes.",
      "Cool before adding frosting."
    ],
    "notes": [
      "Use high-quality cardamom for the best flavor impact",
      "The Yudane method creates an exceptionally soft texture—don''t skip it",
      "Brush with egg wash for a golden-brown finish",
      "These cinnamon rolls freeze beautifully for up to 2 months",
      "Experiment with other spices like nutmeg or star anise for a twist"
    ],
    "keywords": ["Cardamom", "Cinnamon", "Yudane", "Fusion Baking", "Rolls"]
  }'::jsonb,
  true
);