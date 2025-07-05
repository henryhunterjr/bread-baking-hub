import { Card } from "@/components/ui/card";

interface AuthorReflectionBlockProps {
  story: string;
  position?: "left" | "right";
}

const AuthorReflectionBlock = ({ story, position = "left" }: AuthorReflectionBlockProps) => {
  return (
    <section className="py-16 bg-gradient-to-r from-amber-900/10 via-orange-900/5 to-amber-800/10 relative overflow-hidden">
      {/* Subtle flour texture background */}
      <div className="absolute inset-0 opacity-5">
        <div className="h-full w-full bg-gradient-to-br from-amber-100/20 via-transparent to-orange-100/10" 
             style={{
               backgroundImage: `radial-gradient(circle at 20% 80%, rgba(251, 191, 36, 0.1) 0%, transparent 50%),
                                radial-gradient(circle at 80% 20%, rgba(249, 115, 22, 0.1) 0%, transparent 50%)`
             }}>
        </div>
      </div>
      
      <div className="max-w-6xl mx-auto px-4 relative z-10">
        <div className={`max-w-4xl ${position === "right" ? "ml-auto text-right" : ""}`}>
          <Card className="bg-card/80 backdrop-blur-sm border-primary/20 p-8 shadow-stone">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-px bg-primary"></div>
              <span className="text-sm font-medium text-primary tracking-wider uppercase">
                Behind the Book
              </span>
              <div className="w-12 h-px bg-primary"></div>
            </div>
            
            <blockquote className="text-lg md:text-xl leading-relaxed text-foreground font-serif italic mb-6">
              "{story}"
            </blockquote>
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-sm">
                HH
              </div>
              <div>
                <p className="font-medium text-foreground">Henry Hunter</p>
                <p className="text-sm text-muted-foreground">Author & Baker</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default AuthorReflectionBlock;