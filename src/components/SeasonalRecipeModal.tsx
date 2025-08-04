import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Clock, ChefHat, Users, Snowflake, Flower, Sun, Leaf } from 'lucide-react';
import { SeasonalRecipe, Season, getSeasonalColors } from '@/hooks/useSeasonalRecipes';
import { getRecipeImage } from '@/utils/recipeImageMapping';

interface SeasonalRecipeModalProps {
  recipe: SeasonalRecipe | null;
  onClose: () => void;
}

const seasonIcons = {
  Winter: Snowflake,
  Spring: Flower,
  Summer: Sun,
  Fall: Leaf,
};

export const SeasonalRecipeModal = ({ recipe, onClose }: SeasonalRecipeModalProps) => {
  if (!recipe) return null;

  const season = recipe.data.season;
  const colors = getSeasonalColors(season);
  const SeasonIcon = seasonIcons[season];

  return (
    <Dialog open={!!recipe} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <DialogTitle className="text-2xl flex-1">
              {recipe.title}
            </DialogTitle>
            <Badge variant="secondary" className="flex items-center gap-1">
              <SeasonIcon className="w-4 h-4" />
              {season}
            </Badge>
          </div>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Recipe Image */}
          <div className="relative h-64 rounded-lg overflow-hidden">
            <img 
              src={getRecipeImage(recipe.slug, recipe.image_url)}
              alt={recipe.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = "https://henrysbreadkitchen.wpcomstaging.com/wp-content/uploads/2024/01/henry-s-foolproof-sourdough-loaf.png";
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          </div>

          {/* Recipe Meta */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
              <Clock className="w-5 h-5 text-primary" />
              <div>
                <div className="text-sm font-medium">Prep Time</div>
                <div className="text-sm text-muted-foreground">
                  {recipe.data.prepTime.replace('0 hours ', '')}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
              <ChefHat className="w-5 h-5 text-primary" />
              <div>
                <div className="text-sm font-medium">Bake Time</div>
                <div className="text-sm text-muted-foreground">
                  {recipe.data.bakeTime.replace('0 hours ', '')}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
              <Users className="w-5 h-5 text-primary" />
              <div>
                <div className="text-sm font-medium">Yield</div>
                <div className="text-sm text-muted-foreground">{recipe.data.yield}</div>
              </div>
            </div>
            
            <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
              <div className="w-5 h-5 flex items-center justify-center">
                <div className={`w-3 h-3 rounded-full ${
                  recipe.data.difficulty === 'beginner' ? 'bg-green-500' :
                  recipe.data.difficulty === 'intermediate' ? 'bg-yellow-500' : 'bg-red-500'
                }`} />
              </div>
              <div>
                <div className="text-sm font-medium">Difficulty</div>
                <div className="text-sm text-muted-foreground capitalize">{recipe.data.difficulty}</div>
              </div>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-medium mb-2">Categories</h3>
            <div className="flex flex-wrap gap-2">
              {recipe.data.category.map((cat) => (
                <Badge key={cat} variant="outline">{cat}</Badge>
              ))}
            </div>
          </div>

          {/* Ingredients */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Ingredients</h3>
            <p className="text-sm text-muted-foreground mb-4">(Yields {recipe.data.yield})</p>
            <div className="space-y-3">
              {recipe.data.ingredients.map((ingredient, index) => {
                // Parse ingredient string to extract name, metric, and volume measurements
                const parts = ingredient.split(':');
                const ingredientName = parts[0]?.trim() || ingredient;
                const measurements = parts[1]?.trim() || '';
                
                // Try to split measurements by metric and volume
                const measurementParts = measurements.split('(');
                const metric = measurementParts[0]?.trim() || '';
                const volume = measurementParts[1]?.replace(')', '').trim() || '';
                
                return (
                  <div key={index} className="flex justify-between items-center py-2 px-3 bg-muted/30 rounded-lg">
                    <span className="font-medium">{ingredientName}</span>
                    <div className="text-right">
                      {metric && <div className="font-semibold">{metric}</div>}
                      {volume && <div className="text-sm text-muted-foreground">({volume})</div>}
                      {!metric && !volume && measurements && (
                        <div className="font-semibold">{measurements}</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Instructions */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Instructions</h3>
            <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border-l-4 border-blue-500">
              <p className="text-sm text-blue-700 dark:text-blue-300">
                <strong>For Young Bakers:</strong> Take your time with each step. Read through the entire recipe before starting, and ask an adult for help with hot ovens or sharp tools.
              </p>
            </div>
            <ol className="space-y-4">
              {recipe.data.method.map((step, index) => {
                // Enhanced step descriptions for better guidance
                const enhancedStep = step
                  .replace(/Mix/g, 'Mix together carefully')
                  .replace(/Knead/g, 'Knead the dough (fold and push with the heel of your hand)')
                  .replace(/Rise/g, 'Let the dough rise in a warm, draft-free place')
                  .replace(/Bake/g, 'Bake in the preheated oven')
                  .replace(/(\d+)°F/g, '$1°F (ask an adult to help with the oven)');
                
                return (
                  <li key={index} className="flex gap-4">
                    <span className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </span>
                    <div className="flex-1 pt-1">
                      <div className="text-base leading-relaxed">{enhancedStep}</div>
                      {step.includes('temperature') && (
                        <div className="mt-2 text-sm text-muted-foreground italic">
                          💡 Tip: Use an oven thermometer to check accuracy
                        </div>
                      )}
                      {step.includes('knead') && (
                        <div className="mt-2 text-sm text-muted-foreground italic">
                          💡 Tip: The dough should feel smooth and elastic when ready
                        </div>
                      )}
                      {step.includes('rise') && (
                        <div className="mt-2 text-sm text-muted-foreground italic">
                          💡 Tip: Dough has risen enough when you can poke it gently and it springs back slowly
                        </div>
                      )}
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>

          {/* Equipment */}
          {recipe.data.equipment && recipe.data.equipment.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Equipment</h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {recipe.data.equipment.map((item, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full" />
                    <span className="text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Baker's Notes */}
          {recipe.data.notes && (
            <div className="p-4 bg-primary/5 rounded-lg border-l-4 border-primary">
              <h3 className="text-lg font-semibold mb-2 text-primary">Baker's Notes</h3>
              <p className="text-sm">{recipe.data.notes}</p>
            </div>
          )}

          {/* Holiday Info */}
          {recipe.data.holidays && recipe.data.holidays.length > 0 && (
            <div className="p-4 bg-accent/10 rounded-lg">
              <h3 className="font-medium mb-2">Perfect For</h3>
              <div className="flex flex-wrap gap-2">
                {recipe.data.holidays.map((holiday) => (
                  <Badge key={holiday} variant="secondary">{holiday}</Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};