import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, ThumbsUp, ThumbsDown, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

interface Recipe {
  id: string;
  title: string;
  slug: string;
  image_url?: string;
  data: any;
}

interface Recommendation {
  id: string;
  recipe: Recipe;
  recommendation_type: 'ai_based' | 'similar_users' | 'trending' | 'seasonal';
  confidence_score: number;
  metadata: any;
}

const AIRecommendations = () => {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [preferences, setPreferences] = useState<any>(null);

  useEffect(() => {
    if (user) {
      loadUserPreferences();
      loadRecommendations();
    }
  }, [user]);

  const loadUserPreferences = async () => {
    try {
      const { data, error } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      setPreferences(data);
    } catch (error) {
      console.error('Error loading preferences:', error);
    }
  };

  const loadRecommendations = async () => {
    try {
      const { data, error } = await supabase
        .from('recipe_recommendations')
        .select(`
          id,
          recommendation_type,
          confidence_score,
          metadata,
          recipe:recipes(
            id,
            title,
            slug,
            image_url,
            data
          )
        `)
        .eq('user_id', user?.id)
        .is('interaction_type', null)
        .order('confidence_score', { ascending: false })
        .limit(12);

      if (error) throw error;
      
      // Type-safe mapping to ensure proper types
      const typedRecommendations: Recommendation[] = (data || []).map(item => ({
        id: item.id,
        recommendation_type: item.recommendation_type as 'ai_based' | 'similar_users' | 'trending' | 'seasonal',
        confidence_score: item.confidence_score,
        metadata: item.metadata,
        recipe: {
          id: item.recipe.id,
          title: item.recipe.title,
          slug: item.recipe.slug,
          image_url: item.recipe.image_url,
          data: item.recipe.data
        }
      }));
      
      setRecommendations(typedRecommendations);
    } catch (error) {
      console.error('Error loading recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateRecommendations = async () => {
    if (!user || !preferences) return;

    setLoading(true);
    try {
      // This would typically call an AI service
      // For demo purposes, we'll create some mock recommendations
      const mockRecommendations = [
        {
          recipe_id: '123', // This would be real recipe IDs
          recommendation_type: 'ai_based' as const,
          confidence_score: 0.85,
          metadata: {
            reasons: ['Matches your skill level', 'Contains preferred ingredients'],
            tags: ['beginner-friendly', 'quick-bake']
          }
        },
        // Add more mock recommendations...
      ];

      // In a real implementation, you'd call your AI recommendation service
      toast({
        title: 'Recommendations Updated',
        description: 'New recipe recommendations have been generated based on your preferences.',
      });

      loadRecommendations();
    } catch (error) {
      console.error('Error generating recommendations:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate new recommendations.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInteraction = async (recommendationId: string, interactionType: string) => {
    try {
      const { error } = await supabase
        .from('recipe_recommendations')
        .update({ interaction_type: interactionType })
        .eq('id', recommendationId);

      if (error) throw error;

      // Remove from current recommendations
      setRecommendations(prev => prev.filter(r => r.id !== recommendationId));

      if (interactionType === 'saved') {
        toast({
          title: 'Saved!',
          description: 'Recipe saved to your favorites.',
        });
      }
    } catch (error) {
      console.error('Error updating interaction:', error);
    }
  };

  const getRecommendationTypeLabel = (type: string) => {
    switch (type) {
      case 'ai_based':
        return 'AI Recommended';
      case 'similar_users':
        return 'Popular with Similar Bakers';
      case 'trending':
        return 'Trending Now';
      case 'seasonal':
        return 'Seasonal Pick';
      default:
        return 'Recommended';
    }
  };

  const getRecommendationTypeColor = (type: string) => {
    switch (type) {
      case 'ai_based':
        return 'bg-purple-100 text-purple-800';
      case 'similar_users':
        return 'bg-blue-100 text-blue-800';
      case 'trending':
        return 'bg-orange-100 text-orange-800';
      case 'seasonal':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!user) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <p className="text-muted-foreground">
            Sign in to get personalized recipe recommendations
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            AI-Powered Recommendations
          </CardTitle>
          <CardDescription>
            Recipes curated just for you based on your preferences and baking history
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Button onClick={generateRecommendations} disabled={loading}>
              <Sparkles className="w-4 h-4 mr-2" />
              {loading ? 'Generating...' : 'Get New Recommendations'}
            </Button>
            {!preferences?.onboarding_completed && (
              <Button variant="outline" asChild>
                <Link to="/onboarding">Complete Setup</Link>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {recommendations.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendations.map((recommendation) => (
            <Card key={recommendation.id} className="group relative overflow-hidden">
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => handleInteraction(recommendation.id, 'dismissed')}
              >
                <X className="w-4 h-4" />
              </Button>

              {recommendation.recipe.image_url && (
                <div className="aspect-video overflow-hidden">
                  <img
                    src={recommendation.recipe.image_url}
                    alt={recommendation.recipe.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
              )}

              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                  <Badge 
                    variant="secondary" 
                    className={getRecommendationTypeColor(recommendation.recommendation_type)}
                  >
                    {getRecommendationTypeLabel(recommendation.recommendation_type)}
                  </Badge>
                  <div className="text-xs text-muted-foreground">
                    {Math.round(recommendation.confidence_score * 100)}% match
                  </div>
                </div>
                <CardTitle className="text-lg">
                  <Link 
                    to={`/recipe/${recommendation.recipe.slug}`}
                    className="hover:text-primary transition-colors"
                  >
                    {recommendation.recipe.title}
                  </Link>
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-3">
                {recommendation.metadata?.reasons && (
                  <div className="text-sm text-muted-foreground">
                    {recommendation.metadata.reasons.slice(0, 2).map((reason: string, index: number) => (
                      <div key={index}>• {reason}</div>
                    ))}
                  </div>
                )}

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={() => handleInteraction(recommendation.id, 'saved')}
                  >
                    <ThumbsUp className="w-4 h-4 mr-1" />
                    Save
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleInteraction(recommendation.id, 'dismissed')}
                  >
                    <ThumbsDown className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-8">
            <Sparkles className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="font-medium mb-2">No Recommendations Yet</h3>
            <p className="text-muted-foreground mb-4">
              {preferences?.onboarding_completed 
                ? 'Start exploring recipes to get personalized recommendations'
                : 'Complete your profile setup to get personalized recommendations'
              }
            </p>
            <Button onClick={generateRecommendations} disabled={loading}>
              <Sparkles className="w-4 h-4 mr-2" />
              Generate Recommendations
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AIRecommendations;