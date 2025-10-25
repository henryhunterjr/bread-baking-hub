import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Guides = () => {
  const guides = [
    {
      title: "Sourdough Starter Guide",
      description: "Learn how to create and maintain a healthy sourdough starter from scratch.",
      link: "https://sourdough-starter-master-kxo6qxb.gamma.site/",
      difficulty: "Beginner"
    },
    {
      title: "Perfect Kaiser Rolls",
      description: "Master the art of shaping and baking traditional Kaiser rolls.",
      link: "/kaiser-rolls",
      difficulty: "Intermediate"
    },
    {
      title: "Henry's Foolproof Recipe",
      description: "A tried-and-tested recipe that works every time for beginners.",
      link: "/henrys-foolproof-recipe",
      difficulty: "Beginner"
    },
    {
      title: "Bread Troubleshooting",
      description: "Common bread baking problems and how to solve them.",
      link: "/troubleshooting",
      difficulty: "All Levels"
    },
    {
      title: "Bread Glossary",
      description: "Essential bread baking terms and techniques explained.",
      link: "/glossary",
      difficulty: "All Levels"
    },
    {
      title: "Bread Calculator",
      description: "Calculate ingredient ratios for perfect bread every time.",
      link: "/bread-calculator",
      difficulty: "All Levels"
    }
  ];

  return (
    <>
      <Helmet>
        <title>Bread Baking Guides - Step by Step Tutorials | Baking Great Bread</title>
        <meta name="description" content="Comprehensive bread baking guides and tutorials. Learn sourdough, artisan breads, and traditional techniques with expert instruction." />
        <link rel="canonical" href="https://bakinggreatbread.com/guides" />
        <meta property="og:title" content="Bread Baking Guides - Step by Step Tutorials | Baking Great Bread" />
        <meta property="og:description" content="Comprehensive bread baking guides and tutorials. Learn sourdough, artisan breads, and traditional techniques with expert instruction." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://bakinggreatbread.com/guides" />
        <meta property="og:image" content="https://ojyckskucneljvuqzrsw.supabase.co/storage/v1/object/public/blog-images/2025-07/baking-great-bread-at-home-blog/optimizeduploadedbreadhero.avif" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="https://ojyckskucneljvuqzrsw.supabase.co/storage/v1/object/public/blog-images/2025-07/baking-great-bread-at-home-blog/optimizeduploadedbreadhero.avif" />
      </Helmet>
      
      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-4xl font-bold text-foreground mb-6">Baking Guides</h1>
            <p className="text-xl text-muted-foreground mb-12">
              Step-by-step guides to master the art of bread baking. From beginner basics to advanced techniques.
            </p>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {guides.map((guide, index) => (
                <Card key={index} className="h-full">
                  <CardHeader>
                    <div className="flex justify-between items-start mb-2">
                      <CardTitle className="text-xl">{guide.title}</CardTitle>
                      <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                        {guide.difficulty}
                      </span>
                    </div>
                    <CardDescription>{guide.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <Button asChild className="w-full">
                      {guide.link.startsWith('http') ? (
                        <a href={guide.link} target="_self" rel="noopener noreferrer">View Guide</a>
                      ) : (
                        <Link to={guide.link}>View Guide</Link>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default Guides;