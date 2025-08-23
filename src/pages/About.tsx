import Header from "../components/Header";
import Footer from "../components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Helmet } from 'react-helmet-async';
import { ResponsiveImage } from '@/components/ResponsiveImage';
import { Suspense, lazy, useState } from 'react';

const LazyAIAssistantSidebar = lazy(() => import('@/components/AIAssistantSidebar').then(m => ({ default: m.AIAssistantSidebar })));

const About = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  // Remove auto-scroll to top to prevent unwanted scrolling behavior
  // useEffect(() => {
  //   window.scrollTo(0, 0);
  // }, []);

  return (
    <div className="bg-background text-foreground">
      <Helmet>
        <title>About Henry Hunter | Baking Great Bread at Home</title>
        <meta name="description" content="Meet Henry Hunter, master baker and founder of Baking Great Bread at Home. Learn his story, mission, and approach to teaching bread baking." />
        <link rel="canonical" href="https://bread-baking-hub.vercel.app/about" />
        <meta property="og:title" content="About Henry Hunter | Baking Great Bread at Home" />
        <meta property="og:description" content="Meet Henry Hunter, master baker and founder of Baking Great Bread at Home. Learn his story, mission, and approach to teaching bread baking." />
        <meta property="og:url" content="https://the-bakers-bench.lovable.app/about" />
        <meta property="og:type" content="profile" />
        <meta property="og:image" content="https://the-bakers-bench.lovable.app/lovable-uploads/e9d4e95a-2202-46e4-9b07-ae4646daff63.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Henry Hunter - Master Baker and Author" />
        <meta property="og:site_name" content="Baking Great Bread at Home" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="About Henry Hunter | Baking Great Bread at Home" />
        <meta name="twitter:description" content="Meet Henry Hunter, master baker and founder of Baking Great Bread at Home. Learn his story, mission, and approach to teaching bread baking." />
        <meta name="twitter:image" content="https://the-bakers-bench.lovable.app/lovable-uploads/e9d4e95a-2202-46e4-9b07-ae4646daff63.png" />
        <meta name="twitter:image:alt" content="Henry Hunter - Master Baker and Author" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Person",
          "name": "Henry Hunter",
          "url": "https://bread-baking-hub.vercel.app/about",
          "image": "https://bread-baking-hub.vercel.app/lovable-uploads/e9d4e95a-2202-46e4-9b07-ae4646daff63.png",
          "jobTitle": "Master Baker & Author",
          "sameAs": [
            "https://www.youtube.com/@bakinggreatbread",
            "https://www.instagram.com/bakinggreatbread"
          ]
        })}</script>
      </Helmet>
      <Header />
      <main className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-start mb-12">
            <div>
              <ResponsiveImage 
                src="/lovable-uploads/c5a7c8ed-91ce-467c-871d-f50a78adbb3e.png" 
                alt="Henry M. Hunter in his kitchen wearing chef's apron" 
                className="rounded-2xl shadow-stone w-full h-auto"
                loading="lazy"
              />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-primary mb-6">About Henry</h1>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                I didn't set out to become a bread baker. I was in the Army when it started. A landlord named Herr Sherman, a rotund Jewish baker, pulled me into his kitchen and put me to work. I carried flour sacks, scrubbed floors, wiped counters. I didn't think of it as baking. I thought of it as rent.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                But somewhere between those long hours and flour-dusted nights, I was absorbing something deeper. The patience. The rhythm. The transformation. I didn't know it then, but I was being mentored in a craft that would later define me.
              </p>
            </div>
          </div>
          
          <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
            <p>
              After the military, I spent 26 years in advertising and marketing. Leading campaigns, building brands, working in boardrooms. But bread kept calling me back. During a particularly rough season in life, I returned to the simplicity of flour, water, salt, and time. What started as therapy became a passion. Then an obsession. Then a mission.
            </p>
            
            <p>
              That mission became Baking Great Bread at Home. A Facebook group I launched to help everyday people make artisan-quality bread in their own kitchens. No fluff. No gimmicks. Just honest teaching, tested methods, and real results. Today, that community has grown to over 38,000 members and counting.
            </p>
            
            <p>
              My goal has always been to demystify bread. To take the mystery out of sourdough starters, proofing schedules, hydration ratios, and give people confidence in the kitchen. I teach not just how, but why things work.
            </p>
            
            <p>
              I've written five books on bread and baking. I develop tools and apps to help home bakers succeed. I partner with companies whose products I actually use and believe in. But most importantly, I'm still here in the community every day, answering questions and learning alongside everyone else.
            </p>
            
            <p>
              This website is the next step. A place where home bakers can learn, grow, and share, whether they're baking their first loaf or perfecting their tenth hundred.
            </p>
            
            <p>
              This isn't just about bread. It's about connection. It's about reclaiming something real in a world of shortcuts. And I'm honored you're here to be part of it.
            </p>
            
            <div className="bg-stone-100 dark:bg-stone-800 p-6 rounded-lg mt-8">
              <p className="text-primary font-semibold text-xl mb-2">— Henry M. Hunter</p>
              <ResponsiveImage 
                src="/lovable-uploads/2d4c0625-d16c-44e8-8ec7-2287d1bc2a0c.png" 
                alt="Henry M. Hunter signature" 
                className="opacity-80 h-6 mb-2"
                loading="lazy"
              />
              <p className="text-muted-foreground">Founder, Baking Great Bread at Home</p>
            </div>
          </div>
          
          <div className="mt-12 text-center">
            <Button variant="warm" size="lg" asChild>
              <Link to="/">Back to Home</Link>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
      
      <Suspense fallback={null}>
        <LazyAIAssistantSidebar
          isOpen={isSidebarOpen}
          onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        />
      </Suspense>
    </div>
  );
};

export default About;