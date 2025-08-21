import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { AccessibilityChecker } from './AccessibilityChecker';
import { SEOOptimizer } from './SEOOptimizer';
import PerformanceOptimizer from '../utils/performanceOptimizer';

// Global SEO and performance initialization component
export const GlobalSEOInitializer = () => {
  const location = useLocation();
  const [shouldRenderDefaultSEO, setShouldRenderDefaultSEO] = useState(true);

  // Check if page already has specific Open Graph meta tags
  useEffect(() => {
    const checkForExistingSEO = () => {
      // Check if page-specific og:image meta tag exists
      const existingOgImage = document.querySelector('meta[property="og:image"]');
      const hasPageSpecificSEO = existingOgImage && 
        (existingOgImage.getAttribute('content')?.includes('218723c3-e566-4b81-a9e5-a341a5e61037') || // recipes image
         existingOgImage.getAttribute('content')?.includes('1df33d05-6c4f-409b-a817-9b27e6d8edbc') || // blog image
         existingOgImage.getAttribute('content')?.includes('7c954928-23fe-4169-bec1-ffa0629d80f2')); // workspace image
      
      setShouldRenderDefaultSEO(!hasPageSpecificSEO);
    };

    // Check immediately and after a small delay to catch dynamically added meta tags
    checkForExistingSEO();
    const timeoutId = setTimeout(checkForExistingSEO, 50);

    return () => clearTimeout(timeoutId);
  }, [location.pathname]);

  useEffect(() => {
    // Initialize performance optimizer
    const perfOptimizer = PerformanceOptimizer.getInstance();

    // Enhanced image optimization for all routes
    const optimizeAllImages = () => {
      const images = document.querySelectorAll('img');
      
      images.forEach((img, index) => {
        // Ensure all images have meaningful alt text
        if (!img.alt || img.alt.trim() === '') {
          if (img.src.includes('bread') || img.src.includes('recipe')) {
            img.alt = 'Artisan bread recipe image showing texture and baking results';
          } else if (img.src.includes('henry') || img.src.includes('author')) {
            img.alt = 'Henry Hunter, master baker and bread making expert';
          } else if (img.src.includes('book') || img.src.includes('cover')) {
            img.alt = 'Book cover for bread baking guide';
          } else if (img.src.includes('tool') || img.src.includes('equipment')) {
            img.alt = 'Professional bread baking tools and equipment';
          } else {
            img.alt = 'Bread baking related image showing techniques and results';
          }
        }

        // Optimize loading strategy
        if (index < 2) {
          img.loading = 'eager';
          img.setAttribute('fetchpriority', 'high');
        } else {
          img.loading = 'lazy';
          img.setAttribute('fetchpriority', 'low');
        }

        // Add error handling
        if (!img.onerror) {
          img.onerror = () => {
            img.style.display = 'none';
            console.warn('Failed to load image:', img.src);
          };
        }
      });
    };

    // Add structured data for common page types
    const addCommonStructuredData = () => {
      const pathname = location.pathname;
      
      // Add WebSite schema for homepage
      if (pathname === '/') {
        const websiteSchema = {
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: 'Baking Great Bread',
          url: 'https://bread-baking-hub.vercel.app',
          description: 'Master artisan bread baking with expert guidance, troubleshooting tools, and community support',
          potentialAction: {
            '@type': 'SearchAction',
            target: 'https://bread-baking-hub.vercel.app/search?q={search_term_string}',
            'query-input': 'required name=search_term_string'
          },
          author: {
            '@type': 'Person',
            name: 'Henry Hunter',
            url: 'https://bread-baking-hub.vercel.app/about'
          }
        };

        // Add if not already present
        if (!document.querySelector('script[data-schema="website"]')) {
          const script = document.createElement('script');
          script.type = 'application/ld+json';
          script.setAttribute('data-schema', 'website');
          script.textContent = JSON.stringify(websiteSchema);
          document.head.appendChild(script);
        }
      }

      // Add Organization schema
      if (!document.querySelector('script[data-schema="organization"]')) {
        const organizationSchema = {
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: 'Baking Great Bread',
          url: 'https://bread-baking-hub.vercel.app',
          logo: 'https://bread-baking-hub.vercel.app/lovable-uploads/f2a6c7d6-5a78-4068-94bd-1810dd3ebd96.png',
          description: 'Expert bread baking education and community led by master baker Henry Hunter',
          founder: {
            '@type': 'Person',
            name: 'Henry Hunter'
          },
          sameAs: [
            'https://www.facebook.com/groups/1082865755403754',
            'https://www.instagram.com/bakinggreatbread/',
            'https://www.youtube.com/@henryhunterjr',
            'https://bakinggreatbread.store/'
          ]
        };

        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.setAttribute('data-schema', 'organization');
        script.textContent = JSON.stringify(organizationSchema);
        document.head.appendChild(script);
      }
    };

    // Optimize critical rendering path
    const optimizeCriticalPath = () => {
      // Preload critical fonts if not already loaded
      const criticalFonts = [
        'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'
      ];

      criticalFonts.forEach(href => {
        if (!document.querySelector(`link[href="${href}"]`)) {
          const link = document.createElement('link');
          link.rel = 'preload';
          link.as = 'style';
          link.href = href;
          link.onload = () => {
            link.rel = 'stylesheet';
          };
          document.head.appendChild(link);
        }
      });

      // Add critical CSS for above-the-fold content
      if (!document.querySelector('style[data-critical-css]')) {
        const criticalCSS = `
          /* Critical CSS for initial render */
          body {
            font-display: swap;
            line-height: 1.6;
          }
          
          img {
            height: auto;
            max-width: 100%;
          }
          
          .loading-placeholder {
            background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
            background-size: 200% 100%;
            animation: loading 1.5s infinite;
          }
          
          @keyframes loading {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
          }
          
          /* Focus improvements */
          *:focus-visible {
            outline: 2px solid hsl(var(--primary));
            outline-offset: 2px;
          }
          
          /* High contrast mode support */
          @media (prefers-contrast: high) {
            * {
              border-width: 2px !important;
            }
          }
        `;

        const style = document.createElement('style');
        style.setAttribute('data-critical-css', 'true');
        style.textContent = criticalCSS;
        document.head.appendChild(style);
      }
    };

    // Run optimizations with slight delay to not block initial render
    const timeoutId = setTimeout(() => {
      optimizeAllImages();
      addCommonStructuredData();
      optimizeCriticalPath();
    }, 100);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [location.pathname]);

  return (
    <>
      {shouldRenderDefaultSEO && <SEOOptimizer />}
      {process.env.NODE_ENV === 'development' && <AccessibilityChecker />}
    </>
  );
};

export default GlobalSEOInitializer;