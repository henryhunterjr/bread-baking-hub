import { Button } from '@/components/ui/button';
import { ArrowRight, Play } from 'lucide-react';
import challengeBreadImage from '@/assets/challenge-bread.jpg';

const BakersBench = () => {
  const mediaItems = [
    {
      title: "Sourdough Troubleshooting: Dense Loaves",
      description: "Common mistakes that lead to dense bread and how to fix them",
      type: "video",
      thumbnail: challengeBreadImage,
      duration: "12:34",
      link: "https://www.youtube.com/@henryhunterjr",
      date: "June 2025"
    },
    {
      title: "The Science of Gluten Development",
      description: "Understanding how kneading and time affect your dough structure",
      type: "podcast",
      thumbnail: challengeBreadImage,
      duration: "24:15",
      link: "#",
      date: "May 2025"
    }
  ];

  return (
    <section className="py-20 px-4 bg-stone-800">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-primary mb-4">The Baker's Bench</h2>
          <p className="text-xl text-stone-300 max-w-2xl mx-auto">
            In-depth videos and discussions about bread baking techniques and troubleshooting
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          {mediaItems.map((item, index) => (
            <div key={index} className="bg-stone-700 rounded-xl overflow-hidden shadow-stone hover:shadow-warm transition-shadow">
              <div className="relative">
                <img 
                  src={item.thumbnail} 
                  alt={item.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <Play className="w-16 h-16 text-foreground" />
                </div>
                <div className="absolute bottom-4 right-4 bg-black/70 text-foreground px-2 py-1 rounded text-sm">
                  {item.duration}
                </div>
                <div className="absolute top-4 left-4 bg-primary text-primary-foreground px-2 py-1 rounded-full text-xs font-semibold capitalize">
                  {item.type}
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-bold text-foreground line-clamp-2 flex-1">{item.title}</h3>
                  <span className="text-muted-foreground text-sm ml-4">{item.date}</span>
                </div>
                <p className="text-stone-300 text-sm line-clamp-2">{item.description}</p>
                <a 
                  href={item.link}
                  className="inline-flex items-center text-primary hover:text-primary/80 font-medium transition-colors"
                >
                  Watch Now
                  <ArrowRight className="ml-1 w-4 h-4" />
                </a>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Button variant="warm" size="xl" asChild>
            <a href="https://www.youtube.com/@henryhunterjr" target="_blank" rel="noopener noreferrer">
              View All Videos
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default BakersBench;