import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";

const ComingSoonBlock = () => {
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Blurred background image */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(/lovable-uploads/43da7651-de36-46f7-ab6a-22e594aed31b.png)`,
          filter: 'blur(8px) brightness(0.3)',
          transform: 'scale(1.1)'
        }}
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60" />
      
      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto text-center px-4">
        <div className="mb-8">
          <div className="inline-block px-6 py-2 rounded-full bg-primary/20 border border-primary/30 mb-6">
            <span className="text-primary font-medium">Coming December 2025</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            Baking Great Bread at Home
          </h2>
          
          <p className="text-xl md:text-2xl text-orange-200 font-serif italic mb-8">
            A Journey Through the Seasons
          </p>
        </div>
        
        <div className="max-w-2xl mx-auto mb-10">
          <p className="text-lg text-gray-200 leading-relaxed mb-6">
            Henry's most ambitious work yet. Equal parts cookbook, memoir, and cultural history. 
            Recipes that span generations. Stories that trace the soul of bread.
          </p>
          
          <p className="text-base text-gray-300 italic">
            "This isn't just a cookbook. It's a year-long journey through time, temperature, and tradition."
          </p>
        </div>
        
        <Button size="lg" className="bg-primary hover:bg-primary/90 text-white px-8 py-3">
          <Bell className="mr-2 h-5 w-5" />
          Notify Me When It Drops
        </Button>
        
        {/* Decorative elements */}
        <div className="flex justify-center items-center gap-8 mt-12 opacity-60">
          <div className="w-16 h-px bg-gradient-to-r from-transparent to-primary"></div>
          <div className="w-2 h-2 rounded-full bg-primary"></div>
          <div className="w-16 h-px bg-gradient-to-l from-transparent to-primary"></div>
        </div>
      </div>
    </section>
  );
};

export default ComingSoonBlock;