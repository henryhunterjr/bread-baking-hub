import React, { useState, useCallback, useRef } from 'react';

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  sizes?: string;
  loading?: 'lazy' | 'eager';
  style?: React.CSSProperties;
  onLoad?: () => void;
  onError?: () => void;
}

// Set to track URLs that have already been logged to prevent spam
const loggedErrors = new Set<string>();

export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  alt,
  className = '',
  width,
  height,
  priority = false,
  sizes,
  loading = 'lazy',
  style,
  onLoad,
  onError,
}) => {
  const fallbackImage = '/assets/recipe-placeholder.svg';
  
  const [currentSrc, setCurrentSrc] = useState(src || fallbackImage);
  const [hasErrored, setHasErrored] = useState(!src);
  const retryCount = useRef(0);

  const logError = useCallback((url: string, error?: string) => {
    if (!loggedErrors.has(url)) {
      console.error(`ImageWithFallback: Failed to load image: ${url}`, error || '');
      loggedErrors.add(url);
    }
  }, []);

  const handleError = useCallback((event: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const imgElement = event.currentTarget;
    const failedSrc = imgElement.src;

    // Don't retry if we're already on the fallback image
    if (failedSrc.includes('/assets/recipe-placeholder.svg')) {
      logError(failedSrc, 'Fallback image also failed');
      return;
    }

    // Log the error once
    logError(failedSrc);

    // Retry once for transient network failures
    if (retryCount.current === 0) {
      retryCount.current = 1;
      
      setTimeout(() => {
        // Check if the image is still in the DOM and hasn't been replaced
        if (imgElement.src === failedSrc && !hasErrored) {
          setCurrentSrc(src + '?retry=1'); // Add cache-busting parameter
        }
      }, 250);
      
      return;
    }

    // After retry fails, use fallback
    setHasErrored(true);
    setCurrentSrc(fallbackImage);
    onError?.();
  }, [src, hasErrored, logError, onError]);

  const handleLoad = useCallback(() => {
    // Reset retry count on successful load
    retryCount.current = 0;
    onLoad?.();
  }, [onLoad]);

  // Reset state when src prop changes
  React.useEffect(() => {
    const newSrc = src || fallbackImage;
    const shouldUseFallback = !src;
    
    if (newSrc !== currentSrc || shouldUseFallback !== hasErrored) {
      setCurrentSrc(newSrc);
      setHasErrored(shouldUseFallback);
      retryCount.current = 0;
    }
  }, [src, currentSrc, hasErrored, fallbackImage]);

  return (
    <div className={`relative overflow-hidden ${!width || !height ? 'aspect-video' : ''}`}>
      <img
        src={currentSrc}
        alt={alt}
        className={className}
        width={width}
        height={height}
        loading={priority ? 'eager' : loading}
        sizes={sizes}
        style={{
          ...style,
          ...(width && height && { aspectRatio: `${width}/${height}` })
        }}
        onLoad={handleLoad}
        onError={handleError}
        {...(priority && { fetchPriority: 'high' as const })}
      />
    </div>
  );
};