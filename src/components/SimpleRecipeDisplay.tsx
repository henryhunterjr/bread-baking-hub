import { ResponsiveImage } from '@/components/ResponsiveImage';
import { Badge } from '@/components/ui/badge';
import { Clock, ChefHat, Users } from 'lucide-react';
import { SaveRecipeButton } from '@/components/SaveRecipeButton';
import { RecipeActions } from '@/components/RecipeActions';

interface SimpleRecipeDisplayProps {
  recipe: any;
  imageUrl?: string;
  title: string;
  recipeId?: string;
  slug?: string;
}

export const SimpleRecipeDisplay = ({ recipe, imageUrl, title, recipeId, slug }: SimpleRecipeDisplayProps) => {
  if (!recipe) return null;

  return (
    <div className="space-y-6">
      {/* Recipe Image */}
      {imageUrl && (
        <div className="relative h-64 rounded-lg overflow-hidden">
          <ResponsiveImage
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      )}

      {/* Recipe Meta */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {recipe.prepTime && (
          <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
            <Clock className="w-5 h-5 text-primary" />
            <div>
              <div className="text-sm font-medium">Prep Time</div>
              <div className="text-xs text-muted-foreground">{recipe.prepTime}</div>
            </div>
          </div>
        )}
        
        {recipe.bakeTime && (
          <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
            <Clock className="w-5 h-5 text-primary" />
            <div>
              <div className="text-sm font-medium">Bake Time</div>
              <div className="text-xs text-muted-foreground">{recipe.bakeTime}</div>
            </div>
          </div>
        )}

        {recipe.difficulty && (
          <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
            <ChefHat className="w-5 h-5 text-primary" />
            <div>
              <div className="text-sm font-medium">Difficulty</div>
              <div className="text-xs text-muted-foreground capitalize">{recipe.difficulty}</div>
            </div>
          </div>
        )}

        {recipe.yield && (
          <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
            <Users className="w-5 h-5 text-primary" />
            <div>
              <div className="text-sm font-medium">Yield</div>
              <div className="text-xs text-muted-foreground">{recipe.yield}</div>
            </div>
          </div>
        )}
      </div>

      {/* Categories/Tags */}
      {recipe.category && (
        <div className="flex flex-wrap gap-2">
          {recipe.category.map((cat: string, index: number) => (
            <Badge key={index} variant="secondary">
              {cat}
            </Badge>
          ))}
        </div>
      )}

      {/* Ingredients */}
      {recipe.ingredients && (
        <div>
          <h3 className="text-xl font-semibold mb-4">Ingredients</h3>
          <ul className="space-y-2">
            {recipe.ingredients.map((ingredient: string, index: number) => (
              <li key={index} className="flex items-start gap-2">
                <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                <span>{ingredient}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Method */}
      {recipe.method && (
        <div>
          <h3 className="text-xl font-semibold mb-4">Instructions</h3>
          <ol className="space-y-4">
            {recipe.method.map((step: any, index: number) => (
              <li key={index} className="flex gap-3">
                <span className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                  {index + 1}
                </span>
                <div className="pt-1 flex-1">
                  {typeof step === 'string' ? (
                    <span>{step}</span>
                  ) : (
                    <div className="space-y-2">
                      {step.step && (
                        <h4 className="font-medium text-base">{step.step}</h4>
                      )}
                      {step.instruction && (
                        <p>{step.instruction}</p>
                      )}
                      {step.image && (
                        <div className="mt-3">
                          <ResponsiveImage
                            src={step.image}
                            alt={`Step ${index + 1} illustration`}
                            className="w-full max-w-md h-48 object-cover rounded-lg"
                            loading="lazy"
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* Equipment */}
      {recipe.equipment && (
        <div>
          <h3 className="text-xl font-semibold mb-4">Equipment</h3>
          <ul className="space-y-2">
            {recipe.equipment.map((item: string, index: number) => (
              <li key={index} className="flex items-start gap-2">
                <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Notes */}
      {recipe.notes && (
        <div className="bg-muted/50 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Baker's Notes</h3>
          <p className="text-muted-foreground whitespace-pre-wrap">{recipe.notes}</p>
        </div>
      )}

      {/* Recipe Actions */}
      <div className="flex flex-wrap gap-4 pt-6 border-t">
        {recipeId && (
          <SaveRecipeButton 
            recipeId={recipeId} 
            recipeTitle={title || recipe.title}
            recipeSlug={slug}
          />
        )}
        {slug && (
          <RecipeActions 
            recipe={{ 
              title, 
              data: recipe,
              slug 
            }} 
          />
        )}
      </div>
    </div>
  );
};