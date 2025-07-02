import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface FormattedRecipe {
  title: string;
  introduction: string;
  ingredients: {
    metric: string[];
    volume: string[];
  };
  method: string[];
  tips: string[];
  troubleshooting: string[];
}

interface FormattedRecipeDisplayProps {
  recipe: FormattedRecipe;
}

export const FormattedRecipeDisplay = ({ recipe }: FormattedRecipeDisplayProps) => {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-primary text-center">Formatted Recipe</h2>
      
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
              {recipe.ingredients.metric.map((ingredient, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <span className="text-primary font-semibold">•</span>
                  <span>{ingredient}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="shadow-warm">
          <CardHeader>
            <CardTitle className="text-primary">Ingredients (Volume)</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {recipe.ingredients.volume.map((ingredient, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <span className="text-primary font-semibold">•</span>
                  <span>{ingredient}</span>
                </li>
              ))}
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
            {recipe.method.map((step, index) => (
              <li key={index} className="flex items-start space-x-3">
                <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold flex-shrink-0 mt-0.5">
                  {index + 1}
                </span>
                <span className="leading-relaxed">{step}</span>
              </li>
            ))}
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
              {recipe.troubleshooting.map((item, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <span className="text-primary font-semibold">🔧</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};