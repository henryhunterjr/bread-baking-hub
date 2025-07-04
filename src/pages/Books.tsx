import Header from "../components/Header";
import Footer from "../components/Footer";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Play, X } from "lucide-react";
import BooksHeroSlideshow from "@/components/BooksHeroSlideshow";
import BooksGrid from "@/components/BooksGrid";

// Import book cover images
import sourdoughCover from "/lovable-uploads/73deb0d3-e387-4693-bdf8-802f89a1ae85.png";
import breadJourneyCover from "/lovable-uploads/171c5ec1-d38e-4257-a2e4-60b75d2e2909.png";

interface BookData {
  id: string;
  title: string;
  subtitle: string;
  author: string;
  description: string;
  coverImage: string;
  previewContent: string;
  audioUrl?: string;
}

const bookData: Record<string, BookData> = {
  sourdough: {
    id: "sourdough",
    title: "Sourdough for the Rest of Us",
    subtitle: "No Perfection Required",
    author: "Henry Hunter",
    description: "Forget the sourdough snobbery—this book is for real bakers who want great bread without the stress. Whether you're just getting started or tired of conflicting advice, Sourdough for the Rest of Us breaks down the process in plain, no-nonsense terms so you can bake with confidence.",
    coverImage: sourdoughCover,
    previewContent: `
      <h2>Sourdough for the Rest of Us - Preview</h2>
      <h3>Chapter 1: Your Sourdough Starter - The Drama Queen of the Kitchen</h3>
      <p>If you've ever felt personally attacked by a jar of bubbling flour and water, welcome to the world of sourdough. Your starter is a living, breathing diva—demanding, moody, and occasionally unpredictable. But once you learn how to handle its quirks, it'll reward you with the best bread you've ever tasted.</p>
      <p>Think of your starter as a low-maintenance pet that lives in your kitchen. It doesn't need walks or belly rubs, but it does need food, warmth, and patience...</p>
      <h4>✓ Troubleshooting made simple</h4>
      <p>Sticky dough? Lifeless starter? Weird oven results? Get straight answers without the fluff. This book cuts through the mystique to deliver practical advice that works in real kitchens for real people.</p>
    `,
    audioUrl: "/audio/sourdough-excerpt.mp3" // Placeholder for future MP3
  },
  journey: {
    id: "journey", 
    title: "Bread: A Journey",
    subtitle: "Through History, Science, Art, and Community",
    author: "Henry Hunter",
    description: "Bread is humanity's most fundamental food technology. From the first accidentally fermented grain paste to today's artisan sourdough, bread has been our constant companion through history, culture, and community. This book explores not just how to bake bread, but why bread matters—scientifically, culturally, and personally.",
    coverImage: breadJourneyCover,
    previewContent: `
      <h2>Bread: A Journey - Preview</h2>
      <h3>Introduction: The Universal Language of Bread</h3>
      <p>Bread is humanity's most fundamental food technology. From the first accidentally fermented grain paste to today's artisan sourdough, bread has been our constant companion through history, culture, and community.</p>
      <p>This book explores not just how to bake bread, but why bread matters—scientifically, culturally, and personally. You'll discover the fascinating history of bread-making, understand the science behind fermentation, and learn advanced techniques that will elevate your baking.</p>
      <h4>What You'll Learn:</h4>
      <ul>
        <li>Historical context and cultural significance of bread</li>
        <li>Scientific principles explained in simple terms</li>
        <li>Advanced techniques and professional methods</li>
        <li>Building community through the art of bread-making</li>
      </ul>
    `,
    audioUrl: "/audio/journey-excerpt.mp3" // Placeholder for future MP3
  },
  market: {
    id: "market",
    title: "From Oven to Market", 
    subtitle: "The Ultimate Guide to Selling Your Artisan Bread",
    author: "Henry Hunter",
    description: "Transform Your Passion Into Profit – The Complete Roadmap from Home Baker to Market Success. Are you a passionate home baker whose friends and family constantly rave about your bread? Do you dream of turning those weekend baking sessions into a thriving business? Written by Henry Hunter, a former television executive who successfully transformed his own baking passion into a profitable farmers market business, this book offers the rare combination of practical business advice and authentic personal experience.",
    coverImage: "/lovable-uploads/f8d77db8-e27f-43fa-ad7d-4d582b56881f.png",
    previewContent: `
      <h2>From Oven to Market - Preview</h2>
      <h3>Transform Your Passion Into Profit</h3>
      <p><strong>The Complete Roadmap from Home Baker to Market Success</strong></p>
      <p>Are you a passionate home baker whose friends and family constantly rave about your bread? Do you dream of turning those weekend baking sessions into a thriving business? "From Oven to Market" is your comprehensive guide to making that dream a reality.</p>
      <p>Written by Henry Hunter, a former television executive who successfully transformed his own baking passion into a profitable farmers market business, this book offers the rare combination of practical business advice and authentic personal experience.</p>
      
      <h4>What You'll Learn:</h4>
      <ul>
        <li>Pricing strategies that maximize profit (learn from the accidental pricing experiment that doubled sales overnight)</li>
        <li>Market setup psychology and customer engagement techniques</li>
        <li>Legal requirements, permits, and business foundations</li>
        <li>Production scaling and time management for market quantities</li>
        <li>Building customer loyalty and expanding beyond farmers markets</li>
      </ul>

      <h3>Chapter 3: "The $10 Lesson That Changed Everything"</h3>
      <p>I still remember the Saturday morning that changed my entire approach to pricing—and it wasn't even my doing.</p>
      <p>My daughter Sarah had volunteered to help at the market while I finished loading the van. "Just watch the booth for ten minutes," I told her, reviewing the price signs one more time. "Everything's clearly marked. Sourdough loaves are $5, baguettes are $3."</p>
      <p>When I arrived at the market, I found Sarah cheerfully chatting with customers, making change with the confidence of someone who'd been doing this for years. It wasn't until our third customer of the day handed me a ten-dollar bill for a single sourdough loaf that I realized something was wrong...</p>
      <p><em>[Preview continues with purchasing full book...]</em></p>
    `,
    audioUrl: "/audio/market-excerpt.mp3" // Placeholder for future MP3
  }
};

