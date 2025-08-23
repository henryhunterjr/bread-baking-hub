import { useEffect } from 'react';

interface CriticalResourceLoaderProps {
  children: React.ReactNode;
}

export const CriticalResourceLoader = ({ children }: CriticalResourceLoaderProps) => {
  useEffect(() => {
    // Preload critical CSS and fonts
    const preloadCriticalResources = () => {
      const criticalResources = [
        {
          href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
          as: 'style',
          rel: 'preload'
        },
        {
          href: 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&display=swap',
          as: 'style',
          rel: 'preload'
        }
      ];

      criticalResources.forEach(resource => {
        const existingLink = document.querySelector(`link[href="${resource.href}"]`);
        if (!existingLink) {
          const link = document.createElement('link');
          link.rel = resource.rel;
          link.as = resource.as;
          link.href = resource.href;
          link.crossOrigin = 'anonymous';
          
          if (resource.as === 'style') {
            link.onload = () => {
              link.rel = 'stylesheet';
            };
          }
          
          document.head.appendChild(link);
        }
      });
    };

    // Preload hero images for better LCP
    const preloadHeroImages = () => {
      const heroImages = [
        '/lovable-uploads/6ed25ae6-4928-46c6-9fe0-fa7af97ffa2d.png',
        'https://ojyckskucneljvuqzrsw.supabase.co/storage/v1/object/public/hero-images/logo-primary.png',
        '/hero/fallback.jpg'
      ];

      heroImages.forEach(src => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        link.setAttribute('fetchpriority', 'high');
        document.head.appendChild(link);
      });
    };

    // DNS prefetch for external domains
    const prefetchDomains = () => {
      const domains = [
        'https://fonts.googleapis.com',
        'https://fonts.gstatic.com',
        'https://ojyckskucneljvuqzrsw.supabase.co'
      ];

      domains.forEach(domain => {
        const link = document.createElement('link');
        link.rel = 'dns-prefetch';
        link.href = domain;
        document.head.appendChild(link);
      });
    };

    // Execute optimizations
    preloadCriticalResources();
    preloadHeroImages();
    prefetchDomains();

    // Optimize existing images for CLS prevention
    const optimizeExistingImages = () => {
      const images = document.querySelectorAll('img:not([data-optimized])') as NodeListOf<HTMLImageElement>;
      images.forEach(img => {
        // Prevent layout shift
        if (!img.style.aspectRatio && !img.width && !img.height) {
          img.style.aspectRatio = '4/3'; // Default aspect ratio
        }
        
        // Mark as optimized
        img.setAttribute('data-optimized', 'true');
      });
    };

    // Run optimization after initial load
    const timeoutId = setTimeout(optimizeExistingImages, 100);

    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  return <>{children}</>;
};

export default CriticalResourceLoader;