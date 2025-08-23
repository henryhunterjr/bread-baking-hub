import React, { useState } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  priority?: boolean;
  quality?: number;
  sizes?: string;
}

export const OptimizedImage = ({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  quality = 70,
  sizes = '100vw'
}: OptimizedImageProps) => {
  const [hasError, setHasError] = useState(false);

  // Generate responsive image URLs for different formats
  const getWebPSrc = (originalSrc: string, w: number) => {
    if (originalSrc.includes('lovable-uploads')) {
      return `${originalSrc}?format=webp&width=${w}&quality=${quality}`;
    }
    return originalSrc;
  };

  const getAvifSrc = (originalSrc: string, w: number) => {
    if (originalSrc.includes('lovable-uploads')) {
      return `${originalSrc}?format=avif&width=${w}&quality=${quality}`;
    }
    return originalSrc;
  };

  const breakpoints = [384, 640, 750, 828, 1080, 1200, 1920];

  const generateSrcSet = (format: 'webp' | 'avif' | 'original') => {
    return breakpoints
      .filter(w => w <= width * 2) // Don't scale beyond 2x original
      .map(w => {
        if (format === 'webp') {
          return `${getWebPSrc(src, w)} ${w}w`;
        } else if (format === 'avif') {
          return `${getAvifSrc(src, w)} ${w}w`;
        }
        return `${src} ${w}w`;
      })
      .join(', ');
  };

  if (hasError) {
    return (
      <div
        className={`bg-muted flex items-center justify-center ${className}`}
        style={{ width, height, aspectRatio: `${width}/${height}` }}
      >
        <span className="text-muted-foreground text-sm">Image failed to load</span>
      </div>
    );
  }

  return (
    <picture>
      {/* AVIF format - best compression */}
      <source
        srcSet={generateSrcSet('avif')}
        sizes={sizes}
        type="image/avif"
      />
      
      {/* WebP format - good compression and broad support */}
      <source
        srcSet={generateSrcSet('webp')}
        sizes={sizes}
        type="image/webp"
      />
      
      {/* Fallback PNG/JPEG */}
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={className}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : 'low'}
        decoding={priority ? 'sync' : 'async'}
        style={{ aspectRatio: `${width}/${height}` }}
        onError={() => setHasError(true)}
        sizes={sizes}
      />
    </picture>
  );
};

export default OptimizedImage;