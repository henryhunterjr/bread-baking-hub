import React, { useState, useCallback, useRef } from 'react';
import { cn } from '@/lib/utils';

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src?: string;
  alt?: string;
  fallbackSrc?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  sizes?: string;
  loading?: 'lazy' | 'eager';
  onLoad?: () => void;
  onError?: () => void;
}

// Set to track URLs that have already been logged to prevent spam
const loggedErrors = new Set<string>();

export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  alt = "Image",
  fallbackSrc = '/assets/recipe-placeholder.svg',
  className,
  width,
  height,
  priority = false,
  sizes,
  loading = 'lazy',
  onLoad,
  onError,
  ...props
}) => {
  const [error, setError] = useState(false);
  const retryCount = useRef(0);

  const logError = useCallback((url: string, errorMsg?: string) => {
    if (!loggedErrors.has(url)) {
      console.error(`ImageWithFallback: Failed to load image: ${url}`, errorMsg || '');
      loggedErrors.add(url);
    }
  }, []);

  const handleError = useCallback((event: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const imgElement = event.currentTarget;
    const failedSrc = imgElement.src;

    // Don't retry if we're already on the fallback image
    if (failedSrc.includes(fallbackSrc)) {
      logError(failedSrc, 'Fallback image also failed');
      return;
    }

    // Log the error once
    logError(failedSrc);

    // Retry once for transient network failures
    if (retryCount.current === 0 && src) {
      retryCount.current = 1;
      
      setTimeout(() => {
        // Check if the image is still in the DOM and hasn't been replaced
        if (imgElement.src === failedSrc && !error) {
          imgElement.src = src + '?retry=1'; // Add cache-busting parameter
        }
      }, 250);
      
      return;
    }

    // After retry fails, use fallback
    setError(true);
    onError?.();
  }, [src, error, logError, onError, fallbackSrc]);

  const handleLoad = useCallback(() => {
    // Reset retry count and error state on successful load
    retryCount.current = 0;
    setError(false);
    onLoad?.();
  }, [onLoad]);

  // Reset error state when src prop changes
  React.useEffect(() => {
    if (src) {
      setError(false);
      retryCount.current = 0;
    }
  }, [src]);

  // Calculate aspect style for layout stability
  const aspectStyle = !width || !height
    ? { aspectRatio: "16/9" }
    : { width, height };

  return (
    <div 
      style={aspectStyle} 
      className={cn("overflow-hidden bg-muted", className)}
    >
      <img
        src={error || !src ? fallbackSrc : src}
        alt={alt}
        loading={priority ? 'eager' : loading}
        width={width}
        height={height}
        sizes={sizes}
        className="w-full h-full object-cover"
        onLoad={handleLoad}
        onError={handleError}
        {...(priority && { fetchPriority: 'high' as const })}
        {...props}
      />
    </div>
  );
};