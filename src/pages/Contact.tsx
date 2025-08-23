import { Helmet } from "react-helmet-async";
import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, MessageSquare, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Suspense, lazy } from 'react';

const LazyAIAssistantSidebar = lazy(() => import('@/components/AIAssistantSidebar').then(m => ({ default: m.AIAssistantSidebar })));

const Contact = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const mailtoLink = `mailto:henrysbreadkitchen@gmail.com?subject=${encodeURIComponent(formData.subject)}&body=${encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
    )}`;
    
    window.location.href = mailtoLink;
    
    toast({
      title: "Opening your email client",
      description: "Your message will be pre-filled and ready to send!"
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const contactOptions = [
    {
      icon: Mail,
      title: "Email Henry",
      description: "Get a personal response within 24 hours",
      action: "henrysbreadkitchen@gmail.com",
      actionText: "Send Email"
    },
    {
      icon: MessageSquare,
      title: "General Questions", 
      description: "Have questions about recipes or techniques?",
      action: "mailto:henrysbreadkitchen@gmail.com?subject=General Question",
      actionText: "Ask Question"
    },
    {
      icon: Calendar,
      title: "Coaching Inquiry",
      description: "Interested in personalized coaching sessions?",
      action: "mailto:henrysbreadkitchen@gmail.com?subject=Coaching Inquiry",
      actionText: "Book Consultation"
    }
  ];

  return (
    <>
      <Helmet>
        <title>Contact Henry Hunter - Bread Baking Expert | Baking Great Bread</title>
        <meta name="description" content="Get in touch with Henry Hunter for bread baking questions, coaching, or collaborations. Personal responses within 24 hours." />
        <link rel="canonical" href="https://bread-baking-hub.vercel.app/contact" />
        <meta property="og:title" content="Contact Henry Hunter - Bread Baking Expert | Baking Great Bread" />
        <meta property="og:description" content="Get in touch with Henry Hunter for bread baking questions, coaching, or collaborations. Personal responses within 24 hours." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://the-bakers-bench.lovable.app/contact" />
        <meta property="og:image" content="https://the-bakers-bench.lovable.app/lovable-uploads/c851e2b3-f2f7-4b52-9e98-d4e6f7c44ff8.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Contact Henry Hunter - Bread Baking Expert" />
        <meta property="og:site_name" content="Baking Great Bread at Home" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Contact Henry Hunter - Bread Baking Expert | Baking Great Bread" />
        <meta name="twitter:description" content="Get in touch with Henry Hunter for bread baking questions, coaching, or collaborations. Personal responses within 24 hours." />
        <meta name="twitter:image" content="https://the-bakers-bench.lovable.app/lovable-uploads/c851e2b3-f2f7-4b52-9e98-d4e6f7c44ff8.png" />
        <meta name="twitter:image:alt" content="Contact Henry Hunter - Bread Baking Expert" />
      </Helmet>
      
      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-foreground mb-6">Contact Henry</h1>
              <p className="text-xl text-muted-foreground">
                Have a question about bread baking? Want to share your success story? 
                I'd love to hear from you!
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-12">
              {contactOptions.map((option, index) => {
                const Icon = option.icon;
                return (
                  <Card key={index} className="text-center">
                    <CardHeader>
                      <Icon className="h-8 w-8 text-primary mx-auto mb-2" />
                      <CardTitle className="text-lg">{option.title}</CardTitle>
                      <CardDescription>{option.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button 
                        className="w-full"
                        onClick={() => window.location.href = option.action}
                      >
                        {option.actionText}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <Card className="max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle>Send a Message</CardTitle>
                <CardDescription>
                  Fill out the form below and I'll get back to you as soon as possible.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="What's this about?"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Tell me about your baking journey, questions, or how I can help..."
                      rows={5}
                      required
                    />
                  </div>
                  
                  <Button type="submit" className="w-full">
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
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
    </>
  );
};

export default Contact;