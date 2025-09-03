// Phase 3: Third-party script optimization
import React, { useEffect, useRef } from 'react';

// Delayed analytics loader
export const LazyAnalytics = () => {
  useEffect(() => {
    // Load analytics after first paint
    const loadAnalytics = () => {
      if ('requestIdleCallback' in window) {
        requestIdleCallback(() => {
          // Initialize analytics here
          console.log('Analytics initialized after idle');
        });
      } else {
        setTimeout(() => {
          console.log('Analytics initialized after timeout');
        }, 2000);
      }
    };

    if (document.readyState === 'complete') {
      loadAnalytics();
    } else {
      window.addEventListener('load', loadAnalytics);
    }

    return () => window.removeEventListener('load', loadAnalytics);
  }, []);

  return null;
};

// Social embed with intersection observer
export const LazySocialEmbed = ({ 
  embedUrl, 
  placeholder, 
  className = '' 
}: { 
  embedUrl: string; 
  placeholder: React.ReactNode;
  className?: string;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = React.useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isLoaded) {
          setIsLoaded(true);
          // Dynamically load the real embed (placeholder implementation)
          if (element) {
            element.innerHTML = `<iframe src="${embedUrl}" width="100%" height="400" frameborder="0"></iframe>`;
          }
          observer.disconnect();
        }
      },
      { rootMargin: '200px' }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [embedUrl, isLoaded]);

  return (
    <div 
      ref={ref} 
      className={className}
      aria-label="Social content placeholder"
    >
      {!isLoaded && placeholder}
    </div>
  );
};

// YouTube embed optimizer
export const LazyYouTubeEmbed = ({ 
  videoId, 
  title = "YouTube video",
  className = "aspect-video"
}: { 
  videoId: string; 
  title?: string;
  className?: string;
}) => {
  const [isLoaded, setIsLoaded] = React.useState(false);

  const handlePlay = () => {
    setIsLoaded(true);
  };

  if (isLoaded) {
    return (
      <iframe
        className={className}
        src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    );
  }

  return (
    <div 
      className={`${className} bg-muted rounded-lg flex items-center justify-center cursor-pointer group`}
      onClick={handlePlay}
    >
      <div className="text-center">
        <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mb-4 mx-auto group-hover:bg-red-700 transition-colors">
          <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z"/>
          </svg>
        </div>
        <p className="text-sm text-muted-foreground">Click to load {title}</p>
      </div>
    </div>
  );
};