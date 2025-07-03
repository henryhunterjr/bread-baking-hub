import { Button } from '@/components/ui/button';
import booksCollectionImage from '@/assets/books-collection.jpg';

const BooksGrid = () => {
  const books = [
    {
      title: "Bread: A Journey Through History, Science, Art, and Community",
      description: "Bread is more than food—it's civilization. This isn't just a recipe book. It's a sweeping, inspiring exploration of how bread has shaped culture, community, and human progress.",
      image: "/lovable-uploads/603a12a6-df85-470d-9713-6494aa4f1e27.png",
      amazonLink: "https://a.co/d/j9ZNlD1",
      price: "$7.95"
    },
    {
      title: "Vitale Sourdough Mastery: The Complete Guide to Artisan Bread at Home",
      description: "The only sourdough book you'll ever need—whether you're just starting or scaling up. Unlock the science and soul of sourdough with this comprehensive guide.",
      image: "/lovable-uploads/2e122cad-434c-40ad-98dd-93d7488ba290.png",
      amazonLink: "https://a.co/d/5Ihvdzd",
      price: "$9.60"
    },
    {
      title: "Sourdough for the Rest of Us: Perfection Not Required",
      description: "Stop letting sourdough intimidate you. This book makes sourdough actually doable for busy people who don't have time for perfection.",
      image: "/lovable-uploads/5ebe30a7-38d3-43d8-8100-e7b62d5b2249.png",
      gumroadLink: "https://hunter53.gumroad.com/l/tejdc",
      price: "Pay What You Will"
    },
    {
      title: "From Oven to Market: Turn Your Passion Into a Bread Business",
      description: "Build your dream baking business—without losing your soul. This guide teaches home bakers how to turn passion into profit.",
      image: "/lovable-uploads/b3cd6ab6-4411-44c6-8c7a-27c5d1b07342.png",
      amazonLink: "https://a.co/d/0rvrmCs",
      price: "$6.62"
    },
    {
      title: "The Yeast Water Handbook",
      description: "Tired of the same sourdough flavors? Try nature's other starter. Discover wild fermentation using fruit, herbs, and vegetables to create unique flavors.",
      image: "/lovable-uploads/720e215c-73f1-4bb7-891c-c2fa41588f09.png",
      amazonLink: "https://a.co/d/2Xj2Anz",
      price: "$13.00"
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
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
          {books.map((book, index) => (
            <div key={index} className="bg-card rounded-xl overflow-hidden shadow-stone hover:shadow-warm transition-shadow">
              <div className="aspect-[2/3] overflow-hidden">
                <img 
                  src={book.image} 
                  alt={book.title}
                  className="w-full h-full object-cover rounded-lg shadow-md hover:shadow-lg transition-shadow"
                />
              </div>
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