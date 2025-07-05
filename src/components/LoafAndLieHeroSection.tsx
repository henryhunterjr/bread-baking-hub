import { Button } from "@/components/ui/button";
import { Headphones, Download } from "lucide-react";

interface LoafAndLieHeroSectionProps {
  onListen: () => void;
}

const LoafAndLieHeroSection = ({ onListen }: LoafAndLieHeroSectionProps) => {
  return (
    <section className="relative w-full h-[60vh] min-h-[400px] overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: 'url(/lovable-uploads/a3275026-f4de-4e67-8ba6-53786e791047.png)' }}
      />
      
      {/* Subtle overlay for better button visibility */}
      <div className="absolute inset-0 bg-black/20" />
      
      {/* Centered Content */}
      <div className="relative h-full flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="space-y-2">
            <h2 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg">
              The Loaf and the LIE
            </h2>
            <p className="text-xl text-white/90 drop-shadow-md">
              A History of What We Broke and How We're Taking It Back
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={onListen}
              size="lg" 
              className="bg-amber-600 hover:bg-amber-700 text-white shadow-lg"
            >
              <Headphones className="mr-2 h-5 w-5" />
              Listen for Free
            </Button>
            
            <Button 
              variant="outline" 
              size="lg"
              className="bg-white/90 hover:bg-white text-gray-900 border-0 shadow-lg"
              asChild
            >
              <a href="#" download>
                <Download className="mr-2 h-5 w-5" />
                Download PDF
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LoafAndLieHeroSection;