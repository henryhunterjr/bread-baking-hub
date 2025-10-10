import { useRef, useMemo, memo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RecipeScalingControl } from '@/components/ui/RecipeScalingControl';
import { Printer, Download } from 'lucide-react';
import html2pdf from 'html2pdf.js';
import { ProductRecommendations } from './ProductRecommendations';
import { AffiliateProductsSection } from './recipe/AffiliateProductsSection';
import { getRecipeImage } from '@/utils/recipeImageMapping';
import { ResponsiveImage } from '@/components/ResponsiveImage';
import { standardizeIngredients, validateRecipeData } from '@/utils/recipeDataUtils';
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

  // Debug logging to see the actual data structure
  console.log('FormattedRecipeDisplay - Recipe ingredients:', recipe.ingredients);
  console.log('FormattedRecipeDisplay - Full recipe:', recipe);
  console.log('FormattedRecipeDisplay - ImageUrl:', imageUrl);
  
  // Validate and standardize the recipe data
  const isValidRecipe = validateRecipeData(recipe);
  console.log('Recipe validation result:', isValidRecipe);
  
  const standardizedIngredients = useMemo(() => {
    return standardizeIngredients(recipe.ingredients);
  }, [recipe.ingredients]);
  
  console.log('Standardized ingredients:', standardizedIngredients);

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

  // Process ingredients to handle various data formats
  const processedIngredients = useMemo(() => {
    console.log('Processing ingredients:', recipe.ingredients);
    
    if (!recipe.ingredients) {
      console.log('No ingredients found');
      return [];
    }
    
    if (Array.isArray(recipe.ingredients)) {
      console.log('Ingredients is array:', recipe.ingredients);
      return recipe.ingredients;
    }
    
    // Handle object format with metric/volume arrays
    if (typeof recipe.ingredients === 'object' && 'metric' in recipe.ingredients) {
      console.log('Using metric ingredients:', recipe.ingredients.metric);
      const metricIngredients = recipe.ingredients.metric || [];
      const volumeIngredients = recipe.ingredients.volume || [];
      
      return metricIngredients.map((item: string, index: number) => ({
        item: item,
        amount_metric: item,
        amount_volume: volumeIngredients[index] || ''
      }));
    }
    
    // Handle object format where ingredients might be nested
    if (typeof recipe.ingredients === 'object') {
      console.log('Ingredients is object, trying to extract values');
      const values = Object.values(recipe.ingredients);
      if (values.length > 0 && Array.isArray(values[0])) {
        return values[0];
      }
    }
    
    console.log('No valid ingredients format found, returning empty array');
    return [];
  }, [recipe.ingredients]);

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
        {/* Recipe Image */}
        {imageUrl && (
          <div className="w-full mb-6">
            <ResponsiveImage
              src={imageUrl}
              alt={recipe.title}
              className="w-full max-w-md mx-auto rounded-lg shadow-warm"
              loading="lazy"
            />
          </div>
        )}
        {!imageUrl && recipeData && (
          <div className="w-full mb-6">
            <ResponsiveImage
              src={getRecipeImage(recipeData.slug || '', recipeData.image_url)}
              alt={recipe.title}
              className="w-full max-w-md mx-auto rounded-lg shadow-warm"
              loading="lazy"
            />
          </div>
        )}
        {!imageUrl && !recipeData && (
          <div className="w-full mb-6 text-center">
            <div className="w-full max-w-md mx-auto h-48 bg-muted rounded-lg flex items-center justify-center">
              <p className="text-muted-foreground">No image available</p>
            </div>
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
              {standardizedIngredients.map((ingredient, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <span className="text-primary font-semibold">•</span>
                  <span>{scaleAmount(ingredient.amount_metric, scale)} {ingredient.item}</span>
                </li>
              ))}
              {standardizedIngredients.length === 0 && (
                <li className="text-muted-foreground italic">No ingredients found</li>
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
              {processedIngredients.map((ingredient, index) => {
                // Handle different ingredient formats for volume display
                let item, volume;
                
                if (typeof ingredient === 'string') {
                  // If ingredient is just a string, display it as is
                  return (
                    <li key={index} className="flex items-start space-x-2">
                      <span className="text-primary font-semibold">•</span>
                      <span>{scaleAmount(ingredient, scale)}</span>
                    </li>
                  );
                } else if (typeof ingredient === 'object' && ingredient) {
                  // Extract values from different possible object structures
                  item = ingredient.item || ingredient.ingredient || ingredient.name || '';
                  volume = ingredient.amount_volume || ingredient.volume || ingredient.imperial || ingredient.amount_metric || '';
                  
                  return (
                    <li key={index} className="flex items-start space-x-2">
                      <span className="text-primary font-semibold">•</span>
                      <span>{scaleAmount(volume, scale)} {item}</span>
                    </li>
                  );
                }
                
                // Fallback for unknown formats
                return (
                  <li key={index} className="flex items-start space-x-2">
                    <span className="text-primary font-semibold">•</span>
                    <span>{String(ingredient)}</span>
                  </li>
                );
              })}
              {processedIngredients.length === 0 && (
                <li className="text-muted-foreground italic">No ingredients found</li>
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
               (recipe.method as Array<{step: number; instruction: string; image?: string}>)?.map((methodStep, index) => (
                 <li key={index} className="flex flex-col space-y-3">
                   <div className="flex items-start space-x-3">
                     <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold flex-shrink-0 mt-0.5">
                       {methodStep.step}
                     </span>
                     <span className="leading-relaxed">{methodStep.instruction}</span>
                   </div>
                   {(methodStep as any).image && (
                     <div className="ml-9">
                       <ResponsiveImage
                         src={(methodStep as any).image}
                         alt={`Step ${methodStep.step || index + 1}: ${methodStep.instruction.substring(0, 50)}...`}
                         className="w-full max-w-md rounded-lg shadow-md"
                         loading="lazy"
                       />
                     </div>
                   )}
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
      
      {/* Affiliate Products Advertisement Section */}
      {recipe.recommended_products && recipe.recommended_products.length > 0 && (
        <AffiliateProductsSection 
          productIds={recipe.recommended_products}
          recipeTitle={recipe.title}
        />
      )}
      
      {/* Product Recommendations - Only show if no manual products selected */}
      {(!recipe.recommended_products || recipe.recommended_products.length === 0) && (
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
          />
        </div>
      )}
      </div>
    </div>
  );
};