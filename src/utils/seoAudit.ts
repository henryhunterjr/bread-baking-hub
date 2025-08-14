interface SEOIssue {
  type: 'error' | 'warning' | 'info';
  category: 'meta' | 'headings' | 'images' | 'links' | 'structured-data' | 'performance';
  element?: string;
  description: string;
  recommendation: string;
}

export const runSEOAudit = (): SEOIssue[] => {
  const issues: SEOIssue[] = [];
  
  // Check title tag
  const title = document.querySelector('title');
  if (!title || !title.textContent?.trim()) {
    issues.push({
      type: 'error',
      category: 'meta',
      element: 'title',
      description: 'Missing or empty title tag',
      recommendation: 'Add a descriptive title under 60 characters'
    });
  } else if (title.textContent.length > 60) {
    issues.push({
      type: 'warning',
      category: 'meta',
      element: 'title',
      description: 'Title tag too long',
      recommendation: 'Keep title under 60 characters for optimal display'
    });
  }

  // Check meta description
  const metaDescription = document.querySelector('meta[name="description"]');
  if (!metaDescription || !metaDescription.getAttribute('content')?.trim()) {
    issues.push({
      type: 'error',
      category: 'meta',
      element: 'meta[name="description"]',
      description: 'Missing meta description',
      recommendation: 'Add meta description between 120-160 characters'
    });
  } else {
    const content = metaDescription.getAttribute('content') || '';
    if (content.length > 160) {
      issues.push({
        type: 'warning',
        category: 'meta',
        element: 'meta[name="description"]',
        description: 'Meta description too long',
        recommendation: 'Keep meta description under 160 characters'
      });
    }
  }

  // Check H1 tags
  const h1Tags = document.querySelectorAll('h1');
  if (h1Tags.length === 0) {
    issues.push({
      type: 'error',
      category: 'headings',
      element: 'h1',
      description: 'No H1 tag found',
      recommendation: 'Add exactly one H1 tag to describe the main content'
    });
  } else if (h1Tags.length > 1) {
    issues.push({
      type: 'warning',
      category: 'headings',
      element: 'h1',
      description: 'Multiple H1 tags found',
      recommendation: 'Use only one H1 tag per page'
    });
  }

  // Check heading hierarchy
  const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'));
  let lastLevel = 0;
  
  headings.forEach((heading, index) => {
    const currentLevel = parseInt(heading.tagName.substring(1));
    if (currentLevel > lastLevel + 1) {
      issues.push({
        type: 'warning',
        category: 'headings',
        element: heading.tagName.toLowerCase(),
        description: 'Heading hierarchy skip detected',
        recommendation: 'Use proper heading sequence (h1 → h2 → h3)'
      });
    }
    lastLevel = currentLevel;
  });

  // Check images without alt text
  const images = document.querySelectorAll('img');
  images.forEach((img, index) => {
    if (!img.alt || img.alt.trim() === '') {
      issues.push({
        type: 'error',
        category: 'images',
        element: `img[src="${img.src}"]`,
        description: 'Image missing alt text',
        recommendation: 'Add descriptive alt text for accessibility and SEO'
      });
    }
  });

  // Check for canonical link
  const canonical = document.querySelector('link[rel="canonical"]');
  if (!canonical) {
    issues.push({
      type: 'warning',
      category: 'meta',
      element: 'link[rel="canonical"]',
      description: 'Missing canonical URL',
      recommendation: 'Add canonical link to prevent duplicate content issues'
    });
  }

  // Check for Open Graph tags
  const ogTitle = document.querySelector('meta[property="og:title"]');
  const ogDescription = document.querySelector('meta[property="og:description"]');
  const ogImage = document.querySelector('meta[property="og:image"]');
  
  if (!ogTitle) {
    issues.push({
      type: 'warning',
      category: 'meta',
      element: 'meta[property="og:title"]',
      description: 'Missing Open Graph title',
      recommendation: 'Add og:title for better social media sharing'
    });
  }

  if (!ogDescription) {
    issues.push({
      type: 'warning',
      category: 'meta',
      element: 'meta[property="og:description"]',
      description: 'Missing Open Graph description',
      recommendation: 'Add og:description for better social media sharing'
    });
  }

  if (!ogImage) {
    issues.push({
      type: 'warning',
      category: 'meta',
      element: 'meta[property="og:image"]',
      description: 'Missing Open Graph image',
      recommendation: 'Add og:image for better social media sharing'
    });
  }

  // Check for structured data
  const structuredData = document.querySelectorAll('script[type="application/ld+json"]');
  if (structuredData.length === 0) {
    issues.push({
      type: 'info',
      category: 'structured-data',
      element: 'script[type="application/ld+json"]',
      description: 'No structured data found',
      recommendation: 'Add JSON-LD structured data for rich snippets'
    });
  }

  // Check internal links
  const internalLinks = document.querySelectorAll('a[href^="/"], a[href^="./"], a[href^="../"]');
  internalLinks.forEach((link, index) => {
    const href = link.getAttribute('href');
    if (href && !link.textContent?.trim()) {
      issues.push({
        type: 'warning',
        category: 'links',
        element: `a[href="${href}"]`,
        description: 'Internal link without descriptive text',
        recommendation: 'Add descriptive anchor text for better SEO'
      });
    }
  });

  // Check viewport meta tag
  const viewport = document.querySelector('meta[name="viewport"]');
  if (!viewport) {
    issues.push({
      type: 'error',
      category: 'meta',
      element: 'meta[name="viewport"]',
      description: 'Missing viewport meta tag',
      recommendation: 'Add viewport meta tag for mobile responsiveness'
    });
  }

  return issues;
};

export const generateSEOReport = () => {
  const issues = runSEOAudit();
  const errors = issues.filter(issue => issue.type === 'error');
  const warnings = issues.filter(issue => issue.type === 'warning');
  const infos = issues.filter(issue => issue.type === 'info');

  return {
    score: Math.max(0, 100 - (errors.length * 10) - (warnings.length * 5)),
    issues,
    summary: {
      errors: errors.length,
      warnings: warnings.length,
      infos: infos.length,
      total: issues.length
    }
  };
};