import { Card } from '@/components/ui/card';

interface NutritionFact {
  nutrient: string;
  value: string;
}

interface FinalThoughtsNutritionProps {
  finalThoughts: string[];
  nutritionFacts: NutritionFact[];
}

export const FinalThoughtsNutrition = ({ finalThoughts, nutritionFacts }: FinalThoughtsNutritionProps) => {
  return (
    <div className="grid md:grid-cols-2 gap-8 mb-8">
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4 text-primary">Final Thoughts</h2>
        {finalThoughts.map((paragraph, index) => (
          <p key={index} className="mb-4">
            {paragraph}
          </p>
        ))}
      </Card>

      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4 text-primary">Nutrition Facts</h2>
        <p className="text-sm text-muted-foreground mb-4">(per slice, ~50g)</p>
        <div className="grid grid-cols-2 gap-3">
          {nutritionFacts.map((item, index) => (
            <div key={index} className="text-center p-3 bg-muted rounded-lg">
              <div className="font-semibold text-lg">{item.value}</div>
              <div className="text-sm text-muted-foreground">{item.nutrient}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};