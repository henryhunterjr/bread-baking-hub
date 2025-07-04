import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ExternalLink, Eye } from "lucide-react";
import heroYeastWater from "/lovable-uploads/5e067aee-63d8-4d0b-80d3-075211fc0e3b.png";
import heroBreadJourney from "/lovable-uploads/bc026f92-81e2-4d16-8328-a13f53dc666f.png";
import heroSourdoughRest from "/lovable-uploads/901585f4-68ad-4944-ac87-dae24175df7d.png";
import heroVitaleMastery from "@/assets/hero-vitale-mastery.jpg";
import heroOvenMarket from "@/assets/hero-oven-market-new.jpg";
import heroWatchersDescent from "@/assets/hero-watchers-descent.jpg";

interface HeroSlide {
  id: string;
  title: string;
  tagline: string;
  description: string;
  backgroundImage: string;
  overlayPosition: "left" | "right";
  amazonUrl?: string;
  landingPageUrl?: string;
  previewContent: string;
}

const slides: HeroSlide[] = [
  {
    id: "yeast",
    title: "A Comprehensive Guide to Yeast Water",
    tagline: "Unlock the Secrets of Natural Fermentation",
    description: "Discover the ancient art of wild yeast cultivation through fruit fermentation. A complete guide to creating and using yeast water as an alternative to traditional sourdough starters.",
    backgroundImage: heroYeastWater,
    overlayPosition: "right",
    amazonUrl: "https://www.amazon.com/dp/B0CGMF3NBS",
    previewContent: `
      <h2>The Yeast Water Handbook - Preview</h2>
      <h3>Chapter 1: What is Yeast Water?</h3>
      <p>Yeast water is one of the oldest forms of natural leavening, predating sourdough starters by thousands of years. It's created by fermenting fruit, herbs, or even vegetables in water to capture wild yeasts.</p>
      <p>Unlike sourdough starters, yeast water doesn't require daily feeding or maintenance. It's perfect for bakers who want the benefits of wild yeast without the commitment...</p>
    `
  },
  {
    id: "journey",
    title: "Bread: A Journey",
    tagline: "Discover the Rich Traditions of Bread-Making",
    description: "Explore bread's profound impact on human civilization. From ancient grains to modern artisan techniques, this comprehensive guide weaves together history, science, and practical baking wisdom.",
    backgroundImage: heroBreadJourney,
    overlayPosition: "left",
    amazonUrl: "https://www.amazon.com/dp/B0CH2D2GDB",
    previewContent: `
      <h2>Bread: A Journey - Preview</h2>
      <h3>Introduction: The Universal Language of Bread</h3>
      <p>Bread is humanity's most fundamental food technology. From the first accidentally fermented grain paste to today's artisan sourdough, bread has been our constant companion through history, culture, and community.</p>
      <p>This book explores not just how to bake bread, but why bread matters—scientifically, culturally, and personally...</p>
    `
  },
  {
    id: "sourdough",
    title: "Sourdough for the Rest of Us",
    tagline: "Perfection Not Required",
    description: "Finally, a sourdough guide that doesn't take itself too seriously. This book cuts through the mystique to deliver practical advice that works in real kitchens for real people.",
    backgroundImage: heroSourdoughRest,
    overlayPosition: "right",
    amazonUrl: "https://read.amazon.com/sample/B0FGQPM4TG?clientId=share",
    previewContent: `
      <h2>Sourdough for the Rest of Us - Preview</h2>
      <h3>Chapter 1: Your Sourdough Starter - The Drama Queen of the Kitchen</h3>
      <p>If you've ever felt personally attacked by a jar of bubbling flour and water, welcome to the world of sourdough. Your starter is a living, breathing diva—demanding, moody, and occasionally unpredictable. But once you learn how to handle its quirks, it'll reward you with the best bread you've ever tasted.</p>
      <p>Think of your starter as a low-maintenance pet that lives in your kitchen. It doesn't need walks or belly rubs, but it does need food, warmth, and patience...</p>
    `
  },
  {
    id: "vitale",
    title: "Vitale Sourdough Mastery",
    tagline: "Advanced Techniques for Serious Bakers",
    description: "Take your sourdough skills to the professional level. This advanced guide covers complex fermentation schedules, professional shaping methods, and troubleshooting for consistent results.",
    backgroundImage: heroVitaleMastery,
    overlayPosition: "left",
    amazonUrl: "https://www.amazon.com/dp/B0CVB8ZCFV",
    previewContent: `
      <h2>Vitale Sourdough Mastery - Preview</h2>
      <h3>Advanced Fermentation Control</h3>
      <p>This book is for bakers ready to take their sourdough skills to the professional level. We'll explore complex fermentation schedules, temperature control, and the subtle art of reading your dough.</p>
      <p>You'll learn to create consistently excellent bread through understanding the science behind fermentation and applying professional techniques...</p>
    `
  },
  {
    id: "market",
    title: "From Oven to Market",
    tagline: "Selling Bread at Farmers' Markets & Beyond",
    description: "Turn your baking passion into a profitable business. Practical advice on scaling recipes, pricing products, and building a customer base in local markets.",
    backgroundImage: heroOvenMarket,
    overlayPosition: "right",
    amazonUrl: "https://www.amazon.com/dp/B0D8PNGC7Q",
    previewContent: `
      <h2>From Oven to Market - Preview</h2>
      <h3>Turning Passion into Profit</h3>
      <p>Many home bakers dream of turning their passion into a business, but don't know where to start. This book provides a practical roadmap from your home kitchen to farmers' markets and beyond.</p>
      <p>You'll learn about scaling recipes, pricing products, marketing strategies, and the legal requirements for selling food...</p>
    `
  },
  {
    id: "watchers",
    title: "The Watchers' Descent",
    tagline: "A Science Fiction Epic",
    description: "A departure from bread baking into the realm of science fiction. An epic tale of humanity's encounter with otherworldly beings and the choices that define our future.",
    backgroundImage: heroWatchersDescent,
    overlayPosition: "left",
    amazonUrl: "https://www.amazon.com/dp/B0DR2LDDSD",
    landingPageUrl: "https://the-watchers-descent.lovable.app/",
    previewContent: `
      <h2>The Watchers' Descent - Preview</h2>
      <h3>A Science Fiction Epic</h3>
      <p>In a universe where humanity thought they were alone, the arrival of the Watchers changes everything. This epic tale explores first contact, the nature of consciousness, and the difficult choices that define our species.</p>
      <p>Follow Dr. Sarah Chen as she leads humanity's first diplomatic mission to beings whose very existence challenges everything we thought we knew about the cosmos...</p>
    `
  }
];

