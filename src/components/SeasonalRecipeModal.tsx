import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, ChefHat, Users, Snowflake, Flower, Sun, Leaf, Heart, Star, X } from 'lucide-react';
import { SeasonalRecipe, Season, getSeasonalColors } from '@/hooks/useSeasonalRecipes';
import { getRecipeImage } from '@/utils/recipeImageMapping';
import { RecipeActions } from '@/components/RecipeActions';
import { RecipeRating } from '@/components/RecipeRating';
import { ZoomableImage } from '@/components/ZoomableImage';
import CookingMode from '@/components/CookingMode';
import { ScrollDebugPanel } from '@/components/ScrollDebugPanel';
import { useRef, useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { sanitizeStructuredData } from '@/utils/sanitize';
import { useScrollLock } from '@/hooks/useScrollLock';

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

// JSON-LD for Recipe schema
const RecipeStructuredData = ({
  recipe,
  avgRating,
  ratingCount,
}: {
  recipe: SeasonalRecipe;
  avgRating: number | null;
  ratingCount: number;
}) => {
  const imageUrl = getRecipeImage(recipe.slug, recipe.image_url);
  const schema = {
    "@context": "https://schema.org",
    "@type": "Recipe",
    name: recipe.title,
    image: [imageUrl],
    author: { "@type": "Person", name: "Henry Hunter" },
    datePublished: new Date().toISOString(),
    recipeCategory: (recipe.data as any).category?.[0],
    recipeYield: (recipe.data as any).yield,
    recipeIngredient: (recipe.data as any).ingredients,
    recipeInstructions: (recipe.data as any).method?.map((text: string) => ({ "@type": "HowToStep", text })),
    aggregateRating: avgRating ? { "@type": "AggregateRating", ratingValue: avgRating, ratingCount } : undefined,
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: sanitizeStructuredData(schema) }}
    />
  );
};

