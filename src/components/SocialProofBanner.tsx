import { Users, Star, BookOpen, Globe } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export const SocialProofBanner = () => {
  const stats = [
    {
      icon: Users,
      value: '38,000+',
      label: 'Active Bakers',
      color: 'text-blue-600'
    },
    {
      icon: Star,
      value: '4.9★',
      label: 'Average Rating',
      color: 'text-yellow-600'
    },
    {
      icon: BookOpen,
      value: '500+',
      label: 'Proven Recipes',
      color: 'text-green-600'
    },
    {
      icon: Globe,
      value: '50+',
      label: 'Countries',
      color: 'text-purple-600'
    }
  ];

  return (
    <div className="bg-primary/5 border-y border-primary/20 py-6">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Left side - Trust message */}
          <div className="text-center md:text-left">
            <Badge variant="outline" className="mb-2">
              Trusted Worldwide
            </Badge>
            <p className="text-lg font-semibold text-foreground">
              Join the world's most supportive bread-baking community
            </p>
            <p className="text-sm text-muted-foreground">
              Real bakers, real results, real support
            </p>
          </div>

          {/* Right side - Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center">
                  <div className="flex items-center justify-center mb-1">
                    <Icon className={`h-5 w-5 ${stat.color} mr-1`} />
                    <span className="text-lg font-bold text-foreground">
                      {stat.value}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {stat.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};