const Books = () => {
  const [selectedPreview, setSelectedPreview] = useState<string | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const showPreview = (slideId: string) => {
    setSelectedPreview(slideId);
  };

  const closePreview = () => {
    setSelectedPreview(null);
    setIsPlayingAudio(false);
  };

  const selectedBook = selectedPreview ? bookData[selectedPreview] : null;

  const playAudioExcerpt = () => {
    if (selectedBook?.audioUrl) {
      // Future implementation with actual audio file
      setIsPlayingAudio(true);
      // Placeholder - will implement actual audio playback
      setTimeout(() => setIsPlayingAudio(false), 3000);
    }
  };

  return (
    <div className="bg-background text-foreground min-h-screen">
      <Header />
      
      {/* Hero Slideshow */}
      <BooksHeroSlideshow onPreview={(slideId) => showPreview(slideId)} />

      {/* Books Grid */}
      <BooksGrid onPreview={(slideId) => showPreview(slideId)} />

      {/* Newsletter CTA */}
      <section className="py-16 bg-section-background">
        <div className="max-w-4xl mx-auto text-center px-4">
          <div className="bg-card rounded-2xl p-12 shadow-stone">
            <h2 className="text-3xl font-bold text-primary mb-4">Stay Connected</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Get notified when new books are released and receive exclusive baking tips and recipes.
            </p>
            <Button size="lg" asChild>
              <a href="https://www.facebook.com/groups/BakingGreatBreadAtHome" target="_blank" rel="noopener noreferrer">
                Join the Community
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Preview Modal - Amazon Style */}
      {selectedPreview && selectedBook && (
        <div 
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={closePreview}
        >
          <div 
            className="bg-background rounded-2xl max-w-4xl w-full max-h-[85vh] overflow-y-auto shadow-stone animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col lg:flex-row">
              {/* Left side - Book Cover */}
              <div className="lg:w-1/3 p-8 flex flex-col items-center bg-gradient-to-br from-primary/5 to-secondary/5">
                <img 
                  src={selectedBook.coverImage} 
                  alt={selectedBook.title}
                  className="w-full max-w-[250px] rounded-lg shadow-stone mb-6"
                />
                <Button 
                  onClick={playAudioExcerpt}
                  disabled={isPlayingAudio}
                  className="w-full max-w-[200px] mb-4"
                  variant={isPlayingAudio ? "secondary" : "default"}
                >
                  <Play className="mr-2 h-4 w-4" />
                  {isPlayingAudio ? "Playing..." : "Listen to Excerpt"}
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full max-w-[200px]"
                  asChild
                >
                  <a href="https://read.amazon.com/sample/B0FGQPM4TG?clientId=share" target="_blank" rel="noopener noreferrer">
                    Read Sample
                  </a>
                </Button>
              </div>

              {/* Right side - Book Details */}
              <div className="lg:w-2/3 p-8">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h1 className="text-3xl font-bold text-foreground mb-2">
                      {selectedBook.title}
                    </h1>
                    <p className="text-xl text-muted-foreground italic mb-2">
                      {selectedBook.subtitle}
                    </p>
                    <p className="text-lg text-primary font-medium">
                      By {selectedBook.author}
                    </p>
                  </div>
                  <Button variant="ghost" size="icon" onClick={closePreview}>
                    <X className="h-6 w-6" />
                  </Button>
                </div>

                <div className="mb-6">
                  <h2 className="text-xl font-semibold mb-3 text-foreground">Book Details</h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    {selectedBook.description}
                  </p>
                  <div className="border-t pt-4">
                    <p className="text-sm text-muted-foreground mb-2">
                      <strong>Reading age:</strong> Adult
                    </p>
                    <p className="text-sm text-muted-foreground mb-2">
                      <strong>Language:</strong> English
                    </p>
                    <p className="text-sm text-muted-foreground">
                      <strong>Publication date:</strong> 2024
                    </p>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold mb-4 text-foreground">Book Preview</h3>
                  <div 
                    className="prose prose-stone dark:prose-invert max-w-none"
                    dangerouslySetInnerHTML={{ __html: selectedBook.previewContent }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Books;