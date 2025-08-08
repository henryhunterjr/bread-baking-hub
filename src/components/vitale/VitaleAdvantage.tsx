import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Thermometer, CheckCircle, Package } from 'lucide-react';

export const VitaleAdvantage = () => {
  const advantages = [
    {
      icon: Thermometer,
      title: "Perfect Dehydration Process",
      description: "Using the Brød & Taylor Sahara dehydrator with precise temperature control and timing. Zero mold opportunity with professional-grade process."
    },
    {
      icon: CheckCircle,
      title: "Quality Assurance",
      description: "Monthly cultivation of new starter batches. Personal testing in Henry's kitchen. Proven track record with real testimonials from successful bakers."
    },
    {
      icon: Package,
      title: "Generous Portion",
      description: "Each sachet builds TWO complete starters - one for active baking, one for backup or emergencies. Better value than competitors."
    }
  ];

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            The Vitale Advantage
          </h2>
          <p className="text-xl text-muted-foreground">
            What makes our dehydrated starter different
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {advantages.map((advantage, index) => {
            const IconComponent = advantage.icon;
            return (
              <Card key={index} className="p-6 text-center h-full">
                <CardHeader>
                  <div className="mx-auto w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mb-4">
                    <IconComponent className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-xl text-foreground">
                    {advantage.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    {advantage.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
        
        {/* Purchase CTA */}
        <div className="text-center mt-12">
          <Button 
            size="xl" 
            variant="hero"
            onClick={() => (window.location.href = '/go?s=vitale')}}
            className="text-lg"
          >
            Get Your Vitale Starter - $14
          </Button>
        </div>
      </div>
    </section>
  );
};