import { supabase } from '@/integrations/supabase/client';

interface SitemapEntry {
  url: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

export const generateSitemap = async (): Promise<string> => {
  const baseUrl = 'https://bread-baking-hub.vercel.app';
  
  const entries: SitemapEntry[] = [
    // Static pages
    { url: '/', changefreq: 'weekly', priority: 1.0 },
    { url: '/about', changefreq: 'monthly', priority: 0.8 },
    { url: '/books', changefreq: 'monthly', priority: 0.9 },
    { url: '/blog', changefreq: 'daily', priority: 0.9 },
    { url: '/recipes', changefreq: 'weekly', priority: 0.8 },
    { url: '/troubleshooting', changefreq: 'weekly', priority: 0.8 },
    { url: '/crust-and-crumb', changefreq: 'weekly', priority: 0.7 },
    { url: '/vitale-starter', changefreq: 'monthly', priority: 0.7 },
    { url: '/henrys-foolproof-recipe', changefreq: 'monthly', priority: 0.8 },
    { url: '/glossary', changefreq: 'monthly', priority: 0.6 },
    { url: '/bread-calculator', changefreq: 'monthly', priority: 0.6 },
    { url: '/community', changefreq: 'weekly', priority: 0.6 },
    { url: '/legal', changefreq: 'yearly', priority: 0.3 },
  ];

  try {
    // Add public recipes
    const { data: publicRecipes } = await supabase
      .from('recipes')
      .select('slug, created_at')
      .eq('is_public', true)
      .not('slug', 'is', null);

    if (publicRecipes) {
      publicRecipes.forEach(recipe => {
        entries.push({
          url: `/recipes/${recipe.slug}`,
          lastmod: recipe.created_at,
          changefreq: 'monthly',
          priority: 0.6
        });
      });
    }

    // Add blog posts (you'll need to implement blog post fetching)
    // This would require fetching from your blog API
    
  } catch (error) {
    console.error('Error generating sitemap:', error);
  }

  // Generate XML
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.map(entry => `  <url>
    <loc>${baseUrl}${entry.url}</loc>
    ${entry.lastmod ? `<lastmod>${new Date(entry.lastmod).toISOString().split('T')[0]}</lastmod>` : ''}
    ${entry.changefreq ? `<changefreq>${entry.changefreq}</changefreq>` : ''}
    ${entry.priority ? `<priority>${entry.priority}</priority>` : ''}
  </url>`).join('\n')}
</urlset>`;

  return xml;
};

export const generateRobotsTxt = (): string => {
  const baseUrl = 'https://bread-baking-hub.vercel.app';
  
  return `User-agent: *
Allow: /

# Important pages
Allow: /blog
Allow: /books
Allow: /recipes
Allow: /troubleshooting

# Disallow admin/auth pages
Disallow: /auth
Disallow: /dashboard
Disallow: /my-recipes

# Sitemap
Sitemap: ${baseUrl}/sitemap.xml`;
};