import { Star, Users, Clock, TrendingUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface RecipeRatingProps {
  rating?: number;
  reviewCount?: number;
  difficulty?: 'beginner' | 'intermediate' | 'expert';
  trending?: boolean;
  communityFavorite?: boolean;
  successRate?: number;
  className?: string;
}

export const RecipeRating = ({
  rating = 4.8,
  reviewCount = 156,
  difficulty = 'beginner',
  trending = false,
  communityFavorite = false,
  successRate = 94,
  className = ''
}: RecipeRatingProps) => {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => {
      const filled = i < Math.floor(rating);
      const halfFilled = i === Math.floor(rating) && rating % 1 >= 0.5;
      
      return (
        <Star
          key={i}
          className={`h-4 w-4 ${
            filled || halfFilled
              ? 'fill-yellow-400 text-yellow-400'
              : 'text-muted-foreground'
          }`}
        />
      );
    });
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'expert':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <div className={`flex flex-wrap items-center gap-3 ${className}`}>
      {/* Rating Stars */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1">
          {renderStars(rating)}
        </div>
        <span className="text-sm font-medium text-foreground">
          {rating.toFixed(1)}
        </span>
        <span className="text-sm text-muted-foreground">
          ({reviewCount} reviews)
        </span>
      </div>

      {/* Difficulty Badge */}
      <Badge className={getDifficultyColor(difficulty)}>
        {difficulty}
      </Badge>

      {/* Success Rate */}
      <div className="flex items-center gap-1 text-sm text-muted-foreground">
        <TrendingUp className="h-4 w-4 text-green-600" />
        <span>{successRate}% success rate</span>
      </div>

      {/* Special Badges */}
      <div className="flex gap-2">
        {trending && (
          <Badge variant="secondary" className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
            🔥 Trending
          </Badge>
        )}
        
        {communityFavorite && (
          <Badge variant="secondary" className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
            💜 Community Favorite
          </Badge>
        )}
      </div>
    </div>
  );
};