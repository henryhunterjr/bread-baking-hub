import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ToolsResources from "@/components/ToolsResources";
import RecommendedTools from "@/components/RecommendedTools";
import { Testimonials } from "@/components/Testimonials";

const Tools = () => {
  return (
    <>
      <Helmet>
        <title>Baking Tools & Equipment - Essential Bread Making Tools | Baking Great Bread</title>
        <meta name="description" content="Discover essential bread baking tools and equipment. From mixers to measuring tools, find everything you need for perfect homemade bread." />
        <link rel="canonical" href="https://bread-baking-hub.vercel.app/tools" />
        <meta property="og:title" content="Baking Tools & Equipment - Essential Bread Making Tools | Baking Great Bread" />
        <meta property="og:description" content="Discover essential bread baking tools and equipment. From mixers to measuring tools, find everything you need for perfect homemade bread." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://bread-baking-hub.vercel.app/tools" />
        <meta property="og:image" content="https://ojyckskucneljvuqzrsw.supabase.co/storage/v1/object/public/blog-images/2025-07/baking-great-bread-at-home-blog/optimizeduploadedbreadhero.avif" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="https://ojyckskucneljvuqzrsw.supabase.co/storage/v1/object/public/blog-images/2025-07/baking-great-bread-at-home-blog/optimizeduploadedbreadhero.avif" />
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
            <Testimonials className="mb-10" />
            
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