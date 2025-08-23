import React from 'react';

interface PerformanceImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  priority?: boolean;
  sizes?: string;
  quality?: number;
}

// Optimized picture element with AVIF/WebP support and proper dimensions
export const PerformanceImage = ({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  sizes = '100vw',
  quality = 70
}: PerformanceImageProps) => {
  const aspectRatio = `${width}/${height}`;
  
  // Generate optimized URLs for different formats
  const getOptimizedSrc = (format: 'avif' | 'webp' | 'original', w: number) => {
    if (src.includes('lovable-uploads')) {
      return `${src}?format=${format}&width=${w}&quality=${quality}`;
    }
    return src;
  };

  // Generate responsive breakpoints
  const breakpoints = [384, 640, 750, 828, 1080, 1200, 1920];
  const validBreakpoints = breakpoints.filter(w => w <= width * 2);

  const generateSrcSet = (format: 'avif' | 'webp' | 'original') => {
    return validBreakpoints
      .map(w => `${getOptimizedSrc(format, w)} ${w}w`)
      .join(', ');
  };

  return (
    <picture className={`block ${className}`} style={{ aspectRatio }}>
      {/* AVIF format - best compression */}
      <source
        srcSet={generateSrcSet('avif')}
        sizes={sizes}
        type="image/avif"
      />
      
      {/* WebP format - good compression */}
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
        loading={priority ? 'eager' : 'lazy'}
        {...(priority ? { fetchPriority: 'high' } : { fetchPriority: 'low' })}
        decoding={priority ? 'sync' : 'async'}
        style={{ 
          aspectRatio,
          width: '100%',
          height: 'auto',
          contain: 'content'
        }}
        className="object-cover"
        sizes={sizes}
      />
    </picture>
  );
};

// Specific optimized versions for large problem images
export const OptimizedBookCover = ({ src, title, priority = false }: { 
  src: string; 
  title: string; 
  priority?: boolean;
}) => (
  <PerformanceImage
    src={src}
    alt={`${title} book cover`}
    width={380}
    height={570}
    priority={priority}
    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
    quality={70}
  />
);

export const OptimizedHeroImage = ({ src, alt }: { src: string; alt: string }) => (
  <PerformanceImage
    src={src}
    alt={alt}
    width={1920}
    height={1080}
    priority={true}
    sizes="100vw"
    quality={80}
    className="absolute inset-0 w-full h-full object-cover"
  />
);

export const OptimizedAvatar = ({ src, alt }: { src: string; alt: string }) => (
  <PerformanceImage
    src={src}
    alt={alt}
    width={48}
    height={48}
    priority={false}
    sizes="48px"
    quality={70}
    className="rounded-full"
  />
);