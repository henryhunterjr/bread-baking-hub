import { Button } from '@/components/ui/button';
import { ArrowRight, Play } from 'lucide-react';
import challengeBreadImage from '@/assets/challenge-bread.jpg';

const BakersBench = () => {
  const mediaItems = [
    {
      title: "Crumb & Culture: Sourdough for the Rest of Us Book Review",
      description: "Mariah and Jules review Henry Hunter's heartfelt guide that demystifies sourdough while celebrating culture, care, and the stories behind every starter jar.",
      type: "podcast",
      thumbnail: "https://img.youtube.com/vi/FiQg8AaW7PE/maxresdefault.jpg",
      duration: "16:20",
      link: "https://youtu.be/FiQg8AaW7PE?si=uHnH9WG7004E6gDy",
      date: "March 2025"
    },
    {
      title: "Sourdough Troubleshooting: Dense Loaves",
      description: "Common mistakes that lead to dense bread and how to fix them",
      type: "video",
      thumbnail: challengeBreadImage,
      duration: "12:34",
      link: "https://www.youtube.com/@henryhunterjr",
      date: "June 2025"
    }
  ];

  const challenges = [
    {
      title: "The Modern Baker's Toolkit",
      description: "Essential tools and techniques for modern bread baking",
      thumbnail: "/lovable-uploads/6aad1feb-5cbe-4539-830e-5c5b14ef0b79.png",
      link: "https://modern-bakers-toolkit-7n439ft.gamma.site/",
      type: "toolkit"
    },
    {
      title: "Market Fresh Challenge",
      description: "Farm-to-table bread baking with seasonal ingredients",
      thumbnail: "/lovable-uploads/fce61684-fea2-4c54-86b5-2e05b69655d5.png",
      link: "https://market-fresh-6ejlurg.gamma.site/",
      type: "seasonal"
    },
    {
      title: "Sourdough Starter 101",
      description: "Master the art of wild yeast cultivation",
      thumbnail: "/lovable-uploads/3dd9d3e1-4062-40cc-82b2-41f79418dcdb.png",
      link: "https://sourdough-starter-master-kxo6qxb.gamma.site/",
      type: "sourdough"
    },
    {
      title: "Score Big Challenge",
      description: "Perfect your bread scoring techniques",
      thumbnail: "/lovable-uploads/fecb5d01-9088-44ad-8722-faaccc87696a.png",
      link: "https://score-big-challenge-4cl87nq.gamma.site/",
      type: "technique"
    },
    {
      title: "Bewitching Halloween Breads",
      description: "Fun and festive bread ideas for Halloween",
      thumbnail: "/lovable-uploads/eef793ee-a94a-4d13-9293-213e2ec9e632.png",
      link: "https://bewitching-breads-hallow-osjjysy.gamma.site/",
      type: "seasonal"
    },
    {
      title: "February Love Challenge",
      description: "Heart-warming breads for Valentine's Day",
      thumbnail: "/lovable-uploads/c1225388-44e4-4de5-a0c7-15ba9198e7f7.png",
      link: "https://february-baking-challeng-2xj44f0.gamma.site/",
      type: "seasonal"
    }
  ];

  return (
    <section className="py-20 px-4 bg-stone-800">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-primary mb-4">The Baker's Bench</h2>
          <p className="text-xl text-stone-300 max-w-2xl mx-auto">
            Podcasts, videos and in-depth discussions about bread baking techniques and troubleshooting
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
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-primary hover:text-primary/80 font-medium transition-colors"
                >
                  Watch Now
                  <ArrowRight className="ml-1 w-4 h-4" />
                </a>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12 space-y-4">
          <Button variant="warm" size="xl" asChild>
            <a href="https://www.youtube.com/@henryhunterjr" target="_blank" rel="noopener noreferrer">
              View All Videos
            </a>
          </Button>
          
        </div>

        {/* Monthly Challenges Section */}
        <div className="mt-20">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-primary mb-4">Monthly Challenges</h3>
            <p className="text-lg text-stone-300 max-w-2xl mx-auto">
              Join our community challenges and level up your bread baking skills
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {challenges.map((challenge, index) => (
              <div key={index} className="bg-stone-700 rounded-xl overflow-hidden shadow-stone hover:shadow-warm transition-all duration-300 hover:scale-105">
                <div className="relative">
                  <img 
                    src={challenge.thumbnail} 
                    alt={challenge.title}
                    className="w-full h-40 object-cover"
                  />
                  <div className="absolute top-3 left-3 bg-primary text-primary-foreground px-2 py-1 rounded-full text-xs font-semibold capitalize">
                    {challenge.type}
                  </div>
                </div>
                <div className="p-5 space-y-3">
                  <h4 className="text-lg font-bold text-foreground line-clamp-2">{challenge.title}</h4>
                  <p className="text-stone-300 text-sm line-clamp-2">{challenge.description}</p>
                  <a 
                    href={challenge.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-primary hover:text-primary/80 font-medium transition-colors"
                  >
                    Join Challenge
                    <ArrowRight className="ml-1 w-4 h-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BakersBench;