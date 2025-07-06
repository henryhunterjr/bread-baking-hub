import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Eye } from "lucide-react";
import { HeroSlide } from "@/types/hero-slide";

interface HeroSlideMobileProps {
  slide: HeroSlide;
  slideIndex: number;
  onPreview: (slideId: string) => void;
}

const HeroSlideMobile = ({ slide, slideIndex, onPreview }: HeroSlideMobileProps) => {
  return (
    <div className="md:hidden">
      <Card 
        key={`content-mobile-${slideIndex}`}
        className="bg-black/70 backdrop-blur-md border-white/20 p-4 text-white animate-fade-in absolute bottom-8 left-4 right-4 opacity-0"
        style={{ 
          animationDelay: '3s',
          animationFillMode: 'both',
          animationDuration: '0.8s'
        }}
      >
        <h1 className="text-2xl font-bold mb-2 leading-tight">
          {slide.title}
        </h1>
        <p className="text-lg text-primary font-serif italic mb-3">
          {slide.tagline}
        </p>
        
        <div className="flex flex-col gap-3">
          {slide.amazonUrl && (
            <Button asChild variant="hero" size="sm" className="w-full">
              <a href={slide.amazonUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-2 h-4 w-4" />
                Buy on Amazon
              </a>
            </Button>
          )}
          
          {slide.landingPageUrl ? (
            <Button variant="heroOutline" size="sm" asChild className="w-full">
              <a href={slide.landingPageUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-2 h-4 w-4" />
                Landing Page
              </a>
            </Button>
          ) : (
            <Button 
              variant="heroOutline" 
              size="sm"
              className="w-full"
              onClick={() => onPreview(slide.id)}
            >
              <Eye className="mr-2 h-4 w-4" />
              Preview Book
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
};

export default HeroSlideMobile;