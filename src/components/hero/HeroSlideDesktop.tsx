import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Eye } from "lucide-react";
import { HeroSlide } from "@/types/hero-slide";

interface HeroSlideDesktopProps {
  slide: HeroSlide;
  slideIndex: number;
  onPreview: (slideId: string) => void;
  showCard: boolean;
}

const HeroSlideDesktop = ({ slide, slideIndex, onPreview, showCard }: HeroSlideDesktopProps) => {
  return (
    <div className={`hidden md:block max-w-lg ${slide.overlayPosition === 'right' ? 'ml-auto' : ''}`}>
      <Card 
        key={`content-desktop-${slideIndex}`}
        className={`bg-black/60 backdrop-blur-md border-white/20 p-8 text-white transition-all duration-500 ${
          showCard 
            ? `opacity-100 ${slide.overlayPosition === 'left' ? 'translate-x-0' : 'translate-x-0'}` 
            : `opacity-0 ${slide.overlayPosition === 'left' ? '-translate-x-8' : 'translate-x-8'}`
        }`}
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
          {slide.title}
        </h1>
        <p className="text-xl md:text-2xl text-primary font-serif italic mb-6">
          {slide.tagline}
        </p>
        <p className="text-lg mb-8 leading-relaxed opacity-90">
          {slide.description}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4">
          {slide.amazonUrl && (
            <Button asChild variant="hero" size="lg">
              <a href={slide.amazonUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-2 h-5 w-5" />
                Buy on Amazon
              </a>
            </Button>
          )}
          
          {slide.landingPageUrl ? (
            <Button variant="heroOutline" size="lg" asChild>
              <a href={slide.landingPageUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-2 h-5 w-5" />
                Landing Page
              </a>
            </Button>
          ) : (
            <Button 
              variant="heroOutline" 
              size="lg"
              onClick={() => onPreview(slide.id)}
            >
              <Eye className="mr-2 h-5 w-5" />
              Preview Book
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
};

export default HeroSlideDesktop;