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
  const [showCard, setShowCard] = useState(false);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      // Hide card first
      setShowCard(false);
      
      // Wait for card to disappear, then change slide
      setTimeout(() => {
        setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
      }, 500);
    }, 9000); // 9 seconds total per slide (3s image + 6s with card)

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  // Show card after image loads
  useEffect(() => {
    setShowCard(false);
    const cardTimer = setTimeout(() => {
      setShowCard(true);
    }, 2500); // Show card after 2.5 seconds

    return () => clearTimeout(cardTimer);
  }, [currentSlide]);

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
            showCard={showCard}
          />
          
          <HeroSlideDesktop 
            slide={currentSlideData} 
            slideIndex={currentSlide} 
            onPreview={onPreview}
            showCard={showCard}
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