import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { OptimizedImage } from '@/components/OptimizedImage';
import henryPortraitImage from '@/assets/henry-portrait.jpg';

const AboutHenry = () => {
  return (
    <section className="py-20 px-4 bg-stone-800">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <OptimizedImage 
              src="/lovable-uploads/e9d4e95a-2202-46e4-9b07-ae4646daff63.png" 
              alt="Henry Hunter in his kitchen" 
              width={600}
              height={600}
              className="rounded-2xl shadow-stone w-full h-auto gpu-accelerated"
              sizes="(max-width: 768px) 100vw, 50vw"
              quality={70}
            />
            <div className="absolute top-4 left-4 bg-black/50 text-foreground px-3 py-1 rounded-full text-sm">
              Master Baker & Author
            </div>
          </div>
          <div className="space-y-6">
            <h2 className="text-4xl font-bold text-primary">Meet Henry</h2>
            <p className="text-lg text-stone-300 leading-relaxed">
              I'm Henry Hunter, an artisan bread baker, cookbook author, and founder of the 
              Baking Great Bread at Home community. What started as a personal journey to understand 
              the science and art behind great bread has become a mission to help home bakers everywhere.
            </p>
            <p className="text-lg text-stone-300 leading-relaxed">
              Through my books, digital tools, and our supportive community, I've helped thousands 
              of bakers go from store-bought to homemade, from dense failures to perfectly risen loaves. 
              My approach combines traditional techniques with modern understanding, making artisan 
              bread accessible to everyone.
            </p>
            <div className="bg-stone-700 p-6 rounded-lg">
              <p className="text-stone-300 italic mb-4">
                "Baking great bread isn't about perfect technique—it's about understanding your ingredients, 
                trusting the process, and learning from every loaf."
              </p>
              <p className="text-primary font-semibold">— Henry Hunter</p>
            </div>
            <Button variant="warm" asChild>
              <Link to="/about">Read My Story</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutHenry;