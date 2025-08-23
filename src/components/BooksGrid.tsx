import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Eye } from "lucide-react";
import { memo } from "react";
import { OptimizedImage } from '@/components/OptimizedImage';

// Import the new book cover images
import sourdoughCover from "/lovable-uploads/73deb0d3-e387-4693-bdf8-802f89a1ae85.png";
import breadJourneyCover from "/lovable-uploads/171c5ec1-d38e-4257-a2e4-60b75d2e2909.png";
import yeastWaterCover from "/lovable-uploads/1bca24b8-dbf6-440d-8240-4c714ec30891.png";
import marketCover from "/lovable-uploads/a0d33e20-2a9e-46c9-a500-e9e01876a8df.png";
import seasonalBakingCover from "/lovable-uploads/43da7651-de36-46f7-ab6a-22e594aed31b.png";
import loafLieCover from "/lovable-uploads/83cde278-edfc-4a30-98f4-79f37c79346e.png";

interface Book {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  features: string[];
  amazonUrl?: string;
  landingPageUrl?: string;
  coverGradient: string;
  coverImage?: string;
  badge?: string;
  featured?: boolean;
  previewContent: string;
  videoUrl?: string;
}

const books: Book[] = [
  {
    id: "seasonal",
    title: "Baking Great Bread at Home",
    subtitle: "A Journey Through the Seasons",
    description: "This isn't just a cookbook. It's a year-long journey through time, temperature, and tradition. The culmination of Henry Hunter's decades of hands-in-the-dough experience, told through seasonal rhythms, family memories, and the deep, ancient craft of breadmaking.",
    features: [
      "Master-level techniques made accessible",
      "Recipes that evolve with the seasons",
      "Family memories and baking stories",
      "Complete year-long baking journey"
    ],
    coverGradient: "bg-gradient-to-r from-blue-500 to-orange-500",
    coverImage: seasonalBakingCover,
    badge: "Coming December 2025",
    featured: true,
    previewContent: `
      <h2>Baking Great Bread at Home - Preview</h2>
      <h3>A Journey Through the Seasons</h3>
      <p>This isn't just a cookbook. It's a year-long journey through time, temperature, and tradition.</p>
      <p>Baking Great Bread at Home is the culmination of Henry Hunter's decades of hands-in-the-dough experience, told through seasonal rhythms, family memories, and the deep, ancient craft of breadmaking. Inside, you'll find master-level techniques made accessible, recipes that evolve with the weather and the baker, and stories that remind us why bread has always been at the heart of community.</p>
      <p>From crisp winter loaves to sun-drenched summer crusts, this book is a love letter to the home baker's calendar. With every page, Henry invites you into the warmth of the oven and the soul of the seasons.</p>
      <h4>What You'll Discover:</h4>
      <ul>
        <li>Seasonal baking techniques that work with nature's rhythm</li>
        <li>Master-level methods explained for home bakers</li>
        <li>Family stories and the tradition of breadmaking</li>
        <li>Recipes that celebrate each season's unique ingredients</li>
      </ul>
      <p><strong>Available December 2025</strong><br>Sign up now to be the first to know when pre-orders open.</p>
    `
  },
  {
    id: "sourdough",
    title: "Sourdough for the Rest of Us",
    subtitle: "Perfection Not Required",
    description: "Finally, a sourdough guide that doesn't take itself too seriously. This book cuts through the mystique to deliver practical advice that works in real kitchens for real people.",
    features: [
      "7-day starter creation with photos",
      "Troubleshooting for every disaster", 
      "Flexible schedules for busy lives",
      "Community stories and tips"
    ],
    amazonUrl: "https://read.amazon.com/sample/B0FGQPM4TG?clientId=share",
    coverGradient: "bg-primary",
    coverImage: sourdoughCover,
    badge: "Now Available in Paperback",
    featured: true,
    previewContent: `
      <h2>Sourdough for the Rest of Us - Preview</h2>
      <h3>Chapter 1: Your Sourdough Starter - The Drama Queen of the Kitchen</h3>
      <p>If you've ever felt personally attacked by a jar of bubbling flour and water, welcome to the world of sourdough. Your starter is a living, breathing diva—demanding, moody, and occasionally unpredictable. But once you learn how to handle its quirks, it'll reward you with the best bread you've ever tasted.</p>
      <p>Think of your starter as a low-maintenance pet that lives in your kitchen. It doesn't need walks or belly rubs, but it does need food, warmth, and patience...</p>
    `
  },
  {
    id: "journey",
    title: "Bread: A Journey",
    subtitle: "Through History, Science, Art, and Community",
    description: "Explore bread's profound impact on human civilization. From ancient grains to modern artisan techniques, this comprehensive guide weaves together history, science, and practical baking wisdom.",
    features: [
      "Historical context and cultural significance",
      "Scientific principles explained simply",
      "Advanced techniques and recipes",
      "Community building through bread"
    ],
    amazonUrl: "https://www.amazon.com/dp/B0CH2D2GDB",
    coverGradient: "bg-secondary",
    coverImage: "/lovable-uploads/bread-journey-cover-hd.png",
    previewContent: `
      <h2>Bread: A Journey - Preview</h2>
      <h3>Introduction: The Universal Language of Bread</h3>
      <p>Bread is humanity's most fundamental food technology. From the first accidentally fermented grain paste to today's artisan sourdough, bread has been our constant companion through history, culture, and community.</p>
      <p>This book explores not just how to bake bread, but why bread matters—scientifically, culturally, and personally...</p>
    `
  },
  {
    id: "yeast",
    title: "The Yeast Water Handbook", 
    subtitle: "Wild Fermentation Made Simple",
    description: "Discover the ancient art of wild yeast cultivation through fruit fermentation. A complete guide to creating and using yeast water as an alternative to traditional sourdough starters.",
    features: [
      "Step-by-step yeast water creation",
      "Troubleshooting fermentation issues",
      "Unique flavor profiles and techniques", 
      "Recipes for bread and beyond"
    ],
    amazonUrl: "https://www.amazon.com/dp/B0CGMF3NBS",
    coverGradient: "bg-accent",
    coverImage: "/lovable-uploads/yeast-water-cover-hd.png",
    previewContent: `
      <h2>The Yeast Water Handbook - Preview</h2>
      <h3>Chapter 1: What is Yeast Water?</h3>
      <p>Yeast water is one of the oldest forms of natural leavening, predating sourdough starters by thousands of years. It's created by fermenting fruit, herbs, or even vegetables in water to capture wild yeasts.</p>
      <p>Unlike sourdough starters, yeast water doesn't require daily feeding or maintenance. It's perfect for bakers who want the benefits of wild yeast without the commitment...</p>
    `
  },
  {
    id: "vitale",
    title: "Vitale Sourdough Mastery",
    subtitle: "Advanced Techniques for Serious Bakers", 
    description: "Take your sourdough skills to the professional level. This advanced guide covers complex fermentation schedules, professional shaping methods, and troubleshooting for consistent results.",
    features: [
      "Advanced fermentation techniques",
      "Professional shaping methods",
      "Complex flavor development",
      "Consistency and troubleshooting"
    ],
    amazonUrl: "https://www.amazon.com/dp/B0CVB8ZCFV",
    coverGradient: "bg-muted",
    coverImage: "/lovable-uploads/ed2db3c9-f60e-4085-ab44-a1df3ff34c0f.png",
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
    subtitle: "Selling Bread at Farmers' Markets & Beyond",
    description: "Turn your baking passion into a profitable business. Practical advice on scaling recipes, pricing products, and building a customer base in local markets.",
    features: [
      "Business planning and startup costs",
      "Scaling recipes for production", 
      "Marketing and customer building",
      "Legal requirements and permits"
    ],
    amazonUrl: "https://www.amazon.com/dp/B0D8PNGC7Q",
    coverGradient: "bg-primary",
    coverImage: marketCover,
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
    subtitle: "A History of What We Broke and How We're Taking It Back",
    description: "What if the bread on your table was never meant to nourish you? Henry Hunter pulls back the curtain on the industrial food machine that replaced ancestral wisdom with shelf-stable profits. This exposé traces the moment bread became a product—and how we're reclaiming its soul.",
    features: [
      "Investigative exposé of industrial food system",
      "Historical analysis of bread commercialization",
      "Corporate collusion and marketing manipulation",
      "How real bread is fighting back"
    ],
    amazonUrl: "#",
    coverGradient: "bg-gradient-to-r from-amber-900 to-yellow-600",
    coverImage: loafLieCover,
    videoUrl: "https://drive.google.com/file/d/18l7YvjiTul6m6iLuK6QkH1wSkhCy1w0o/preview",
    previewContent: `
      <h2>The Loaf and the LIE - Preview</h2>
      <h3>A History of What We Broke and How We're Taking It Back</h3>
      <p>What if the bread on your table was never meant to nourish you?</p>
      <p>In The Loaf and the LIE, Henry Hunter pulls back the curtain on the industrial food machine that replaced ancestral wisdom with shelf-stable profits. Told in gripping, investigative detail with the fire of someone who's spent a lifetime in both the kitchen and the archives, this exposé traces the moment bread became a product—and how we're reclaiming its soul.</p>
      <p>With the depth of a historian and the bite of a journalist, Henry dissects corporate collusion, lost fermentation knowledge, and the marketing tricks that turned nourishing loaves into empty calories. This is the untold story of how food was weaponized—and how real bread is fighting back.</p>
      <h4>What You'll Uncover:</h4>
      <ul>
        <li>The moment traditional bread became industrial product</li>
        <li>Corporate strategies that prioritized profit over nutrition</li>
        <li>Lost fermentation knowledge and ancestral wisdom</li>
        <li>How marketing transformed bread into empty calories</li>
        <li>The grassroots movement reclaiming real bread</li>
      </ul>
      <p><strong>This is not just a book. It's a reckoning.</strong></p>
    `
  },
  {
    id: "watchers",
    title: "The Watchers' Descent",
    subtitle: "A Science Fiction Epic",
    description: "A departure from bread baking into the realm of science fiction. An epic tale of humanity's encounter with otherworldly beings and the choices that define our future.",
    features: [
      "Epic science fiction storytelling",
      "Complex character development", 
      "Thought-provoking themes",
      "Immersive world-building"
    ],
    amazonUrl: "https://www.amazon.com/dp/B0DR2LDDSD",
    landingPageUrl: "https://the-watchers-descent.lovable.app/",
    coverGradient: "bg-secondary",
    coverImage: "/lovable-uploads/2b4a2ed0-1e01-4acf-9de5-2e2165f803b6.png",
    previewContent: `
      <h2>The Watchers' Descent - Preview</h2>
      <h3>A Science Fiction Epic</h3>
      <p>In a universe where humanity thought they were alone, the arrival of the Watchers changes everything. This epic tale explores first contact, the nature of consciousness, and the difficult choices that define our species.</p>
      <p>Follow Dr. Sarah Chen as she leads humanity's first diplomatic mission to beings whose very existence challenges everything we thought we knew about the cosmos...</p>
    `
  }
];

