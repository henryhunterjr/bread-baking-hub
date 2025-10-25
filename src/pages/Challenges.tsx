import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MonthlyChallenge from "@/components/MonthlyChallenge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Challenges = () => {
  const pastChallenges = [
    {
      month: "July 2025",
      title: "Perfect Sourdough",
      description: "Master the basics of sourdough bread with our community support."
    },
    {
      month: "June 2025", 
      title: "Artisan Focaccia",
      description: "Explore different toppings and techniques for perfect focaccia."
    },
    {
      month: "May 2025",
      title: "Classic Baguettes",
      description: "Learn the traditional French technique for crispy baguettes."
    }
  ];

  return (
    <>
      <Helmet>
        <title>Monthly Baking Challenges - Join Our Community | Baking Great Bread</title>
        <meta name="description" content="Join our monthly baking challenges and improve your skills with our supportive community. New recipes and techniques every month." />
        <link rel="canonical" href="https://bakinggreatbread.com/challenges" />
        <meta property="og:title" content="Monthly Baking Challenges - Join Our Community | Baking Great Bread" />
        <meta property="og:description" content="Join our monthly baking challenges and improve your skills with our supportive community. New recipes and techniques every month." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://bakinggreatbread.com/challenges" />
        <meta property="og:image" content="https://ojyckskucneljvuqzrsw.supabase.co/storage/v1/object/public/blog-images/2025-07/baking-great-bread-at-home-blog/optimizeduploadedbreadhero.avif" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="https://ojyckskucneljvuqzrsw.supabase.co/storage/v1/object/public/blog-images/2025-07/baking-great-bread-at-home-blog/optimizeduploadedbreadhero.avif" />
      </Helmet>
      
      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold text-foreground mb-6">Monthly Baking Challenges</h1>
            <p className="text-xl text-muted-foreground mb-12">
              Join our community in monthly baking adventures. Learn new techniques, 
              share your results, and connect with fellow bakers.
            </p>
            
            <MonthlyChallenge />
            
            <section className="mt-16">
              <h2 className="text-2xl font-semibold text-foreground mb-8">Past Challenges</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {pastChallenges.map((challenge, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle className="text-lg">{challenge.title}</CardTitle>
                      <CardDescription className="text-sm text-muted-foreground">
                        {challenge.month}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm">{challenge.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default Challenges;