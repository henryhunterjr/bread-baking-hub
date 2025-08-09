import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Clock, ChefHat, Users, Snowflake, Flower, Sun, Leaf, Heart, Star } from 'lucide-react';
import { SeasonalRecipe, Season, getSeasonalColors } from '@/hooks/useSeasonalRecipes';
import { getRecipeImage } from '@/utils/recipeImageMapping';
import { RecipeActions } from '@/components/RecipeActions';
import { RecipeRating } from '@/components/RecipeRating';
import { ZoomableImage } from '@/components/ZoomableImage';
import CookingMode from '@/components/CookingMode';
import { useRef, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface SeasonalRecipeModalProps {
  recipe: SeasonalRecipe | null;
  onClose: () => void;
  onNext?: () => void;
  onPrev?: () => void;
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

  // Servings scaling helpers
  const getBaseServings = (yieldText?: string) => {
    if (!yieldText) return 1;
    const match = yieldText.match(/\d+(?:\.\d+)?/);
    return match ? Number(match[0]) || 1 : 1;
  };
  const baseServings = getBaseServings(recipe.data.yield);
  const [servings, setServings] = useState<number>(baseServings);
  const factor = servings > 0 && baseServings > 0 ? servings / baseServings : 1;

  const normalizeFractions = (str: string) =>
    str.replace(/½/g, '1/2').replace(/¼/g, '1/4').replace(/¾/g, '3/4');
  const parseQuantity = (input: string): { qty: number | null; rest: string } => {
    const str = normalizeFractions((input || '').trim());
    const match = str.match(/^((\d+\s+\d+\/\d+)|(\d+\/\d+)|(\d+(?:\.\d+)?))/);
    if (!match) return { qty: null, rest: input || '' };
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
    const rest = str.slice(match[0].length);
    return { qty, rest };
  };
  const formatQty = (qty: number): string => {
    const rounded = Math.round(qty * 100) / 100;
    return String(rounded);
  };
  const scaleAmount = (text: string, f: number): string => {
    if (!text) return '';
    const { qty, rest } = parseQuantity(text);
    if (qty === null) return text;
    const scaled = qty * f;
    return `${formatQty(scaled)}${rest}`;
  };

  // Engagement state (ratings, favorites, reviews)
  const { user } = useAuth();
  const { toast } = useToast();
  const [avgRating, setAvgRating] = useState<number | null>(null);
  const [ratingCount, setRatingCount] = useState<number>(0);
  const [myRating, setMyRating] = useState<number | null>(null);
  const [isFav, setIsFav] = useState<boolean>(false);
  const [loadingEngagement, setLoadingEngagement] = useState<boolean>(false);
  const [reviews, setReviews] = useState<Array<{ id: string; comment: string; photo_url?: string; created_at: string }>>([]);
  const [reviewText, setReviewText] = useState<string>('');
  const [reviewFile, setReviewFile] = useState<File | null>(null);
  const [submittingReview, setSubmittingReview] = useState<boolean>(false);

  useEffect(() => {
    const load = async () => {
      if (!recipe?.id) return;
      try {
        // Ratings
        const { data: ratingRows, error: ratingErr } = await supabase
          .from('recipe_ratings')
          .select('rating')
          .eq('recipe_id', recipe.id);
        if (!ratingErr && ratingRows) {
          const total = ratingRows.reduce((sum: number, r: any) => sum + (r.rating || 0), 0);
          setRatingCount(ratingRows.length);
          setAvgRating(ratingRows.length ? total / ratingRows.length : null);
        }
        // My rating
        if (user?.id) {
          const { data: my, error: myErr } = await supabase
            .from('recipe_ratings')
            .select('rating')
            .eq('recipe_id', recipe.id)
            .eq('user_id', user.id)
            .maybeSingle();
          if (!myErr && my) setMyRating(my.rating ?? null);
          // Favorite
          const { data: fav, error: favErr } = await supabase
            .from('user_favorites')
            .select('id')
            .eq('recipe_id', recipe.id)
            .eq('user_id', user.id)
            .maybeSingle();
          if (!favErr) setIsFav(!!fav);
        } else {
          setMyRating(null);
          setIsFav(false);
        }
        // Reviews (latest 5)
        const { data: revs } = await supabase
          .from('recipe_reviews')
          .select('id, comment, photo_url, created_at')
          .eq('recipe_id', recipe.id)
          .order('created_at', { ascending: false })
          .limit(5);
        setReviews(revs || []);
      } catch (e) {
        // ignore
      }
    };
    load();
  }, [recipe?.id, user?.id]);

  const handleRate = async (value: number) => {
    if (!user) {
      toast({ title: 'Login required', description: 'Please sign in to rate recipes.' });
      return;
    }
    setLoadingEngagement(true);
    const { error } = await supabase.from('recipe_ratings').upsert(
      { recipe_id: recipe.id, user_id: user.id, rating: value },
      { onConflict: 'recipe_id,user_id' }
    );
    setLoadingEngagement(false);
    if (error) {
      toast({ title: 'Rating failed', description: error.message, variant: 'destructive' });
    } else {
      setMyRating(value);
      // refresh aggregates
      const { data: ratingRows } = await supabase
        .from('recipe_ratings')
        .select('rating')
        .eq('recipe_id', recipe.id);
      const total = (ratingRows || []).reduce((sum: number, r: any) => sum + (r.rating || 0), 0);
      setRatingCount(ratingRows?.length || 0);
      setAvgRating(ratingRows && ratingRows.length ? total / ratingRows.length : null);
      toast({ title: 'Thanks!', description: 'Your rating was saved.' });
    }
  };

  const toggleFavorite = async () => {
    if (!user) {
      toast({ title: 'Login required', description: 'Please sign in to save favorites.' });
      return;
    }
    setLoadingEngagement(true);
    try {
      if (isFav) {
        const { error } = await supabase
          .from('user_favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('recipe_id', recipe.id);
        if (error) throw error;
        setIsFav(false);
        toast({ title: 'Removed from favorites' });
      } else {
        const { error } = await supabase
          .from('user_favorites')
          .insert({ user_id: user.id, recipe_id: recipe.id });
        if (error) throw error;
        setIsFav(true);
        toast({ title: 'Saved to favorites' });
      }
    } catch (e: any) {
      toast({ title: 'Favorite error', description: e.message, variant: 'destructive' });
    } finally {
      setLoadingEngagement(false);
    }
  };

  const submitReview = async () => {
    if (!user) {
      toast({ title: 'Login required', description: 'Please sign in to leave a review.' });
      return;
    }
    if (!reviewText.trim()) {
      toast({ title: 'Review required', description: 'Please enter a comment.', variant: 'destructive' });
      return;
    }
    setSubmittingReview(true);
    try {
      let photoUrl: string | undefined;
      if (reviewFile) {
        const ext = reviewFile.name.split('.').pop() || 'jpg';
        const path = `review-photos/${user.id}/${Date.now()}.${ext}`;
        const { data: up, error: upErr } = await supabase.storage
          .from('recipe-uploads')
          .upload(path, reviewFile, { cacheControl: '3600', upsert: false });
        if (upErr) throw upErr;
        const { data: pub } = supabase.storage.from('recipe-uploads').getPublicUrl(up.path);
        photoUrl = pub.publicUrl;
      }
      const { error } = await supabase.from('recipe_reviews').insert({
        recipe_id: recipe.id,
        user_id: user.id,
        comment: reviewText.trim(),
        photo_url: photoUrl
      });
      if (error) throw error;
      setReviewText('');
      setReviewFile(null);
      // refresh reviews
      const { data: revs } = await supabase
        .from('recipe_reviews')
        .select('id, comment, photo_url, created_at')
        .eq('recipe_id', recipe.id)
        .order('created_at', { ascending: false })
        .limit(5);
      setReviews(revs || []);
      toast({ title: 'Review submitted' });
    } catch (e: any) {
      toast({ title: 'Review error', description: e.message, variant: 'destructive' });
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <Dialog open={!!recipe} onOpenChange={onClose} aria-labelledby="recipe-modal-title">
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" role="dialog" aria-modal="true">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <DialogTitle id="recipe-modal-title" className="text-2xl flex-1">
              {recipe.title}
            </DialogTitle>
            <Badge variant="secondary" className="flex items-center gap-1">
              <SeasonIcon className="w-4 h-4" />
              {season}
            </Badge>
          </div>
          
          {/* Recipe Rating */}
          <RecipeRating 
            rating={avgRating ?? 0}
            reviewCount={ratingCount}
            difficulty={recipe.data.difficulty as 'beginner' | 'intermediate' | 'expert'}
            trending={ratingCount > 10 && (avgRating ?? 0) >= 4.5}
            communityFavorite={ratingCount > 50 && (avgRating ?? 0) >= 4.6}
            successRate={Math.min(99, Math.max(85, Math.round((avgRating ?? 0) * 20)))}
            className="mb-2"
          />

          {/* Rate & Favorite Controls */}
          <div className="flex flex-wrap items-center gap-4 mb-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Your rating:</span>
              {Array.from({ length: 5 }, (_, i) => i + 1).map((val) => (
                <button
                  key={val}
                  onClick={() => handleRate(val)}
                  disabled={loadingEngagement || !user}
                  aria-label={`Rate ${val} star${val > 1 ? 's' : ''}`}
                  className="disabled:opacity-50"
                >
                  <Star
                    className={`h-5 w-5 ${myRating && myRating >= val ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`}
                  />
                </button>
              ))}
              {!user && (
                <span className="text-xs text-muted-foreground ml-2">Sign in to rate</span>
              )}
            </div>

            <button
              onClick={toggleFavorite}
              disabled={loadingEngagement || !user}
              className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm hover:bg-muted disabled:opacity-50"
              aria-pressed={isFav}
              aria-label="Save to favorites"
            >
              <Heart className={`h-4 w-4 ${isFav ? 'fill-red-500 text-red-500' : 'text-muted-foreground'}`} />
              {isFav ? 'Favorited' : 'Save to Favorites'}
            </button>
          </div>

          {/* Recipe Actions */}
          <RecipeActions 
            recipe={recipe}
            className="border-t pt-4"
          />

          {/* Servings Selector */}
          <div className="mt-4 flex items-center gap-3">
            <label htmlFor="servings-input" className="text-sm text-muted-foreground">Servings</label>
            <input
              id="servings-input"
              type="number"
              min={1}
              value={servings}
              onChange={(e) => setServings(Math.max(1, Number(e.target.value) || baseServings))}
              className="h-9 w-24 rounded-md border border-border bg-background px-2 text-foreground"
            />
            <span className="text-xs text-muted-foreground">Base: {baseServings}</span>
          </div>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Recipe Image */}
          <div className="relative h-64 rounded-lg overflow-hidden">
            <ZoomableImage
              src={getRecipeImage(recipe.slug, recipe.image_url)}
              alt={recipe.title}
              className="w-full h-full"
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
          <section aria-labelledby="ingredients-heading">
            <h3 id="ingredients-heading" className="text-lg font-semibold mb-3">Ingredients</h3>
            <p className="text-sm text-muted-foreground mb-4">(Yields {recipe.data.yield})</p>
            <div className="space-y-3" role="list" aria-label="Recipe ingredients">
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
                  <div key={index} className="flex justify-between items-center py-2 px-3 bg-muted/30 rounded-lg" role="listitem">
                    <span className="font-medium">{ingredientName}</span>
                    <div className="text-right">
                      {metric && <div className="font-semibold">{scaleAmount(metric, factor)}</div>}
                      {volume && <div className="text-sm text-muted-foreground">({scaleAmount(volume, factor)})</div>}
                      {!metric && !volume && measurements && (
                        <div className="font-semibold">{scaleAmount(measurements, factor)}</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Instructions */}
          <section aria-labelledby="instructions-heading">
            <h3 id="instructions-heading" className="text-lg font-semibold mb-3">Instructions</h3>
            <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border-l-4 border-blue-500">
              <p className="text-sm text-blue-700 dark:text-blue-300">
                <strong>For Young Bakers:</strong> Take your time with each step. Read through the entire recipe before starting, and ask an adult for help with hot ovens or sharp tools.
              </p>
            </div>
            <ol className="space-y-4" role="list" aria-label="Recipe instructions">
              {recipe.data.method.map((step, index) => {
                // Enhanced step descriptions for better guidance
                const enhancedStep = step
                  .replace(/Mix/g, 'Mix together carefully')
                  .replace(/Knead/g, 'Knead the dough (fold and push with the heel of your hand)')
                  .replace(/Rise/g, 'Let the dough rise in a warm, draft-free place')
                  .replace(/Bake/g, 'Bake in the preheated oven')
                  .replace(/(\d+)°F/g, '$1°F (ask an adult to help with the oven)');
                
                return (
                  <li key={index} className="flex gap-4" role="listitem">
                    <span 
                      className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold"
                      aria-label={`Step ${index + 1}`}
                    >
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
          </section>

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

          {/* Reviews */}
          <section aria-labelledby="reviews-heading" className="mt-6">
            <h3 id="reviews-heading" className="text-lg font-semibold mb-3">Reviews</h3>
            {user ? (
              <div className="mb-4 space-y-3">
                <textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Share your experience with this recipe..."
                  className="w-full min-h-[80px] rounded-md border border-border bg-background p-3 text-sm"
                />
                <div className="flex items-center justify-between gap-3">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setReviewFile(e.target.files?.[0] || null)}
                    className="text-sm"
                  />
                  <button
                    onClick={submitReview}
                    disabled={submittingReview || !reviewText.trim()}
                    className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm hover:bg-muted disabled:opacity-50"
                  >
                    {submittingReview ? 'Submitting…' : 'Submit Review'}
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground mb-4">Sign in to leave a review.</p>
            )}

            <div className="space-y-3">
              {reviews.length === 0 ? (
                <p className="text-sm text-muted-foreground">No reviews yet. Be the first to review!</p>
              ) : (
                reviews.map((r) => (
                  <div key={r.id} className="rounded-lg border border-border p-3">
                    <p className="text-sm leading-relaxed">{r.comment}</p>
                    {r.photo_url && (
                      <img src={r.photo_url} alt="Review photo" className="mt-2 h-32 w-auto rounded-md object-cover" loading="lazy" />
                    )}
                    <p className="mt-1 text-xs text-muted-foreground">{new Date(r.created_at).toLocaleString()}</p>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
};