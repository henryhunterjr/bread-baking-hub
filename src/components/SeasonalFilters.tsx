import { Search, Filter, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Season, Category, Difficulty, getCurrentSeason } from '@/hooks/useSeasonalRecipes';
interface SeasonalFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedSeason: Season | 'All';
  onSeasonChange: (season: Season | 'All') => void;
  selectedCategory: Category | 'All';
  onCategoryChange: (category: Category | 'All') => void;
  selectedDifficulty: Difficulty | 'All';
  onDifficultyChange: (difficulty: Difficulty | 'All') => void;
  resultCount: number;
}
const getSeasonalPlaceholder = (season: Season) => {
  const seasonalPlaceholders = {
    Winter: "Search for hearty winter breads...",
    Spring: "Find fresh spring recipes...",
    Summer: "Discover light summer breads...",
    Fall: "Explore harvest season favorites..."
  };
  return seasonalPlaceholders[season];
};
export const SeasonalFilters = ({
  searchQuery,
  onSearchChange,
  selectedSeason,
  onSeasonChange,
  selectedCategory,
  onCategoryChange,
  selectedDifficulty,
  onDifficultyChange,
  resultCount
}: SeasonalFiltersProps) => {
  const currentSeason = getCurrentSeason();
  const hasActiveFilters = selectedSeason !== 'All' || selectedCategory !== 'All' || selectedDifficulty !== 'All' || searchQuery;
  const clearAllFilters = () => {
    onSearchChange('');
    onSeasonChange('All');
    onCategoryChange('All');
    onDifficultyChange('All');
  };
  return <div className="space-y-6">
      {/* Enhanced Search Bar - More Prominent */}
      <div className="relative bg-gradient-to-br from-amber-600 to-amber-700 rounded-xl border-2 border-amber-500 p-4 shadow-xl">
        <div className="text-center mb-4">
          <h3 className="font-bold text-white mb-1 text-4xl">Find Your Perfect Recipe</h3>
          <p className="text-amber-100 text-xl font-semibold text-center">Search by name, ingredients, or description</p>
        </div>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-700 w-6 h-6" />
          <Input placeholder={getSeasonalPlaceholder(currentSeason)} value={searchQuery} onChange={e => onSearchChange(e.target.value)} className="pl-12 pr-12 h-14 text-lg font-medium border-2 border-amber-200 focus:border-amber-300 bg-white/95 backdrop-blur-sm text-slate-900 placeholder:text-slate-600" />
          {searchQuery && <Button variant="ghost" size="sm" className="absolute right-2 top-1/2 transform -translate-y-1/2 hover:bg-primary/10" onClick={() => onSearchChange('')}>
              <X className="w-5 h-5" />
            </Button>}
        </div>
        <div className="mt-3 text-sm font-medium text-amber-100 text-center">
          Try searching for "cinnamon", "sourdough", "whole wheat", or "holiday bread"
        </div>
      </div>

      {/* Filter Controls */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Season Filter */}
        <Select value={selectedSeason} onValueChange={value => onSeasonChange(value as Season | 'All')}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Season" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Seasons</SelectItem>
            <SelectItem value="Winter">Winter</SelectItem>
            <SelectItem value="Spring">Spring</SelectItem>
            <SelectItem value="Summer">Summer</SelectItem>
            <SelectItem value="Fall">Fall</SelectItem>
          </SelectContent>
        </Select>

        {/* Category Filter */}
        <Select value={selectedCategory} onValueChange={value => onCategoryChange(value as Category | 'All')}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Categories</SelectItem>
            <SelectItem value="yeast bread">Yeast Bread</SelectItem>
            <SelectItem value="quick bread">Quick Bread</SelectItem>
            <SelectItem value="sourdough">Sourdough</SelectItem>
            <SelectItem value="enriched">Enriched</SelectItem>
            <SelectItem value="holiday bread">Holiday Bread</SelectItem>
            <SelectItem value="whole grain">Whole Grain</SelectItem>
          </SelectContent>
        </Select>

        {/* Difficulty Filter */}
        <Select value={selectedDifficulty} onValueChange={value => onDifficultyChange(value as Difficulty | 'All')}>
          <SelectTrigger className="w-36">
            <SelectValue placeholder="Difficulty" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Levels</SelectItem>
            <SelectItem value="beginner">Beginner</SelectItem>
            <SelectItem value="intermediate">Intermediate</SelectItem>
            <SelectItem value="advanced">Advanced</SelectItem>
          </SelectContent>
        </Select>

        {/* Advanced Filters Popover */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="icon">
              <Filter className="w-4 h-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="space-y-4">
              <h4 className="font-medium">Advanced Filters</h4>
              <div className="text-sm text-muted-foreground">
                More filtering options coming soon! Use the search bar to find recipes by ingredients.
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {/* Clear Filters */}
        {hasActiveFilters && <Button variant="ghost" size="sm" onClick={clearAllFilters}>
            <X className="w-4 h-4 mr-1" />
            Clear All
          </Button>}
      </div>

      {/* Active Filters & Results */}
      <div className="flex flex-wrap items-center gap-2">
        {selectedSeason !== 'All' && <Badge variant="secondary">
            Season: {selectedSeason}
            <Button variant="ghost" size="sm" className="h-auto p-0 ml-1" onClick={() => onSeasonChange('All')}>
              <X className="w-3 h-3" />
            </Button>
          </Badge>}
        {selectedCategory !== 'All' && <Badge variant="secondary">
            Category: {selectedCategory}
            <Button variant="ghost" size="sm" className="h-auto p-0 ml-1" onClick={() => onCategoryChange('All')}>
              <X className="w-3 h-3" />
            </Button>
          </Badge>}
        {selectedDifficulty !== 'All' && <Badge variant="secondary">
            Difficulty: {selectedDifficulty}
            <Button variant="ghost" size="sm" className="h-auto p-0 ml-1" onClick={() => onDifficultyChange('All')}>
              <X className="w-3 h-3" />
            </Button>
          </Badge>}
        
        <div className="ml-auto text-sm text-muted-foreground">
          {resultCount} recipe{resultCount !== 1 ? 's' : ''} found
        </div>
      </div>
    </div>;
};