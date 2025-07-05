import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

const testimonials = [
  {
    text: "This book finally helped me get sourdough right. Henry's approach is so practical and encouraging.",
    author: "Sarah M.",
    role: "Community Member",
    book: "Sourdough for the Rest of Us"
  },
  {
    text: "Henry teaches with truth and soul. His books aren't just recipes - they're stories that connect you to the bread.",
    author: "Michael R.",
    role: "Home Baker",
    book: "Bread: A Journey"
  },
  {
    text: "Finally, someone who doesn't make sourdough feel like rocket science. Real advice for real kitchens.",
    author: "Jennifer L.",
    role: "Busy Parent",
    book: "Sourdough for the Rest of Us"
  },
  {
    text: "The Yeast Water Handbook opened up a whole new world of fermentation for me. Brilliant work.",
    author: "David K.",
    role: "Advanced Baker",
    book: "Yeast Water Handbook"
  },
  {
    text: "Henry's market book helped me turn my passion into profit. The pricing chapter alone was worth the purchase.",
    author: "Lisa C.",
    role: "Farmers Market Vendor",
    book: "From Oven to Market"
  }
];

const PraiseSocialProof = () => {
  return (
    <section className="py-16 bg-section-background">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            What Readers Are Saying
          </h2>
          <p className="text-xl text-muted-foreground">
            Join thousands of bakers who've transformed their kitchens with Henry's guidance
          </p>
        </div>
        
        {/* Horizontal scroll container */}
        <div className="relative">
          <div className="overflow-x-auto pb-4">
            <div className="flex gap-6 w-max">
              {testimonials.map((testimonial, index) => (
                <Card 
                  key={index}
                  className="w-80 flex-shrink-0 p-6 bg-card border-border hover:shadow-stone hover:scale-105 transition-all duration-300"
                >
                  <div className="mb-4">
                    <div className="flex text-primary mb-2">
                      {"★".repeat(5)}
                    </div>
                    <blockquote className="text-foreground leading-relaxed italic">
                      "{testimonial.text}"
                    </blockquote>
                  </div>
                  
                  <div className="border-t pt-4">
                    <p className="font-medium text-foreground">
                      {testimonial.author}
                    </p>
                    <p className="text-sm text-muted-foreground mb-1">
                      {testimonial.role}
                    </p>
                    <p className="text-xs text-primary font-medium">
                      {testimonial.book}
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
          
          {/* Fade gradient on right edge */}
          <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-section-background to-transparent pointer-events-none"></div>
        </div>
        
        <div className="text-center mt-10">
          <Button variant="outline" size="lg">
            Read More Community Stories
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default PraiseSocialProof;