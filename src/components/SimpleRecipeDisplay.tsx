import { ResponsiveImage } from '@/components/ResponsiveImage';
import { Badge } from '@/components/ui/badge';
import { Clock, ChefHat, Users } from 'lucide-react';
import { SaveRecipeButton } from '@/components/SaveRecipeButton';
import { RecipeActions } from '@/components/RecipeActions';
import { AffiliateProductsSection } from '@/components/recipe/AffiliateProductsSection';
import { EquipmentWithAffiliates } from '@/components/recipe/EquipmentWithAffiliates';
import sourhousePromo from '@/assets/sourhouse-promo.png';

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
      {/* Recipe Introduction */}
      {recipe.introduction && (
        <div className="bg-muted/30 rounded-lg p-6 border-l-4 border-primary">
          <div className="prose prose-sm max-w-none text-foreground">
            {recipe.author_name && (
              <div className="text-sm font-medium text-primary mb-2">By {recipe.author_name}</div>
            )}
            <div className="whitespace-pre-wrap">{recipe.introduction}</div>
          </div>
        </div>
      )}

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
        <EquipmentWithAffiliates 
          equipment={recipe.equipment}
          affiliateProductIds={recipe.recommended_products}
        />
      )}

      {/* Notes */}
      {recipe.notes && (
        <div className="bg-muted/50 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Baker's Notes</h3>
          <p className="text-muted-foreground whitespace-pre-wrap">{recipe.notes}</p>
        </div>
      )}

      {/* Sourhouse Promotional Section - Only on Holiday Star Cinnamon Bread */}
      {slug === 'holiday-star-cinnamon-bread' && (
        <div className="py-8 border-t border-border">
          <div className="text-center space-y-4">
            <h3 className="text-2xl font-semibold">Keep Your Dough Perfect</h3>
            <p className="text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              I use Sourhouse products in my kitchen. The <strong>DoughBed</strong> has proven invaluable when it comes to knowing exactly the right temperature to keep my dough for proofing, especially as the weather begins to change.
            </p>
            
            <div className="py-4">
              <p className="text-lg font-medium mb-2">
                🛒 Use code <span className="text-primary font-bold text-xl">HBK23</span> for <span className="text-primary font-bold">10% off</span> all products at{' '}
                <a 
                  href="https://sourhouse.co?ref=BAKINGGREATBREAD" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline font-medium"
                >
                  Sourhouse
                </a>
              </p>
            </div>

            <div className="mt-6 max-w-2xl mx-auto">
              <img 
                src={sourhousePromo} 
                alt="Sourhouse 10% Off Promotion"
                className="w-full rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      )}

      {/* Affiliate Products Section */}
      {recipe.recommended_products && recipe.recommended_products.length > 0 && (
        <AffiliateProductsSection 
          productIds={recipe.recommended_products}
          recipeTitle={title || recipe.title}
        />
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