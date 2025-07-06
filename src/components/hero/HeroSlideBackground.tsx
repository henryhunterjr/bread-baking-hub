import { HeroSlide } from "@/types/hero-slide";

interface HeroSlideBackgroundProps {
  slide: HeroSlide;
  slideIndex: number;
}

const HeroSlideBackground = ({ slide, slideIndex }: HeroSlideBackgroundProps) => {
  return (
    <>
      {/* Background Image - Optimized for mobile book cover visibility */}
      <div 
        key={`bg-${slideIndex}`}
        className={`absolute inset-0 bg-cover bg-no-repeat animate-fade-in ${
          // Mobile positioning to show book covers better
          slide.id === 'yeast' ? 'bg-left-center' : 'bg-center md:bg-center bg-[center_top_25%]'
        }`}
        style={{ 
          backgroundImage: `url(${slide.backgroundImage})`
        }}
      />
      
      {/* Overlay - Lighter on mobile for better image visibility */}
      <div className="absolute inset-0 bg-black/10 md:bg-black/20" />
    </>
  );
};

export default HeroSlideBackground;