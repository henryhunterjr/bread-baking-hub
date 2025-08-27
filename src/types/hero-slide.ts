export interface HeroSlide {
  id: string;
  title: string;
  tagline: string;
  description: string;
  backgroundImage: string;
  overlayPosition: "left" | "right";
  amazonUrl?: string;
  landingPageUrl?: string;
  videoUrl?: string;
  previewContent: string;
}

export interface BooksHeroSlideshowProps {
  onPreview: (slideId: string) => void;
}