interface BooksGridProps {
  onPreview: (bookId: string) => void;
  onVideoPlay?: (bookId: string, videoUrl: string) => void;
}

const BooksGrid = memo(({ onPreview, onVideoPlay }: BooksGridProps) => {
  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-foreground mb-4">Complete Book Collection</h2>
        <p className="text-xl text-muted-foreground text-center mb-12 max-w-3xl mx-auto">
          Explore all books by Henry Hunter, from beginner-friendly guides to advanced techniques and beyond.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {books.map((book) => (
            <Card 
              key={book.id} 
              className={`shadow-warm hover:shadow-stone transition-all duration-300 hover:-translate-y-2 ${
                book.featured ? 'ring-2 ring-primary scale-105' : ''
              }`}
            >
              {/* Book Cover */}
              <div className="relative rounded-t-lg overflow-hidden bg-gradient-to-br from-muted/20 to-muted/40">
                {book.badge && (
                  <Badge className="absolute top-4 right-4 bg-destructive text-destructive-foreground z-10">
                    {book.badge}
                  </Badge>
                )}
                
                {book.coverImage ? (
                  <OptimizedImage 
                    src={book.coverImage} 
                    alt={`${book.title} book cover`}
                    width={380}
                    height={570}
                    className="w-full h-auto object-contain bg-gradient-to-br from-muted/10 to-muted/20 gpu-accelerated"
                    priority={book.featured}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                ) : (
                  <div className={`${book.coverGradient} aspect-[2/3] min-h-[300px] flex flex-col justify-center items-center text-white p-6 text-center relative`}>
                    {/* Book spine effect */}
                    <div className="absolute left-4 top-4 bottom-4 w-2 bg-black/20 rounded-sm"></div>
                    
                    <div className="bg-black/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                      <h3 className="text-xl font-bold mb-2">{book.title}</h3>
                      <p className="text-sm opacity-90 italic">{book.subtitle}</p>
                    </div>
                    
                    {/* Book pages effect */}
                    <div className="absolute right-0 top-6 bottom-6 w-1 bg-white/30"></div>
                    <div className="absolute right-1 top-8 bottom-8 w-0.5 bg-white/20"></div>
                  </div>
                )}
              </div>

              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-foreground mb-3">{book.title}</h3>
                <p className="text-muted-foreground mb-4 text-sm leading-relaxed">{book.description}</p>
                
                <div className="flex flex-col sm:flex-row gap-3">
                  {book.amazonUrl && (
                    <Button asChild size="sm" className="flex-1">
                      <a href={book.amazonUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Buy
                      </a>
                    </Button>
                  )}
                  {book.landingPageUrl ? (
                    <Button variant="outline" asChild size="sm" className="flex-1">
                      <a href={book.landingPageUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Page
                      </a>
                    </Button>
                  ) : (
                    <Button 
                      variant="outline" 
                      onClick={() => onPreview(book.id)}
                      size="sm"
                      className="flex-1"
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      Preview
                    </Button>
                  )}
                  {book.videoUrl && onVideoPlay && (
                    <Button 
                      onClick={() => onVideoPlay(book.id, book.videoUrl!)}
                      size="sm"
                      className="flex-1 bg-amber-600 hover:bg-amber-700"
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      Watch Trailer
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
});

export default BooksGrid;