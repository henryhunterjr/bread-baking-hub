import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Parse command line arguments
const args = process.argv.slice(2);
const isRecipesOnly = args.includes('--recipes-only');

// Add __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Base URL for the site - use environment variable
const BASE_URL = process.env.VITE_SITE_URL || 'https://bakinggreatbread.com';

// Meta data for each route
const routeMetaData = {
  '/': {
    title: 'Baking Great Bread at Home - Expert Guidance for Real Home Bakers',
    description: 'Master the art of bread baking with expert recipes, troubleshooting guides, and a vibrant community led by Henry Hunter.',
    image: 'https://ojyckskucneljvuqzrsw.supabase.co/storage/v1/object/public/blog-images/2025-08/baking-great-bread-at-home-join-our-supportive-baking-community/a-warm-inviting-lifestyle-photograph-sho9sttfiagry2spdvvrlstkqbrxrfijer9-kofpmfryhtg.png'
  },
  '/recipes': {
    title: 'Bread Recipes - Baking Great Bread at Home | The Baker\'s Bench',
    description: 'Discover tested bread recipes from sourdough to sandwich loaves. Master artisan baking with Henry Hunter\'s expert guidance and detailed instructions.',
    image: 'https://ojyckskucneljvuqzrsw.supabase.co/storage/v1/object/public/blog-images/2025-08/bread-recipes-baking-great-bread-at-home-the-bakers-bench/the-bakers-bench2.png'
  },
  '/blog': {
    title: 'Baking Great Bread at Home - Blog, Recipes, Tips and Expert Guidance',
    description: 'Read our latest articles on bread baking techniques, troubleshooting guides, and expert tips from Henry Hunter to master artisan bread making.',
    image: 'https://ojyckskucneljvuqzrsw.supabase.co/storage/v1/object/public/blog-images/2025-08/baking-great-bread-at-home-blog-recipes-tips-and-expert-guidance/untitled-600-x-300-px-1200-x-630-px-1200-x-600-px-1200-x-500-px-1200-x-450-px.png'
  },
  '/recipe-workspace': {
    title: 'Recipe Work Space - AI-Powered Recipe Creation and Formatting Studio',
    description: 'Create and format recipes with our AI-powered studio. Transform your baking ideas into professional recipe cards with expert guidance.',
    image: 'https://ojyckskucneljvuqzrsw.supabase.co/storage/v1/object/public/blog-images/2025-08/recipe-work-space-ai-powered-recipe-creation-and-formatting-studio/sunday-fun-day-1200-x-630-px.png'
  },
  '/troubleshooting': {
    title: 'Troubleshooting - Solve Your Bread Baking Challenges and Problems',
    description: 'Find solutions to common bread baking problems with our comprehensive troubleshooting guide. Expert diagnosis and fixes for perfect bread every time.',
    image: 'https://ojyckskucneljvuqzrsw.supabase.co/storage/v1/object/public/blog-images/2025-08/troubleshooting-solve-your-bread-baking-challenges-and-problems/troubleshooting.png'
  },
  '/glossary': {
    title: 'Glossary - Comprehensive Guide to Bread Baking Terminology',
    description: 'Learn the language of bread baking with our comprehensive glossary. Master essential terms and techniques for successful artisan bread making.',
    image: 'https://ojyckskucneljvuqzrsw.supabase.co/storage/v1/object/public/blog-images/2025-08/glossary-comprehensive-guide-to-bread-baking-terminology/a-social-media-thumbnail-1200x630-pixelslylw5ur6td2zimxwbcfkzgggzrg2opro-rpmbfjdtrga.png'
  },
  '/library': {
    title: 'The Library - Bread Baking Books and Resources Collection',
    description: 'Explore curated bread baking books and resources. Build your knowledge with expert recommendations from Henry Hunter\'s personal library.',
    image: 'https://ojyckskucneljvuqzrsw.supabase.co/storage/v1/object/public/blog-images/2025-08/the-library-bread-baking-books-and-resources-collection/the-library.png'
  },
  '/books': {
    title: 'The Library - Bread Baking Books and Resources Collection',
    description: 'Explore curated bread baking books and resources. Build your knowledge with expert recommendations from Henry Hunter\'s personal library.',
    image: 'https://ojyckskucneljvuqzrsw.supabase.co/storage/v1/object/public/blog-images/2025-08/the-library-bread-baking-books-and-resources-collection/the-library.png'
  },
  '/vitale-starter': {
    title: 'Vitale Sourdough Starter - Baking Bread in 3 Days | Baking Great Bread',
    description: 'Get Vitale starter - baking bread in just 3 days. $14 sachet builds two starters. Professionally dehydrated, monthly tested, guaranteed to work.',
    image: 'https://ojyckskucneljvuqzrsw.supabase.co/storage/v1/object/public/blog-images/2025-08/vitale-dehydrated-sourdough-starter-baking-bread-in-just-3-days/vitale-thumbnail.png'
  }
};

