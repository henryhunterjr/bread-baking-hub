import { Button } from "@/components/ui/button";
import { Eye, ExternalLink, Play } from "lucide-react";
import { OptimizedImage } from '@/components/OptimizedImage';

interface LoafAndLieSpotlightProps {
  onPreview: () => void;
  onAudio?: () => void;
}

const LoafAndLieSpotlight = ({ onPreview, onAudio }: LoafAndLieSpotlightProps) => {
  return (
    <section className="py-20 bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 relative overflow-hidden">
      {/* Dramatic lighting effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl"></div>
      </div>
      
      {/* Film grain texture */}
      <div className="absolute inset-0 opacity-20">
        <div className="h-full w-full bg-gradient-radial from-transparent via-gray-800/20 to-transparent"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Book cover */}
          <div className="relative">
            <div className="relative group">
              {/* Glow effect behind book */}
              <div className="absolute -inset-4 bg-gradient-to-r from-red-500/20 via-orange-500/20 to-red-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
              
              <OptimizedImage 
                src="/lovable-uploads/83cde278-edfc-4a30-98f4-79f37c79346e.png"
                alt="The Loaf and the LIE cover"
                width={400}
                height={600}
                className="relative w-full max-w-md mx-auto rounded-lg shadow-2xl transform group-hover:scale-105 transition-transform duration-500 gpu-accelerated"
                sizes="(max-width: 768px) 100vw, 400px"
                quality={70}
              />
              
              {/* Spotlight effect */}
              <div className="absolute -top-8 -right-8 w-32 h-32 bg-gradient-radial from-white/10 to-transparent rounded-full blur-2xl"></div>
            </div>
          </div>
          
          {/* Right side - Content */}
          <div className="text-white">
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">🕵🏽‍♂️</span>
                <span className="text-red-400 font-semibold tracking-wider uppercase text-sm">
                  Investigative Exposé
                </span>
              </div>
              
              <h2 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
                <span className="text-red-400">Expose</span> the System.<br />
                <span className="text-orange-300">Reclaim</span> the Bread.
              </h2>
            </div>
            
            <div className="mb-8">
              <p className="text-xl text-gray-200 leading-relaxed mb-6">
                "The Loaf and the LIE" pulls back the curtain on the industrial bread complex 
                and the marketing myths we swallowed.
              </p>
              
              <p className="text-gray-300 leading-relaxed mb-6">
                With the depth of a historian and the bite of a journalist, Henry dissects corporate 
                collusion, lost fermentation knowledge, and the marketing tricks that turned nourishing 
                loaves into empty calories.
              </p>
              
              <p className="text-gray-400 italic">
                This is not just a book. It's a reckoning.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              {onAudio && (
                <Button 
                  onClick={onAudio}
                  size="lg" 
                  className="bg-amber-600 hover:bg-amber-700 text-white border-amber-500"
                >
                  <Play className="mr-2 h-5 w-5" />
                  Watch the Trailer
                </Button>
              )}
              
              <Button 
                onClick={onPreview}
                size="lg" 
                className="bg-red-600 hover:bg-red-700 text-white border-red-500"
              >
                <Eye className="mr-2 h-5 w-5" />
                Read the Full Synopsis
              </Button>
              
              <Button 
                variant="outline" 
                size="lg"
                className="border-gray-600 text-gray-200 hover:bg-gray-800"
                asChild
              >
                <a href="/go?u=https%3A%2F%2Fhunter53.gumroad.com%2Fl%2Fixsjex" target="_self" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-5 w-5" />
                  Get the Book
                </a>
              </Button>
            </div>
          </div>
        </div>
        
        {/* Bottom accent */}
        <div className="flex justify-center items-center gap-8 mt-16 opacity-40">
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-red-500 to-transparent"></div>
          <div className="w-2 h-2 rounded-full bg-red-500"></div>
          <div className="w-24 h-px bg-gradient-to-l from-transparent via-red-500 to-transparent"></div>
        </div>
      </div>
    </section>
  );
};

export default LoafAndLieSpotlight;