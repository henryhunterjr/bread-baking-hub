import { Users, Eye, Mail } from "lucide-react";
import { useMediaKit } from "./MediaKitContext";

const MediaKitHero = () => {
  const { data, sectionVisibility } = useMediaKit();
  const { hero } = data;

  const stats = [
    {
      label: "Total Community Reach",
      value: hero.totalReach.toLocaleString(),
      icon: Users,
      description: "Facebook Group + Page Members",
    },
    {
      label: "Monthly Impressions",
      value: hero.monthlyImpressions.toLocaleString(),
      icon: Eye,
      description: "Website Page Views",
    },
    {
      label: "Newsletter Subscribers",
      value: hero.newsletterSubscribers.toLocaleString(),
      icon: Mail,
      description: "Active Email List",
    },
  ];

  if (!sectionVisibility.hero) return null;

  return (
    <section className="relative py-16 md:py-24 overflow-hidden">
      {/* Subtle bread imagery background */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-background via-background to-muted/10"
        style={{
          backgroundImage: "url('data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.02'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')",
        }}
      />
      
      <div className="container relative z-10 max-w-6xl mx-auto px-4">
        {/* Profile and Headline */}
        <div className="text-center mb-12 md:mb-16">
          <div className="flex justify-center mb-6">
            <img
              src="/lovable-uploads/aff4f11b-5fc6-420e-8ac0-1c53dcc3dd20.png"
              alt="Henry Hunter"
              className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-border shadow-lg"
            />
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Henry Hunter
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground font-medium mb-6">
            Artisan Baker & Community Leader
          </p>
          
          <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            {hero.aboutText}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="group relative bg-card border border-border rounded-2xl p-6 md:p-8 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <stat.icon className="w-7 h-7 text-primary" />
                </div>
                
                <div className="space-y-2">
                  <div className="text-4xl md:text-5xl font-bold text-foreground">
                    {stat.value}
                  </div>
                  <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                    {stat.label}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {stat.description}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MediaKitHero;
