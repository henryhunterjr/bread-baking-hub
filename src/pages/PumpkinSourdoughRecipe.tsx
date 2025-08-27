import { Helmet } from 'react-helmet-async';
import heroImage from '@/assets/recipes/pumpkin-sourdough-hero.jpg';
import mixingImage from '@/assets/recipes/pumpkin-sourdough-mixing.jpg';
import twineSetupImage from '@/assets/recipes/pumpkin-sourdough-twine-setup.jpg';
import bannetonImage from '@/assets/recipes/pumpkin-sourdough-banneton.jpg';
import shapingImage from '@/assets/recipes/pumpkin-sourdough-shaping.jpg';
import scoringImage from '@/assets/recipes/pumpkin-sourdough-scoring.jpg';
import bakedImage from '@/assets/recipes/pumpkin-sourdough-baked.jpg';

export default function PumpkinSourdoughRecipe() {
  const recipeData = {
    title: "Pumpkin Shaped Sourdough Loaf",
    subtitle: "Festive pumpkin sourdough tied with twine and finished with a cinnamon stick stem.",
    description: "Pumpkin sourdough shaped with kitchen twine into a pumpkin, then finished with a cinnamon stick stem. Perfect fall centerpiece bread.",
    yield: "1 loaf (8–10 slices)",
    times: {
      prepTime: "PT30M",
      cookTime: "PT45M",
      totalTime: "PT6H"
    },
    ingredients: [
      "350 g bread flour (about 2 3/4–3 cups)",
      "100 g whole wheat flour (about 3/4–1 cup)", 
      "150 g active sourdough starter, 100% hydration (about 2/3 cup)",
      "200 g pumpkin purée, unsweetened (about 3/4 cup + 1 tbsp)",
      "150–170 g water to start (about 2/3–3/4 cup)",
      "9 g fine sea salt (about 1 1/2 tsp)",
      "1–2 tsp pumpkin pie spice or cinnamon (optional)"
    ],
    instructions: [
      {
        name: "Mix & Autolyse",
        text: "Whisk pumpkin purée and water (start at 150 g) until smooth, then mix in the starter. Add both flours and mix until no dry bits remain. Rest 30–40 minutes.",
        image: mixingImage
      },
      {
        name: "Add Salt", 
        text: "Sprinkle in salt (and spice if using). Pinch and fold to incorporate until even."
      },
      {
        name: "Bulk Fermentation",
        text: "3–4 hours at 75°F/24°C with 3–4 coil folds in the first 2 hours. Target ~50% rise."
      },
      {
        name: "Prepare Twine",
        text: "Lay 4–6 strands of food-safe twine in a star pattern. Flour banneton and surface.",
        image: twineSetupImage
      },
      {
        name: "Shape & Tie", 
        text: "Shape a tight boule, place on twine, and tie gently over the top.",
        image: shapingImage
      },
      {
        name: "Proof",
        text: "Place seam down in banneton. Proof 2–4 hours or cold proof 8–12 hours."
      },
      {
        name: "Score",
        text: "Turn out, dust, and score leaf shapes between twine lines.",
        image: scoringImage
      },
      {
        name: "Bake",
        text: "Bake in preheated Dutch oven: 20 minutes covered at 475°F, then 20–25 minutes uncovered at 450°F.",
        image: bakedImage
      },
      {
        name: "Finish",
        text: "Remove twine while warm. Insert a cinnamon stick as the stem. Cool fully before slicing."
      }
    ]
  };

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Recipe",
    "name": recipeData.title,
    "description": recipeData.description,
    "image": [heroImage],
    "author": { "@type": "Person", "name": "Henry Hunter" },
    "recipeCuisine": "American",
    "recipeCategory": "Bread",
    "keywords": "sourdough, pumpkin, fall baking, centerpiece bread",
    "recipeYield": recipeData.yield,
    "prepTime": recipeData.times.prepTime,
    "cookTime": recipeData.times.cookTime,
    "totalTime": recipeData.times.totalTime,
    "recipeIngredient": recipeData.ingredients,
    "recipeInstructions": recipeData.instructions.map(instruction => ({
      "@type": "HowToStep",
      "name": instruction.name,
      "text": instruction.text,
      ...(instruction.image && { "image": instruction.image })
    }))
  };

  return (
    <>
      <Helmet>
        <title>{recipeData.title} | Baking Great Bread</title>
        <meta name="description" content={recipeData.description} />
        <meta name="keywords" content="sourdough, pumpkin, fall baking, centerpiece bread, bread recipe" />
        <link rel="canonical" href="https://bread-baking-hub.vercel.app/recipes/pumpkin-shaped-sourdough-loaf" />
        
        {/* Open Graph */}
        <meta property="og:type" content="article" />
        <meta property="og:title" content={recipeData.title} />
        <meta property="og:description" content={recipeData.description} />
        <meta property="og:image" content={heroImage} />
        <meta property="og:url" content="https://bread-baking-hub.vercel.app/recipes/pumpkin-shaped-sourdough-loaf" />
        <meta property="og:site_name" content="Baking Great Bread" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={recipeData.title} />
        <meta name="twitter:description" content="Tie it, bake it, crown it. The perfect fall showstopper." />
        <meta name="twitter:image" content={heroImage} />
        
        {/* JSON-LD Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>

      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative h-[60vh] min-h-[400px] overflow-hidden">
          <img 
            src={heroImage} 
            alt="Pumpkin-shaped sourdough loaf with cinnamon stick stem"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <div className="text-center text-white max-w-4xl px-4">
              <h1 className="text-4xl md:text-6xl font-bold mb-4">{recipeData.title}</h1>
              <p className="text-xl md:text-2xl text-white/90">{recipeData.subtitle}</p>
            </div>
          </div>
        </section>

        {/* Recipe Content */}
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Recipe Meta */}
          <div className="bg-muted rounded-lg p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div>
                <h3 className="font-semibold text-foreground">Prep Time</h3>
                <p className="text-muted-foreground">30 minutes</p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Cook Time</h3>
                <p className="text-muted-foreground">45 minutes</p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Yield</h3>
                <p className="text-muted-foreground">{recipeData.yield}</p>
              </div>
            </div>
          </div>

          {/* Ingredients */}
          <section className="mb-8">
            <h2 className="text-3xl font-bold mb-4 text-foreground">Ingredients</h2>
            <ul className="space-y-2">
              {recipeData.ingredients.map((ingredient, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  <span className="text-foreground">{ingredient}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 p-4 bg-accent/20 rounded-lg">
              <p className="text-sm text-muted-foreground">
                <strong>Baker's math (effective):</strong> Treat pumpkin as 85% water. With 150 g water, effective hydration is ~75%. 
                Increase toward 170 g only if dough is tight. This keeps the twine-tied loaf from spreading.
              </p>
            </div>
          </section>

          {/* Method */}
          <section className="mb-8">
            <h2 className="text-3xl font-bold mb-6 text-foreground">Method</h2>
            <div className="space-y-8">
              {recipeData.instructions.map((step, index) => (
                <div key={index} className="border-l-4 border-primary pl-6">
                  <h3 className="text-xl font-semibold mb-2 text-foreground">
                    {index + 1}. {step.name}
                  </h3>
                  <p className="text-muted-foreground mb-4">{step.text}</p>
                  {step.image && (
                    <img 
                      src={step.image}
                      alt={`Step ${index + 1}: ${step.name}`}
                      className="w-full max-w-md rounded-lg shadow-md"
                    />
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Notes */}
          <section className="mb-8">
            <h2 className="text-3xl font-bold mb-4 text-foreground">Notes</h2>
            <div className="bg-accent/20 rounded-lg p-6">
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  <span className="text-foreground">If dough feels slack, keep water at 150 g, add an extra coil fold, and extend cold proof.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  <span className="text-foreground">Dust with flour before baking for bold segment contrast.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  <span className="text-foreground">Twine should be food-safe cotton. Remove before serving.</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Equipment */}
          <section className="mb-8">
            <h2 className="text-3xl font-bold mb-4 text-foreground">Equipment</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {[
                "4–5 qt Dutch oven",
                "Food-safe cotton kitchen twine (4–6 strands)", 
                "Round banneton, well floured",
                "Parchment paper",
                "Lame or razor",
                "Large bowl or tub",
                "Digital scale",
                "Cinnamon stick (stem)"
              ].map((item, index) => (
                <div key={index} className="flex items-center">
                  <span className="text-primary mr-2">✓</span>
                  <span className="text-foreground">{item}</span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </>
  );
}