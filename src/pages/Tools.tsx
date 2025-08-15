import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import BakersPercentSolver from "@/components/BakersPercentSolver";

const Tools = () => {
  return (
    <>
      <Helmet>
        <title>Baking Tools & Calculator Suite - Essential Bread Making Tools | Baking Great Bread</title>
        <meta name="description" content="Professional bread baking calculator suite with Baker's percentage solver, scaling tools, and essential equipment guides for perfect homemade bread." />
        <link rel="canonical" href="https://bread-baking-hub.vercel.app/tools" />
        <meta property="og:title" content="Baking Tools & Calculator Suite - Essential Bread Making Tools | Baking Great Bread" />
        <meta property="og:description" content="Professional bread baking calculator suite with Baker's percentage solver, scaling tools, and essential equipment guides for perfect homemade bread." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://bread-baking-hub.vercel.app/tools" />
        <meta property="og:image" content="https://ojyckskucneljvuqzrsw.supabase.co/storage/v1/object/public/blog-images/2025-07/baking-great-bread-at-home-blog/optimizeduploadedbreadhero.avif" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="https://ojyckskucneljvuqzrsw.supabase.co/storage/v1/object/public/blog-images/2025-07/baking-great-bread-at-home-blog/optimizeduploadedbreadhero.avif" />
      </Helmet>
      
      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <header className="text-center mb-12">
              <h1 className="text-4xl font-bold text-foreground mb-6">Bread Baking Calculator Suite</h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Professional-grade calculators and tools for precise bread baking. 
                Master baker's percentages, scaling, and recipe development with our comprehensive suite.
              </p>
            </header>
            
            <Tabs defaultValue="bakers-percent" className="w-full">
              <TabsList className="grid w-full grid-cols-2 lg:grid-cols-6 mb-8">
                <TabsTrigger value="bakers-percent">Baker's % (Smart Solver)</TabsTrigger>
                <TabsTrigger value="scaling" disabled>Scaling</TabsTrigger>
                <TabsTrigger value="preferments" disabled>Preferments</TabsTrigger>
                <TabsTrigger value="conversions" disabled>Conversions</TabsTrigger>
                <TabsTrigger value="ddt" disabled>DDT</TabsTrigger>
                <TabsTrigger value="log" disabled>Log</TabsTrigger>
              </TabsList>
              
              <TabsContent value="bakers-percent" className="mt-6">
                <div className="bg-card rounded-lg border p-6">
                  <header className="mb-6">
                    <h2 className="text-2xl font-semibold mb-2">Baker's Percentage Smart Solver</h2>
                    <p className="text-muted-foreground">
                      Advanced two-knowns solver with true levain math. Choose any two values you know, 
                      and we'll calculate the complete recipe with proper baker's percentages.
                    </p>
                  </header>
                  <BakersPercentSolver />
                </div>
              </TabsContent>
              
              <TabsContent value="scaling">
                <div className="bg-card rounded-lg border p-6">
                  <h2 className="text-2xl font-semibold mb-4">Recipe Scaling</h2>
                  <p className="text-muted-foreground">Coming soon - Scale recipes up or down while maintaining perfect ratios.</p>
                </div>
              </TabsContent>
              
              <TabsContent value="preferments">
                <div className="bg-card rounded-lg border p-6">
                  <h2 className="text-2xl font-semibold mb-4">Preferment Calculator</h2>
                  <p className="text-muted-foreground">Coming soon - Calculate poolish, biga, and levain ratios.</p>
                </div>
              </TabsContent>
              
              <TabsContent value="conversions">
                <div className="bg-card rounded-lg border p-6">
                  <h2 className="text-2xl font-semibold mb-4">Unit Conversions</h2>
                  <p className="text-muted-foreground">Coming soon - Convert between metric and imperial measurements.</p>
                </div>
              </TabsContent>
              
              <TabsContent value="ddt">
                <div className="bg-card rounded-lg border p-6">
                  <h2 className="text-2xl font-semibold mb-4">Desired Dough Temperature</h2>
                  <p className="text-muted-foreground">Coming soon - Calculate optimal water temperature for perfect fermentation.</p>
                </div>
              </TabsContent>
              
              <TabsContent value="log">
                <div className="bg-card rounded-lg border p-6">
                  <h2 className="text-2xl font-semibold mb-4">Baking Log</h2>
                  <p className="text-muted-foreground">Coming soon - Track your bakes and improve your technique.</p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default Tools;