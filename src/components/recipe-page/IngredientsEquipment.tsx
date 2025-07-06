import { Card } from '@/components/ui/card';

interface Ingredient {
  ingredient: string;
  metric: string;
  volume: string;
}

interface IngredientsEquipmentProps {
  ingredients: Ingredient[];
  equipment: string[];
}

export const IngredientsEquipment = ({ ingredients, equipment }: IngredientsEquipmentProps) => {
  return (
    <div className="grid md:grid-cols-2 gap-8 mb-8">
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4 text-primary">Ingredients</h2>
        <p className="text-sm text-muted-foreground mb-4">(Yields one loaf)</p>
        <div className="space-y-3">
          {ingredients.map((item, index) => (
            <div key={index} className="flex justify-between items-center py-2 border-b border-border">
              <span className="font-medium">{item.ingredient}</span>
              <div className="text-right">
                <div className="font-semibold">{item.metric}</div>
                <div className="text-sm text-muted-foreground">{item.volume}</div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4 text-primary">Equipment</h2>
        <ul className="space-y-2">
          {equipment.map((item, index) => (
            <li key={index} className="flex items-start">
              <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
              {item}
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
};