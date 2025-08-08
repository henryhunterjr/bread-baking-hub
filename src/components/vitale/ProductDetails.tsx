import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, Book, Users, Mail } from 'lucide-react';
import { ResponsiveImage } from '@/components/ResponsiveImage';

export const ProductDetails = () => {
  const included = [
    {
      icon: Package,
      title: "Dehydrated Vitale Starter",
      description: "Enough for 2 complete builds - one active, one backup"
    },
    {
      icon: Book,
      title: "Digital Reactivation Guide", 
      description: "Step-by-step instructions with photos and troubleshooting"
    },
    {
      icon: Mail,
      title: "Email Support",
      description: "Direct access to Henry for questions and guidance"
    },
    {
      icon: Users,
      title: "Facebook Group Access",
      description: "Join 38,000+ bakers in 'Baking Great Bread at Home'"
    }
  ];

  return (
    <section className="py-20 bg-section-background">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            What You Get
          </h2>
          <p className="text-xl text-muted-foreground">
            Everything you need for sourdough success
          </p>
        </div>

        <Card className="p-8 mb-12">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-primary mb-2">
              One $14 Sachet Includes:
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              {included.map((item, index) => {
                const IconComponent = item.icon;
                return (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <IconComponent className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">
                        {item.title}
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        {item.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Product image showcase */}
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <ResponsiveImage 
              src="/lovable-uploads/828b37ec-9c03-472c-a48d-25cafa2981ad.png"
              alt="Complete Vitale starter package contents"
              className="rounded-xl shadow-stone w-full"
              loading="lazy"
            />
          </div>
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-foreground">
              Professional Quality, Home Baker Friendly
            </h3>
            <p className="text-muted-foreground">
              Each package is carefully prepared using professional dehydration equipment, 
              then quality-tested monthly to ensure consistent results. The same attention 
              to detail that Henry uses in his own kitchen.
            </p>
            <p className="text-muted-foreground">
              The generous portion size means you can build two complete starters - 
              perfect for having a backup or sharing with a friend.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};