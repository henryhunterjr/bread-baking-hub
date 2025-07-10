import { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Search, Filter, Star, Calendar, BookOpen } from 'lucide-react';

interface Book {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  category: string;
  author: string;
  publicationYear: number;
  rating: number;
  featured: boolean;
  tags: string[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  format: 'Physical' | 'Digital' | 'Both';
  amazonUrl?: string;
  landingPageUrl?: string;
  coverImage: string;
  previewContent: string;
}

interface BookSearchAndFilterProps {
  books: Book[];
  onFilteredBooks: (books: Book[]) => void;
  onPreview: (bookId: string) => void;
}

export const BookSearchAndFilter = ({ books, onFilteredBooks, onPreview }: BookSearchAndFilterProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedFormat, setSelectedFormat] = useState('all');
  const [sortBy, setSortBy] = useState('featured'); // featured, title, rating, year

  // Extract unique values for filters
  const categories = useMemo(() => 
    ['all', ...Array.from(new Set(books.map(book => book.category)))], 
    [books]
  );
  
  const difficulties = ['all', 'Beginner', 'Intermediate', 'Advanced'];
  const formats = ['all', 'Physical', 'Digital', 'Both'];

  // Filter and sort books
  const filteredAndSortedBooks = useMemo(() => {
    let filtered = books.filter(book => {
      const matchesSearch = searchTerm === '' || 
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.subtitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesCategory = selectedCategory === 'all' || book.category === selectedCategory;
      const matchesDifficulty = selectedDifficulty === 'all' || book.difficulty === selectedDifficulty;
      const matchesFormat = selectedFormat === 'all' || book.format === selectedFormat;

      return matchesSearch && matchesCategory && matchesDifficulty && matchesFormat;
    });

    // Sort books
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'rating':
          return b.rating - a.rating;
        case 'year':
          return b.publicationYear - a.publicationYear;
        case 'featured':
        default:
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return b.rating - a.rating; // Secondary sort by rating
      }
    });

    return filtered;
  }, [books, searchTerm, selectedCategory, selectedDifficulty, selectedFormat, sortBy]);

  // Update parent component when filters change
  useMemo(() => {
    onFilteredBooks(filteredAndSortedBooks);
  }, [filteredAndSortedBooks, onFilteredBooks]);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSelectedDifficulty('all');
    setSelectedFormat('all');
    setSortBy('featured');
  };

  const activeFiltersCount = [
    searchTerm !== '',
    selectedCategory !== 'all',
    selectedDifficulty !== 'all',
    selectedFormat !== 'all'
  ].filter(Boolean).length;

  return (
    <div className="space-y-6">
      {/* Search and Sort Controls */}
      <Card>
        <CardContent className="p-4 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search books by title, subtitle, or tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Sort */}
            <div className="w-full sm:w-48">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Featured First</SelectItem>
                  <SelectItem value="title">Title A-Z</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="year">Newest First</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Filter Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            <div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category === 'all' ? 'All Categories' : category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                <SelectTrigger>
                  <SelectValue placeholder="Difficulty" />
                </SelectTrigger>
                <SelectContent>
                  {difficulties.map(difficulty => (
                    <SelectItem key={difficulty} value={difficulty}>
                      {difficulty === 'all' ? 'All Levels' : difficulty}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Select value={selectedFormat} onValueChange={setSelectedFormat}>
                <SelectTrigger>
                  <SelectValue placeholder="Format" />
                </SelectTrigger>
                <SelectContent>
                  {formats.map(format => (
                    <SelectItem key={format} value={format}>
                      {format === 'all' ? 'All Formats' : format}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button 
              variant="outline" 
              onClick={clearFilters}
              className="w-full"
              disabled={activeFiltersCount === 0}
            >
              <Filter className="w-4 h-4 mr-2" />
              Clear {activeFiltersCount > 0 && `(${activeFiltersCount})`}
            </Button>
          </div>

          {/* Results Summary */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground border-t pt-4">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              <span>{filteredAndSortedBooks.length} of {books.length} books</span>
            </div>
            
            {/* Active Filters Display */}
            {activeFiltersCount > 0 && (
              <div className="flex flex-wrap gap-2">
                {searchTerm && (
                  <Badge variant="secondary" className="text-xs">
                    Search: "{searchTerm}"
                  </Badge>
                )}
                {selectedCategory !== 'all' && (
                  <Badge variant="secondary" className="text-xs">
                    Category: {selectedCategory}
                  </Badge>
                )}
                {selectedDifficulty !== 'all' && (
                  <Badge variant="secondary" className="text-xs">
                    Level: {selectedDifficulty}
                  </Badge>
                )}
                {selectedFormat !== 'all' && (
                  <Badge variant="secondary" className="text-xs">
                    Format: {selectedFormat}
                  </Badge>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quick Filters */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={selectedCategory === 'Sourdough' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setSelectedCategory(selectedCategory === 'Sourdough' ? 'all' : 'Sourdough')}
        >
          Sourdough Books
        </Button>
        <Button
          variant={selectedDifficulty === 'Beginner' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setSelectedDifficulty(selectedDifficulty === 'Beginner' ? 'all' : 'Beginner')}
        >
          Beginner Friendly
        </Button>
        <Button
          variant={sortBy === 'rating' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setSortBy('rating')}
        >
          <Star className="w-4 h-4 mr-1" />
          Top Rated
        </Button>
        <Button
          variant={sortBy === 'year' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setSortBy('year')}
        >
          <Calendar className="w-4 h-4 mr-1" />
          Latest
        </Button>
      </div>
    </div>
  );
};