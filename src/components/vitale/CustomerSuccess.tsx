import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star } from 'lucide-react';
import { ResponsiveImage } from '@/components/ResponsiveImage';

export const CustomerSuccess = () => {
  const testimonials = [
    {
      name: "Nicole",
      location: "Verified Customer",
      quote: "Thanks a bunch! I really appreciate it! I just got home from being out of town all day and my starter has at least tripled! My jaw hit the floor - I've never had a starter so active!!",
      rating: 5,
      image: "/lovable-uploads/ad456380-83ab-4b4b-9dd6-e0fcdf10f398.png"
    },
    {
      name: "Elaine Morris",
      location: "Day 3 Success", 
      quote: "Omg! The pic above was before discarding and feeding at 6:00 this morning. It's now 10:30a!!! I think she's ready for the fridge! Over doubled in four hours! Thank you so much!",
      rating: 5,
      image: "/lovable-uploads/a374f667-4314-42da-9466-8627518d052d.png"
    },
    {
      name: "Monica D. Njoo",
      location: "Verified Customer",
      quote: "Shoutout to Vitale from the fridge. I took 20g starter from the fridge and gave it a single feeding overnight. Made a levain around noon and it was ready for using about 4 hours later. My breads have more spring than before switching!",
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
                <div className="w-28 h-28 mx-auto mb-4 rounded-full overflow-hidden">
                  <ResponsiveImage 
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
        
        {/* Purchase CTA */}
        <div className="text-center mt-12">
          <Button 
            size="xl" 
            variant="hero"
            onClick={() => window.open('https://vitalesourdoughco.etsy.com', '_blank')}
            className="text-lg"
          >
            Join These Success Stories - $14
          </Button>
        </div>
      </div>
    </section>
  );
};