import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS for debugging
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const siteUrl = 'https://bakinggreatbread.com';
  const pageUrl = `${siteUrl}/salt-converter`;
  const imageUrl = `${siteUrl}/lovable-uploads/salt-converter-hero.png`;

  // Generate HTML with Open Graph tags
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Salt Conversion Chart for Bakers | Baking Great Bread</title>
  <meta name="description" content="Free salt converter tool - Not all salt weighs the same. Convert between table salt, sea salt, and kosher salt for perfect baking measurements." />
  
  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="website" />
  <meta property="og:url" content="${pageUrl}" />
  <meta property="og:title" content="Salt Conversion Chart for Bakers" />
  <meta property="og:description" content="Free salt converter tool - Not all salt weighs the same. Convert between table salt, sea salt, and kosher salt." />
  <meta property="og:site_name" content="Baking Great Bread" />
  <meta property="og:image" content="${imageUrl}" />
  <meta property="og:image:secure_url" content="${imageUrl}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:image:alt" content="Salt Conversion Chart showing different types of salt and measuring equivalents" />
  <meta property="og:locale" content="en_US" />
  
  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Salt Conversion Chart for Bakers" />
  <meta name="twitter:description" content="Free salt converter tool - Not all salt weighs the same. Convert between table salt, sea salt, and kosher salt." />
  <meta name="twitter:image" content="${imageUrl}" />
  <meta name="twitter:image:alt" content="Salt Conversion Chart showing different types of salt and measuring equivalents" />
  
  <!-- Redirect after metadata is scraped -->
  <meta http-equiv="refresh" content="0;url=${pageUrl}" />
  <link rel="canonical" href="${pageUrl}" />
</head>
<body>
  <h1>Salt Conversion Chart for Bakers</h1>
  <p>Redirecting to <a href="${pageUrl}">Salt Converter Tool</a>...</p>
  <script>
    window.location.href = '${pageUrl}';
  </script>
</body>
</html>`;

  // Set appropriate headers
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=86400');
  
  return res.status(200).send(html);
}
