import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS for debugging
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { slug } = req.query;

  if (!slug || typeof slug !== 'string') {
    console.error('Missing slug in query:', req.query);
    return res.status(400).send('Missing recipe slug');
  }
  
  console.log('Processing recipe share for slug:', slug);

  try {
    // Fetch recipe data from Supabase
    const supabaseUrl = 'https://ojyckskucneljvuqzrsw.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9qeWNrc2t1Y25lbGp2dXF6cnN3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY3NDI0MTUsImV4cCI6MjA1MjMxODQxNX0.-Bx7Y0d_aMcHakE27Z5QKriY6KPpG1m8n0uuLaamFfY';

    const response = await fetch(
      `${supabaseUrl}/rest/v1/recipes?slug=eq.${encodeURIComponent(slug)}&is_public=eq.true&select=*`,
      {
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
        },
      }
    );

    const recipes = await response.json();

    if (!recipes || recipes.length === 0) {
      return res.status(404).send('Recipe not found');
    }

    const recipe = recipes[0];
    const title = recipe.title || 'Recipe';
    const description = recipe.data?.description || recipe.data?.summary || `Check out this recipe: ${title}`;
    
    // Priority: social_image_url → inline_image_url → hero_image_url → image_url → default
    const socialImageUrl = recipe.data?.social_image_url;
    const inlineImageUrl = recipe.data?.inline_image_url;
    const heroImageUrl = recipe.data?.hero_image_url;
    const imageUrl = socialImageUrl || inlineImageUrl || heroImageUrl || recipe.image_url || 'https://bakinggreatbread.com/og/default.jpg';
    
    const url = `https://bakinggreatbread.com/recipes/${slug}`;
    const updatedAt = recipe.updated_at ? new Date(recipe.updated_at).getTime() : Date.now();

    // Ensure absolute image URL with cache buster
    const absoluteImageUrl = imageUrl.startsWith('http') 
      ? `${imageUrl}?v=${updatedAt}` 
      : `https://bakinggreatbread.com${imageUrl}?v=${updatedAt}`;

    // Generate HTML with OG tags
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  
  <!-- Basic SEO -->
  <title>${title} | Baking Great Bread</title>
  <meta name="description" content="${description.substring(0, 160)}">
  <link rel="canonical" href="${url}">
  
  <!-- Facebook App ID -->
  <meta property="fb:app_id" content="1511662243358762" />
  
  <!-- Open Graph -->
  <meta property="og:type" content="article">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description.substring(0, 160)}">
  <meta property="og:url" content="${url}">
  <meta property="og:site_name" content="Baking Great Bread">
  <meta property="og:image" content="${absoluteImageUrl}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="${title}">
  
  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${title}">
  <meta name="twitter:description" content="${description.substring(0, 160)}">
  <meta name="twitter:image" content="${absoluteImageUrl}">
  <meta name="twitter:image:alt" content="${title}">
  <meta name="twitter:creator" content="@bakinggreatbread">
  
  <!-- Redirect to actual page -->
  <meta http-equiv="refresh" content="0;url=${url}">
  <script>window.location.href = "${url}";</script>
</head>
<body>
  <p>Redirecting to <a href="${url}">${title}</a>...</p>
</body>
</html>
    `.trim();

    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=3600');
    return res.status(200).send(html);
  } catch (error) {
    console.error('Error generating recipe share page:', error);
    return res.status(500).send('Internal server error');
  }
}
