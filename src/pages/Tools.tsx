import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ToolsResources from "@/components/ToolsResources";
import RecommendedTools from "@/components/RecommendedTools";

const Tools = () => {
  return (
    <>
      <Helmet>
        <title>Baking Tools & Equipment - Essential Bread Making Tools | Baking Great Bread</title>
        <meta name="description" content="Discover essential bread baking tools and equipment. From mixers to measuring tools, find everything you need for perfect homemade bread." />
      </Helmet>
      
      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold text-foreground mb-6">Essential Baking Tools</h1>
            <p className="text-xl text-muted-foreground mb-12">
              Discover the tools and equipment that will elevate your bread baking journey. 
              From beginner essentials to professional-grade equipment.
            </p>
            
            <ToolsResources />
            <RecommendedTools />
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default Tools;