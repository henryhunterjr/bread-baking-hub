import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const NovemberChallenge = () => {
  return (
    <>
      <Helmet>
        <title>November 2025 Baking Challenge - Sourdough Mastery | Baking Great Bread</title>
        <meta name="description" content="Join our November 2025 baking challenge and master sourdough techniques with our community. Step-by-step guidance and support." />
        <link rel="canonical" href="https://bakinggreatbread.com/novemberchallenge" />
        <meta property="og:title" content="November 2025 Baking Challenge - Sourdough Mastery | Baking Great Bread" />
        <meta property="og:description" content="Join our November 2025 baking challenge and master sourdough techniques with our community." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://bakinggreatbread.com/novemberchallenge" />
        <meta property="og:image" content="https://ojyckskucneljvuqzrsw.supabase.co/storage/v1/object/public/blog-images/2025-07/baking-great-bread-at-home-blog/optimizeduploadedbreadhero.avif" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="https://ojyckskucneljvuqzrsw.supabase.co/storage/v1/object/public/blog-images/2025-07/baking-great-bread-at-home-blog/optimizeduploadedbreadhero.avif" />
      </Helmet>
      
      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <Button variant="ghost" asChild>
                <a href="/challenges">← Back to All Challenges</a>
              </Button>
            </div>

            <h1 className="text-4xl font-bold text-foreground mb-4">November 2025 Baking Challenge</h1>
            <p className="text-xl text-muted-foreground mb-8">
              Join our community this month as we master sourdough techniques together. 
              Follow along with our comprehensive guide and share your progress!
            </p>
            
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Challenge Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-muted-foreground">
                    This month's challenge focuses on perfecting your sourdough skills. 
                    We'll guide you through each step with our detailed presentation.
                  </p>
                  
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">What You'll Learn:</h3>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                      <li>Essential sourdough starter maintenance</li>
                      <li>Proper dough mixing and fermentation</li>
                      <li>Shaping and scoring techniques</li>
                      <li>Baking for the perfect crust</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">Challenge Guide</h2>
              <div className="relative w-full" style={{ paddingBottom: '56.25%', height: 0 }}>
                <iframe 
                  src="https://gamma.app/embed/eydgchjzhlv5n19" 
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                  allow="fullscreen"
                  title="November 2025 Baking Challenge Guide"
                />
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Join the Community</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Share your baking journey, get feedback, and connect with fellow bakers 
                  in our supportive community.
                </p>
                <Button asChild className="w-full sm:w-auto">
                  <a href="https://bit.ly/3srdSYS" target="_blank" rel="noopener noreferrer">
                    Join Our Community
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default NovemberChallenge;
