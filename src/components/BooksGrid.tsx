import { Button } from '@/components/ui/button';
import booksCollectionImage from '@/assets/books-collection.jpg';

const BooksGrid = () => {
  const books = [
    {
      title: "Bread: A Journey Through History, Science, Art, and Community",
      description: "A comprehensive guide to understanding bread from grain to loaf",
      image: booksCollectionImage,
      amazonLink: "https://www.amazon.com/dp/B0CH2D2GDB",
      price: "$24.99"
    },
    {
      title: "The Tally: Sourdough Mastery",
      description: "Advanced techniques for sourdough perfection",
      image: booksCollectionImage,
      amazonLink: "https://www.amazon.com/dp/B0CVB8ZCFV",
      price: "$19.99"
    },
    {
      title: "Sourdough for the Rest of Us",
      description: "Beginner-friendly sourdough made simple",
      image: booksCollectionImage,
      gumroadLink: "https://hunter53.gumroad.com/l/tejdc",
      price: "$14.99"
    },
    {
      title: "The Yeast Water Handbook",
      description: "Natural fermentation techniques and wild yeast cultivation",
      image: booksCollectionImage,
      amazonLink: "https://www.amazon.com/dp/B0CGMF3NBS",
      price: "$16.99"
    }
  ];

  return (
    <section className="py-20 px-4 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-primary mb-4">Books & Guides</h2>
          <p className="text-xl text-stone-300 max-w-2xl mx-auto">
            Deep-dive into the art and science of bread baking with comprehensive guides 
            that take you from beginner to expert.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {books.map((book, index) => (
            <div key={index} className="bg-card rounded-xl overflow-hidden shadow-stone hover:shadow-warm transition-shadow">
              <img 
                src={book.image} 
                alt={book.title}
                className="w-full h-64 object-cover"
              />
              <div className="p-6 space-y-4">
                <h3 className="text-lg font-bold text-card-foreground line-clamp-2">{book.title}</h3>
                <p className="text-muted-foreground text-sm line-clamp-3">{book.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-primary font-bold text-xl">{book.price}</span>
                  <Button variant="warm" size="sm" asChild>
                    <a href={book.amazonLink || book.gumroadLink || '#'} target="_blank" rel="noopener noreferrer">
                      Get Book
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BooksGrid;