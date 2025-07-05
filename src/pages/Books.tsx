import Header from "../components/Header";
import Footer from "../components/Footer";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Play, X } from "lucide-react";
import BooksHeroSlideshow from "@/components/BooksHeroSlideshow";
import BooksGrid from "@/components/BooksGrid";
import BookshelfDisplay from "@/components/BookshelfDisplay";

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
  seasonal: {
    id: "seasonal",
    title: "Baking Great Bread at Home",
    subtitle: "A Journey Through the Seasons",
    author: "Henry Hunter",
    description: "This isn't just a cookbook. It's a year-long journey through time, temperature, and tradition. Baking Great Bread at Home is the culmination of Henry Hunter's decades of hands-in-the-dough experience, told through seasonal rhythms, family memories, and the deep, ancient craft of breadmaking. Inside, you'll find master-level techniques made accessible, recipes that evolve with the weather and the baker, and stories that remind us why bread has always been at the heart of community.",
    coverImage: "/lovable-uploads/43da7651-de36-46f7-ab6a-22e594aed31b.png",
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
        <li>The deep connection between bread and community</li>
      </ul>

      <h3>Chapter 1: "Winter's Wisdom - The Foundation Loaves"</h3>
      <p>Winter teaches patience. In the quiet months when the world slows down, we learn the foundational breads that have sustained families for generations. These are the loaves that fill kitchens with warmth when snow covers the ground.</p>
      
      <p><strong>The January Starter</strong><br>Every great bread journey begins with understanding fermentation in winter's gentle pace. When temperatures drop, our starters become contemplative, developing deeper flavors through slower fermentation.</p>
      
      <p><strong>February's Family Loaf</strong><br>This is the bread my grandmother made every Sunday, the one that brought three generations to the table. Simple ingredients, profound results – the alchemy of flour, water, salt, and time.</p>
      
      <p><em>Available December 2025 - Sign up now to be the first to know when pre-orders open.</em></p>
    `,
    audioUrl: "/audio/seasonal-excerpt.mp3"
  },
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
  vitale: {
    id: "vitale",
    title: "Vitale Sourdough Mastery",
    subtitle: "Master the Art of Fermentation and Baking",
    author: "Henry Hunter",
    description: "Ready to transform your relationship with sourdough? 'Vitale Sourdough Mastery' shares the secrets behind Henry Hunter's 10+ year relationship with his treasured starter – the foundation of consistently exceptional bread. Written by the founder of the global 'Baking Great Bread at Home' community, this book goes beyond recipes to teach you the living culture mastery that separates good bakers from great ones.",
    coverImage: "/lovable-uploads/ed2db3c9-f60e-4085-ab44-a1df3ff34c0f.png",
    previewContent: `
      <h2>Vitale Sourdough Mastery - Preview</h2>
      <h3>Master the Art of Fermentation and Baking – The Complete Guide to Sourdough Excellence</h3>
      <p>Ready to transform your relationship with sourdough? "Vitale Sourdough Mastery" shares the secrets behind Henry Hunter's 10+ year relationship with his treasured starter – the foundation of consistently exceptional bread.</p>
      <p>Written by the founder of the global "Baking Great Bread at Home" community, this book goes beyond recipes to teach you the living culture mastery that separates good bakers from great ones.</p>
      
      <h4>What You'll Master:</h4>
      <ul>
        <li>Reading your starter's signals for perfect timing and flavor</li>
        <li>Henry's proven "fermentolyse" technique for superior texture</li>
        <li>Visual monitoring, feeding schedules, and troubleshooting</li>
        <li>Global sourdough variations adapted for home kitchens</li>
        <li>The science behind fermentation made simple and practical</li>
      </ul>

      <h3>Chapter 2: "Understanding Vitale - Reading Your Starter's Language"</h3>
      <p>After ten years with Vitale, I've learned that sourdough starters communicate if you know how to listen. The key to mastery isn't following rigid rules – it's learning to read your starter's signals.</p>
      
      <p><strong>The Morning Ritual</strong><br>Every morning, I observe Vitale before thinking about feeding schedules. I look, smell, and yes – listen. A healthy starter makes tiny pops as bubbles break the surface. It's the sound of life.</p>
      
      <p><strong>Visual Cues That Matter</strong><br>Vitale's surface tells me everything: bubbles and slight doming mean active fermentation – perfect for milder loaves. If she's fallen with liquid on top, she's past peak but ready for tangier, complex flavors.</p>
      
      <p><strong>Your Nose Knows Best</strong><br>Your nose is more reliable than any timer. Fresh after feeding, Vitale smells clean and yeasty. At peak activity, she's bright and appealing. Post-peak brings wine-like complexity. When she smells vinegary, she's hungry but perfectly fine.</p>
      
      <p><em>[Preview continues with purchasing full book...]</em></p>
    `,
    audioUrl: "/audio/vitale-excerpt.mp3" // Placeholder for future MP3
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
  },
  loaflie: {
    id: "loaflie",
    title: "The Loaf and the LIE",
    subtitle: "A History of What We Broke and How We're Taking It Back",
    author: "Henry Hunter",
    description: "What if the bread on your table was never meant to nourish you? In The Loaf and the LIE, Henry Hunter pulls back the curtain on the industrial food machine that replaced ancestral wisdom with shelf-stable profits. Told in gripping, investigative detail with the fire of someone who's spent a lifetime in both the kitchen and the archives, this exposé traces the moment bread became a product—and how we're reclaiming its soul.",
    coverImage: "/lovable-uploads/83cde278-edfc-4a30-98f4-79f37c79346e.png",
    previewContent: `
      <h2>The Loaf and the LIE - Preview</h2>
      <h3>A History of What We Broke and How We're Taking It Back</h3>
      <p>What if the bread on your table was never meant to nourish you?</p>
      <p>In The Loaf and the LIE, Henry Hunter pulls back the curtain on the industrial food machine that replaced ancestral wisdom with shelf-stable profits. Told in gripping, investigative detail with the fire of someone who's spent a lifetime in both the kitchen and the archives, this exposé traces the moment bread became a product—and how we're reclaiming its soul.</p>
      <p>With the depth of a historian and the bite of a journalist, Henry dissects corporate collusion, lost fermentation knowledge, and the marketing tricks that turned nourishing loaves into empty calories. This is the untold story of how food was weaponized—and how real bread is fighting back.</p>
      
      <h4>What This Book Exposes:</h4>
      <ul>
        <li>The exact moment traditional bread became industrial product</li>
        <li>Corporate strategies that prioritized shelf-life over nutrition</li>
        <li>Lost fermentation knowledge and how it was systematically erased</li>
        <li>Marketing manipulation that transformed bread into empty calories</li>
        <li>The grassroots movement reclaiming real bread</li>
      </ul>

      <h3>Chapter 3: "The Great Deception - When Bread Became Product"</h3>
      <p>It happened so gradually that most people never noticed. One day, bread was the staff of life, made fresh in neighborhood bakeries with flour, water, salt, and time. The next, it was a shelf-stable commodity, pumped full of preservatives and wrapped in plastic.</p>
      
      <p><strong>The Turning Point: 1961</strong><br>The year everything changed wasn't marked by fanfare or headlines. It was the year industrial baking finally cracked the code on extending shelf life while maintaining the appearance of "fresh bread."</p>
      
      <p><strong>What They Didn't Tell Us</strong><br>The trade-offs were staggering. Nutrition density plummeted by 40%. Digestibility became a problem for millions. But profits soared, and that's all that mattered to the boardrooms making these decisions.</p>
      
      <p><em>This is not just a book. It's a reckoning.</em></p>
    `,
    audioUrl: "/audio/loaflie-excerpt.mp3" // Placeholder for future MP3
  },
  yeast: {
    id: "yeast",
    title: "The Yeast Water Handbook",
    subtitle: "Wild Fermentation Made Simple",
    author: "Henry Hunter",
    description: "Discover the ancient art of wild yeast cultivation through fruit fermentation. A complete guide to creating and using yeast water as an alternative to traditional sourdough starters.",
    coverImage: "/lovable-uploads/6f937c37-592f-4516-8414-a82a3c9dc838.png",
    previewContent: `
      <h2>The Yeast Water Handbook - Preview</h2>
      <h3>Chapter 1: What is Yeast Water?</h3>
      <p>Yeast water is one of the oldest forms of natural leavening, predating sourdough starters by thousands of years. It's created by fermenting fruit, herbs, or even vegetables in water to capture wild yeasts.</p>
      <p>Unlike sourdough starters, yeast water doesn't require daily feeding or maintenance. It's perfect for bakers who want the benefits of wild yeast without the commitment...</p>
      
      <h4>What You'll Learn:</h4>
      <ul>
        <li>Creating and maintaining yeast water cultures</li>
        <li>Fruit selection and fermentation techniques</li>
        <li>Converting recipes from commercial yeast to yeast water</li>
        <li>Troubleshooting common yeast water issues</li>
        <li>Advanced techniques for flavor development</li>
      </ul>

      <h3>Chapter 2: "Your First Yeast Water Culture"</h3>
      <p>Starting your first yeast water culture is simpler than you might think. All you need is fresh fruit, clean water, and patience. The wild yeasts living naturally on fruit skins will do the rest.</p>
      
      <p><strong>Choosing Your Fruit</strong><br>Organic apples are my favorite starting point - they're reliable, available year-round, and produce a clean, mild yeast water perfect for bread. But don't be afraid to experiment with grapes, pears, or even dried fruits.</p>
      
      <p><em>[Available now on Amazon]</em></p>
    `,
    audioUrl: "/audio/yeast-excerpt.mp3"
  },
  watchers: {
    id: "watchers",
    title: "The Watchers' Descent",
    subtitle: "A Science Fiction Epic",
    author: "Henry Hunter",
    description: "A departure from bread baking into the realm of science fiction. An epic tale of humanity's encounter with otherworldly beings and the choices that define our future.",
    coverImage: "/lovable-uploads/2b4a2ed0-1e01-4acf-9de5-2e2165f803b6.png",
    previewContent: `
      <h2>The Watchers' Descent - Preview</h2>
      <h3>A Science Fiction Epic</h3>
      <p>In a universe where humanity thought they were alone, the arrival of the Watchers changes everything. This epic tale explores first contact, the nature of consciousness, and the difficult choices that define our species.</p>
      <p>Follow Dr. Sarah Chen as she leads humanity's first diplomatic mission to beings whose very existence challenges everything we thought we knew about the cosmos...</p>
      
      <h4>What Awaits:</h4>
      <ul>
        <li>First contact with an ancient alien civilization</li>
        <li>Deep philosophical questions about consciousness and existence</li>
        <li>Political intrigue and cosmic diplomacy</li>
        <li>Action-packed sequences across multiple worlds</li>
        <li>A story that will change how you see humanity's place in the universe</li>
      </ul>

      <h3>Chapter 1: "The Signal"</h3>
      <p>Dr. Sarah Chen had been staring at the same data stream for three hours when she finally saw it—a pattern so subtle, so deliberately hidden within the cosmic background radiation, that it had taken the most sophisticated algorithms on Earth to detect it.</p>
      
      <p><strong>The Discovery</strong><br>It wasn't random. It couldn't be. The mathematical precision, the way it wove through frequencies like a signature written in starlight—this was artificial. This was a message.</p>
      
      <p><em>[Available now - Visit landing page for more details]</em></p>
    `,
    audioUrl: "/audio/watchers-excerpt.mp3"
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

      {/* Bookshelf Display */}
      <BookshelfDisplay onPreview={(slideId) => showPreview(slideId)} />

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