import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Activity, ChefHat, MessageSquare, Star, Trophy, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';

interface ActivityItem {
  id: string;
  user_id: string;
  activity_type: 'recipe_created' | 'recipe_shared' | 'recipe_cooked' | 'review_posted' | 'achievement_earned';
  target_type: 'recipe' | 'review' | 'achievement' | 'user';
  target_id: string;
  visibility: 'public' | 'followers' | 'private';
  activity_data: any;
  created_at: string;
}

interface ActivityFeedProps {
  userId?: string; // If provided, shows activities for specific user
  limit?: number;
  showFilters?: boolean;
}

const ActivityFeed: React.FC<ActivityFeedProps> = ({ 
  userId, 
  limit = 20, 
  showFilters = true 
}) => {
  const { user } = useAuth();
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    loadActivities();
  }, [userId, filter, limit]);

  const loadActivities = async () => {
    try {
      let query = supabase
        .from('user_activities')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      // Filter by user if specified
      if (userId) {
        query = query.eq('user_id', userId);
      } else {
        // Show public activities or user's own activities
        query = query.or(`visibility.eq.public,user_id.eq.${user?.id || 'null'}`);
      }

      // Apply activity type filter
      if (filter !== 'all') {
        query = query.eq('activity_type', filter);
      }

      const { data, error } = await query;
      if (error) throw error;

      // Type-safe mapping
      const typedActivities: ActivityItem[] = (data || []).map(item => {
        const {
          id,
          user_id,
          activity_type,
          target_type,
          target_id,
          visibility,
          activity_data,
          created_at
        } = item;

        return {
          id,
          user_id,
          activity_type: activity_type as ActivityItem['activity_type'],
          target_type: target_type as ActivityItem['target_type'],
          target_id: target_id || '',
          visibility: visibility as ActivityItem['visibility'],
          activity_data,
          created_at,
        };
      });

      setActivities(typedActivities);
    } catch (error) {
      console.error('Error loading activities:', error);
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'recipe_created':
        return <ChefHat className="w-4 h-4 text-green-600" />;
      case 'recipe_shared':
        return <Heart className="w-4 h-4 text-pink-600" />;
      case 'recipe_cooked':
        return <Star className="w-4 h-4 text-orange-600" />;
      case 'review_posted':
        return <MessageSquare className="w-4 h-4 text-blue-600" />;
      case 'achievement_earned':
        return <Trophy className="w-4 h-4 text-purple-600" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  const getActivityMessage = (activity: ActivityItem) => {
    const userName = activity.activity_data?.user_name || 'Someone';
    
    switch (activity.activity_type) {
      case 'recipe_created':
        return (
          <span>
            <strong>{userName}</strong> created a new recipe:{' '}
            <Link 
              to={`/recipe/${activity.activity_data?.slug || activity.target_id}`}
              className="text-primary hover:underline"
            >
              {activity.activity_data?.title || 'New Recipe'}
            </Link>
          </span>
        );
      case 'recipe_shared':
        return (
          <span>
            <strong>{userName}</strong> shared{' '}
            <Link 
              to={`/recipe/${activity.activity_data?.slug || activity.target_id}`}
              className="text-primary hover:underline"
            >
              {activity.activity_data?.title || 'a recipe'}
            </Link>
          </span>
        );
      case 'recipe_cooked':
        return (
          <span>
            <strong>{userName}</strong> cooked{' '}
            <Link 
              to={`/recipe/${activity.activity_data?.slug || activity.target_id}`}
              className="text-primary hover:underline"
            >
              {activity.activity_data?.title || 'a recipe'}
            </Link>
          </span>
        );
      case 'review_posted':
        return (
          <span>
            <strong>{userName}</strong> reviewed{' '}
            <Link 
              to={`/recipe/${activity.activity_data?.recipe_slug || activity.target_id}`}
              className="text-primary hover:underline"
            >
              {activity.activity_data?.recipe_title || 'a recipe'}
            </Link>
          </span>
        );
      case 'achievement_earned':
        return (
          <span>
            <strong>{userName}</strong> earned the{' '}
            <Badge variant="secondary" className="mx-1">
              {activity.activity_data?.achievement_name || 'Achievement'}
            </Badge>
            badge
          </span>
        );
      default:
        return <span><strong>{userName}</strong> did something</span>;
    }
  };

  const filterOptions = [
    { value: 'all', label: 'All Activities' },
    { value: 'recipe_created', label: 'New Recipes' },
    { value: 'recipe_cooked', label: 'Recipe Attempts' },
    { value: 'review_posted', label: 'Reviews' },
    { value: 'achievement_earned', label: 'Achievements' },
  ];

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground">Loading activities...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Activity Feed
          </CardTitle>
          <CardDescription>
            {userId ? 'Recent activities' : 'What\'s happening in the baking community'}
          </CardDescription>
        </CardHeader>
        {showFilters && (
          <CardContent className="pt-0">
            <div className="flex flex-wrap gap-2">
              {filterOptions.map((option) => (
                <Button
                  key={option.value}
                  variant={filter === option.value ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilter(option.value)}
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </CardContent>
        )}
      </Card>

      {activities.length > 0 ? (
        <div className="space-y-3">
          {activities.map((activity) => (
            <Card key={activity.id}>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="flex items-center gap-2">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="text-xs">
                        {(activity.activity_data?.user_name || 'U').charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    {getActivityIcon(activity.activity_type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="text-sm">
                      {getActivityMessage(activity)}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
                    </div>
                    
                    {/* Additional activity data */}
                    {activity.activity_data?.description && (
                      <div className="text-sm text-muted-foreground mt-2 p-2 bg-muted rounded">
                        "{activity.activity_data.description}"
                      </div>
                    )}
                    
                    {activity.activity_data?.rating && (
                      <div className="flex items-center gap-1 mt-2">
                        {Array.from({ length: 5 }, (_, i) => (
                          <Star 
                            key={i} 
                            className={`w-3 h-3 ${
                              i < activity.activity_data.rating 
                                ? 'text-yellow-400 fill-current' 
                                : 'text-gray-300'
                            }`} 
                          />
                        ))}
                        <span className="text-xs text-muted-foreground ml-1">
                          {activity.activity_data.rating}/5
                        </span>
                      </div>
                    )}
                  </div>
                  
                  {activity.visibility === 'private' && (
                    <Badge variant="outline" className="text-xs">
                      Private
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-8">
            <Activity className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="font-medium mb-2">No Activities Yet</h3>
            <p className="text-muted-foreground">
              {userId 
                ? 'This user hasn\'t been active recently'
                : 'Start baking and sharing to see activities here!'
              }
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ActivityFeed;