import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import { ResponsiveImage } from '@/components/ResponsiveImage';

// Import book cover images
import sourdoughCover from "https://ojyckskucneljvuqzrsw.supabase.co/storage/v1/object/public/blog-images/sourdough-cover.png";
import breadJourneyCover from "https://ojyckskucneljvuqzrsw.supabase.co/storage/v1/object/public/blog-images/bread-journey-cover-hd.png";
import seasonalBakingCover from "https://ojyckskucneljvuqzrsw.supabase.co/storage/v1/object/public/blog-images/seasonal-baking-cover.png";

interface Book {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  amazonUrl?: string;
  landingPageUrl?: string;
  coverGradient: string;
  coverImage?: string;
  badge?: string;
  featured?: boolean;
}

const books: Book[] = [
  {
    id: "seasonal",
    title: "Baking Great Bread at Home",
    subtitle: "A Journey Through the Seasons",
    description: "This isn't just a cookbook. It's a year-long journey through time, temperature, and tradition. The culmination of Henry Hunter's decades of hands-in-the-dough experience, told through seasonal rhythms, family memories, and the deep, ancient craft of breadmaking.",
    coverGradient: "bg-gradient-to-r from-blue-500 to-orange-500",
    coverImage: seasonalBakingCover,
    badge: "Coming December 2025",
    featured: true
  },
  {
    id: "sourdough",
    title: "Sourdough for the Rest of Us",
    subtitle: "Perfection Not Required",
    description: "Finally, a sourdough guide that doesn't take itself too seriously. This book cuts through the mystique to deliver practical advice that works in real kitchens for real people.",
    amazonUrl: "#",
    coverGradient: "bg-primary",
    coverImage: sourdoughCover,
    badge: "Now Available!"
  },
  {
    id: "journey",
    title: "Bread: A Journey",
    subtitle: "Through History, Science, Art, and Community",
    description: "Explore bread's profound impact on human civilization. From ancient grains to modern artisan techniques, this comprehensive guide weaves together history, science, and practical baking wisdom.",
    amazonUrl: "https://www.amazon.com/dp/B0CH2D2GDB",
    coverGradient: "bg-secondary",
    coverImage: breadJourneyCover
  }
];

const BooksPreview = () => {
  return (
    <section className="py-16 bg-section-background">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">Books by Henry Hunter</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Comprehensive guides to bread baking, from beginner-friendly sourdough to advanced techniques.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {books.map((book) => (
            <Card 
              key={book.id} 
              className={`shadow-warm hover:shadow-stone transition-all duration-300 hover:-translate-y-2 ${
                book.featured ? 'ring-2 ring-primary scale-105' : ''
              }`}
            >
              {/* Book Cover */}
              <div className={`relative h-64 rounded-t-lg overflow-hidden bg-gradient-to-br from-muted/20 to-muted/40`}>
                {book.badge && (
                  <Badge className="absolute top-4 right-4 bg-destructive text-destructive-foreground z-10">
                    {book.badge}
                  </Badge>
                )}
                
                {book.coverImage ? (
                  <ResponsiveImage 
                    src={book.coverImage} 
                    alt={book.title}
                    className="w-full h-full object-contain bg-gradient-to-br from-muted/10 to-muted/20"
                    loading="lazy"
                  />
                ) : (
                  <div className={`${book.coverGradient} h-full flex flex-col justify-center items-center text-white p-6 text-center relative`}>
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
                    <Button variant="outline" asChild size="sm" className="flex-1">
                      <Link to={`/books#${book.id}`}>
                        <Eye className="mr-2 h-4 w-4" />
                        Preview
                      </Link>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button asChild size="lg" variant="outline">
            <Link to="/books">
              View All Books
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default BooksPreview;