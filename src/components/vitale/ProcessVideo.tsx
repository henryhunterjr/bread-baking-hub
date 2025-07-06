import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, ExternalLink } from 'lucide-react';

export const ProcessVideo = () => {
  return (
    <section className="py-20 bg-section-background">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            Behind the Scenes
          </h2>
          <p className="text-xl text-muted-foreground">
            See exactly how Vitale is prepared for perfect results
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Video Section */}
          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle className="text-xl text-center text-primary">
                How I Dehydrate Vitale for Perfect Results
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="relative aspect-video bg-stone-800 flex items-center justify-center">
                <img 
                  src="/lovable-uploads/87e73552-babd-4f00-b0e5-cc0a7f23e155.png"
                  alt="Brød & Taylor Sahara dehydrator in action"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-overlay-dark flex items-center justify-center">
                  <Button variant="hero" size="lg" className="text-lg">
                    <Play className="h-6 w-6 mr-2" />
                    Watch Process Video
                  </Button>
                </div>
              </div>
              <div className="p-6">
                <p className="text-muted-foreground text-center">
                  See the complete dehydration process using the Brød & Taylor Sahara dehydrator, 
                  plus my monthly quality testing routine.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Equipment Spotlight */}
          <div className="space-y-8">
            <Card className="p-6">
              <CardHeader>
                <CardTitle className="text-xl text-primary">
                  Equipment Spotlight: Brød & Taylor Sahara
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  The same dehydrator I use for Vitale - perfect temperature control 
                  and even air circulation ensure consistent results every time.
                </p>
                
                <div className="space-y-2">
                  <h4 className="font-semibold text-foreground">Benefits for home bakers:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Preserve your own starter cultures</li>
                    <li>• Make fruit leathers and dried herbs</li>
                    <li>• Professional results at home</li>
                    <li>• Precise temperature settings</li>
                  </ul>
                </div>

                <Button variant="outline" className="w-full">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Get the Brød & Taylor Sahara
                  <span className="text-xs ml-2">(Henry's discount code included)</span>
                </Button>
              </CardContent>
            </Card>

            <Card className="p-6">
              <CardHeader>
                <CardTitle className="text-lg text-foreground">
                  Monthly Quality Testing
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Every batch is personally tested by Henry in his kitchen before shipping. 
                  Only starters that meet strict activity and flavor standards make it to you.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};