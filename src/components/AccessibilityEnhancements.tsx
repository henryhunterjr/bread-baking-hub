import * as React from 'react';

// Enhanced accessibility fixes for final validation
export const AccessibilityEnhancements = () => {
  React.useEffect(() => {
    // Ensure all images have meaningful alt text
    const images = document.querySelectorAll('img');
    images.forEach(img => {
      if (!img.alt || img.alt.trim() === '' || img.alt.includes('.')) {
        console.warn('Image missing meaningful alt text:', img.src);
      }
    });

    // Check for proper heading hierarchy
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    let previousLevel = 0;
    headings.forEach(heading => {
      const currentLevel = parseInt(heading.tagName.charAt(1));
      if (currentLevel > previousLevel + 1) {
        console.warn('Heading hierarchy issue - skipped level:', heading);
      }
      previousLevel = currentLevel;
    });

    // Ensure all interactive elements have accessible names
    const interactiveElements = document.querySelectorAll('button, a, input, select, textarea');
    interactiveElements.forEach(element => {
      const hasAccessibleName = element.getAttribute('aria-label') || 
                               element.getAttribute('aria-labelledby') ||
                               element.textContent?.trim() ||
                               element.getAttribute('title');
      
      if (!hasAccessibleName) {
        console.warn('Interactive element missing accessible name:', element);
      }
    });

    // Check for proper landmark structure
    const main = document.querySelector('main');
    if (!main) {
      console.warn('Page missing main landmark');
    }

    const nav = document.querySelector('nav');
    if (!nav) {
      console.warn('Page missing navigation landmark');
    }

    // Ensure color contrast meets WCAG standards (this is a basic check)
    const elementsToCheck = document.querySelectorAll('p, span, div, button, a');
    elementsToCheck.forEach(element => {
      const styles = getComputedStyle(element);
      const color = styles.color;
      const backgroundColor = styles.backgroundColor;
      
      // Basic contrast check (you'd need a proper contrast calculator for production)
      if (color === backgroundColor) {
        console.warn('Potential contrast issue:', element);
      }
    });

  }, []);

  return null; // This is a utility component that doesn't render anything
};

// Hook for improved focus management
export const useAccessibleFocus = () => {
  React.useEffect(() => {
    // Enhanced focus outline for better visibility
    const style = document.createElement('style');
    style.textContent = `
      *:focus-visible {
        outline: 3px solid var(--primary) !important;
        outline-offset: 2px !important;
        border-radius: 4px !important;
      }
      
      /* High contrast mode support */
      @media (prefers-contrast: high) {
        *:focus-visible {
          outline: 4px solid currentColor !important;
          outline-offset: 3px !important;
        }
      }
      
      /* Ensure focus is never hidden */
      *:focus {
        z-index: 9999 !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return {
    setFocus: (selector: string) => {
      const element = document.querySelector(selector) as HTMLElement;
      if (element) {
        element.focus();
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    },
    
    announceLiveRegion: (message: string) => {
      const announcement = document.createElement('div');
      announcement.setAttribute('aria-live', 'polite');
      announcement.setAttribute('aria-atomic', 'true');
      announcement.className = 'sr-only';
      announcement.textContent = message;
      
      document.body.appendChild(announcement);
      
      setTimeout(() => {
        document.body.removeChild(announcement);
      }, 1000);
    }
  };
};

// Enhanced skip link for better keyboard navigation
export const EnhancedSkipLink = () => {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 bg-primary text-primary-foreground px-6 py-3 rounded-md font-medium transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-primary/50"
      tabIndex={0}
    >
      Skip to main content
    </a>
  );
};