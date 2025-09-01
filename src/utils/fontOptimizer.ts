// Phase 2: Font optimization utilities
export class FontOptimizer {
  private static instance: FontOptimizer;
  private loadedFonts = new Set<string>();

  static getInstance(): FontOptimizer {
    if (!FontOptimizer.instance) {
      FontOptimizer.instance = new FontOptimizer();
    }
    return FontOptimizer.instance;
  }

  // Preload critical fonts
  preloadFont(href: string, weight?: string): void {
    if (this.loadedFonts.has(href)) return;

    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'font';
    link.type = 'font/woff2';
    link.href = href;
    link.crossOrigin = 'anonymous';
    
    if (weight) {
      link.dataset.weight = weight;
    }

    document.head.appendChild(link);
    this.loadedFonts.add(href);
  }

  // Load fonts with display: swap
  loadFontFace(
    family: string, 
    src: string, 
    options: {
      weight?: string;
      style?: string;
      display?: 'auto' | 'block' | 'swap' | 'fallback' | 'optional';
    } = {}
  ): void {
    const { weight = '400', style = 'normal', display = 'swap' } = options;
    
    const fontFace = new FontFace(family, `url(${src})`, {
      weight,
      style,
      display
    });

    fontFace.load().then((loadedFont) => {
      document.fonts.add(loadedFont);
    }).catch((error) => {
      console.warn(`Failed to load font ${family}:`, error);
    });
  }

  // Remove unused font loading from head
  removeUnusedFontLinks(): void {
    const fontLinks = document.querySelectorAll('link[rel="stylesheet"][href*="fonts.googleapis.com"]');
    fontLinks.forEach(link => {
      // Keep only critical fonts (Playfair Display and Inter)
      const href = link.getAttribute('href') || '';
      if (!href.includes('Playfair+Display') && !href.includes('Inter')) {
        link.remove();
      }
    });
  }

  // Initialize optimized font loading
  initializeFonts(): void {
    // Preload critical font files used above the fold
    this.preloadFont(
      'https://fonts.gstatic.com/s/playfairdisplay/v35/nuFvD-vYSZviVYUb_rj3ij__anPXJzDwcbmjWBN2PKdFvXDXbtM.woff2',
      '400'
    );
    
    this.preloadFont(
      'https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyeMZhrib2Bg-4.woff2',
      '400'
    );

    // Remove any unused font links
    this.removeUnusedFontLinks();
  }
}

// Auto-initialize on DOM ready
if (typeof window !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    const fontOptimizer = FontOptimizer.getInstance();
    fontOptimizer.initializeFonts();
  });
}

export const fontOptimizer = FontOptimizer.getInstance();
