import React, { useState, useEffect, useRef } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  priority?: boolean;
  quality?: number;
  sizes?: string;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  loading?: 'lazy' | 'eager';
  onLoad?: () => void;
  onError?: () => void;
  fallbackSrc?: string;
}

// Breakpoints for responsive images
const BREAKPOINTS = [384, 640, 750, 828, 1080, 1200, 1920];

export const OptimizedImage = ({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  quality = 75,
  sizes = '100vw',
  objectFit = 'cover',
  loading,
  onLoad,
  onError,
  fallbackSrc = '/placeholder.svg'
}: OptimizedImageProps) => {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  
  const aspectRatio = `${width}/${height}`;
  const finalLoading = loading || (priority ? 'eager' : 'lazy');

  // Generate optimized URLs for different formats and sizes
  const getOptimizedUrl = (originalSrc: string, format: 'avif' | 'webp' | 'original', targetWidth: number) => {
    if (originalSrc.includes('lovable-uploads') || originalSrc.includes('supabase.co')) {
      const baseUrl = originalSrc.split('?')[0];
      if (format === 'original') {
        return `${baseUrl}?width=${targetWidth}&quality=${quality}`;
      }
      return `${baseUrl}?format=${format}&width=${targetWidth}&quality=${quality}`;
    }
    return originalSrc;
  };

  // Generate responsive srcSet for different formats
  const generateSrcSet = (format: 'avif' | 'webp' | 'original') => {
    const validBreakpoints = BREAKPOINTS.filter(w => w <= width * 2);
    return validBreakpoints
      .map(w => `${getOptimizedUrl(src, format, w)} ${w}w`)
      .join(', ');
  };

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  // Reset states when src changes
  useEffect(() => {
    setHasError(false);
    setIsLoaded(false);
  }, [src]);

  // Performance optimization: Set fetchpriority attribute manually
  useEffect(() => {
    if (imgRef.current && priority) {
      imgRef.current.setAttribute('fetchpriority', 'high');
    }
  }, [priority]);

  if (hasError) {
    return (
      <div
        className={`bg-muted flex items-center justify-center ${className}`}
        style={{ 
          width: '100%', 
          height: 'auto',
          aspectRatio,
          objectFit
        }}
      >
        <img
          src={fallbackSrc}
          alt={alt}
          width={width}
          height={height}
          className="opacity-50"
          style={{ aspectRatio, objectFit }}
        />
      </div>
    );
  }

  return (
    <div className={`relative ${className}`} style={{ aspectRatio }}>
      {/* Loading placeholder */}
      {!isLoaded && (
        <div 
          className="absolute inset-0 bg-muted animate-pulse"
          style={{ aspectRatio }}
        />
      )}
      
      <picture className="block w-full h-full">
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
          ref={imgRef}
          src={getOptimizedUrl(src, 'original', width)}
          alt={alt}
          width={width}
          height={height}
          loading={finalLoading}
          decoding={priority ? 'sync' : 'async'}
          className={`w-full h-full transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
          style={{ 
            aspectRatio,
            objectFit,
            contain: 'content'
          }}
          sizes={sizes}
          onLoad={handleLoad}
          onError={handleError}
        />
      </picture>
    </div>
  );
};

// Specialized components for common use cases
export const HeroImage = ({ src, alt, className = '' }: { 
  src: string; 
  alt: string; 
  className?: string; 
}) => (
  <OptimizedImage
    src={src}
    alt={alt}
    width={1920}
    height={1080}
    priority={true}
    sizes="100vw"
    quality={85}
    className={className}
    objectFit="cover"
  />
);

export const BookCoverImage = ({ src, title, alt, className = '', ...props }: { 
  src: string; 
  title: string;
  alt?: string; 
  className?: string;
  [key: string]: any;
}) => (
  <OptimizedImage
    src={src}
    alt={alt || `${title} book cover`}
    width={300}
    height={450}
    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
    quality={80}
    className={className}
    objectFit="cover"
    {...props}
  />
);

export const RecipeCardImage = ({ src, alt, className = '' }: { 
  src: string; 
  alt: string; 
  className?: string; 
}) => (
  <OptimizedImage
    src={src}
    alt={alt}
    width={400}
    height={300}
    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
    quality={75}
    className={className}
    objectFit="cover"
  />
);

export const BlogPostImage = ({ src, alt, className = '' }: { 
  src: string; 
  alt: string; 
  className?: string; 
}) => (
  <OptimizedImage
    src={src}
    alt={alt}
    width={800}
    height={600}
    sizes="(max-width: 768px) 100vw, 800px"
    quality={80}
    className={className}
    objectFit="cover"
  />
);

export const AvatarImage = ({ src, alt, size = 48, className = '' }: { 
  src: string; 
  alt: string; 
  size?: number;
  className?: string; 
}) => (
  <OptimizedImage
    src={src}
    alt={alt}
    width={size}
    height={size}
    sizes={`${size}px`}
    quality={75}
    className={`rounded-full ${className}`}
    objectFit="cover"
  />
);

export default OptimizedImage;