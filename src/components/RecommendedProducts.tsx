import { Button } from '@/components/ui/button';
import booksCollectionImage from '@/assets/books-collection.jpg';

const RecommendedProducts = () => {
  const products = [
    {
      name: "Brød & Taylor Folding Proofer",
      description: "Temperature-controlled proofer for perfect fermentation every time",
      image: booksCollectionImage,
      price: "From $189",
      link: "https://collabs.shop/vutgu8",
      category: "Proofing"
    },
    {
      name: "Challenger Breadware Pan",
      description: "Professional-grade bread pan for bakery-quality loaves at home",
      image: booksCollectionImage, 
      price: "From $295",
      link: "https://challengerbreadware.com/?ref=henryhunterjr",
      category: "Baking"
    },
    {
      name: "Brød & Taylor Dough Whisk",
      description: "Essential tool for mixing dough without overworking",
      image: booksCollectionImage,
      price: "$24.95",
      link: "https://collabs.shop/6jalk7",
      category: "Mixing"
    },
    {
      name: "High Capacity Baking Scale", 
      description: "Precise measurements for consistent results every time",
      image: booksCollectionImage,
      price: "$79.95",
      link: "https://collabs.shop/hvryn6",
      category: "Measuring"
    },
    {
      name: "SourHouse Starter Kit",
      description: "Everything you need to maintain a healthy sourdough starter",
      image: booksCollectionImage,
      price: "$85",
      link: "https://bit.ly/Sourhouse",
      category: "Sourdough"
    },
    {
      name: "Wire Monkey Dough Scrapers",
      description: "Professional-grade bench scrapers for easy dough handling",
      image: booksCollectionImage,
      price: "$29.99",
      link: "https://bit.ly/3QFQek8",
      category: "Tools"
    }
  ];

  return (
    <section className="py-20 px-4 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-primary mb-4">Products I Recommend</h2>
          <p className="text-xl text-stone-300 max-w-2xl mx-auto">
            Tested and trusted tools that make the difference between good bread and great bread
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product, index) => (
            <div key={index} className="bg-card rounded-xl overflow-hidden shadow-stone hover:shadow-warm transition-all duration-300 group">
              <div className="relative overflow-hidden">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4 bg-primary text-primary-foreground px-2 py-1 rounded-full text-xs font-semibold">
                  {product.category}
                </div>
              </div>
              <div className="p-6 space-y-4">
                <h3 className="text-lg font-bold text-card-foreground">{product.name}</h3>
                <p className="text-muted-foreground text-sm line-clamp-2">{product.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-primary font-bold text-lg">{product.price}</span>
                  <Button variant="warm" size="sm" asChild>
                    <a href={product.link} target="_blank" rel="noopener noreferrer">
                      Shop Now
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <p className="text-muted-foreground text-sm">
            As an affiliate, I earn from qualifying purchases. These are tools I personally use and recommend.
          </p>
        </div>
      </div>
    </section>
  );
};

export default RecommendedProducts;