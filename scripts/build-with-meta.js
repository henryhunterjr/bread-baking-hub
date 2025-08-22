import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Add __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Base URL for the site
const BASE_URL = 'https://bread-baking-hub.vercel.app';

// Meta data for each route
const routeMetaData = {
  '/': {
    title: 'Baking Great Bread at Home - Learn Artisan Bread Making Techniques',
    description: 'Master the art of artisan bread making...',
    image: 'https://ojyckskucneljvuqzrsw.supabase.co/storage/v1/object/public/blog-images/2025-08/baking-great-bread-at-home-learn-artisan-bread-making-techniques/a-striking-social-media-thumbnail-advertdfs6eor0shwsglim6-mjqqx5wemn1ftju8rabqm0fmqg.png'
  },
  '/recipes': {
    title: 'Recipes - Delicious Home Cooking Ideas',
    description: 'Explore our collection of tested recipes...',
    image: 'https://ojyckskucneljvuqzrsw.supabase.co/storage/v1/object/public/blog-images/2025-08/recipes-delicious-home-cooking-ideas/recipes-thumbnail.png'
  },
  '/blog': {
    title: 'Baking Great Bread at Home - Blog',
    description: 'Read our latest articles on bread baking...',
    image: 'https://ojyckskucneljvuqzrsw.supabase.co/storage/v1/object/public/blog-images/2025-08/baking-great-bread-at-home-blog/scoring-1200-x-250-px-1280-x-720-px.png'
  },
  '/recipe-workspace': {
    title: 'Recipe Work Space - AI-Powered Recipe Creation',
    description: 'Create and format recipes with our AI-powered studio...',
    image: 'https://ojyckskucneljvuqzrsw.supabase.co/storage/v1/object/public/blog-images/2025-08/recipe-work-space-ai-powered-recipe-creation-and-formatting-studio/sunday-fun-day-1200-x-630-px.png'
  },
  '/vitale-starter': {
    title: 'Vitale - Dehydrated Sourdough Starter',
    description: 'Baking bread in just 3 days with Vitale...',
    image: 'https://ojyckskucneljvuqzrsw.supabase.co/storage/v1/object/public/blog-images/2025-08/vitale-dehydrated-sourdough-starter-baking-bread-in-just-3-days/vitale-thumbnail.png'
  },
  '/glossary': {
    title: 'Glossary - Comprehensive Guide to Bread Baking Terminology',
    description: 'Learn the language of bread baking...',
    image: 'https://ojyckskucneljvuqzrsw.supabase.co/storage/v1/object/public/blog-images/2025-08/glossary-comprehensive-guide-to-bread-baking-terminology/a-social-media-thumbnail-1200x630-pixelslylw5ur6td2zimxwbcfkzgggzrg2opro-rpmbfjdtrga.png'
  },
  '/community': {
    title: 'Baking Great Bread at Home - Join Our Supportive Baking Community',
    description: 'Connect with fellow bakers...',
    image: 'https://ojyckskucneljvuqzrsw.supabase.co/storage/v1/object/public/blog-images/2025-08/baking-great-bread-at-home-join-our-supportive-baking-community/a-warm-inviting-lifestyle-photograph-sho9sttfiagry2spdvvrlstkqbrxrfijer9-kofpmfryhtg.png'
  },
  '/troubleshooting': {
    title: 'Troubleshooting - Solve Your Bread Baking Challenges',
    description: 'Find solutions to common bread baking problems...',
    image: 'https://ojyckskucneljvuqzrsw.supabase.co/storage/v1/object/public/blog-images/2025-08/troubleshooting-solve-your-bread-baking-challenges-and-problems/troubleshooting.png'
  },
  '/books': {
    title: 'The Library - Bread Baking Books and Resources Collection',
    description: 'Your personal recipe collection...',
    image: 'https://ojyckskucneljvuqzrsw.supabase.co/storage/v1/object/public/blog-images/2025-08/the-library-bread-baking-books-and-resources-collection/the-library.png'
  }
};

// Routes to generate static files for
const routesToGenerate = [
  '/',
  '/blog',
  '/recipes',
  '/recipe-workspace',
  '/vitale-starter',
  '/glossary',
  '/community',
  '/troubleshooting',
  '/books'
];

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
    
  } catch (error) {
    console.error('❌ Build script failed:', error.message);
    console.error('Stack trace:', error.stack);
    process.exit(1);
  }
}

// Run the build process
buildWithMeta();