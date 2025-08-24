import { useRef, useMemo, memo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RecipeScalingControl } from '@/components/ui/RecipeScalingControl';
import { Printer, Download } from 'lucide-react';
import html2pdf from 'html2pdf.js';
import { ProductRecommendations } from './ProductRecommendations';
import { getRecipeImage } from '@/utils/recipeImageMapping';
import { ResponsiveImage } from '@/components/ResponsiveImage';
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
  recipe: FormattedRecipe & {
    recommended_products?: string[];
  };
  imageUrl?: string;
  recipeData?: { image_url?: string; slug?: string };
}

export const FormattedRecipeDisplay = ({ recipe, imageUrl, recipeData }: FormattedRecipeDisplayProps) => {
  const printRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState<number>(1);

  // Helpers for recipe scaling
  const normalizeFractions = (str: string) =>
    str
      .replace(/½/g, '1/2')
      .replace(/¼/g, '1/4')
      .replace(/¾/g, '3/4');

  const parseQuantity = (input: string | number | any): { qty: number | null; rest: string } => {
    // Convert input to string and handle non-string inputs
    const inputStr = typeof input === 'string' ? input : String(input || '');
    if (!inputStr) return { qty: null, rest: '' };
    
    const str = normalizeFractions(inputStr.trim());
    const match = str.match(/^((\d+\s+\d+\/\d+)|(\d+\/\d+)|(\d+(?:\.\d+)?))/);
    if (!match) return { qty: null, rest: inputStr };
    const raw = match[1];
    let qty = 0;
    if (raw.includes(' ')) {
      const [whole, frac] = raw.split(' ');
      const [n, d] = frac.split('/').map(Number);
      qty = Number(whole) + (n / d);
    } else if (raw.includes('/')) {
      const [n, d] = raw.split('/').map(Number);
      qty = n / d;
    } else {
      qty = Number(raw);
    }
    const rest = inputStr.slice(match[0].length);
    return { qty, rest };
  };

  const formatQty = (qty: number): string => {
    const rounded = Math.round(qty * 100) / 100;
    return rounded % 1 === 0 ? String(rounded) : String(rounded);
  };

  const scaleAmount = (text: string, factor: number): string => {
    const { qty, rest } = parseQuantity(text);
    if (qty === null) return text;
    const scaled = qty * factor;
    return `${formatQty(scaled)}${rest}`;
  };
  
  // Check if ingredients is in new format (array of objects) or old format (object with metric/volume arrays)
  const isNewIngredientFormat = Array.isArray(recipe.ingredients);
  const isNewMethodFormat = Array.isArray(recipe.method) && recipe.method.length > 0 && typeof recipe.method[0] === 'object';
  const isNewTroubleshootingFormat = Array.isArray(recipe.troubleshooting) && recipe.troubleshooting.length > 0 && typeof recipe.troubleshooting[0] === 'object';

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    const element = printRef.current;
    if (!element) return;

    const opt = {
      margin: 1,
      filename: `${recipe.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-primary">Formatted Recipe</h2>
        <div className="flex flex-col sm:flex-row gap-2 print:hidden">
          <Button
            onClick={handlePrint}
            variant="outline"
            size="sm"
            className="flex items-center justify-center gap-2 w-full sm:w-auto h-11 touch-manipulation"
          >
            <Printer className="h-4 w-4" />
            Print
          </Button>
          <Button
            onClick={handleDownloadPDF}
            variant="outline"
            size="sm"
            className="flex items-center justify-center gap-2 w-full sm:w-auto h-11 touch-manipulation"
          >
            <Download className="h-4 w-4" />
            Download PDF
          </Button>
        </div>
      </div>
      
      <RecipeScalingControl 
        scale={scale}
        onScaleChange={setScale}
        className="mb-6"
      />

      <div ref={printRef} className="print-container">
      
        {(imageUrl || recipeData) && (
          <div className="w-full">
            <ResponsiveImage
              src={imageUrl || (recipeData ? getRecipeImage(recipeData.slug || '', recipeData.image_url) : '')}
              alt={recipe.title}
              className="w-full h-64 rounded-lg shadow-warm"
              loading="lazy"
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-warm">
          <CardHeader>
            <CardTitle className="text-primary">Ingredients (Metric)</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {isNewIngredientFormat ? (
                (recipe.ingredients as Array<{item: string; amount_metric: string; amount_volume: string; note?: string}>)?.map((ingredient, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <span className="text-primary font-semibold">•</span>
                    <span>{scaleAmount(ingredient.amount_metric, scale)} {ingredient.item}</span>
                  </li>
                )) || []
              ) : (
                (recipe.ingredients as {metric: string[]; volume: string[]})?.metric?.map((ingredient, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <span className="text-primary font-semibold">•</span>
                    <span>{scaleAmount(ingredient, scale)}</span>
                  </li>
                )) || []
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
                (recipe.ingredients as Array<{item: string; amount_metric: string; amount_volume: string; note?: string}>)?.map((ingredient, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <span className="text-primary font-semibold">•</span>
                    <span>{scaleAmount(ingredient.amount_volume, scale)} {ingredient.item}</span>
                  </li>
                )) || []
              ) : (
                (recipe.ingredients as {metric: string[]; volume: string[]})?.volume?.map((ingredient, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <span className="text-primary font-semibold">•</span>
                    <span>{scaleAmount(ingredient, scale)}</span>
                  </li>
                )) || []
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
              (recipe.method as Array<{step: number; instruction: string}>)?.map((methodStep, index) => (
                <li key={index} className="flex items-start space-x-3">
                  <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold flex-shrink-0 mt-0.5">
                    {methodStep.step}
                  </span>
                  <span className="leading-relaxed">{methodStep.instruction}</span>
                </li>
              )) || []
            ) : (
              (recipe.method as string[])?.map((step, index) => (
                <li key={index} className="flex items-start space-x-3">
                  <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold flex-shrink-0 mt-0.5">
                    {index + 1}
                  </span>
                  <span className="leading-relaxed">{step}</span>
                </li>
              )) || []
            )}
          </ol>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-warm">
          <CardHeader>
            <CardTitle className="text-primary">Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {recipe.tips?.map((tip, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <span className="text-primary font-semibold">💡</span>
                  <span>{tip}</span>
                </li>
              )) || []}
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
                (recipe.troubleshooting as Array<{issue: string; solution: string}>)?.map((item, index) => (
                  <li key={index} className="space-y-1">
                    <div className="flex items-start space-x-2">
                      <span className="text-primary font-semibold">🔧</span>
                      <div>
                        <p className="font-semibold">{item.issue}</p>
                        <p className="text-sm text-muted-foreground">{item.solution}</p>
                      </div>
                    </div>
                  </li>
                )) || []
              ) : (
                (recipe.troubleshooting as string[])?.map((item, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <span className="text-primary font-semibold">🔧</span>
                    <span>{item}</span>
                  </li>
                )) || []
              )}
            </ul>
          </CardContent>
        </Card>
      </div>
      
      {/* Product Recommendations */}
      <div className="print:hidden">
        <ProductRecommendations
          recipeTitle={recipe.title}
          recipeContent={useMemo(() => {
            const isNewIngredientFormat = Array.isArray(recipe.ingredients);
            const isNewMethodFormat = Array.isArray(recipe.method) && recipe.method.length > 0 && typeof recipe.method[0] === 'object';
            const intro = recipe.introduction || '';
            const ingredientsText = isNewIngredientFormat && Array.isArray(recipe.ingredients)
              ? (recipe.ingredients as Array<{item: string; amount_metric: string; amount_volume: string; note?: string}>)
                  .map((ing) => ing.item || (ing as any))
                  .join(' ')
              : !isNewIngredientFormat && (recipe.ingredients as {metric: string[]; volume: string[]})?.metric
                ? (recipe.ingredients as {metric: string[]; volume: string[]}).metric?.join(' ')
                : '';
            const methodText = isNewMethodFormat && Array.isArray(recipe.method)
              ? (recipe.method as Array<{step: number; instruction: string}>)
                  .map((step) => step.instruction)
                  .join(' ')
              : Array.isArray(recipe.method)
                ? (recipe.method as string[])?.join(' ')
                : '';
            return `${intro} ${ingredientsText} ${methodText}`.trim();
          }, [recipe])}
          manualOverrides={recipe.recommended_products}
        />
      </div>
      </div>
    </div>
  );
};