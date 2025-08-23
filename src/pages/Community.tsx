import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Users, Heart, BookOpen, MessageCircle } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ResponsiveImage } from '@/components/ResponsiveImage';
import { Suspense, lazy, useState } from 'react';

const LazyAIAssistantSidebar = lazy(() => import('@/components/AIAssistantSidebar').then(m => ({ default: m.AIAssistantSidebar })));

const Community = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  return (
    <div className="bg-background text-foreground">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="relative py-20 bg-gradient-to-br from-primary/5 to-secondary/5">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-4xl">🥖</span>
                  <h1 className="text-4xl md:text-5xl font-bold text-foreground">
                    Welcome to<br />
                    <span className="text-primary">Baking Great Bread at Home</span>
                  </h1>
                </div>
                
                <div className="space-y-4 text-lg text-muted-foreground leading-relaxed">
                  <p>
                    If you're here, you probably care about real bread. The kind you make with your own two hands. 
                    The kind that takes time, patience, and a little bit of mess. Good. You're in the right place.
                  </p>
                  
                  <p>
                    This group was built for bakers of all levels. Some are just starting out. Others have been baking 
                    for decades. But we're all here for the same reason: to share what we know and help each other get better.
                  </p>
                </div>

                <Button asChild size="lg" className="mt-6">
                  <a 
                    href="https://bit.ly/3srdSYS" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2"
                  >
                    <Users className="h-5 w-5" />
                    Join Our Community
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              </div>

              <div className="relative">
                <ResponsiveImage 
                  src="/lovable-uploads/d3aae90f-fcef-49fb-9ca0-5593bdfac3d1.png"
                  alt="Baking Great Bread at Home - Kitchen scene with wooden bowl, whisk, and fresh bread"
                  className="rounded-lg shadow-warm w-full"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </section>

        {/* What We Do Section */}
        <section className="py-16 bg-section-background">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-foreground mb-12">What We Do</h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {[
                {
                  icon: BookOpen,
                  title: "Share techniques that actually work",
                  description: "Real methods tested in real kitchens"
                },
                {
                  icon: MessageCircle,
                  title: "Post wins and fails so others can learn",
                  description: "Every mistake is a teaching moment"
                },
                {
                  icon: Heart,
                  title: "Ask questions and answer honestly",
                  description: "No judgment, just helpful guidance"
                },
                {
                  icon: Users,
                  title: "Teach what we've learned",
                  description: "And stay open to learning more"
                },
                {
                  icon: Heart,
                  title: "Respect the craft and each other",
                  description: "Community built on mutual support"
                },
                {
                  icon: BookOpen,
                  title: "Bake with purpose and connection",
                  description: "Creating something meaningful together"
                }
              ].map((item, index) => (
                <Card key={index} className="shadow-warm hover:shadow-stone transition-all duration-300">
                  <CardContent className="p-6 text-center">
                    <item.icon className="h-8 w-8 text-primary mx-auto mb-4" />
                    <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center">
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                You'll find everything here from sourdough tips to bagel shaping advice, hydration math to crumb shots, 
                and a lot of generous, thoughtful people along the way.
              </p>
            </div>
          </div>
        </section>

        {/* Community Showcase */}
        <section className="py-16">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="relative">
                <ResponsiveImage 
                  src="/lovable-uploads/19566fef-b4d5-4c88-97e9-c27eb0b2ad01.png"
                  alt="Made by Members. Learned Together. - Community showcase of various breads and baking achievements"
                  className="rounded-lg shadow-warm w-full"
                  loading="lazy"
                />
                <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground">
                  Our Community
                </Badge>
              </div>

              <div className="space-y-6">
                <h2 className="text-3xl font-bold text-foreground">What Makes This Different</h2>
                
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    This isn't a group where people flex their perfect loaves. We show the real stuff. 
                    Starter that went flat. Bread that didn't rise. Confused questions. Long answers. 
                    Joy. Frustration. And growth.
                  </p>
                  
                  <p>
                    This is a teaching space. A learning space. A place to slow down and do something real.
                  </p>
                  
                  <p>
                    I started this group because I wanted to create the kind of space I wish I had when 
                    I was figuring it all out. You don't have to be perfect to be here. You just have to care.
                  </p>
                </div>

                <div className="pt-4">
                  <Button asChild variant="outline" size="lg">
                    <a 
                      href="https://bit.ly/3srdSYS" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Join Facebook Group
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Welcome Message */}
        <section className="py-16 bg-section-background">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-primary mb-8">Welcome to the bench.</h2>
            
            <div className="bg-card rounded-lg p-8 shadow-warm">
              <div className="flex flex-col items-center space-y-4">
                <div className="w-16 h-0.5 bg-primary"></div>
                <p className="text-xl font-medium text-foreground">— Henry Hunter</p>
                <p className="text-muted-foreground">Baker | Teacher | Founder</p>
                <Link to="/" className="text-primary hover:text-primary/80 transition-colors">
                  Bread Baking Hub
                </Link>
              </div>
            </div>

            <div className="mt-12">
              <Button asChild size="lg">
                <a 
                  href="https://bit.ly/3srdSYS" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2"
                >
                  <Users className="h-5 w-5" />
                  Join Our Community Today
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>
        </section>
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

export default Community;