export const SeasonalRecipeModal = ({ recipe, onClose }: SeasonalRecipeModalProps) => {
  if (!recipe) return null;

  const season = recipe.data.season;
  const colors = getSeasonalColors(season);
  const SeasonIcon = seasonIcons[season];

  // Refs for focus management and DOM cleanup
  const dialogContentRef = useRef<HTMLDivElement>(null);
  const previouslyFocusedElementRef = useRef<HTMLElement | null>(null);

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

  // Let Radix UI Dialog handle scroll lock natively - no custom hook needed

  // Focus management and DOM cleanup effects
  useEffect(() => {
    if (recipe) {
      // Store currently focused element
      previouslyFocusedElementRef.current = document.activeElement as HTMLElement;
      
      // Focus the dialog content after a brief delay to ensure it's mounted
      const focusTimeout = setTimeout(() => {
        if (dialogContentRef.current) {
          dialogContentRef.current.focus();
        }
      }, 100);

      return () => {
        clearTimeout(focusTimeout);
      };
    }
  }, [recipe]);

  // Comprehensive cleanup effect when modal closes
  useEffect(() => {
    return () => {
      if (recipe) {
        // Restore focus to previously focused element
        if (previouslyFocusedElementRef.current && document.body.contains(previouslyFocusedElementRef.current)) {
          previouslyFocusedElementRef.current.focus();
        }

        // Force cleanup of DOM references and styles
        const cleanup = () => {
          // Clear any remaining object URLs
          document.querySelectorAll('img[src^="blob:"]').forEach(img => {
            const src = (img as HTMLImageElement).src;
            if (src.startsWith('blob:')) {
              URL.revokeObjectURL(src);
            }
          });

          // Let useScrollLock handle body styles - don't interfere
          
          // Clear any potential memory leaks from refs
          previouslyFocusedElementRef.current = null;
        };

        // Use both immediate and delayed cleanup for robustness
        cleanup();
        setTimeout(cleanup, 100);
      }
    };
  }, [recipe]);

  // Enhanced close handler with detailed logging
  const handleClose = useCallback(() => {
    console.log(`🚪 MODAL CLOSE - Starting close process`);
    console.log(`🚪 Body overflow before close: "${document.body.style.overflow}"`);
    console.log(`🚪 Body position before close: "${document.body.style.position}"`);
    
    // Reset all local state
    setServings(baseServings);
    setReviewText('');
    setReviewFile(null);
    setSubmittingReview(false);
    setLoadingEngagement(false);
    
    // Add a small delay to ensure scroll lock cleanup completes
    setTimeout(() => {
      console.log(`🚪 MODAL CLOSE - After timeout`);
      console.log(`🚪 Body overflow after close: "${document.body.style.overflow}"`);
      console.log(`🚪 Body position after close: "${document.body.style.position}"`);
      console.log(`🚪 Can scroll after close: ${document.body.scrollHeight > window.innerHeight ? 'YES' : 'NO'}`);
    }, 200);
    
    // Call parent close handler
    onClose();
  }, [baseServings, onClose]);

  // Swipe-down to close on mobile
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const onTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    touchStart.current = { x: t.clientX, y: t.clientY };
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart.current) return;
    const t = e.changedTouches[0];
    const dy = t.clientY - touchStart.current.y;
    const dx = t.clientX - touchStart.current.x;
    if (dy > 80 && Math.abs(dy) > Math.abs(dx)) handleClose();
    touchStart.current = null;
  };

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
    <>
      <ScrollDebugPanel isOpen={!!recipe} />
      <Dialog 
        open={!!recipe} 
        onOpenChange={(open) => {
          if (!open) {
            handleClose();
          }
        }}
      >
        <DialogContent 
          ref={dialogContentRef}
          className="w-[95vw] max-w-4xl h-[90vh] max-h-[900px] overflow-hidden p-0 gap-0 
                     sm:w-full sm:h-auto sm:max-h-[90vh]
                     flex flex-col focus:outline-none"
          aria-labelledby="recipe-modal-title"
          aria-describedby="recipe-modal-description"
          onInteractOutside={(e) => {
            e.preventDefault();
            handleClose();
          }}
          onEscapeKeyDown={handleClose}
        >
          <style>{`
            @media print {
              .no-print { display: none !important; }
              h1, h2, h3 { break-after: avoid; }
            }
          `}</style>
          
          {/* Mobile sticky header with improved touch targets */}
          <div className="sm:hidden sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b px-3 py-2 flex items-center gap-2 min-h-[60px]">
            <Button 
              onClick={handleClose} 
              variant="ghost" 
              size="sm" 
              aria-label="Close recipe modal" 
              className="min-h-[48px] min-w-[48px] p-2 touch-manipulation"
            >
              <X className="h-6 w-6" />
            </Button>
            <div className="flex-1 font-semibold text-sm leading-tight line-clamp-2">
              {recipe.title}
            </div>
            <Badge variant="secondary" className="flex items-center gap-1 px-2 py-1 text-xs">
              <SeasonIcon className="w-3 h-3" />
              <span className="hidden xs:inline">{season}</span>
            </Badge>
          </div>

          {/* Scrollable content area */}
          <div 
            className="flex-1 overflow-y-auto overscroll-behavior-contain px-4 sm:px-6"
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            <DialogHeader className="py-4 sm:py-6">
              {/* Accessible title and description - properly structured */}
              <DialogTitle id="recipe-modal-title" className="sr-only">
                {recipe.title} - Seasonal Recipe Details
              </DialogTitle>
              <DialogDescription id="recipe-modal-description" className="sr-only">
                Detailed view of {recipe.title}, a {recipe.data.season?.toLowerCase()} recipe including ingredients, instructions, ratings, and reviews. 
                This recipe serves {recipe.data.yield} and has a {recipe.data.difficulty} difficulty level.
              </DialogDescription>
              
              {/* JSON-LD for Recipe */}
              <RecipeStructuredData recipe={recipe} avgRating={avgRating} ratingCount={ratingCount} />
              <div className="hidden sm:flex items-center gap-3">
                <h1 className="text-2xl flex-1 font-semibold leading-none tracking-tight">
                  {recipe.title}
                </h1>
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
              <div className="flex items-center gap-3 mb-2">
                <Button
                  variant="link"
                  size="sm"
                  className="px-0"
                  onClick={() => document.getElementById('reviews-heading')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                  aria-label="Read reviews"
                >
                  Read reviews ({ratingCount})
                </Button>
              </div>

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
                      className="disabled:opacity-50 h-11 w-11 min-h-[44px] min-w-[44px] grid place-items-center rounded-md hover:bg-muted touch-manipulation"
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

                <Button
                  onClick={toggleFavorite}
                  disabled={loadingEngagement || !user}
                  variant="outline"
                  size="sm"
                  aria-pressed={isFav}
                  aria-label="Save to favorites"
                  className="min-h-[44px] min-w-[44px] touch-manipulation"
                >
                  <Heart className={`h-4 w-4 ${isFav ? 'fill-red-500 text-red-500' : 'text-muted-foreground'}`} />
                  {isFav ? 'Favorited' : 'Save to Favorites'}
                </Button>
              </div>

              {/* Recipe Actions */}
              <RecipeActions 
                recipe={recipe}
                className="border-t pt-4 no-print"
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
                  className="h-11 min-h-[44px] w-28 rounded-md border border-border bg-background px-3 text-foreground touch-manipulation"
                />
                <span className="text-xs text-muted-foreground">Base: {baseServings}</span>
              </div>
            </DialogHeader>
            
            <div className="space-y-6 pb-4">
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
                      className="w-full min-h-[80px] rounded-md border border-border bg-background p-3 text-sm touch-manipulation resize-y"
                      maxLength={1000}
                    />
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setReviewFile(e.target.files?.[0] || null)}
                        className="text-sm w-full sm:w-auto touch-manipulation"
                      />
                      <Button
                        onClick={submitReview}
                        disabled={submittingReview || !reviewText.trim()}
                        size="sm"
                        variant="outline"
                        className="min-h-[48px] min-w-[120px] w-full sm:w-auto touch-manipulation"
                      >
                        {submittingReview ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                            Submitting…
                          </>
                        ) : (
                          'Submit Review'
                        )}
                      </Button>
                    </div>
                    {reviewText.length > 900 && (
                      <p className="text-xs text-muted-foreground">
                        {1000 - reviewText.length} characters remaining
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="mb-4 p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-2">Sign in to leave a review and save your favorite recipes.</p>
                    <Button variant="outline" size="sm" className="min-h-[44px] touch-manipulation">
                      Sign In to Review
                    </Button>
                  </div>
                )}

                <div className="space-y-3">
                  {reviews.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No reviews yet. Be the first to review!</p>
                  ) : (
                    reviews.map((r) => (
                      <div key={r.id} className="rounded-lg border border-border p-3">
                        <p className="text-sm leading-relaxed">{r.comment}</p>
                        {r.photo_url && (
                          <img src={r.photo_url} alt={`Review photo for ${recipe.title}`} className="mt-2 h-32 w-auto rounded-md object-cover" loading="lazy" />
                        )}
                        <p className="mt-1 text-xs text-muted-foreground">{new Date(r.created_at).toLocaleString()}</p>
                      </div>
                    ))
                  )}
                </div>
              </section>
            </div>
          </div>
          
          {/* Mobile footer with main actions */}
          <div className="sm:hidden border-t bg-background/95 backdrop-blur p-3 no-print">
            <div className="flex gap-2">
              <RecipeActions 
                recipe={recipe} 
                className="flex-1"
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
