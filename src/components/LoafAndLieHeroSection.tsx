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
        style={{ backgroundImage: 'url(/lovable-uploads/a95e5824-e4a5-4592-a465-9ea4df7c5488.png)' }}
      />
      
      {/* Buttons positioned in upper right */}
      <div className="absolute top-8 right-8 flex flex-col gap-3">
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
    </section>
  );
};

export default LoafAndLieHeroSection;