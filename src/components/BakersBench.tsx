import { Button } from '@/components/ui/button';
import { ArrowRight, Play } from 'lucide-react';
import challengeBreadImage from '@/assets/challenge-bread.jpg';
import VideoPlayerModal from './VideoPlayerModal';
import { useState } from 'react';
import { ResponsiveImage } from '@/components/ResponsiveImage';

const BakersBench = () => {
  const [selectedVideo, setSelectedVideo] = useState<{
    url: string;
    title: string;
    description: string;
  } | null>(null);
  
  const handlePlayVideo = (item: {
    title: string;
    description: string;
    link: string;
    type: string;
  }) => {
    // Only open modal for YouTube videos, otherwise open externally
    if (item.link.includes('youtu.be') || item.link.includes('youtube.com/watch')) {
      setSelectedVideo({
        url: item.link,
        title: item.title,
        description: item.description
      });
    } else {
      window.open(item.link, '_blank', 'noopener,noreferrer');
    }
  };
  
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
      title: "A Fat Jewish German Baker Treated Me Like a Sourdough Starter",
      description: "Breaking Bread Podcast: Exploring bread legends, baking tips & cultural stories from food history",
      type: "video",
      thumbnail: "https://img.youtube.com/vi/49XtxfMlBgo/maxresdefault.jpg",
      duration: "7:33",
      link: "https://youtu.be/49XtxfMlBgo?si=-8Jc7YixJJXDaLOI",
      date: "April 2023"
    }
  ];

  const challenges = [
    {
      title: "The Modern Baker's Toolkit",
      description: "Essential tools and techniques for modern bread baking",
      thumbnail: "https://ojyckskucneljvuqzrsw.supabase.co/storage/v1/object/public/recipe-uploads/recipe-1.png",
      link: "https://modern-bakers-toolkit-7n439ft.gamma.site/",
      type: "toolkit"
    },
    {
      title: "Market Fresh Challenge",
      description: "Farm-to-table bread baking with seasonal ingredients",
      thumbnail: "https://ojyckskucneljvuqzrsw.supabase.co/storage/v1/object/public/recipe-uploads/recipe-2.png",
      link: "https://market-fresh-6ejlurg.gamma.site/",
      type: "seasonal"
    },
    {
      title: "Sourdough Starter 101",
      description: "Master the art of wild yeast cultivation",
      thumbnail: "https://ojyckskucneljvuqzrsw.supabase.co/storage/v1/object/public/recipe-uploads/recipe-3.png",
      link: "https://sourdough-starter-master-kxo6qxb.gamma.site/",
      type: "sourdough"
    },
    {
      title: "Score Big Challenge",
      description: "Perfect your bread scoring techniques",
      thumbnail: "https://ojyckskucneljvuqzrsw.supabase.co/storage/v1/object/public/recipe-uploads/recipe-4.png",
      link: "https://score-big-challenge-4cl87nq.gamma.site/",
      type: "technique"
    },
    {
      title: "Bewitching Halloween Breads",
      description: "Fun and festive bread ideas for Halloween",
      thumbnail: "https://ojyckskucneljvuqzrsw.supabase.co/storage/v1/object/public/recipe-uploads/recipe-5.png",
      link: "https://bewitching-breads-hallow-osjjysy.gamma.site/",
      type: "seasonal"
    },
    {
      title: "February Love Challenge",
      description: "Heart-warming breads for Valentine's Day",
      thumbnail: "https://ojyckskucneljvuqzrsw.supabase.co/storage/v1/object/public/recipe-uploads/recipe-6.png",
      link: "https://february-baking-challeng-2xj44f0.gamma.site/",
      type: "seasonal"
    },
    {
      title: "Give Bread Instead (Holiday Challenge)",
      description: "This Holiday Season, give homemade bread as the perfect gift.",
      thumbnail: "https://ojyckskucneljvuqzrsw.supabase.co/storage/v1/object/public/recipe-uploads/recipe-7.png",
      link: "#", // TODO: replace with published Gamma page URL
      type: "seasonal"
    },
    {
      title: "Sourdough Conversion Challenge",
      description: "Convert your favorite yeast recipes to sourdough.",
      thumbnail: "https://ojyckskucneljvuqzrsw.supabase.co/storage/v1/object/public/recipe-uploads/recipe-8.png",
      link: "#", // TODO: replace with published Gamma page URL
      type: "sourdough"
    },
    {
      title: "August Challenge – #BlueRibbon Bake",
      description: "County fair bakes worthy of a blue ribbon.",
      thumbnail: "https://ojyckskucneljvuqzrsw.supabase.co/storage/v1/object/public/recipe-uploads/recipe-9.png",
      link: "#", // TODO: replace with published Gamma page URL
      type: "seasonal"
    },
    {
      title: "February 2025 Challenge #Love",
      description: "Bake with heart—share your #Love themed bakes.",
      thumbnail: "https://ojyckskucneljvuqzrsw.supabase.co/storage/v1/object/public/recipe-uploads/recipe-10.png",
      link: "#", // TODO: replace with published Gamma page URL
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
                <ResponsiveImage 
                  src={item.thumbnail} 
                  alt={item.title}
                  className="w-full h-48 object-cover"
                  loading="lazy"
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
                <button 
                  onClick={() => handlePlayVideo(item)}
                  className="inline-flex items-center text-primary hover:text-primary/80 font-medium transition-colors bg-transparent border-none cursor-pointer"
                >
                  Watch Now
                  <ArrowRight className="ml-1 w-4 h-4" />
                </button>
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
                  <ResponsiveImage 
                    src={challenge.thumbnail} 
                    alt={challenge.title}
                    className="w-full h-40 object-cover"
                    loading="lazy"
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
      
      {/* Video Player Modal */}
      <VideoPlayerModal
        isOpen={!!selectedVideo}
        onClose={() => setSelectedVideo(null)}
        videoUrl={selectedVideo?.url || ''}
        title={selectedVideo?.title || ''}
        description={selectedVideo?.description || ''}
      />
    </section>
  );
};

export default BakersBench;