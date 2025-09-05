// Performance enhancement utilities specifically for mobile optimization

export class MobilePerformanceEnhancer {
  private static instance: MobilePerformanceEnhancer;
  private criticalImageQueue: string[] = [];
  private preloadedImages = new Set<string>();
  
  static getInstance(): MobilePerformanceEnhancer {
    if (!MobilePerformanceEnhancer.instance) {
      MobilePerformanceEnhancer.instance = new MobilePerformanceEnhancer();
    }
    return MobilePerformanceEnhancer.instance;
  }

  // Optimize images for mobile performance
  optimizeForMobile() {
    this.preloadCriticalImages();
    this.setupImageLazyLoading();
    this.optimizeExistingImages();
    this.setupResourceHints();
  }

  // Preload critical images that affect LCP (disabled - handled by ResponsiveImage priority prop)
  private preloadCriticalImages() {
    // Hero images are now handled by ResponsiveImage component with priority={true}
    // This prevents duplicate preload warnings in browser console
    
    // Only preload non-hero critical images if needed
    const criticalImages = [
      // '/lovable-uploads/db15ab36-18a2-4103-b9d5-a5e58af2b2a2.png', // Hero - handled by ResponsiveImage
      '/lovable-uploads/f2a6c7d6-5a78-4068-94bd-1810dd3ebd96.png'  // Default recipe
    ];

    criticalImages.forEach((src, index) => {
      if (!this.preloadedImages.has(src)) {
        this.preloadImage(src, 'low'); // Lower priority since not hero
        this.preloadedImages.add(src);
      }
    });
  }

  // Preload individual image with priority
  private preloadImage(src: string, priority: 'high' | 'low' = 'low') {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    
    // Optimize Supabase/Lovable images with WebP
    if (src.includes('lovable-uploads') || src.includes('supabase.co')) {
      link.href = `${src}?format=webp&width=1920&quality=85`;
      link.type = 'image/webp';
    } else {
      link.href = src;
    }
    
    if (priority === 'high') {
      link.setAttribute('fetchpriority', 'high');
    }
    
    document.head.appendChild(link);
  }

  // Setup intersection observer for lazy loading
  private setupImageLazyLoading() {
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.removeAttribute('data-src');
              imageObserver.unobserve(img);
            }
          }
        });
      }, {
        rootMargin: '50px 0px', // Start loading 50px before entering viewport
        threshold: 0.01
      });

      // Observe all images with data-src
      const lazyImages = document.querySelectorAll('img[data-src]');
      lazyImages.forEach(img => imageObserver.observe(img));
    }
  }

  // Optimize all existing images on the page
  private optimizeExistingImages() {
    const images = document.querySelectorAll('img');
    
    images.forEach((img, index) => {
      // Set appropriate loading strategy
      if (index < 3) {
        // Critical images - load immediately
        img.loading = 'eager';
        img.decoding = 'sync';
        img.setAttribute('fetchpriority', 'high');
      } else {
        // Non-critical images - lazy load
        img.loading = 'lazy';
        img.decoding = 'async';
        img.setAttribute('fetchpriority', 'low');
      }

      // Prevent layout shift with aspect ratio
      if (!img.style.aspectRatio && img.width && img.height) {
        img.style.aspectRatio = `${img.width}/${img.height}`;
      }

      // Optimize Supabase images for WebP
      this.optimizeImageSrc(img);
    });
  }

  // Optimize image source for better compression
  private optimizeImageSrc(img: HTMLImageElement) {
    if (!img.src) return;

    if (img.src.includes('lovable-uploads') || img.src.includes('supabase.co')) {
      const url = new URL(img.src);
      
      // Only add optimization if not already present
      if (!url.searchParams.has('format')) {
        url.searchParams.set('format', 'webp');
        url.searchParams.set('quality', '75');
        
        // Set width based on container or natural width
        const containerWidth = img.getBoundingClientRect().width;
        const targetWidth = Math.min(containerWidth * 2, 1920); // 2x for retina
        if (targetWidth > 0) {
          url.searchParams.set('width', Math.floor(targetWidth).toString());
        }
        
        img.src = url.toString();
      }
    }
  }

  // Setup DNS prefetch and preconnect hints
  private setupResourceHints() {
    const hints = [
      { rel: 'preconnect', href: 'https://ojyckskucneljvuqzrsw.supabase.co', crossOrigin: true },
      { rel: 'dns-prefetch', href: 'https://lovable-uploads.s3.amazonaws.com' },
      { rel: 'dns-prefetch', href: 'https://fonts.googleapis.com' },
      { rel: 'dns-prefetch', href: 'https://fonts.gstatic.com' }
    ];

    hints.forEach(hint => {
      const existing = document.querySelector(`link[rel="${hint.rel}"][href="${hint.href}"]`);
      if (!existing) {
        const link = document.createElement('link');
        link.rel = hint.rel;
        link.href = hint.href;
        if (hint.crossOrigin) {
          link.crossOrigin = 'anonymous';
        }
        document.head.appendChild(link);
      }
    });
  }

  // Compress images before upload (for user uploads)
  async compressImage(file: File, quality: number = 0.8): Promise<File> {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        // Calculate optimal dimensions
        const maxWidth = 1920;
        const maxHeight = 1080;
        
        let { width, height } = img;
        
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width *= ratio;
          height *= ratio;
        }

        canvas.width = width;
        canvas.height = height;

        // Draw and compress
        ctx?.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob((blob) => {
          if (blob) {
            const compressedFile = new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now()
            });
            resolve(compressedFile);
          } else {
            resolve(file);
          }
        }, 'image/jpeg', quality);
      };

      img.src = URL.createObjectURL(file);
    });
  }
}

// Auto-initialize on page load
if (typeof window !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    const enhancer = MobilePerformanceEnhancer.getInstance();
    enhancer.optimizeForMobile();
  });
}

export default MobilePerformanceEnhancer;