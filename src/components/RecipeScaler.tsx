import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Calculator, Users, ChefHat } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Recipe } from '@/types';

interface RecipeScalerProps {
  recipe: Recipe;
  onScaledRecipe: (scaledRecipe: Recipe) => void;
}


export const RecipeScaler = ({ recipe, onScaledRecipe }: RecipeScalerProps) => {
  const [servings, setServings] = useState(4);
  const [scaleFactor, setScaleFactor] = useState(1);

  const extractNumbers = (text: string): { value: number; unit: string; rest: string } | null => {
    // Match common fraction patterns and decimals
    const patterns = [
      /^(\d+\/\d+)\s*([a-zA-Z]*)\s*(.*)/,  // fractions like 1/2
      /^(\d*\.?\d+)\s*([a-zA-Z]*)\s*(.*)/,  // decimals like 1.5
      /^(\d+)\s*([a-zA-Z]*)\s*(.*)/        // whole numbers
    ];

    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match) {
        let value: number;
        if (match[1].includes('/')) {
          const [num, den] = match[1].split('/');
          value = parseInt(num) / parseInt(den);
        } else {
          value = parseFloat(match[1]);
        }
        return {
          value,
          unit: match[2] || '',
          rest: match[3] || ''
        };
      }
    }
    return null;
  };

  const scaleIngredient = (ingredient: string, factor: number): string => {
    const extracted = extractNumbers(ingredient.trim());
    if (!extracted) return ingredient;

    const scaledValue = extracted.value * factor;
    let formattedValue: string;

    // Convert to fraction if it makes sense
    if (scaledValue < 1 && scaledValue > 0) {
      const denominator = 4; // quarters
      const numerator = Math.round(scaledValue * denominator);
      if (numerator === 0) {
        formattedValue = `${scaledValue.toFixed(2)}`;
      } else if (numerator === denominator) {
        formattedValue = "1";
      } else {
        formattedValue = `${numerator}/${denominator}`;
      }
    } else if (scaledValue % 1 === 0) {
      formattedValue = scaledValue.toString();
    } else {
      formattedValue = scaledValue.toFixed(2).replace(/\.?0+$/, '');
    }

    return `${formattedValue} ${extracted.unit} ${extracted.rest}`.trim();
  };

  const handleScale = () => {
    if (!recipe.data) return;

    const scaledData = { ...recipe.data };
    
    // Scale ingredients
    if (scaledData.ingredients) {
      scaledData.ingredients = scaledData.ingredients.map((ingredient: string) => 
        scaleIngredient(ingredient, scaleFactor)
      );
    }

    // Update servings in description or notes
    if (scaledData.servings) {
      scaledData.servings = Math.round(scaledData.servings * scaleFactor);
    }

    const scaledRecipe = {
      ...recipe,
      title: `${recipe.title} (Scaled ${scaleFactor}x)`,
      data: scaledData
    };

    onScaledRecipe(scaledRecipe);
    
    toast({
      title: "Recipe scaled successfully",
      description: `Recipe scaled by ${scaleFactor}x for ${Math.round(servings)} servings`
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="w-5 h-5" />
          Recipe Scaler
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="servings">Target Servings</Label>
            <Input
              id="servings"
              type="number"
              min="1"
              max="50"
              value={servings}
              onChange={(e) => setServings(parseInt(e.target.value) || 1)}
            />
          </div>
          <div>
            <Label htmlFor="scale-factor">Scale Factor</Label>
            <Input
              id="scale-factor"
              type="number"
              min="0.1"
              max="10"
              step="0.1"
              value={scaleFactor}
              onChange={(e) => setScaleFactor(parseFloat(e.target.value) || 1)}
            />
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setScaleFactor(0.5)}
          >
            Half
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setScaleFactor(1)}
          >
            Original
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setScaleFactor(2)}
          >
            Double
          </Button>
        </div>

        <Separator />

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="w-4 h-4" />
            Original: ~4 servings → Scaled: ~{Math.round(servings)} servings
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <ChefHat className="w-4 h-4" />
            Scaling factor: {scaleFactor}x
          </div>
        </div>

        <Button onClick={handleScale} className="w-full">
          Scale Recipe
        </Button>

        <div className="text-xs text-muted-foreground">
          <strong>Note:</strong> Scaling works best for ingredients with specific measurements. 
          Cooking times and techniques may need manual adjustment.
        </div>
      </CardContent>
    </Card>
  );
};