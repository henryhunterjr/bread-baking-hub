import { useState, useEffect } from "react";
import { BooksHeroSlideshowProps } from "@/types/hero-slide";
import { heroSlides } from "@/data/hero-slides";
import HeroSlideBackground from "@/components/hero/HeroSlideBackground";
import HeroSlideMobile from "@/components/hero/HeroSlideMobile";
import HeroSlideDesktop from "@/components/hero/HeroSlideDesktop";
import HeroSlideNavigation from "@/components/hero/HeroSlideNavigation";

const BooksHeroSlideshow = ({ onPreview }: BooksHeroSlideshowProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000); // 6 seconds total per slide

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const currentSlideData = heroSlides[currentSlide];

  return (
    <section 
      className="relative h-[60vh] min-h-[500px] md:h-[80vh] md:min-h-[600px] w-full overflow-hidden"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      <HeroSlideBackground slide={currentSlideData} slideIndex={currentSlide} />

      {/* Content Overlay - Mobile and Desktop layouts */}
      <div className="relative h-full flex items-center">
        <div className="max-w-7xl mx-auto px-4 w-full">
          <HeroSlideMobile 
            slide={currentSlideData} 
            slideIndex={currentSlide} 
            onPreview={onPreview} 
          />
          
          <HeroSlideDesktop 
            slide={currentSlideData} 
            slideIndex={currentSlide} 
            onPreview={onPreview} 
          />
        </div>
      </div>

      <HeroSlideNavigation
        totalSlides={heroSlides.length}
        currentSlide={currentSlide}
        onPrevious={goToPrevious}
        onNext={goToNext}
        onGoToSlide={goToSlide}
      />
    </section>
  );
};

export default BooksHeroSlideshow;