import { Card } from '@/components/ui/card';
import { Clock, Users, ChefHat, Thermometer } from 'lucide-react';

interface RecipeStatsProps {
  totalTime: string;
  serves: string;
  difficulty: string;
  hydration: string;
}

export const RecipeStats = ({ totalTime, serves, difficulty, hydration }: RecipeStatsProps) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
      <Card className="p-4 text-center">
        <Clock className="h-6 w-6 mx-auto mb-2 text-primary" />
        <div className="text-sm font-medium">Total Time</div>
        <div className="text-xs text-muted-foreground">{totalTime}</div>
      </Card>
      <Card className="p-4 text-center">
        <Users className="h-6 w-6 mx-auto mb-2 text-primary" />
        <div className="text-sm font-medium">Serves</div>
        <div className="text-xs text-muted-foreground">{serves}</div>
      </Card>
      <Card className="p-4 text-center">
        <ChefHat className="h-6 w-6 mx-auto mb-2 text-primary" />
        <div className="text-sm font-medium">Difficulty</div>
        <div className="text-xs text-muted-foreground">{difficulty}</div>
      </Card>
      <Card className="p-4 text-center">
        <Thermometer className="h-6 w-6 mx-auto mb-2 text-primary" />
        <div className="text-sm font-medium">Hydration</div>
        <div className="text-xs text-muted-foreground">{hydration}</div>
      </Card>
    </div>
  );
};