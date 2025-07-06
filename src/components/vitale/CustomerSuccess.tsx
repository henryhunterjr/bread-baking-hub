import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Star } from 'lucide-react';

export const CustomerSuccess = () => {
  const testimonials = [
    {
      name: "Sarah M.",
      location: "Portland, OR",
      quote: "I was nervous about starting with sourdough, but Vitale made it so easy. Had beautiful bread on day 3 just like promised!",
      rating: 5,
      image: "/lovable-uploads/ad456380-83ab-4b4b-9dd6-e0fcdf10f398.png"
    },
    {
      name: "Mike R.",
      location: "Austin, TX", 
      quote: "The quality is incredible. My starter is now 6 months old and still going strong. Worth every penny.",
      rating: 5,
      image: "/lovable-uploads/a374f667-4314-42da-9466-8627518d052d.png"
    },
    {
      name: "Lisa Chen",
      location: "San Francisco, CA",
      quote: "Perfect for beginners! The instructions were clear and the starter was active within hours. Two starters from one packet is genius.",
      rating: 5,
      image: "/lovable-uploads/154d14c0-76bd-47e3-b378-282823bda6fd.png"
    }
  ];

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            Customer Success Stories
          </h2>
          <p className="text-xl text-muted-foreground">
            Real results from real bakers
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="p-6 h-full">
              <CardHeader className="text-center">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full overflow-hidden">
                  <img 
                    src={testimonial.image}
                    alt={`Success story from ${testimonial.name}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="flex justify-center space-x-1 mb-2">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                  ))}
                </div>
                <CardTitle className="text-lg text-foreground">
                  {testimonial.name}
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  {testimonial.location}
                </p>
              </CardHeader>
              <CardContent>
                <blockquote className="text-muted-foreground italic text-center">
                  "{testimonial.quote}"
                </blockquote>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};