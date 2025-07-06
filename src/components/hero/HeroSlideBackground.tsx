import { HeroSlide } from "@/types/hero-slide";

interface HeroSlideBackgroundProps {
  slide: HeroSlide;
  slideIndex: number;
}

const HeroSlideBackground = ({ slide, slideIndex }: HeroSlideBackgroundProps) => {
  // Individual positioning for each book to showcase the cover properly on mobile
  const getBackgroundPosition = () => {
    switch (slide.id) {
      case 'yeast':
        return 'bg-left-center'; // Centered and looks good ✓
      case 'journey':
        return 'bg-center md:bg-center bg-[center_left]'; // Was too far right, move left
      case 'sourdough':
        return 'bg-center md:bg-center bg-[center_right]'; // Was too far left, move right
      case 'vitale':
        return 'bg-center md:bg-center bg-[center_left]'; // Was too far right, move left
      case 'market':
        return 'bg-center md:bg-center bg-[center_right]'; // Was too far left, move right
      case 'loaflie':
        return 'bg-center md:bg-center bg-[center_right]'; // Was too far left, move right to show book
      case 'watchers':
        return 'bg-center md:bg-center bg-[center_left]'; // Was too far right, move left to show book
      default:
        return 'bg-center';
    }
  };

  return (
    <>
      {/* Background Image - Individually positioned for each book cover */}
      <div 
        key={`bg-${slideIndex}`}
        className={`absolute inset-0 bg-cover bg-no-repeat animate-fade-in ${getBackgroundPosition()}`}
        style={{ 
          backgroundImage: `url(${slide.backgroundImage})`
        }}
      />
      
      {/* Overlay - Very light on mobile for maximum book cover visibility */}
      <div className="absolute inset-0 bg-black/5 md:bg-black/20" />
    </>
  );
};

export default HeroSlideBackground;