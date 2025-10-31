import { Facebook, Globe, Mail, FileText } from "lucide-react";
import { LineChart, Line, ResponsiveContainer } from "recharts";

interface PlatformCardProps {
  name: string;
  icon: React.ReactNode;
  stat: string;
  description: string;
  trendData: number[];
  change: string;
}

const PlatformCard = ({ name, icon, stat, description, trendData, change }: PlatformCardProps) => {
  const chartData = trendData.map((value, index) => ({ value }));
  const isPositive = change.startsWith("+");
  
  return (
    <div className="group bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
          {icon}
        </div>
        <span className={`text-sm font-semibold px-2 py-1 rounded ${
          isPositive ? "bg-green-500/10 text-green-600" : "bg-muted text-muted-foreground"
        }`}>
          {change}
        </span>
      </div>
      
      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">
        {name}
      </h3>
      
      <div className="text-3xl font-bold text-foreground mb-1">
        {stat}
      </div>
      
      <p className="text-sm text-muted-foreground mb-4">
        {description}
      </p>
      
      {/* Mini Sparkline */}
      <div className="h-12 -mx-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke="hsl(var(--primary))" 
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const PlatformCards = () => {
  const platforms = [
    {
      name: "Facebook Group",
      icon: <Facebook className="w-6 h-6 text-primary" />,
      stat: "31,000",
      description: "Active Group Members",
      trendData: [28000, 28500, 29000, 29500, 30000, 30500, 31000],
      change: "+8%",
    },
    {
      name: "Facebook Page",
      icon: <Facebook className="w-6 h-6 text-primary" />,
      stat: "17,315",
      description: "Page Followers",
      trendData: [16500, 16700, 16900, 17000, 17100, 17200, 17315],
      change: "+5%",
    },
    {
      name: "Website",
      icon: <Globe className="w-6 h-6 text-primary" />,
      stat: "282",
      description: "Monthly Unique Visitors",
      trendData: [200, 220, 240, 250, 260, 270, 282],
      change: "+40%",
    },
    {
      name: "Newsletter",
      icon: <Mail className="w-6 h-6 text-primary" />,
      stat: "2,400",
      description: "Email Subscribers",
      trendData: [2100, 2150, 2200, 2250, 2300, 2350, 2400],
      change: "+14%",
    },
    {
      name: "Blog",
      icon: <FileText className="w-6 h-6 text-primary" />,
      stat: "729",
      description: "Monthly Pageviews",
      trendData: [520, 550, 600, 630, 670, 700, 729],
      change: "+40%",
    },
  ];

  return (
    <section className="py-12 md:py-16 bg-muted/30">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Platform Performance
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Growing, engaged audiences across multiple platforms — not just numbers, but real people who take action.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {platforms.map((platform, index) => (
            <PlatformCard key={index} {...platform} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PlatformCards;
