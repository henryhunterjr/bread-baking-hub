// Utility to handle external image loading errors gracefully
export const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement;
  if (!img) return;

  // Check if this is an external image (from external domains)
  const isExternal = img.src && (
    img.src.includes('bakinggreatbread.blog') ||
    img.src.includes('bakinggreatbread.com') ||
    img.src.includes('secure.gravatar.com') ||
    img.src.includes('i0.wp.com') ||
    img.src.includes('wp.com')
  );

  if (isExternal) {
    // Suppress console errors for external images
    console.debug('External image failed to load (suppressed):', img.src);
    
    // Set a placeholder or hide the image
    img.style.display = 'none';
    
    // Optionally show a fallback
    const fallback = document.createElement('div');
    fallback.className = 'bg-muted/50 rounded-md p-4 text-center text-sm text-muted-foreground';
    fallback.textContent = 'Image unavailable';
    fallback.style.minHeight = '200px';
    fallback.style.display = 'flex';
    fallback.style.alignItems = 'center';
    fallback.style.justifyContent = 'center';
    
    if (img.parentNode) {
      img.parentNode.insertBefore(fallback, img);
    }
  }
};

// Install global error handler for images
export const installImageErrorHandler = () => {
  // Suppress network errors for external resources in console
  const originalError = console.error;
  const originalWarn = console.warn;
  
  console.error = (...args) => {
    const message = args[0]?.toString() || '';
    
    // Suppress external resource loading errors
    if (
      message.includes('Failed to load resource') ||
      message.includes('net::ERR_') ||
      message.includes('postMessage') ||
      message.includes('target origin') ||
      message.includes('WebSocket') ||
      message.includes('wss://') ||
      (message.includes('status of') && (
        message.includes('502') || 
        message.includes('400') || 
        message.includes('0')
      ))
    ) {
      // Check if it's from external domains we know about
      const hasExternalDomain = args.some(arg => 
        typeof arg === 'string' && (
          arg.includes('bakinggreatbread.blog') ||
          arg.includes('bakinggreatbread.com') ||
          arg.includes('secure.gravatar.com') ||
          arg.includes('googleapis.com')
        )
      );
      
      if (hasExternalDomain || message.includes('postMessage') || message.includes('WebSocket')) {
        return; // Suppress these errors
      }
    }
    
    originalError.apply(console, args);
  };

  console.warn = (...args) => {
    const message = args[0]?.toString() || '';
    
    // Suppress React prop warnings for known issues
    if (
      message.includes('React does not recognize') ||
      message.includes('fetchpriority') ||
      message.includes('%s')
    ) {
      return; // Suppress these warnings
    }
    
    originalWarn.apply(console, args);
  };

  // Add global error handler for images
  document.addEventListener('error', (event) => {
    if (event.target instanceof HTMLImageElement) {
      handleImageError(event);
    }
  }, true);
};