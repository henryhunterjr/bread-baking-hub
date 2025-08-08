import { useState, useEffect } from 'react';

interface ResponsiveImageProps {
  src: string;
  alt: string; // Required for accessibility
  className?: string;
  sizes?: string;
  priority?: boolean;
  quality?: number;
  webpSrc?: string;
  mobileSrc?: string;
  tabletSrc?: string;
  desktopSrc?: string;
  loading?: 'lazy' | 'eager';
  onLoad?: () => void;
  onError?: () => void;
}

export const ResponsiveImage = ({
  src,
  alt,
  className = '',
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  priority = false,
  quality = 75,
  webpSrc,
  mobileSrc,
  tabletSrc,
  desktopSrc,
  loading = 'lazy',
  onLoad,
  onError
}: ResponsiveImageProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [supportsWebP, setSupportsWebP] = useState(false);

  // Check WebP support
  useEffect(() => {
    const checkWebPSupport = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 1;
      canvas.height = 1;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const dataURL = canvas.toDataURL('image/webp');
        setSupportsWebP(dataURL.indexOf('data:image/webp') === 0);
      }
    };

    checkWebPSupport();
  }, []);

  // Generate srcSet for different screen sizes
  const generateSrcSet = (baseSrc: string) => {
    if (mobileSrc || tabletSrc || desktopSrc) {
      const srcSet = [];
      if (mobileSrc) srcSet.push(`${mobileSrc} 480w`);
      if (tabletSrc) srcSet.push(`${tabletSrc} 768w`);
      if (desktopSrc) srcSet.push(`${desktopSrc} 1200w`);
      return srcSet.join(', ');
    }
    
    // Generate responsive sizes from base image
    const baseUrl = baseSrc.split('?')[0];
    const params = baseSrc.includes('?') ? baseSrc.split('?')[1] : '';
    const separator = params ? '&' : '?';
    
    return [
      `${baseUrl}${separator}w=480&q=${quality} 480w`,
      `${baseUrl}${separator}w=768&q=${quality} 768w`,
      `${baseUrl}${separator}w=1200&q=${quality} 1200w`,
      `${baseUrl}${separator}w=1920&q=${quality} 1920w`
    ].join(', ');
  };

  const handleLoad = () => {
    setImageLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setImageError(true);
    onError?.();
  };

  // Use WebP if supported and available
  const imageSrc = supportsWebP && webpSrc ? webpSrc : src;
  const srcSet = generateSrcSet(imageSrc);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Loading placeholder */}
      {!imageLoaded && !imageError && (
        <div 
          className="absolute inset-0 bg-muted animate-pulse flex items-center justify-center"
          aria-hidden="true"
        >
          <div className="text-muted-foreground text-sm">Loading image...</div>
        </div>
      )}
      
      {/* Error fallback */}
      {imageError && (
        <div 
          className="absolute inset-0 bg-muted flex items-center justify-center"
          role="img"
          aria-label={`Image failed to load: ${alt}`}
        >
          <div className="text-muted-foreground text-sm">Image unavailable</div>
        </div>
      )}

      {/* Main image */}
      <picture>
        {supportsWebP && webpSrc && (
          <source
            srcSet={generateSrcSet(webpSrc)}
            sizes={sizes}
            type="image/webp"
          />
        )}
        <img
          src={imageSrc}
          srcSet={srcSet}
          sizes={sizes}
          alt={alt}
          loading={priority ? 'eager' : loading}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={handleLoad}
          onError={handleError}
          fetchPriority={priority ? 'high' : 'auto'}
          role="img"
        />
      </picture>
    </div>
  );
};