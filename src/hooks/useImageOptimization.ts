import { useEffect, useCallback } from 'react';

// Hook to optimize images for performance
export const useImageOptimization = () => {
  
  // Preload critical images for LCP optimization
  const preloadCriticalImages = useCallback((imageSrcs: string[]) => {
    if (typeof window === 'undefined') return;

    imageSrcs.forEach((src, index) => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      
      // Optimize for Supabase/Lovable uploads
      if (src.includes('lovable-uploads') || src.includes('supabase.co')) {
        link.href = `${src}?format=webp&width=1920&quality=85`;
        link.type = 'image/webp';
      } else {
        link.href = src;
      }
      
      // Set high priority for the first few images
      if (index < 3) {
        link.setAttribute('fetchpriority', 'high');
      }
      
      document.head.appendChild(link);
    });
  }, []);

  // Optimize existing images on the page
  const optimizeExistingImages = useCallback(() => {
    if (typeof window === 'undefined') return;

    const images = document.querySelectorAll('img');
    
    images.forEach((img, index) => {
      // Set loading attribute for below-the-fold images
      if (index > 2) {
        img.loading = 'lazy';
        img.decoding = 'async';
      } else {
        img.loading = 'eager';
        img.decoding = 'sync';
        img.setAttribute('fetchpriority', 'high');
      }

      // Add aspect ratio to prevent CLS
      if (!img.style.aspectRatio && img.width && img.height) {
        img.style.aspectRatio = `${img.width}/${img.height}`;
      }

      // Optimize Supabase images
      if (img.src && (img.src.includes('lovable-uploads') || img.src.includes('supabase.co'))) {
        const url = new URL(img.src);
        if (!url.searchParams.has('format')) {
          url.searchParams.set('format', 'webp');
          url.searchParams.set('quality', '75');
          if (img.width) {
            url.searchParams.set('width', img.width.toString());
          }
          img.src = url.toString();
        }
      }
    });
  }, []);

  // Add resource hints for critical domains
  const addResourceHints = useCallback(() => {
    if (typeof window === 'undefined') return;

    const hints = [
      { rel: 'preconnect', href: 'https://ojyckskucneljvuqzrsw.supabase.co', crossOrigin: 'anonymous' },
      { rel: 'dns-prefetch', href: 'https://lovable-uploads.s3.amazonaws.com' },
      { rel: 'dns-prefetch', href: 'https://fonts.googleapis.com' },
      { rel: 'dns-prefetch', href: 'https://vercel.live' }
    ];

    hints.forEach(hint => {
      const existing = document.querySelector(`link[rel="${hint.rel}"][href="${hint.href}"]`);
      if (!existing) {
        const link = document.createElement('link');
        link.rel = hint.rel;
        link.href = hint.href;
        if (hint.crossOrigin) {
          link.crossOrigin = hint.crossOrigin;
        }
        document.head.appendChild(link);
      }
    });
  }, []);

  // Initialize optimizations
  useEffect(() => {
    // Run optimizations after DOM is ready
    const runOptimizations = () => {
      optimizeExistingImages();
      addResourceHints();
    };

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', runOptimizations);
    } else {
      runOptimizations();
    }

    // Cleanup
    return () => {
      document.removeEventListener('DOMContentLoaded', runOptimizations);
    };
  }, [optimizeExistingImages, addResourceHints]);

  return {
    preloadCriticalImages,
    optimizeExistingImages,
    addResourceHints
  };
};

// Critical images that should be preloaded immediately
export const CRITICAL_IMAGES = [
  '/lovable-uploads/db15ab36-18a2-4103-b9d5-a5e58af2b2a2.png', // Hero image
  '/lovable-uploads/f2a6c7d6-5a78-4068-94bd-1810dd3ebd96.png'  // Default recipe image
];

export default useImageOptimization;