import { Button } from "@/components/ui/button";
import { Headphones, ShoppingCart } from "lucide-react";
import { OptimizedImage } from "@/components/OptimizedImage";

interface LoafAndLieHeroSectionProps {
  onListen: () => void;
}

const LoafAndLieHeroSection = ({ onListen }: LoafAndLieHeroSectionProps) => {
  return (
    <section className="relative w-full h-[60vh] min-h-[400px] overflow-hidden">
      {/* Background Image */}
      <OptimizedImage
        src="/lovable-uploads/a95e5824-e4a5-4592-a465-9ea4df7c5488.png"
        alt="Loaf and Lie book cover background"
        width={1920}
        height={1080}
        priority={true}
        className="absolute inset-0 w-full h-full object-cover gpu-accelerated"
        sizes="100vw"
      />
      
      {/* Buttons positioned in upper right */}
      <div className="absolute top-8 right-8 flex flex-col gap-3">
        <Button 
          onClick={onListen}
          size="lg" 
          className="bg-amber-600 hover:bg-amber-700 text-white shadow-lg"
        >
          <Headphones className="mr-2 h-5 w-5" />
          See the Trailer
        </Button>
        
        <Button 
          variant="outline" 
          size="lg"
          className="bg-white/90 hover:bg-white text-gray-900 border-0 shadow-lg"
          asChild
        >
          <a href="https://a.co/d/1E3objQ" target="_blank" rel="noopener noreferrer">
            <ShoppingCart className="mr-2 h-5 w-5" />
            Buy on Amazon
          </a>
        </Button>
      </div>
    </section>
  );
};

export default LoafAndLieHeroSection;