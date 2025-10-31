import { FileText, Users, Award, BookOpen, Utensils } from "lucide-react";
import { useMediaKit } from "./MediaKitContext";

const CollaborationBenefits = () => {
  const { sectionVisibility } = useMediaKit();
  const benefits = [
    {
      icon: <FileText className="w-8 h-8 text-primary" />,
      title: "Featured Blog Posts",
      description: "Dedicated articles featuring your products with detailed reviews, recipes, and tutorials.",
    },
    {
      icon: <Users className="w-8 h-8 text-primary" />,
      title: "Community Engagement",
      description: "Direct access to 48,000+ engaged bakers through Facebook Group posts and discussions.",
    },
    {
      icon: <Award className="w-8 h-8 text-primary" />,
      title: "Product Reviews",
      description: "Honest, detailed reviews highlighting real-world usage and benefits for home bakers.",
    },
    {
      icon: <Utensils className="w-8 h-8 text-primary" />,
      title: "Recipe Integration",
      description: "Your products featured in tested recipes posted 2-3x weekly to our community.",
    },
    {
      icon: <BookOpen className="w-8 h-8 text-primary" />,
      title: "Newsletter Features",
      description: "Spotlights in our email newsletter reaching 2,400+ active subscribers.",
    },
    {
      icon: <Users className="w-8 h-8 text-primary" />,
      title: "Member Spotlight",
      description: "Showcase how community members use your products with user-generated content.",
    },
  ];

  if (!sectionVisibility.benefits) return null;

  return (
    <section className="py-12 md:py-16">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Collaboration Benefits
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Partner with us to reach an engaged community of passionate bakers who trust our recommendations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="group bg-card border border-border rounded-xl p-6 hover:shadow-xl hover:border-primary/50 transition-all duration-300"
            >
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                {benefit.icon}
              </div>
              
              <h3 className="text-xl font-bold mb-3">
                {benefit.title}
              </h3>
              
              <p className="text-muted-foreground">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-xl p-8">
          <h3 className="text-2xl font-bold mb-4 text-center">
            Why Partner With Us?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-primary mb-2">48,000+</div>
              <div className="text-sm text-muted-foreground">Engaged Community Members</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">2.8%</div>
              <div className="text-sm text-muted-foreground">Engagement Rate (12x Industry Avg)</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">100%</div>
              <div className="text-sm text-muted-foreground">Authentic Recommendations</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CollaborationBenefits;
