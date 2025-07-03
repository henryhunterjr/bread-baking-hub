import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface FormattedRecipe {
  title: string;
  introduction: string;
  ingredients: Array<{
    item: string;
    amount_metric: string;
    amount_volume: string;
    note?: string;
  }> | {
    metric: string[];
    volume: string[];
  };
  method: Array<{
    step: number;
    instruction: string;
  }> | string[];
  tips: string[];
  troubleshooting: Array<{
    issue: string;
    solution: string;
  }> | string[];
}

interface FormattedRecipeDisplayProps {
  recipe: FormattedRecipe;
  imageUrl?: string;
}

export const FormattedRecipeDisplay = ({ recipe, imageUrl }: FormattedRecipeDisplayProps) => {
  // Check if ingredients is in new format (array of objects) or old format (object with metric/volume arrays)
  const isNewIngredientFormat = Array.isArray(recipe.ingredients);
  const isNewMethodFormat = Array.isArray(recipe.method) && recipe.method.length > 0 && typeof recipe.method[0] === 'object';
  const isNewTroubleshootingFormat = Array.isArray(recipe.troubleshooting) && recipe.troubleshooting.length > 0 && typeof recipe.troubleshooting[0] === 'object';

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-primary text-center">Formatted Recipe</h2>
      
      {imageUrl && (
        <div className="w-full">
          <img 
            src={imageUrl} 
            alt={recipe.title}
            className="w-full h-64 object-cover rounded-lg shadow-warm"
          />
        </div>
      )}
      
      <Card className="shadow-warm">
        <CardHeader>
          <CardTitle className="text-2xl text-primary">{recipe.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground leading-relaxed">{recipe.introduction}</p>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="shadow-warm">
          <CardHeader>
            <CardTitle className="text-primary">Ingredients (Metric)</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {isNewIngredientFormat ? (
                (recipe.ingredients as Array<{item: string; amount_metric: string; amount_volume: string; note?: string}>).map((ingredient, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <span className="text-primary font-semibold">•</span>
                    <span>{ingredient.amount_metric} {ingredient.item}</span>
                  </li>
                ))
              ) : (
                (recipe.ingredients as {metric: string[]; volume: string[]}).metric.map((ingredient, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <span className="text-primary font-semibold">•</span>
                    <span>{ingredient}</span>
                  </li>
                ))
              )}
            </ul>
          </CardContent>
        </Card>

        <Card className="shadow-warm">
          <CardHeader>
            <CardTitle className="text-primary">Ingredients (Volume)</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {isNewIngredientFormat ? (
                (recipe.ingredients as Array<{item: string; amount_metric: string; amount_volume: string; note?: string}>).map((ingredient, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <span className="text-primary font-semibold">•</span>
                    <span>{ingredient.amount_volume} {ingredient.item}</span>
                  </li>
                ))
              ) : (
                (recipe.ingredients as {metric: string[]; volume: string[]}).volume.map((ingredient, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <span className="text-primary font-semibold">•</span>
                    <span>{ingredient}</span>
                  </li>
                ))
              )}
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-warm">
        <CardHeader>
          <CardTitle className="text-primary">Method</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="space-y-3">
            {isNewMethodFormat ? (
              (recipe.method as Array<{step: number; instruction: string}>).map((methodStep, index) => (
                <li key={index} className="flex items-start space-x-3">
                  <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold flex-shrink-0 mt-0.5">
                    {methodStep.step}
                  </span>
                  <span className="leading-relaxed">{methodStep.instruction}</span>
                </li>
              ))
            ) : (
              (recipe.method as string[]).map((step, index) => (
                <li key={index} className="flex items-start space-x-3">
                  <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold flex-shrink-0 mt-0.5">
                    {index + 1}
                  </span>
                  <span className="leading-relaxed">{step}</span>
                </li>
              ))
            )}
          </ol>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="shadow-warm">
          <CardHeader>
            <CardTitle className="text-primary">Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {recipe.tips.map((tip, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <span className="text-primary font-semibold">💡</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="shadow-warm">
          <CardHeader>
            <CardTitle className="text-primary">Troubleshooting</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {isNewTroubleshootingFormat ? (
                (recipe.troubleshooting as Array<{issue: string; solution: string}>).map((item, index) => (
                  <li key={index} className="space-y-1">
                    <div className="flex items-start space-x-2">
                      <span className="text-primary font-semibold">🔧</span>
                      <div>
                        <p className="font-semibold">{item.issue}</p>
                        <p className="text-sm text-muted-foreground">{item.solution}</p>
                      </div>
                    </div>
                  </li>
                ))
              ) : (
                (recipe.troubleshooting as string[]).map((item, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <span className="text-primary font-semibold">🔧</span>
                    <span>{item}</span>
                  </li>
                ))
              )}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};