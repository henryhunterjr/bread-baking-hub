import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ResponsiveImage } from '@/components/ResponsiveImage';
export const ThreeDayPromise = () => {
  const timeline = [
    {
      day: "Day 1",
      title: "Rehydration",
      description: "Mix sachet with water and watch for signs of life. We'll guide you through what to expect hour by hour.",
      image: "/lovable-uploads/828b37ec-9c03-472c-a48d-25cafa2981ad.png"
    },
    {
      day: "Day 2", 
      title: "First Feeding",
      description: "Look for bubbling activity and feed according to our proven ratios. Troubleshooting tips included.",
      image: "/lovable-uploads/7da8ec7e-56f6-4a25-be5f-2614b696df25.png"
    },
    {
      day: "Day 3",
      title: "Ready to Bake",
      description: "Your starter is active and ready! We'll show you the success indicators and first recipe recommendations.",
      image: "/lovable-uploads/154d14c0-76bd-47e3-b378-282823bda6fd.png"
    }
  ];

  return (
    <section className="py-20 bg-section-background">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            The 3-Day Promise
          </h2>
          <p className="text-xl text-muted-foreground">
            From sachet to fresh bread in just three days
          </p>
        </div>

        <div className="space-y-8">
          {timeline.map((day, index) => (
            <Card key={index} className="overflow-hidden">
              <div className="grid md:grid-cols-2 gap-0">
                <div className="p-8 flex flex-col justify-center">
                  <CardHeader className="p-0 mb-4">
                    <div className="text-4xl font-bold text-primary mb-2">
                      {day.day}
                    </div>
                    <CardTitle className="text-2xl text-foreground">
                      {day.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <p className="text-lg text-muted-foreground">
                      {day.description}
                    </p>
                  </CardContent>
                </div>
                <div className="relative h-64 md:h-auto">
                <ResponsiveImage 
                  src={day.image}
                  alt={`${day.title} - ${day.day}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                </div>
              </div>
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
            Start Your 3-Day Journey - $14
          </Button>
        </div>
      </div>
    </section>
  );
};