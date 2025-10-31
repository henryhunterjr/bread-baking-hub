import { Mail, Phone, Send, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useMediaKit } from "./MediaKitContext";

const ContactCTA = () => {
  const { toast } = useToast();
  const { sectionVisibility } = useMediaKit();
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Message Sent!",
      description: "Thank you for your interest. We'll get back to you soon.",
    });
    setFormData({ name: "", company: "", email: "", message: "" });
  };

  if (!sectionVisibility.contact) return null;

  return (
    <section className="py-12 md:py-16 bg-muted/30">
      <div className="container max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Let's Collaborate
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Ready to partner with an authentic voice in the artisan baking community? 
            Let's discuss how we can work together.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Form */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="text-xl font-bold mb-6">Send a Message</h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Input
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              
              <div>
                <Input
                  placeholder="Company Name"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  required
                />
              </div>
              
              <div>
                <Input
                  type="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              
              <div>
                <Textarea
                  placeholder="Tell us about your project or partnership idea..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={4}
                  required
                />
              </div>
              
              <Button type="submit" className="w-full" size="lg">
                <Send className="w-4 h-4 mr-2" />
                Send Message
              </Button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <div className="bg-card border border-border rounded-xl p-6">
              <h3 className="text-xl font-bold mb-6">Contact Information</h3>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-primary mt-1" />
                  <div>
                    <div className="font-semibold mb-1">Email</div>
                    <a 
                      href="mailto:legacyaisystem@gmail.com" 
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      legacyaisystem@gmail.com
                    </a>
                    <br />
                    <a 
                      href="mailto:henrysbreadkitchen@gmail.com" 
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      henrysbreadkitchen@gmail.com
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-primary mt-1" />
                  <div>
                    <div className="font-semibold mb-1">Phone</div>
                    <a 
                      href="tel:312-721-2088" 
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      312-721-2088
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-xl p-6">
              <h3 className="text-xl font-bold mb-4">Quick Links</h3>
              
              <div className="space-y-3">
                <a
                  href="https://www.amazon.com/author/henryhunterjr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  Amazon Author Page
                </a>
                
                <a
                  href="https://www.facebook.com/groups/1082865755403754"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  Facebook Community
                </a>
                
                <a
                  href="/"
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  BakingGreatBread.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactCTA;
