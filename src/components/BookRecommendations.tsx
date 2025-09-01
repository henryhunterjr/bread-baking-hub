import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BookCoverImage } from '@/components/ui/OptimizedImage';
import { Star, BookOpen, Target, Award, TrendingUp } from 'lucide-react';

interface Book {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  category: string;
  tags: string[];
  difficulty: string;
  rating: number;
  featured: boolean;
  coverImage: string;
}

interface BookRecommendationProps {
  books: Book[];
  currentBookId?: string;
  userPreferences?: {
    favoriteCategories: string[];
    skillLevel: string;
    recentlyViewed: string[];
  };
  onSelectBook: (bookId: string) => void;
}

export const BookRecommendations = ({ 
  books, 
  currentBookId, 
  userPreferences,
  onSelectBook 
}: BookRecommendationProps) => {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<'similar' | 'skill' | 'trending' | 'featured'>('similar');

  const recommendedBooks = useMemo(() => {
    let candidates = books.filter(book => book.id !== currentBookId);
    
    switch (selectedAlgorithm) {
      case 'similar':
        if (currentBookId) {
          const currentBook = books.find(b => b.id === currentBookId);
          if (currentBook) {
            // Score books based on similarity
            candidates = candidates
              .map(book => ({
                ...book,
                score: calculateSimilarityScore(currentBook, book)
              }))
              .sort((a, b) => b.score - a.score)
              .slice(0, 6);
          }
        } else {
          // If no current book, show featured books
          candidates = candidates.filter(book => book.featured).slice(0, 6);
        }
        break;
        
      case 'skill':
        if (userPreferences?.skillLevel) {
          candidates = candidates
            .filter(book => book.difficulty === userPreferences.skillLevel)
            .sort((a, b) => b.rating - a.rating)
            .slice(0, 6);
        } else {
          candidates = candidates
            .filter(book => book.difficulty === 'Beginner')
            .slice(0, 6);
        }
        break;
        
      case 'trending':
        // Mock trending algorithm - in real app would use actual metrics
        candidates = candidates
          .sort((a, b) => {
            const scoreA = b.rating * 0.7 + (b.featured ? 0.3 : 0);
            const scoreB = a.rating * 0.7 + (a.featured ? 0.3 : 0);
            return scoreA - scoreB;
          })
          .slice(0, 6);
        break;
        
      case 'featured':
      default:
        candidates = candidates
          .filter(book => book.featured)
          .sort((a, b) => b.rating - a.rating)
          .slice(0, 6);
        break;
    }
    
    return candidates.slice(0, 6);
  }, [books, currentBookId, selectedAlgorithm, userPreferences]);

  const calculateSimilarityScore = (book1: Book, book2: Book): number => {
    let score = 0;
    
    // Category match (highest weight)
    if (book1.category === book2.category) score += 40;
    
    // Difficulty level similarity
    const difficultyLevels = ['Beginner', 'Intermediate', 'Advanced'];
    const diff1Index = difficultyLevels.indexOf(book1.difficulty);
    const diff2Index = difficultyLevels.indexOf(book2.difficulty);
    const difficultyDistance = Math.abs(diff1Index - diff2Index);
    score += (2 - difficultyDistance) * 15; // 30, 15, or 0 points
    
    // Tag overlap
    const commonTags = book1.tags.filter(tag => book2.tags.includes(tag));
    score += commonTags.length * 5;
    
    // Rating bonus
    score += book2.rating * 2;
    
    return score;
  };

  const getAlgorithmDescription = () => {
    switch (selectedAlgorithm) {
      case 'similar':
        return 'Books similar to the current selection';
      case 'skill':
        return 'Books matching your skill level';
      case 'trending':
        return 'Popular and highly-rated books';
      case 'featured':
        return 'Our hand-picked recommendations';
      default:
        return '';
    }
  };

  const getAlgorithmIcon = () => {
    switch (selectedAlgorithm) {
      case 'similar':
        return <Target className="w-4 h-4" />;
      case 'skill':
        return <Award className="w-4 h-4" />;
      case 'trending':
        return <TrendingUp className="w-4 h-4" />;
      case 'featured':
        return <Star className="w-4 h-4" />;
      default:
        return <BookOpen className="w-4 h-4" />;
    }
  };

  if (recommendedBooks.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="w-5 h-5" />
          Recommended for You
        </CardTitle>
        
        {/* Algorithm Selection */}
        <div className="flex flex-wrap gap-2">
          {([
            { key: 'similar', label: 'Similar Books', icon: <Target className="w-3 h-3" /> },
            { key: 'skill', label: 'Your Level', icon: <Award className="w-3 h-3" /> },
            { key: 'trending', label: 'Trending', icon: <TrendingUp className="w-3 h-3" /> },
            { key: 'featured', label: 'Featured', icon: <Star className="w-3 h-3" /> }
          ] as Array<{ key: 'similar' | 'skill' | 'trending' | 'featured'; label: string; icon: JSX.Element }>).map(({ key, label, icon }) => (
            <Button
              key={key}
              variant={selectedAlgorithm === key ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedAlgorithm(key)}
              className="text-xs"
            >
              {icon}
              <span className="ml-1">{label}</span>
            </Button>
          ))}
        </div>
        
        <p className="text-sm text-muted-foreground flex items-center gap-2">
          {getAlgorithmIcon()}
          {getAlgorithmDescription()}
        </p>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {recommendedBooks.map(book => (
            <div
              key={book.id}
              className="group cursor-pointer"
              onClick={() => onSelectBook(book.id)}
            >
              <div className="aspect-[2/3] bg-gradient-to-br from-muted/20 to-muted/40 rounded-lg overflow-hidden mb-2 group-hover:shadow-lg transition-all duration-200">
                <BookCoverImage
                  src={book.coverImage || `/api/placeholder/200/300`}
                  title={book.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                />
              </div>
              
              <div className="space-y-1">
                <h4 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors">
                  {book.title}
                </h4>
                
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star
                      key={i}
                      className={`w-3 h-3 ${
                        i < Math.floor(book.rating)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-muted-foreground/30'
                      }`}
                    />
                  ))}
                  <span className="text-xs text-muted-foreground ml-1">
                    {book.rating}
                  </span>
                </div>
                
                <div className="flex flex-wrap gap-1">
                  <Badge variant="secondary" className="text-xs px-1 py-0">
                    {book.category}
                  </Badge>
                  <Badge 
                    variant="outline" 
                    className={`text-xs px-1 py-0 ${
                      book.difficulty === 'Beginner' ? 'border-green-200' :
                      book.difficulty === 'Intermediate' ? 'border-yellow-200' :
                      'border-red-200'
                    }`}
                  >
                    {book.difficulty}
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {recommendedBooks.length === 6 && (
          <div className="text-center mt-4">
            <Button variant="outline" size="sm">
              View More Recommendations
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};