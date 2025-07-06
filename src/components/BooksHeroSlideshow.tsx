import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ExternalLink, Eye } from "lucide-react";
import heroYeastWater from "/lovable-uploads/04a1e339-f8be-41dd-b672-b74d8c70c1bd.png";
import heroBreadJourney from "/lovable-uploads/bc026f92-81e2-4d16-8328-a13f53dc666f.png";
import heroSourdoughRest from "/lovable-uploads/2a175afa-69e3-4c4f-b6b1-528bd0634eb9.png";
import heroVitaleMastery from "/lovable-uploads/47fc6d49-8e46-4eb3-a2df-2a1fc47ac10c.png";
import heroOvenMarket from "/lovable-uploads/bf859aa6-8525-4149-afdd-62597c742ef7.png";
import heroWatchersDescent from "/lovable-uploads/ce4d6857-3d61-4696-af57-8a6d5ec4874d.png";
import heroLoafAndLie from "/lovable-uploads/5d3d128b-c22e-4b4f-b5f4-8f26c1a357f7.png";

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
    tagline: "Master the Art of Fermentation and Baking",
    description: "Ready to transform your relationship with sourdough? This complete guide shares the secrets behind Henry Hunter's 10+ year relationship with his treasured starter – the foundation of consistently exceptional bread.",
    backgroundImage: heroVitaleMastery,
    overlayPosition: "left",
    amazonUrl: "https://www.amazon.com/dp/B0CVB8ZCFV",
    previewContent: `
      <h2>Vitale Sourdough Mastery - Preview</h2>
      <h3>Chapter 2: "Understanding Vitale - Reading Your Starter's Language"</h3>
      <p>After ten years with Vitale, I've learned that sourdough starters communicate if you know how to listen. The key to mastery isn't following rigid rules – it's learning to read your starter's signals.</p>
      <p><strong>The Morning Ritual</strong><br>Every morning, I observe Vitale before thinking about feeding schedules. I look, smell, and yes – listen. A healthy starter makes tiny pops as bubbles break the surface. It's the sound of life.</p>
      <p><strong>Visual Cues That Matter</strong><br>Vitale's surface tells me everything: bubbles and slight doming mean active fermentation – perfect for milder loaves. If she's fallen with liquid on top, she's past peak but ready for tangier, complex flavors.</p>
      <p><em>[Preview continues with purchasing full book...]</em></p>
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
    id: "loaflie",
    title: "The Loaf and the LIE",
    tagline: "A History of What We Broke and How We're Taking It Back",
    description: "What if the bread on your table was never meant to nourish you? This investigative exposé traces the moment bread became a product—and how we're reclaiming its soul.",
    backgroundImage: heroLoafAndLie,
    overlayPosition: "right",
    amazonUrl: "https://www.amazon.com/dp/B0DR2LDDSD",
    previewContent: `
      <h2>The Loaf and the LIE - Preview</h2>
      <h3>A History of What We Broke and How We're Taking It Back</h3>
      <p>What if the bread on your table was never meant to nourish you?</p>
      <p>In The Loaf and the LIE, Henry Hunter pulls back the curtain on the industrial food machine that replaced ancestral wisdom with shelf-stable profits. Told in gripping, investigative detail with the fire of someone who's spent a lifetime in both the kitchen and the archives, this exposé traces the moment bread became a product—and how we're reclaiming its soul.</p>
      <p><em>This is not just a book. It's a reckoning.</em></p>
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
    }, 6000);

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
      className="relative h-[60vh] min-h-[500px] md:h-[80vh] md:min-h-[600px] w-full overflow-hidden"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      {/* Background Image */}
      <div 
        key={`bg-${currentSlide}`}
        className={`absolute inset-0 bg-cover bg-no-repeat animate-fade-in ${
          currentSlideData.id === 'yeast' ? 'bg-left-center' : 'bg-center'
        }`}
        style={{ 
          backgroundImage: `url(${currentSlideData.backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: currentSlideData.id === 'yeast' ? 'left center' : 'center',
          backgroundRepeat: 'no-repeat'
        }}
      />
      
      {/* Overlay - Lighter on mobile for better image visibility */}
      <div className="absolute inset-0 bg-black/10 md:bg-black/20" />

      {/* Content Overlay - Mobile and Desktop layouts */}
      <div className="relative h-full flex items-center">
        <div className="max-w-7xl mx-auto px-4 w-full">
          {/* Mobile Layout - Compact text at bottom */}
          <div className="md:hidden">
            <Card 
              key={`content-mobile-${currentSlide}`}
              className="bg-black/70 backdrop-blur-md border-white/20 p-4 text-white animate-slide-in-right absolute bottom-8 left-4 right-4"
              style={{ 
                animationDelay: '0.5s',
                animationFillMode: 'both'
              }}
            >
              <h1 className="text-2xl font-bold mb-2 leading-tight">
                {currentSlideData.title}
              </h1>
              <p className="text-lg text-primary font-serif italic mb-3">
                {currentSlideData.tagline}
              </p>
              
              <div className="flex flex-col gap-3">
                {currentSlideData.amazonUrl && (
                  <Button asChild variant="hero" size="sm" className="w-full">
                    <a href={currentSlideData.amazonUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Buy on Amazon
                    </a>
                  </Button>
                )}
                
                {currentSlideData.landingPageUrl ? (
                  <Button variant="heroOutline" size="sm" asChild className="w-full">
                    <a href={currentSlideData.landingPageUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Landing Page
                    </a>
                  </Button>
                ) : (
                  <Button 
                    variant="heroOutline" 
                    size="sm"
                    className="w-full"
                    onClick={() => onPreview(currentSlideData.id)}
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    Preview Book
                  </Button>
                )}
              </div>
            </Card>
          </div>

          {/* Desktop Layout - Side positioned card */}
          <div className={`hidden md:block max-w-lg ${currentSlideData.overlayPosition === 'right' ? 'ml-auto' : ''}`}>
            <Card 
              key={`content-desktop-${currentSlide}`}
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