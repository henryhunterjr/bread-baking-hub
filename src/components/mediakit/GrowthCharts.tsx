import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ResponsiveContainer 
} from "recharts";

const GrowthCharts = () => {
  // Member Growth Data (last 12 months)
  const memberGrowthData = [
    { month: "Nov '24", members: 28000 },
    { month: "Dec '24", members: 28500 },
    { month: "Jan '25", members: 29000 },
    { month: "Feb '25", members: 29500 },
    { month: "Mar '25", members: 30000 },
    { month: "Apr '25", members: 30200 },
    { month: "May '25", members: 30400 },
    { month: "Jun '25", members: 30600 },
    { month: "Jul '25", members: 30800 },
    { month: "Aug '25", members: 30900 },
    { month: "Sep '25", members: 31000 },
    { month: "Oct '25", members: 31000 },
  ];

  // Blog Visitors Data (last 12 months)
  const blogVisitorsData = [
    { month: "Nov '24", visitors: 200 },
    { month: "Dec '24", visitors: 210 },
    { month: "Jan '25", visitors: 220 },
    { month: "Feb '25", visitors: 230 },
    { month: "Mar '25", visitors: 240 },
    { month: "Apr '25", visitors: 250 },
    { month: "May '25", visitors: 255 },
    { month: "Jun '25", visitors: 260 },
    { month: "Jul '25", visitors: 265 },
    { month: "Aug '25", visitors: 270 },
    { month: "Sep '25", visitors: 275 },
    { month: "Oct '25", visitors: 282 },
  ];

  // Engagement Rate Comparison
  const engagementData = [
    { name: "Our Community", rate: 2.8, fill: "hsl(var(--primary))" },
    { name: "Industry Average", rate: 0.23, fill: "hsl(var(--muted))" },
  ];

  // Device Split Data (from analytics)
  const deviceData = [
    { name: "Mobile", value: 153, color: "hsl(var(--primary))" },
    { name: "Desktop", value: 122, color: "hsl(142 71% 45%)" },
    { name: "Tablet", value: 7, color: "hsl(var(--muted))" },
  ];

  return (
    <section className="py-12 md:py-16">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Growth & Engagement Analytics
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Data-driven insights showing consistent growth and exceptional engagement rates.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Facebook Group Growth */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="text-xl font-bold mb-2">Facebook Group Growth</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Steady growth over the past 12 months — 10.7% increase
            </p>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={memberGrowthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="month" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="members" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={3}
                  dot={{ fill: "hsl(var(--primary))", r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Blog Monthly Visitors */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="text-xl font-bold mb-2">Blog Monthly Visitors</h3>
            <p className="text-sm text-muted-foreground mb-6">
              +40% year-over-year growth in unique visitors
            </p>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={blogVisitorsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="month" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="visitors" 
                  stroke="hsl(142 71% 45%)" 
                  strokeWidth={3}
                  dot={{ fill: "hsl(142 71% 45%)", r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Engagement Rate Comparison */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="text-xl font-bold mb-2">Engagement Rate</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Our community engagement is <strong>12x higher</strong> than industry average
            </p>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={engagementData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis 
                  type="category" 
                  dataKey="name" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  width={140}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                  formatter={(value: number) => `${value}%`}
                />
                <Bar dataKey="rate" radius={[0, 8, 8, 0]}>
                  {engagementData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <p className="text-xs text-muted-foreground mt-4 italic">
              * Industry benchmark: ~0.23% engagement rate for Facebook Pages (Source: Hootsuite 2025)
            </p>
          </div>

          {/* Device Split */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="text-xl font-bold mb-2">Audience Device Split</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Mobile-first audience with strong cross-device presence
            </p>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={deviceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {deviceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-6 mt-4">
              {deviceData.map((entry, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: entry.color }}
                  />
                  <span className="text-sm text-muted-foreground">
                    {entry.name}: {entry.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Interpretation Box */}
        <div className="mt-8 bg-primary/5 border border-primary/20 rounded-xl p-6">
          <p className="text-foreground leading-relaxed">
            <strong>What this means:</strong> Our community isn't just large — it's highly engaged and growing. 
            With engagement rates 12x higher than industry averages and consistent month-over-month growth, 
            partnering with us means reaching real people who actively participate, share, and trust our recommendations.
          </p>
        </div>
      </div>
    </section>
  );
};

export default GrowthCharts;
