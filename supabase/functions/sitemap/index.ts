import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    const baseUrl = 'https://bakinggreatbread.com'
    
    // Static pages with priorities
    const staticPages = [
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
    ]

    let allUrls = [...staticPages]

    // Add public recipes
    const { data: publicRecipes } = await supabase
      .from('recipes')
      .select('slug, created_at, updated_at')
      .eq('is_public', true)
      .not('slug', 'is', null)

    if (publicRecipes) {
      publicRecipes.forEach(recipe => {
        allUrls.push({
          url: `/r/${recipe.slug}`,
          lastmod: recipe.updated_at || recipe.created_at,
          changefreq: 'monthly',
          priority: 0.6
        })
      })
    }

    // Add published blog posts
    const { data: blogPosts } = await supabase
      .from('blog_posts')
      .select('slug, published_at, updated_at')
      .eq('is_draft', false)
      .not('slug', 'is', null)

    if (blogPosts) {
      blogPosts.forEach(post => {
        allUrls.push({
          url: `/blog/${post.slug}`,
          lastmod: post.updated_at || post.published_at,
          changefreq: 'monthly',
          priority: 0.7
        })
      })
    }

    // Generate sitemap XML
    const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls.map(page => `  <url>
    <loc>${baseUrl}${page.url}</loc>
    ${page.lastmod ? `<lastmod>${new Date(page.lastmod).toISOString().split('T')[0]}</lastmod>` : ''}
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`

    return new Response(sitemapXml, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
      },
    })

  } catch (error) {
    console.error('Sitemap generation error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})