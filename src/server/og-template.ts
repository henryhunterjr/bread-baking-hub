/**
 * Server-side Open Graph HTML template generator
 * Ensures clean, bot-friendly HTML with complete meta tags
 */

function escapeHtml(str: string): string {
  return str.replace(/[&<>"']/g, (char) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[char] || char));
}

export function renderOgHtml(data: {
  title: string;
  description: string;
  canonical: string;
  image: { 
    url: string; 
    width?: number; 
    height?: number; 
    alt?: string; 
  };
  siteName?: string;
  twitterHandle?: string;
  type?: string;
}): string {
  const {
    title,
    description,
    canonical,
    image,
    siteName = 'Baking Great Bread',
    twitterHandle = '@henrysbread',
    type = 'article'
  } = data;

  const width = image.width ?? 1200;
  const height = image.height ?? 630;
  const alt = image.alt ?? title;

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(title)}</title>
<meta name="description" content="${escapeHtml(description)}">
<link rel="canonical" href="${canonical}">

<!-- Open Graph / Facebook -->
<meta property="og:type" content="${type}">
<meta property="og:url" content="${canonical}">
<meta property="og:title" content="${escapeHtml(title)}">
<meta property="og:description" content="${escapeHtml(description)}">
<meta property="og:site_name" content="${escapeHtml(siteName)}">
<meta property="og:image" content="${image.url}">
<meta property="og:image:width" content="${width}">
<meta property="og:image:height" content="${height}">
<meta property="og:image:alt" content="${escapeHtml(alt)}">
<meta property="og:locale" content="en_US">

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${escapeHtml(title)}">
<meta name="twitter:description" content="${escapeHtml(description)}">
<meta name="twitter:image" content="${image.url}">
<meta name="twitter:image:alt" content="${escapeHtml(alt)}">
<meta name="twitter:site" content="${twitterHandle}">
<meta name="twitter:creator" content="${twitterHandle}">
</head>
<body>
<div style="text-align: center; padding: 50px; font-family: Arial, sans-serif;">
  <h1>${escapeHtml(title)}</h1>
  <p>${escapeHtml(description)}</p>
  <p><a href="${canonical}" style="color: #D97706; text-decoration: none; font-weight: bold;">Continue to full article →</a></p>
</div>
<script>
// Fallback redirect for any browsers that reach this page
if (typeof window !== 'undefined') {
  window.location.replace(${JSON.stringify(canonical)});
}
</script>
</body>
</html>`;
}