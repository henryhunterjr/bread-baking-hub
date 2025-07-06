import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const StarterTruthSection = () => {
  return (
    <section className="py-20 bg-section-background">
      <div className="max-w-4xl mx-auto px-4">
        <Card className="p-8">
          <CardHeader>
            <CardTitle className="text-3xl md:text-4xl text-center text-primary mb-6">
              Why Age Doesn't Matter (And What Actually Does)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 text-lg text-muted-foreground">
            <p>
              People love to claim their starter is 150+ years old, but here's the truth...
            </p>
            
            <p>
              Every time you feed and discard your starter, you're essentially creating a new starter. 
              The microorganisms adapt to your environment, your flour, your water, and your schedule. 
              After just a few feeds, it becomes <span className="text-foreground font-semibold">YOUR</span> starter 
              from <span className="text-foreground font-semibold">YOUR</span> kitchen.
            </p>
            
            <p>
              What actually matters isn't how old the starter claims to be. What matters is:
            </p>
            
            <ul className="space-y-2 ml-6">
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                Your relationship with the starter
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                Your environment and kitchen conditions
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                Your flour and water quality
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                Consistent feeding and care
              </li>
            </ul>
            
            <p className="text-xl font-semibold text-foreground">
              Vitale isn't special because of age - it's special because it works reliably.
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};