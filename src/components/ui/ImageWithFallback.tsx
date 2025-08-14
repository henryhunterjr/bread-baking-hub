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
  const [currentSrc, setCurrentSrc] = useState(src);
  const [hasErrored, setHasErrored] = useState(false);
  const retryCount = useRef(0);
  const fallbackImage = '/hero/fallback.jpg';

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
    if (failedSrc.includes('/hero/fallback.jpg')) {
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
    if (src !== currentSrc && !hasErrored) {
      setCurrentSrc(src);
      setHasErrored(false);
      retryCount.current = 0;
    }
  }, [src, currentSrc, hasErrored]);

  return (
    <div className="relative overflow-hidden">
      {/* Loading skeleton */}
      {!hasErrored && (
        <div 
          className="absolute inset-0 bg-muted rounded-md overflow-hidden animate-pulse"
          style={{ display: retryCount.current === 0 ? 'block' : 'none' }}
          aria-hidden="true"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-muted-foreground/10 to-transparent" />
          <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        </div>
      )}
      
      <img
        src={currentSrc}
        alt={alt}
        className={className}
        width={width}
        height={height}
        loading={priority ? 'eager' : loading}
        sizes={sizes}
        style={style}
        onLoad={handleLoad}
        onError={handleError}
        {...(priority && { fetchPriority: 'high' as const })}
      />
    </div>
  );
};