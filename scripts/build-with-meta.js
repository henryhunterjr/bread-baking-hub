const fs = require('fs');
const path = require('path');

// Base URL for the site
const BASE_URL = 'https://bread-baking-hub.vercel.app';

// Meta data for each route
const routeMetaData = {
  '/': {
    title: 'Baking Great Bread at Home – Recipes, Tools & Community Hub',
    description: 'Proven recipes and expert techniques for exceptional homemade bread.',
    image: 'https://ojyckskucneljvuqzrsw.supabase.co/storage/v1/object/public/blog-images/2025-07/baking-great-bread-at-home-blog/optimizeduploadedbreadhero.avif'
  },
  '/blog': {
    title: 'Bread Baking Blog | Baking Great Bread',
    description: 'Expert bread baking tips, techniques, and recipes from professional baker Henry Hunter.',
    image: 'https://ojyckskucneljvuqzrsw.supabase.co/storage/v1/object/public/blog-images/2025-07/baking-great-bread-at-home-blog/optimizeduploadedbreadhero.avif'
  },
  '/recipes': {
    title: 'Bread Recipes Collection | Baking Great Bread',
    description: 'Discover our collection of proven bread recipes from basic loaves to artisan masterpieces.',
    image: 'https://bread-baking-hub.vercel.app/lovable-uploads/43da7651-de36-46f7-ab6a-22e594aed31b.png'
  },
  '/about': {
    title: 'About Henry Hunter | Baking Great Bread',
    description: 'Learn about Henry Hunter and his passion for teaching exceptional bread baking techniques.',
    image: 'https://bread-baking-hub.vercel.app/lovable-uploads/c851e2b3-f2f7-4b52-9e98-d4e6f7c44ff8.png'
  },
  '/contact': {
    title: 'Contact Us | Baking Great Bread',
    description: 'Get in touch with us for bread baking questions, feedback, or collaboration opportunities.',
    image: 'https://bread-baking-hub.vercel.app/lovable-uploads/43da7651-de36-46f7-ab6a-22e594aed31b.png'
  },
  '/workspace': {
    title: 'Bread Baking Workspace | Baking Great Bread',
    description: 'Your personal bread baking workspace with recipes, tools, and progress tracking.',
    image: 'https://bread-baking-hub.vercel.app/lovable-uploads/e9d4e95a-2202-46e4-9b07-ae4646daff63.png'
  },
  '/vitale-starter': {
    title: 'Vitale Sourdough Starter | Baking Great Bread',
    description: 'Get your foolproof sourdough starter system that guarantees perfect bread every time.',
    image: 'https://bread-baking-hub.vercel.app/lovable-uploads/vitale-starter-social.png'
  },
  '/my-recipes': {
    title: 'My Recipe Library | Baking Great Bread',
    description: 'Save and organize your favorite bread recipes in your personal library.',
    image: 'https://bread-baking-hub.vercel.app/lovable-uploads/43da7651-de36-46f7-ab6a-22e594aed31b.png'
  },
  '/loaf-and-lie': {
    title: 'Loaf & Lie Audiobook | Baking Great Bread',
    description: 'Listen to the captivating audiobook about bread baking adventures and mysteries.',
    image: 'https://bread-baking-hub.vercel.app/lovable-uploads/a95e5824-e4a5-4592-a465-9ea4df7c5488.png'
  },
  '/tools': {
    title: 'Bread Baking Tools & Equipment | Baking Great Bread',
    description: 'Essential tools and equipment recommendations for perfect bread baking at home.',
    image: 'https://bread-baking-hub.vercel.app/lovable-uploads/43da7651-de36-46f7-ab6a-22e594aed31b.png'
  }
};

// Routes to generate static files for
const routesToGenerate = [
  '/',
  '/blog',
  '/recipes', 
  '/about',
  '/contact',
  '/workspace',
  '/vitale-starter',
  '/my-recipes',
  '/loaf-and-lie',
  '/tools'
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
  const distPath = path.join(__dirname, '..', 'dist');
  const templatePath = path.join(distPath, 'index.html');
  
  if (!fs.existsSync(templatePath)) {
    console.error('Template index.html not found in dist folder. Run vite build first.');
    process.exit(1);
  }
  
  const templateContent = fs.readFileSync(templatePath, 'utf8');
  
  console.log('🔧 Generating static HTML files with Open Graph meta tags...');
  
  routesToGenerate.forEach(route => {
    const htmlContent = generateHtmlForRoute(route, templateContent);
    
    if (route === '/') {
      // Update the root index.html
      fs.writeFileSync(templatePath, htmlContent);
      console.log(`✅ Generated: /index.html`);
    } else {
      // Create directory structure for the route
      const routePath = path.join(distPath, route);
      createDirectory(routePath);
      
      // Write the HTML file
      const htmlPath = path.join(routePath, 'index.html');
      fs.writeFileSync(htmlPath, htmlContent);
      console.log(`✅ Generated: ${route}/index.html`);
    }
  });
  
  console.log('🎉 Static HTML generation complete!');
  console.log('📱 Each route now has proper Open Graph meta tags for social media sharing.');
}

// Run the build process
buildWithMeta();