// Hero image mapping for blog posts
// Maps blog post slugs to their hero image URLs

export const heroImageMapping: Record<string, string> = {
  // Batch 1 - Featured Images (Entries 1-35)
  "why-summer-changes-your-dough": "/hero-images/why-summer-changes-your-dough.png",
  "proofing-yeasted-dough-guide": "/hero-images/proofing-yeasted-dough-guide.png",
  "blueberry-white-chocolate-chip-scones": "/hero-images/blueberry-white-chocolate-chip-scones.jpg",
  "bulk-fermentation": "/hero-images/bulk-fermentation.png",
  "this-keeps-it-simple-readable-and-keyword-friendly-you-could-add-with-cream-cheese-icing-if-you-want-it-more-specific-but-shorter-urls-are-usually-better-for-seo": "/hero-images/this-keeps-it-simple-readable-and-keyword-friendly-you-could-add-with-cream-cheese-icing-if-you-want-it-more-specific-but-shorter-urls-are-usually-better-for-seo.jpg",
  "hybrid-sourdough-sandwich-bread": "/hero-images/hybrid-sourdough-sandwich-bread.jpg",
  "the-loaf-and-the-lie": "/hero-images/the-loaf-and-the-lie.png",
  "ancient-grain-flour-baking-guide": "/hero-images/ancient-grain-flour-baking-guide.png",
  "the-sourdough-mama-artistic-sourdough-scoring": "/hero-images/the-sourdough-mama-artistic-sourdough-scoring.jpeg",
  "steam-for-sourdough-crust": "/hero-images/steam-for-sourdough-crust.png",
  "vietnamese-banh-mi-baguette": "/hero-images/vietnamese-banh-mi-baguette.webp",
  "rose-burns-bread-baker": "/hero-images/rose-burns-bread-baker.png",
  "homemade-hot-cross-buns%e2%9c%9d%ef%b8%8f": "/hero-images/homemade-hot-cross-buns%e2%9c%9d%ef%b8%8f.jpg",
  "marbled-blueberry-sourdough-recipe": "/hero-images/marbled-blueberry-sourdough-recipe.jpg",
  "member-spotlight-bella-artisan-bread": "/hero-images/member-spotlight-bella-artisan-bread.png",
  "is-sourdough-healthier-than-regular-bread": "/hero-images/is-sourdough-healthier-than-regular-bread.jpg",
  "member-spotlight-debbie-eckerstein": "/hero-images/member-spotlight-debbie-eckerstein.jpg",
  "henrys-blueberry-muffin-bread": "/hero-images/henrys-blueberry-muffin-bread.jpg",
  "priscilla-jolly-chocolate-cherry-sourdough-recipe": "/hero-images/priscilla-jolly-chocolate-cherry-sourdough-recipe.jpg",
  "the-magic-of-yeast-water": "/hero-images/the-magic-of-yeast-water.jpg",
  "brioche-bread-recipe": "/hero-images/brioche-bread-recipe.jpg",
  "sourdough-for-the-rest-of-us-free-download": "/hero-images/sourdough-for-the-rest-of-us-free-download.png",
  "blackberry-orange-galette": "/hero-images/blackberry-orange-galette.jpg",
  "bread-proofing-poke-test": "/hero-images/bread-proofing-poke-test.jpg",
  "crusty-white-bread-recipe": "/hero-images/crusty-white-bread-recipe.png",
  "donnas-baguette-recipe": "/hero-images/donnas-baguette-recipe.png",
  "flour-protein-content-guide": "/hero-images/flour-protein-content-guide.jpeg",
  "onion-poppy-seed-pletzel-recipe": "/hero-images/onion-poppy-seed-pletzel-recipe.jpg",
  "spelt-sourdough-bread": "/hero-images/spelt-sourdough-bread.jpg",
  "artisan-sourdough-bread": "/hero-images/artisan-sourdough-bread.jpg",
  "from-passion-to-profit-a-bakers-guide-to-market-success": "/hero-images/from-passion-to-profit-a-bakers-guide-to-market-success.webp",
  "rosemary-garlic-parmesan-bread": "/hero-images/rosemary-garlic-parmesan-bread.png",
  "versatile-market-yeast-dough": "/hero-images/versatile-market-yeast-dough.webp",
  "homemade-bagel-recipe": "/hero-images/homemade-bagel-recipe.jpg",
  "savory-irish-soda-bread": "/hero-images/savory-irish-soda-bread.jpg",
};

// Function to get hero image URL by slug
export const getHeroImageBySlug = (slug: string): string | null => {
  return heroImageMapping[slug] || null;
};

// Function to get hero image URL with fallback
export const getHeroImageWithFallback = (slug: string, fallback?: string): string => {
  return heroImageMapping[slug] || fallback || '/lovable-uploads/bd157eb8-d847-4f54-913a-8483144ecb46.png';
};