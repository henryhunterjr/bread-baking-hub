import { Card } from "@/components/ui/card";

// Import all book covers
import sourdoughCover from "https://ojyckskucneljvuqzrsw.supabase.co/storage/v1/object/public/blog-images/sourdough-cover.png";
import breadJourneyCover from "https://ojyckskucneljvuqzrsw.supabase.co/storage/v1/object/public/blog-images/bread-journey-cover.png";
import yeastWaterCover from "https://ojyckskucneljvuqzrsw.supabase.co/storage/v1/object/public/blog-images/yeast-water-alt.png";
import marketCover from "https://ojyckskucneljvuqzrsw.supabase.co/storage/v1/object/public/blog-images/market-cover.png";
import vitaleCover from "https://ojyckskucneljvuqzrsw.supabase.co/storage/v1/object/public/blog-images/vitale-cover.png";
import watchersCover from "https://ojyckskucneljvuqzrsw.supabase.co/storage/v1/object/public/blog-images/watchers-cover.png";
import seasonalBakingCover from "https://ojyckskucneljvuqzrsw.supabase.co/storage/v1/object/public/blog-images/seasonal-baking-cover.png";
import loafLieCover from "https://ojyckskucneljvuqzrsw.supabase.co/storage/v1/object/public/blog-images/loaf-lie-cover.png";

const books = [
  { id: "seasonal", cover: seasonalBakingCover, title: "Baking Great Bread at Home" },
  { id: "sourdough", cover: sourdoughCover, title: "Sourdough for the Rest of Us" },
  { id: "journey", cover: breadJourneyCover, title: "Bread: A Journey" },
  { id: "yeast", cover: yeastWaterCover, title: "The Yeast Water Handbook" },
  { id: "vitale", cover: vitaleCover, title: "Vitale Sourdough Mastery" },
  { id: "market", cover: marketCover, title: "From Oven to Market" },
  { id: "loaflie", cover: loafLieCover, title: "The Loaf and the LIE" },
  { id: "watchers", cover: watchersCover, title: "The Watchers' Descent" }
];

interface BookshelfDisplayProps {
  onPreview: (bookId: string) => void;
}

const BookshelfDisplay = ({ onPreview }: BookshelfDisplayProps) => {
  // Split books into two shelves
  const topShelf = books.slice(0, 4);
  const bottomShelf = books.slice(4, 8);

  return (
    <section className="py-20 bg-gradient-to-b from-amber-50/50 via-orange-50/30 to-amber-100/20 dark:from-amber-950/20 dark:via-orange-950/10 dark:to-amber-900/5 overflow-hidden relative">
      {/* Wood grain background texture */}
      <div className="absolute inset-0 opacity-5">
        <div className="h-full w-full bg-gradient-to-r from-amber-800/30 via-transparent to-amber-700/20" 
             style={{
               backgroundImage: `repeating-linear-gradient(
                 90deg,
                 transparent,
                 transparent 2px,
                 rgba(139, 69, 19, 0.1) 2px,
                 rgba(139, 69, 19, 0.1) 4px
               )`
             }}>
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">Henry Hunter's Library</h2>
          <p className="text-xl text-muted-foreground">
            Complete collection of books on bread, baking, and beyond
          </p>
        </div>

        <div className="relative">
          {/* Background with perspective */}
          <div className="relative perspective-1000">
            
            {/* Top Shelf */}
            <div className="relative mb-16">
              {/* Shelf Wood */}
              <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-b from-amber-800 to-amber-900 rounded-sm shadow-lg transform rotate-x-12 origin-bottom"></div>
              <div className="absolute bottom-0 left-0 right-0 h-2 bg-amber-900 rounded-sm shadow-md transform translate-y-2"></div>
              
              {/* Books on top shelf */}
              <div className="flex justify-center items-end gap-4 pb-4 relative z-10">
                {topShelf.map((book, index) => (
                  <div
                    key={book.id}
                    className="relative group cursor-pointer transition-all duration-500 hover:scale-150 hover:-translate-y-12 hover:rotate-0 hover:z-20 hover:drop-shadow-2xl"
                    style={{
                      transform: `rotateY(${(index - 1) * 5}deg) rotateX(-2deg)`,
                      transformStyle: 'preserve-3d'
                    }}
                    onClick={() => onPreview(book.id)}
                  >
                    <img
                      src={book.cover}
                      alt={book.title}
                      className="h-40 w-auto object-cover rounded shadow-lg border border-gray-300 group-hover:shadow-2xl group-hover:brightness-110"
                      style={{
                        filter: 'drop-shadow(2px 4px 8px rgba(0,0,0,0.3))',
                        backfaceVisibility: 'hidden'
                      }}
                      loading="lazy"
                      decoding="async"
                    />
                    {/* Book spine shadow */}
                    <div className="absolute top-0 right-0 w-2 h-full bg-black/20 rounded-r transform translate-x-full -skew-y-12 origin-top"></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Shelf */}
            <div className="relative">
              {/* Shelf Wood */}
              <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-b from-amber-800 to-amber-900 rounded-sm shadow-lg transform rotate-x-12 origin-bottom"></div>
              <div className="absolute bottom-0 left-0 right-0 h-2 bg-amber-900 rounded-sm shadow-md transform translate-y-2"></div>
              
              {/* Books on bottom shelf */}
              <div className="flex justify-center items-end gap-4 pb-4 relative z-10">
                {bottomShelf.map((book, index) => (
                  <div
                    key={book.id}
                    className="relative group cursor-pointer transition-all duration-500 hover:scale-150 hover:-translate-y-12 hover:rotate-0 hover:z-20 hover:drop-shadow-2xl"
                    style={{
                      transform: `rotateY(${(index - 1) * 5}deg) rotateX(-2deg)`,
                      transformStyle: 'preserve-3d'
                    }}
                    onClick={() => onPreview(book.id)}
                  >
                    <img
                      src={book.cover}
                      alt={book.title}
                      className="h-40 w-auto object-cover rounded shadow-lg border border-gray-300 group-hover:shadow-2xl group-hover:brightness-110"
                      style={{
                        filter: 'drop-shadow(2px 4px 8px rgba(0,0,0,0.3))',
                        backfaceVisibility: 'hidden'
                      }}
                      loading="lazy"
                      decoding="async"
                    />
                    {/* Book spine shadow */}
                    <div className="absolute top-0 right-0 w-2 h-full bg-black/20 rounded-r transform translate-x-full -skew-y-12 origin-top"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Author signature */}
          <div className="text-center mt-8">
            <p className="text-lg font-serif italic text-primary">
              "Every book is a journey of discovery" - Henry Hunter
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BookshelfDisplay;