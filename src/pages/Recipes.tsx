import Header from "../components/Header";
import Footer from "../components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Recipes = () => {
  return (
    <div className="bg-background text-foreground">
      <Header />
      <main className="min-h-screen">
        <div className="max-w-4xl mx-auto px-4 py-16">
          <div className="text-center space-y-6 mb-12">
            <h1 className="text-4xl md:text-6xl font-bold text-primary">
              Recipes Collection
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Coming soon! We're carefully curating our best bread recipes for you.
            </p>
          </div>

          <Card className="p-8 text-center">
            <CardHeader>
              <CardTitle className="text-2xl text-primary">Under Construction</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-6">
                We're working hard to bring you the most comprehensive collection of bread recipes. 
                In the meantime, check out Henry's Foolproof Recipe to get started!
              </p>
              <a 
                href="/henrys-foolproof-recipe" 
                className="inline-block bg-primary text-primary-foreground px-6 py-3 rounded-md hover:bg-primary/90 transition-colors"
              >
                Try Henry's Foolproof Recipe
              </a>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Recipes;