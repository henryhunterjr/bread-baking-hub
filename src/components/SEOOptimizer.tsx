import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

interface SEOOptimizerProps {
  title?: string;
  description?: string;
  image?: string;
  structuredData?: object;
  canonical?: string;
}

// Enhanced SEO component with comprehensive optimization
export const SEOOptimizer = ({ 
  title, 
  description, 
  image, 
  structuredData,
  canonical 
}: SEOOptimizerProps) => {
  const location = useLocation();
  
  const defaultData = {
    title: 'Baking Great Bread at Home - Expert Guidance for Real Home Bakers',
    description: 'Expert guidance for real home bakers. Proven tutorials, troubleshooting guides, sourdough tips, and a supportive community of passionate bakers.',
    image: 'https://the-bakers-bench.lovable.app/lovable-uploads/46c5de6f-c603-4f84-85ec-bb53a2781939.png?v=20250827-1',
    url: 'https://the-bakers-bench.lovable.app'
  };

  const seoTitle = title ? `${title} | ${defaultData.title}` : defaultData.title;
  const seoDescription = description || defaultData.description;
  const seoImage = image || defaultData.image;
  const seoUrl = canonical || `${defaultData.url}${location.pathname}`;

  useEffect(() => {
    // Enhanced image alt text validation
    validateImageAltText();
    
    // Inject critical SEO improvements
    injectCriticalSEO();
    
    // Monitor for accessibility issues
    checkAccessibility();
  }, [location.pathname]);

  const validateImageAltText = () => {
    const images = document.querySelectorAll('img');
    images.forEach((img, index) => {
      if (!img.alt || img.alt.trim() === '') {
        console.warn(`Image ${index + 1} missing alt text:`, img.src);
        
        // Auto-generate basic alt text for common images
        if (img.src.includes('bread') || img.src.includes('recipe')) {
          img.alt = 'Artisan bread recipe image';
        } else if (img.src.includes('henry') || img.src.includes('author')) {
          img.alt = 'Henry Hunter, master baker and author';
        } else {
          img.alt = 'Image content for bread baking guide';
        }
      }
    });
  };

  const injectCriticalSEO = () => {
    // Add viewport meta if missing
    if (!document.querySelector('meta[name="viewport"]')) {
      const viewport = document.createElement('meta');
      viewport.name = 'viewport';
      viewport.content = 'width=device-width, initial-scale=1.0, shrink-to-fit=no';
      document.head.appendChild(viewport);
    }

    // Add robots meta for proper indexing
    const robots = document.querySelector('meta[name="robots"]') || document.createElement('meta');
    robots.setAttribute('name', 'robots');
    robots.setAttribute('content', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
    if (!robots.parentNode) {
      document.head.appendChild(robots);
    }

    // Add language declaration
    if (!document.documentElement.lang) {
      document.documentElement.lang = 'en';
    }
  };

  const checkAccessibility = () => {
    // Check for skip link
    const skipLink = document.querySelector('a[href="#main-content"]');
    if (!skipLink) {
      console.warn('Missing skip link for accessibility');
    }

    // Check for main content area
    const mainContent = document.querySelector('main, [role="main"], #main-content');
    if (!mainContent) {
      console.warn('Missing main content landmark');
    }

    // Check heading hierarchy
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    let previousLevel = 0;
    let hierarchyIssues = 0;
    
    headings.forEach(heading => {
      const level = parseInt(heading.tagName.charAt(1));
      if (level > previousLevel + 1) {
        hierarchyIssues++;
      }
      previousLevel = level;
    });

    if (hierarchyIssues > 0) {
      console.warn(`${hierarchyIssues} heading hierarchy issues found`);
    }
  };

  // Generate comprehensive structured data
  const generatePageSchema = () => {
    const baseSchema = {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: seoTitle,
      description: seoDescription,
      url: seoUrl,
      image: seoImage,
      publisher: {
        '@type': 'Organization',
        name: 'Baking Great Bread',
        logo: {
          '@type': 'ImageObject',
          url: 'https://bread-baking-hub.vercel.app/lovable-uploads/f2a6c7d6-5a78-4068-94bd-1810dd3ebd96.png'
        }
      },
      author: {
        '@type': 'Person',
        name: 'Henry Hunter',
        url: 'https://bread-baking-hub.vercel.app/about'
      }
    };

    return structuredData ? { ...baseSchema, ...structuredData } : baseSchema;
  };

  return (
    <Helmet>
      {/* Core SEO Meta Tags */}
      <title>{seoTitle}</title>
      <meta name="description" content={seoDescription} />
      <link rel="canonical" href={seoUrl} />
      
      {/* Enhanced Meta Tags */}
      <meta name="keywords" content="bread baking, sourdough, artisan bread, baking troubleshooting, Henry Hunter, bread recipes" />
      <meta name="author" content="Henry Hunter" />
      <meta name="publisher" content="Baking Great Bread" />
      
      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={seoTitle} />
      <meta property="og:description" content={seoDescription} />
      <meta property="og:image" content={seoImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={seoDescription} />
      <meta property="og:url" content={seoUrl} />
      <meta property="og:site_name" content="Baking Great Bread" />
      <meta property="og:locale" content="en_US" />
      
      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={seoTitle} />
      <meta name="twitter:description" content={seoDescription} />
      <meta name="twitter:image" content={seoImage} />
      <meta name="twitter:image:alt" content={seoDescription} />
      
      {/* Additional SEO Tags */}
      <meta name="theme-color" content="#8B4513" />
      <meta name="application-name" content="Baking Great Bread" />
      <meta name="apple-mobile-web-app-title" content="Baking Great Bread" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      
      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(generatePageSchema())}
      </script>
      
      {/* Breadcrumb Schema for pages with navigation */}
      {location.pathname !== '/' && (
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              {
                '@type': 'ListItem',
                position: 1,
                name: 'Home',
                item: 'https://bread-baking-hub.vercel.app'
              },
              {
                '@type': 'ListItem',
                position: 2,
                name: title || 'Page',
                item: seoUrl
              }
            ]
          })}
        </script>
      )}
    </Helmet>
  );
};

export default SEOOptimizer;