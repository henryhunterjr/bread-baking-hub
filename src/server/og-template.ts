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
  publishedAt?: string;  // ISO 8601
  modifiedAt?: string;   // ISO 8601
}): string {
  const {
    title,
    description,
    canonical,
    image,
    siteName = 'Baking Great Bread',
    twitterHandle = '@henrysbread',
    type = 'article',
    publishedAt,
    modifiedAt
  } = data;

  const width = image.width ?? 1200;
  const height = image.height ?? 630;
  const alt = image.alt ?? title;

  // Ensure we have valid strings for all required fields
  const safeTitle = title || 'Baking Great Bread';
  const safeDescription = description || 'Master the art of bread baking with expert recipes and techniques.';
  const safeImageUrl = image?.url || '/og/default.jpg';
  const safeAlt = alt || safeTitle;

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(safeTitle)}</title>
<meta name="description" content="${escapeHtml(safeDescription)}">
<link rel="canonical" href="${canonical}">

<!-- Open Graph / Facebook -->
<meta property="og:type" content="${type}">
<meta property="og:url" content="${canonical}">
<meta property="og:title" content="${escapeHtml(safeTitle)}">
<meta property="og:description" content="${escapeHtml(safeDescription)}">
<meta property="og:site_name" content="${escapeHtml(siteName)}">
<meta property="og:image" content="${safeImageUrl}">
<meta property="og:image:width" content="${width}">
<meta property="og:image:height" content="${height}">
<meta property="og:image:alt" content="${escapeHtml(safeAlt)}">
<meta property="og:locale" content="en_US">
${publishedAt ? `<meta property="article:published_time" content="${publishedAt}">` : ''}
${modifiedAt ? `<meta property="article:modified_time" content="${modifiedAt}">` : ''}

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${escapeHtml(safeTitle)}">
<meta name="twitter:description" content="${escapeHtml(safeDescription)}">
<meta name="twitter:image" content="${safeImageUrl}">
<meta name="twitter:image:alt" content="${escapeHtml(safeAlt)}">
<meta name="twitter:site" content="${twitterHandle}">
<meta name="twitter:creator" content="${twitterHandle}">
</head>
<body>
<div style="text-align: center; padding: 50px; font-family: Arial, sans-serif;">
  <h1>${escapeHtml(safeTitle)}</h1>
  <p>${escapeHtml(safeDescription)}</p>
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