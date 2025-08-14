import React, { useState, useCallback, useRef } from 'react';

interface BackgroundImageWithFallbackProps {
  src: string;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

// Set to track URLs that have already been logged to prevent spam
const loggedErrors = new Set<string>();

export const BackgroundImageWithFallback: React.FC<BackgroundImageWithFallbackProps> = ({
  src,
  className = '',
  style = {},
  children,
}) => {
  const [currentSrc, setCurrentSrc] = useState(src);
  const [hasErrored, setHasErrored] = useState(false);
  const retryCount = useRef(0);
  const fallbackImage = '/hero/fallback.jpg';

  const logError = useCallback((url: string, error?: string) => {
    if (!loggedErrors.has(url)) {
      console.error(`BackgroundImageWithFallback: Failed to load image: ${url}`, error || '');
      loggedErrors.add(url);
    }
  }, []);

  const handleError = useCallback(() => {
    // Don't retry if we're already on the fallback image
    if (currentSrc.includes('/hero/fallback.jpg')) {
      logError(currentSrc, 'Fallback image also failed');
      return;
    }

    // Log the error once
    logError(currentSrc);

    // Retry once for transient network failures
    if (retryCount.current === 0) {
      retryCount.current = 1;
      
      setTimeout(() => {
        if (!hasErrored) {
          setCurrentSrc(src + '?retry=1'); // Add cache-busting parameter
        }
      }, 250);
      
      return;
    }

    // After retry fails, use fallback
    setHasErrored(true);
    setCurrentSrc(fallbackImage);
  }, [src, hasErrored, currentSrc, logError]);

  // Reset state when src prop changes
  React.useEffect(() => {
    if (src !== currentSrc && !hasErrored) {
      setCurrentSrc(src);
      setHasErrored(false);
      retryCount.current = 0;
    }
  }, [src, currentSrc, hasErrored]);

  // Create a hidden image element to test loading
  React.useEffect(() => {
    const img = new Image();
    img.onload = () => {
      // Image loaded successfully
      retryCount.current = 0;
    };
    img.onerror = handleError;
    img.src = currentSrc;

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [currentSrc, handleError]);

  return (
    <div
      className={className}
      style={{
        ...style,
        backgroundImage: `url(${currentSrc})`,
      }}
    >
      {children}
    </div>
  );
};