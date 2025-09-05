/**
 * Metadata Debugger Utility
 * Helps debug and validate Open Graph and Twitter Card meta tags
 */

interface MetaTag {
  property?: string;
  name?: string;
  content: string;
  source: string;
}

interface DebugReport {
  duplicates: MetaTag[];
  missing: string[];
  warnings: string[];
  openGraph: MetaTag[];
  twitter: MetaTag[];
  canonical: string[];
}

/**
 * Extract all relevant meta tags from the document
 */
function extractMetaTags(): MetaTag[] {
  const metaTags: MetaTag[] = [];
  
  // Open Graph tags
  document.querySelectorAll('meta[property^="og:"]').forEach(meta => {
    const property = meta.getAttribute('property');
    const content = meta.getAttribute('content');
    if (property && content) {
      metaTags.push({
        property,
        content,
        source: 'document'
      });
    }
  });
  
  // Twitter tags
  document.querySelectorAll('meta[name^="twitter:"]').forEach(meta => {
    const name = meta.getAttribute('name');
    const content = meta.getAttribute('content');
    if (name && content) {
      metaTags.push({
        name,
        content,
        source: 'document'
      });
    }
  });
  
  // Canonical links
  document.querySelectorAll('link[rel="canonical"]').forEach(link => {
    const href = link.getAttribute('href');
    if (href) {
      metaTags.push({
        name: 'canonical',
        content: href,
        source: 'document'
      });
    }
  });
  
  return metaTags;
}

/**
 * Generate a comprehensive debug report of meta tags
 */
export function generateDebugReport(): DebugReport {
  const metaTags = extractMetaTags();
  
  const openGraph = metaTags.filter(tag => tag.property?.startsWith('og:'));
  const twitter = metaTags.filter(tag => tag.name?.startsWith('twitter:'));
  const canonical = metaTags.filter(tag => tag.name === 'canonical');
  
  // Find duplicates
  const tagMap = new Map<string, MetaTag[]>();
  metaTags.forEach(tag => {
    const key = tag.property || tag.name || '';
    if (!tagMap.has(key)) {
      tagMap.set(key, []);
    }
    tagMap.get(key)!.push(tag);
  });
  
  const duplicates = Array.from(tagMap.entries())
    .filter(([, tags]) => tags.length > 1)
    .flatMap(([, tags]) => tags);
  
  // Check for missing required tags
  const missing: string[] = [];
  const requiredOgTags = ['og:title', 'og:description', 'og:image', 'og:url', 'og:type'];
  const requiredTwitterTags = ['twitter:card', 'twitter:title', 'twitter:description', 'twitter:image'];
  
  requiredOgTags.forEach(required => {
    if (!openGraph.some(tag => tag.property === required)) {
      missing.push(required);
    }
  });
  
  requiredTwitterTags.forEach(required => {
    if (!twitter.some(tag => tag.name === required)) {
      missing.push(required);
    }
  });
  
  // Generate warnings
  const warnings: string[] = [];
  
  if (duplicates.length > 0) {
    warnings.push(`Found ${duplicates.length} duplicate meta tags`);
  }
  
  if (canonical.length === 0) {
    warnings.push('No canonical URL found');
  } else if (canonical.length > 1) {
    warnings.push('Multiple canonical URLs found');
  }
  
  // Check image URLs
  const imageTag = openGraph.find(tag => tag.property === 'og:image');
  if (imageTag && !imageTag.content.startsWith('http')) {
    warnings.push('og:image is not an absolute URL');
  }
  
  return {
    duplicates,
    missing,
    warnings,
    openGraph,
    twitter,
    canonical: canonical.map(tag => tag.content)
  };
}

/**
 * Log a formatted debug report to the console
 */
export function logDebugReport(): void {
  const report = generateDebugReport();
  
  console.group('🔍 Social Media Meta Tags Debug Report');
  
  if (report.warnings.length > 0) {
    console.warn('⚠️ Warnings:', report.warnings);
  }
  
  if (report.missing.length > 0) {
    console.error('❌ Missing Required Tags:', report.missing);
  }
  
  if (report.duplicates.length > 0) {
    console.warn('🔄 Duplicate Tags:', report.duplicates);
  }
  
  console.log('📱 Open Graph Tags:', report.openGraph);
  console.log('🐦 Twitter Tags:', report.twitter);
  console.log('🔗 Canonical URLs:', report.canonical);
  
  console.groupEnd();
}

/**
 * Validate a specific image URL for social media requirements
 */
export async function validateSocialImage(imageUrl: string): Promise<{
  isValid: boolean;
  issues: string[];
  recommendations: string[];
}> {
  const issues: string[] = [];
  const recommendations: string[] = [];
  
  if (!imageUrl) {
    issues.push('No image URL provided');
    return { isValid: false, issues, recommendations };
  }
  
  // Check if absolute URL
  if (!imageUrl.startsWith('http')) {
    issues.push('Image URL is not absolute');
  }
  
  // Check if HTTPS (required for social media)
  if (!imageUrl.startsWith('https://')) {
    issues.push('Image URL is not HTTPS');
  }
  
  // Try to fetch image metadata
  try {
    const response = await fetch(imageUrl, { method: 'HEAD' });
    
    if (!response.ok) {
      issues.push(`Image returns ${response.status} status`);
    }
    
    const contentType = response.headers.get('content-type');
    if (!contentType?.startsWith('image/')) {
      issues.push('Invalid content type for image');
    }
    
    const contentLength = response.headers.get('content-length');
    if (contentLength) {
      const sizeKB = parseInt(contentLength) / 1024;
      if (sizeKB > 2048) { // 2MB limit for social media
        recommendations.push(`Image is ${Math.round(sizeKB)}KB, consider optimizing`);
      }
    }
    
  } catch (error) {
    issues.push('Failed to fetch image metadata');
  }
  
  return {
    isValid: issues.length === 0,
    issues,
    recommendations
  };
}

/**
 * Enable debug mode for development
 */
export function enableMetadataDebugMode(): void {
  if (import.meta.env.DEV) {
    // Log debug report after page loads
    setTimeout(() => {
      logDebugReport();
    }, 1000);
    
    // Add global debug function
    (window as any).debugMetadata = logDebugReport;
    console.log('🔧 Metadata debug mode enabled. Call debugMetadata() to generate report.');
  }
}