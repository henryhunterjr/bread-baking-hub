import React from 'react';
import { OptimizedImage, HeroImage } from './OptimizedImage';

// Critical images that need immediate loading for LCP optimization
export const CriticalHeroImage = ({ src, alt, className = '' }: {
  src: string;
  alt: string;
  className?: string;
}) => (
  <HeroImage
    src={src}
    alt={alt}
    className={className}
  />
);

// Above-the-fold images that should be prioritized
export const AboveFoldImage = ({ src, alt, width, height, className = '' }: {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
}) => (
  <OptimizedImage
    src={src}
    alt={alt}
    width={width}
    height={height}
    priority={true}
    className={className}
    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  />
);

// Preload critical images for LCP optimization
export const preloadCriticalImages = (images: string[]) => {
  if (typeof window === 'undefined') return;

  images.forEach((src, index) => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = src;
    
    // Add format hints for better browser optimization
    if (src.includes('lovable-uploads') || src.includes('supabase.co')) {
      // Prefer WebP for Supabase images
      link.href = `${src}?format=webp&width=1920&quality=85`;
      link.type = 'image/webp';
    }
    
    // Set priority for the first few images
    if (index < 3) {
      link.setAttribute('fetchpriority', 'high');
    }
    
    document.head.appendChild(link);
  });
};

// Component to handle preloading in React
export const ImagePreloader = ({ images }: { images: string[] }) => {
  React.useEffect(() => {
    preloadCriticalImages(images);
  }, [images]);

  return null;
};

export default OptimizedImage;