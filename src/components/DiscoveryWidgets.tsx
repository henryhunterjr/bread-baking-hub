import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Clock, Eye } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { ImageWithFallback } from '@/components/ui/ImageWithFallback';
import { useAuth } from '@/hooks/useAuth';

interface TrendingRecipe {
  id: string;
  title: string;
  slug: string;
  image_url?: string;
  tags: string[];
  activity_score: number;
}

interface RecentlyViewedItem {
  id: string;
  content_title: string;
  content_type: 'recipe' | 'blog_post' | 'glossary_term';
  content_url?: string;
  viewed_at: string;
}

interface RelatedRecipe {
  id: string;
  title: string;
  slug: string;
  image_url?: string;
  tags: string[];
  similarity_score: number;
}

interface DiscoveryWidgetsProps {
  className?: string;
  currentRecipeId?: string; // For related recipes
}

export const DiscoveryWidgets: React.FC<DiscoveryWidgetsProps> = ({ 
  className = "",
  currentRecipeId 
}) => {
  const [trendingRecipes, setTrendingRecipes] = useState<TrendingRecipe[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<RecentlyViewedItem[]>([]);
  const [relatedRecipes, setRelatedRecipes] = useState<RelatedRecipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    loadDiscoveryData();
  }, [user, currentRecipeId]);

  const loadDiscoveryData = async () => {
    setIsLoading(true);
    try {
      // Load trending recipes
      const { data: trending } = await supabase.rpc('get_trending_recipes', {
        days_back: 7,
        limit_count: 5
      });

      if (trending) {
        setTrendingRecipes(trending);
      }

      // Load recently viewed for authenticated users
      if (user) {
        const { data: recent } = await supabase
          .from('user_viewing_history')
          .select('*')
          .eq('user_id', user.id)
          .order('viewed_at', { ascending: false })
          .limit(5);

        if (recent) {
          setRecentlyViewed(recent.map(item => ({
            id: item.id,
            content_title: item.content_title,
            content_type: item.content_type as 'recipe' | 'blog_post' | 'glossary_term',
            content_url: item.content_url,
            viewed_at: item.viewed_at
          })));
        }
      }

      // Load related recipes if on a recipe page
      if (currentRecipeId) {
        const { data: related } = await supabase.rpc('get_related_recipes', {
          recipe_id: currentRecipeId,
          limit_count: 5
        });

        if (related) {
          setRelatedRecipes(related);
        }
      }

    } catch (error) {
      console.error('Error loading discovery data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className={`space-y-6 ${className}`}>
        {[1, 2, 3].map(i => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-muted rounded w-1/3"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[1, 2, 3].map(j => (
                  <div key={j} className="flex gap-3">
                    <div className="w-16 h-16 bg-muted rounded"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-muted rounded w-3/4"></div>
                      <div className="h-3 bg-muted rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Trending Recipes */}
      {trendingRecipes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <TrendingUp className="h-5 w-5 text-primary" />
              Trending This Week
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {trendingRecipes.map((recipe, index) => (
                <Link
                  key={recipe.id}
                  to={`/recipe/${recipe.slug}`}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors group"
                >
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm flex-shrink-0">
                    {index + 1}
                  </div>
                  
                  {recipe.image_url && (
                    <ImageWithFallback
                      src={recipe.image_url}
                      alt={recipe.title}
                      className="w-12 h-12 rounded object-cover flex-shrink-0"
                    />
                  )}
                  
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm group-hover:text-primary transition-colors line-clamp-1">
                      {recipe.title}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Eye className="h-3 w-3" />
                        {recipe.activity_score} views
                      </div>
                      {recipe.tags.length > 0 && (
                        <Badge variant="secondary" className="text-xs">
                          {recipe.tags[0]}
                        </Badge>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recently Viewed */}
      {user && recentlyViewed.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Clock className="h-5 w-5 text-primary" />
              Recently Viewed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentlyViewed.map((item) => (
                <Link
                  key={`${item.content_type}-${item.id}`}
                  to={item.content_url || '#'}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors group"
                >
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm group-hover:text-primary transition-colors line-clamp-1">
                      {item.content_title}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {item.content_type.replace('_', ' ')}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {new Date(item.viewed_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Related Recipes */}
      {currentRecipeId && relatedRecipes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Related Recipes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {relatedRecipes.map((recipe) => (
                <Link
                  key={recipe.id}
                  to={`/recipe/${recipe.slug}`}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors group"
                >
                  {recipe.image_url && (
                    <ImageWithFallback
                      src={recipe.image_url}
                      alt={recipe.title}
                      className="w-12 h-12 rounded object-cover flex-shrink-0"
                    />
                  )}
                  
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm group-hover:text-primary transition-colors line-clamp-1">
                      {recipe.title}
                    </h4>
                    <div className="flex items-center gap-1 mt-1">
                      {recipe.tags.slice(0, 2).map(tag => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DiscoveryWidgets;