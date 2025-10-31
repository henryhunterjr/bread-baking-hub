import { MapPin, Users, TrendingUp, ShoppingCart } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const AudienceProfile = () => {
  // Geographic data from analytics
  const geoData = [
    { name: "United States", value: 237, percentage: 84 },
    { name: "Canada", value: 15, percentage: 5 },
    { name: "United Kingdom", value: 5, percentage: 2 },
    { name: "Other", value: 25, percentage: 9 },
  ];

  const ageData = [
    { name: "25-34", value: 28, color: "hsl(var(--primary))" },
    { name: "35-44", value: 35, color: "hsl(142 71% 45%)" },
    { name: "45-54", value: 22, color: "hsl(var(--chart-3))" },
    { name: "55+", value: 15, color: "hsl(var(--muted))" },
  ];

  const interests = [
    { name: "Artisan Baking", icon: "🍞" },
    { name: "Sourdough", icon: "🥖" },
    { name: "Cooking Education", icon: "📚" },
    { name: "Quality Ingredients", icon: "🌾" },
    { name: "Home Cooking", icon: "🏠" },
    { name: "Food Photography", icon: "📸" },
  ];

  return (
    <section className="py-12 md:py-16 bg-muted/30">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Audience Profile
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Engaged, passionate home bakers who invest in quality tools and value authenticity.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Geographic Distribution */}
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center gap-2 mb-6">
              <MapPin className="w-5 h-5 text-primary" />
              <h3 className="text-xl font-bold">Geographic Distribution</h3>
            </div>
            
            <div className="space-y-4">
              {geoData.map((location, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{location.name}</span>
                    <span className="text-muted-foreground">{location.percentage}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary rounded-full transition-all duration-500"
                      style={{ width: `${location.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Age Distribution */}
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center gap-2 mb-6">
              <Users className="w-5 h-5 text-primary" />
              <h3 className="text-xl font-bold">Age Distribution</h3>
            </div>
            
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={ageData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {ageData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                  formatter={(value: number) => `${value}%`}
                />
              </PieChart>
            </ResponsiveContainer>
            
            <div className="flex flex-wrap justify-center gap-4 mt-4">
              {ageData.map((entry, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: entry.color }}
                  />
                  <span className="text-sm text-muted-foreground">
                    {entry.name}: {entry.value}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Interests */}
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="w-5 h-5 text-primary" />
              <h3 className="text-xl font-bold">Top Interests</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {interests.map((interest, index) => (
                <div 
                  key={index} 
                  className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                >
                  <span className="text-2xl">{interest.icon}</span>
                  <span className="text-sm font-medium">{interest.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Purchase Profile */}
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center gap-2 mb-6">
              <ShoppingCart className="w-5 h-5 text-primary" />
              <h3 className="text-xl font-bold">Purchase Profile</h3>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                <div className="text-2xl font-bold text-primary mb-1">$200-500+</div>
                <div className="text-sm text-muted-foreground">Average equipment spend</div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary mt-1.5" />
                  <p className="text-sm text-muted-foreground">
                    Values authenticity and personal recommendations
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary mt-1.5" />
                  <p className="text-sm text-muted-foreground">
                    Invests in quality over quantity
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary mt-1.5" />
                  <p className="text-sm text-muted-foreground">
                    Seeks educational content and expert guidance
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary mt-1.5" />
                  <p className="text-sm text-muted-foreground">
                    Actively participates in community discussions
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AudienceProfile;
