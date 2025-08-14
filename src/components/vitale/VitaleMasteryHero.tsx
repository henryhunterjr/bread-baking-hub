import { Button } from '@/components/ui/button';
import { ExternalLink, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const VitaleMasteryHero = () => {
  const navigate = useNavigate();
  
  const vitaleSlide = {
    id: "vitale",
    title: "Vitale Sourdough Mastery",
    tagline: "Master the Art of Fermentation and Baking",
    description: "Ready to transform your relationship with sourdough? This complete guide shares the secrets behind Henry Hunter's 10+ year relationship with his treasured starter – the foundation of consistently exceptional bread.",
    backgroundImage: "/lovable-uploads/e7320a6f-7363-46a3-a5a5-c30644bac35a.png",
    amazonUrl: "https://www.amazon.com/dp/B0CVB8ZCFV"
  };

  const handlePreviewClick = () => {
    // Track analytics if available
    if (typeof (window as any).gtag !== 'undefined') {
      (window as any).gtag('event', 'vitale_preview_click', {
        event_category: 'engagement',
        event_label: 'vitale_sourdough_mastery'
      });
    }
    navigate('/preview/vitale-sourdough-mastery');
  };

  return (
    <section className="relative h-[60vh] min-h-[500px] md:h-[80vh] md:min-h-[600px] w-full overflow-hidden">
      {/* Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: `url(${vitaleSlide.backgroundImage})`,
        }}
      >
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Content Overlay */}
      <div className="relative h-full flex items-center">
        <div className="max-w-7xl mx-auto px-4 w-full">
          {/* Mobile Layout */}
          <div className="md:hidden text-center text-white space-y-6">
            <h1 className="text-3xl font-bold leading-tight">
              {vitaleSlide.title}
            </h1>
            <p className="text-lg font-medium text-amber-200">
              {vitaleSlide.tagline}
            </p>
            <p className="text-base leading-relaxed text-gray-200 max-w-md mx-auto">
              {vitaleSlide.description}
            </p>
            <div className="flex flex-col gap-3 max-w-xs mx-auto">
              <Button 
                size="lg" 
                className="w-full bg-amber-600 hover:bg-amber-700 text-white"
                asChild
              >
                <a href={vitaleSlide.amazonUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Buy on Amazon
                </a>
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="w-full border-white text-white hover:bg-white hover:text-black"
                onClick={handlePreviewClick}
                data-analytics="vitale_preview_click"
              >
                <Eye className="mr-2 h-4 w-4" />
                Preview Book
              </Button>
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden md:block">
            <div className="grid grid-cols-2 gap-12 items-center">
              <div className="text-white space-y-8">
                <div className="space-y-4">
                  <h1 className="text-4xl lg:text-5xl font-bold leading-tight">
                    {vitaleSlide.title}
                  </h1>
                  <p className="text-xl font-medium text-amber-200">
                    {vitaleSlide.tagline}
                  </p>
                </div>
                <p className="text-lg leading-relaxed text-gray-200">
                  {vitaleSlide.description}
                </p>
                <div className="flex gap-4">
                  <Button 
                    size="lg" 
                    className="bg-amber-600 hover:bg-amber-700 text-white"
                    asChild
                  >
                    <a href={vitaleSlide.amazonUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Buy on Amazon
                    </a>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="border-white text-white hover:bg-white hover:text-black"
                    onClick={handlePreviewClick}
                    data-analytics="vitale_preview_click"
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    Preview Book
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VitaleMasteryHero;