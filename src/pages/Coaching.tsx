import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

const Coaching = () => {
  const coachingOptions = [
    {
      title: "Beginner's Breakthrough",
      price: "$75",
      duration: "60 minutes",
      description: "Perfect for new bakers ready to start their bread journey",
      features: [
        "Sourdough starter basics",
        "Essential equipment guide", 
        "First recipe walkthrough",
        "Troubleshooting common issues"
      ]
    },
    {
      title: "Technique Mastery",
      price: "$125", 
      duration: "90 minutes",
      description: "Advance your skills with specialized techniques",
      features: [
        "Advanced shaping methods",
        "Fermentation optimization",
        "Custom recipe development",
        "Professional tips & tricks"
      ]
    },
    {
      title: "Business Mentoring",
      price: "$200",
      duration: "2 hours", 
      description: "Turn your passion into a profitable venture",
      features: [
        "Business planning & strategy",
        "Product development",
        "Marketing & branding",
        "Scaling operations"
      ]
    }
  ];

  return (
    <>
      <Helmet>
        <title>Personal Bread Baking Coaching with Henry Hunter | Baking Great Bread</title>
        <meta name="description" content="Get personalized bread baking coaching from expert Henry Hunter. One-on-one sessions for beginners to advanced bakers." />
        <link rel="canonical" href="https://bread-baking-hub.vercel.app/coaching" />
        <meta property="og:title" content="Personal Bread Baking Coaching with Henry Hunter | Baking Great Bread" />
        <meta property="og:description" content="Get personalized bread baking coaching from expert Henry Hunter. One-on-one sessions for beginners to advanced bakers." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://bread-baking-hub.vercel.app/coaching" />
        <meta property="og:image" content="https://ojyckskucneljvuqzrsw.supabase.co/storage/v1/object/public/blog-images/2025-07/baking-great-bread-at-home-blog/optimizeduploadedbreadhero.avif" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="https://ojyckskucneljvuqzrsw.supabase.co/storage/v1/object/public/blog-images/2025-07/baking-great-bread-at-home-blog/optimizeduploadedbreadhero.avif" />
      </Helmet>
      
      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-foreground mb-6">Personal Coaching</h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Accelerate your bread baking journey with personalized one-on-one coaching. 
                Get expert guidance tailored to your skill level and goals.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-12">
              {coachingOptions.map((option, index) => (
                <Card key={index} className="relative">
                  <CardHeader>
                    <CardTitle className="text-xl">{option.title}</CardTitle>
                    <CardDescription>{option.description}</CardDescription>
                    <div className="text-3xl font-bold text-primary mt-4">
                      {option.price}
                      <span className="text-sm text-muted-foreground font-normal">
                        /{option.duration}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3 mb-6">
                      {option.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-primary" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button 
                      className="w-full" 
                      onClick={() => window.location.href = 'mailto:henrysbreadkitchen@gmail.com?subject=Coaching Inquiry - ' + option.title}
                    >
                      Book Session
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="bg-muted/50 rounded-lg p-8 text-center">
              <h2 className="text-2xl font-semibold mb-4">Ready to Start?</h2>
              <p className="text-muted-foreground mb-6">
                Have questions or need a custom coaching plan? Let's discuss your baking goals.
              </p>
              <Button 
                size="lg"
                onClick={() => window.location.href = 'mailto:henrysbreadkitchen@gmail.com?subject=Coaching Consultation Request'}
              >
                Schedule Free Consultation
              </Button>
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default Coaching;