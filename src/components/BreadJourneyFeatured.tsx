import { Button } from "@/components/ui/button";
import { Headphones, ExternalLink } from "lucide-react";
// Use the uploaded image from public folder

interface BreadJourneyFeaturedProps {
  onListen: () => void;
}

const BreadJourneyFeatured = ({ onListen }: BreadJourneyFeaturedProps) => {
  return (
    <section className="py-16 bg-section-background">
      <div className="max-w-6xl mx-auto px-4">
        <div className="relative overflow-hidden rounded-2xl shadow-stone">
          {/* Background Image */}
          <video
            className="absolute inset-0 w-full h-full object-cover"
            src="https://ojyckskucneljvuqzrsw.supabase.co/storage/v1/object/public/audio-files/bread-journey-video.mp4"
            poster="https://ojyckskucneljvuqzrsw.supabase.co/storage/v1/object/public/hero-images/video-poster.png"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            aria-label="Bread: A Journey hero background video"
          >
            <source src="https://ojyckskucneljvuqzrsw.supabase.co/storage/v1/object/public/audio-files/bread-journey-video.mp4" type="video/mp4" />
          </video>
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
          
          {/* Content */}
          <div className="relative p-8 lg:p-12">
            <div className="max-w-2xl">
              <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
                Bread: A Journey
              </h2>
              <p className="text-xl text-white/90 mb-2 italic">
                Through History, Science, Art, and Community
              </p>
              <p className="text-lg text-white/80 mb-8">
                Discover the fascinating story behind humanity's most fundamental food technology.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  onClick={onListen}
                  size="lg" 
                  className="bg-primary hover:bg-primary/90 text-white shadow-lg"
                >
                  <Headphones className="mr-2 h-5 w-5" />
                  Listen to Excerpt
                </Button>
                
                <Button 
                  variant="outline" 
                  size="lg"
                  className="bg-white/90 hover:bg-white text-gray-900 border-0 shadow-lg"
                  asChild
                >
                  <a href="https://a.co/d/fDyKdyp" target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="mr-2 h-5 w-5" />
                    Buy Now
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BreadJourneyFeatured;