import { useEffect } from 'react';

// Performance optimization component for final Lighthouse improvements
export const PerformanceOptimizer = () => {
  useEffect(() => {
    // Preload critical resources
    const preloadCriticalResources = () => {
      // Preload hero images
      const heroImages = [
        '/lovable-uploads/db15ab36-18a2-4103-b9d5-a5e58af2b2a2.png',
        '/lovable-uploads/b5e1dc0c-46f0-43df-9624-3a332d98ec4e.png'
      ];

      heroImages.forEach(src => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        link.fetchPriority = 'high';
        document.head.appendChild(link);
      });

      // Preload critical fonts
      const criticalFonts = [
        'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap'
      ];

      criticalFonts.forEach(href => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'style';
        link.href = href;
        link.onload = () => {
          link.rel = 'stylesheet';
        };
        document.head.appendChild(link);
      });
    };

    // Skip image optimization to prevent loading interference
    const optimizeImages = () => {
      // Disabled to prevent image loading conflicts
    };

    // Optimize third-party resources
    const optimizeThirdParty = () => {
      // Add dns-prefetch for external domains
      const externalDomains = [
        'https://fonts.googleapis.com',
        'https://fonts.gstatic.com',
        'https://ojyckskucneljvuqzrsw.supabase.co'
      ];

      externalDomains.forEach(domain => {
        const link = document.createElement('link');
        link.rel = 'dns-prefetch';
        link.href = domain;
        document.head.appendChild(link);
      });
    };

    // Reduce layout shift
    const reduceLayoutShift = () => {
      // Set explicit dimensions for dynamic content containers
      const dynamicContainers = document.querySelectorAll('[data-dynamic]');
      dynamicContainers.forEach(container => {
        if (!container.getAttribute('style')?.includes('min-height')) {
          (container as HTMLElement).style.minHeight = '200px';
        }
      });
    };

    // Execute optimizations
    preloadCriticalResources();
    optimizeImages();
    optimizeThirdParty();
    reduceLayoutShift();

    // Run image optimization again after DOM updates
    const observer = new MutationObserver(() => {
      optimizeImages();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  return null; // This component doesn't render anything
};

// Critical CSS injector for above-the-fold content
export const CriticalCSS = () => {
  useEffect(() => {
    const criticalCSS = `
      /* Critical styles for above-the-fold content */
      .bg-gradient-hero {
        background: linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--primary-dark)) 100%);
      }
      
      /* Ensure text is readable during font load */
      body {
        font-display: swap;
      }
      
      /* Prevent layout shift for images */
      img {
        height: auto;
      }
      
      /* Optimize button rendering */
      button {
        contain: layout style;
      }
      
      /* Reduce paint complexity */
      .shadow-warm,
      .shadow-stone {
        will-change: auto;
      }
    `;

    const style = document.createElement('style');
    style.textContent = criticalCSS;
    style.setAttribute('data-critical', 'true');
    document.head.insertBefore(style, document.head.firstChild);

    return () => {
      const criticalStyleElement = document.querySelector('[data-critical="true"]');
      if (criticalStyleElement) {
        criticalStyleElement.remove();
      }
    };
  }, []);

  return null;
};