// Routes to generate static files for
const allRoutes = [
  '/',
  '/blog',
  '/recipes',
  '/recipe-workspace',
  '/troubleshooting',
  '/glossary',
  '/library',
  '/books',
  '/vitale-starter'
];

// Filter routes based on CLI flags
const routesToGenerate = isRecipesOnly 
  ? allRoutes.filter(route => route.includes('recipe'))
  : allRoutes;

function generateHtmlForRoute(route, templateContent) {
  const metaData = routeMetaData[route] || routeMetaData['/'];
  const url = `${BASE_URL}${route}`;
  
  return templateContent
    .replace(/__OG_TITLE__/g, metaData.title)
    .replace(/__OG_DESCRIPTION__/g, metaData.description)
    .replace(/__OG_IMAGE__/g, metaData.image)
    .replace(/__OG_URL__/g, url);
}

function createDirectory(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function printBuildReport() {
  console.log('\n📋 BUILD REPORT - GENERATED ROUTES');
  console.log(''.padEnd(80, '='));
  console.log('Route'.padEnd(25) + 'OG Image');
  console.log(''.padEnd(80, '-'));
  
  routesToGenerate.forEach(route => {
    const metaData = routeMetaData[route] || routeMetaData['/'];
    const routeDisplay = route === '/' ? '/index.html' : `${route}/index.html`;
    const imageUrl = metaData.image.slice(0, 50) + (metaData.image.length > 50 ? '...' : '');
    console.log(routeDisplay.padEnd(25) + imageUrl);
  });
  
  console.log(''.padEnd(80, '='));
  console.log(`✅ Generated ${routesToGenerate.length} route(s) with correct meta tags`);
  
  if (isRecipesOnly) {
    console.log('🎯 Recipes-only mode: Only recipe-related routes were regenerated');
  }
}

function buildWithMeta() {
  try {
    const distPath = path.join(__dirname, '..', 'dist');
    const templatePath = path.join(distPath, 'index.html');
    
    console.log(`🔍 Looking for template at: ${templatePath}`);
    
    if (!fs.existsSync(templatePath)) {
      console.error('❌ Template index.html not found in dist folder. Run vite build first.');
      process.exit(1);
    }
    
    const templateContent = fs.readFileSync(templatePath, 'utf8');
    console.log('📄 Template content loaded successfully');
    
    // Verify template has placeholders
    if (!templateContent.includes('__OG_TITLE__')) {
      console.warn('⚠️  Warning: Template does not contain __OG_TITLE__ placeholder');
    }
    
    console.log('🔧 Generating static HTML files with Open Graph meta tags...');
    
    routesToGenerate.forEach(route => {
      try {
        console.log(`🔄 Processing route: ${route}`);
        const htmlContent = generateHtmlForRoute(route, templateContent);
        
        // Verify replacements worked
        if (htmlContent.includes('__OG_TITLE__')) {
          console.warn(`⚠️  Warning: Placeholders still exist in ${route} HTML`);
        }
        
        if (route === '/') {
          // Update the root index.html
          fs.writeFileSync(templatePath, htmlContent);
          console.log(`✅ Generated: /index.html`);
        } else {
          // Create directory structure for the route
          const routePath = path.join(distPath, route);
          console.log(`📁 Creating directory: ${routePath}`);
          createDirectory(routePath);
          
          // Write the HTML file
          const htmlPath = path.join(routePath, 'index.html');
          fs.writeFileSync(htmlPath, htmlContent);
          console.log(`✅ Generated: ${route}/index.html`);
        }
      } catch (error) {
        console.error(`❌ Error processing route ${route}:`, error.message);
        throw error;
      }
    });
    
    console.log('🎉 Static HTML generation complete!');
    console.log('📱 Each route now has proper Open Graph meta tags for social media sharing.');
    console.log(`📊 Total routes processed: ${routesToGenerate.length}`);
    
    // Print build report
    printBuildReport();
    
  } catch (error) {
    console.error('❌ Build script failed:', error.message);
    console.error('Stack trace:', error.stack);
    process.exit(1);
  }
}

// Run the build process
buildWithMeta();