interface BooksHeroSlideshowProps {
  onPreview: (slideId: string) => void;
}

const BooksHeroSlideshow = ({ onPreview }: BooksHeroSlideshowProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 8000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const currentSlideData = slides[currentSlide];

  return (
    <section 
      className="relative h-[80vh] min-h-[600px] w-full overflow-hidden"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      {/* Background Image */}
      <div 
        key={`bg-${currentSlide}`}
        className={`absolute inset-0 bg-cover bg-no-repeat animate-fade-in ${
          currentSlideData.id === 'yeast' ? 'bg-left' : 'bg-center'
        }`}
        style={{ backgroundImage: `url(${currentSlideData.backgroundImage})` }}
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Content Overlay */}
      <div className="relative h-full flex items-center">
        <div className="max-w-7xl mx-auto px-4 w-full">
          <div className={`max-w-lg ${currentSlideData.overlayPosition === 'right' ? 'ml-auto' : ''}`}>
            <Card 
              key={`content-${currentSlide}`}
              className={`bg-black/60 backdrop-blur-md border-white/20 p-8 text-white animate-slide-in-right ${
                currentSlideData.overlayPosition === 'left' ? 'animate-slide-in-left' : ''
              }`}
              style={{ 
                animationDelay: '0.5s',
                animationFillMode: 'both'
              }}
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
                {currentSlideData.title}
              </h1>
              <p className="text-xl md:text-2xl text-primary font-serif italic mb-6">
                {currentSlideData.tagline}
              </p>
              <p className="text-lg mb-8 leading-relaxed opacity-90">
                {currentSlideData.description}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                {currentSlideData.amazonUrl && (
                  <Button asChild variant="hero" size="lg">
                    <a href={currentSlideData.amazonUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="mr-2 h-5 w-5" />
                      Buy on Amazon
                    </a>
                  </Button>
                )}
                
                {currentSlideData.landingPageUrl ? (
                  <Button variant="heroOutline" size="lg" asChild>
                    <a href={currentSlideData.landingPageUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="mr-2 h-5 w-5" />
                      Landing Page
                    </a>
                  </Button>
                ) : (
                  <Button 
                    variant="heroOutline" 
                    size="lg"
                    onClick={() => onPreview(currentSlideData.id)}
                  >
                    <Eye className="mr-2 h-5 w-5" />
                    Preview Book
                  </Button>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white border-white/20"
        onClick={goToPrevious}
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white border-white/20"
        onClick={goToNext}
      >
        <ChevronRight className="h-6 w-6" />
      </Button>

      {/* Dot Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-3">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide 
                ? 'bg-primary scale-125' 
                : 'bg-white/50 hover:bg-white/80'
            }`}
            onClick={() => goToSlide(index)}
          />
        ))}
      </div>
    </section>
  );
};

export default BooksHeroSlideshow;