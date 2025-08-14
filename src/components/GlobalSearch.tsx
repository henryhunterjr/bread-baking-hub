import * as React from 'react';
import { Search, X, Clock, TrendingUp, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useDebounce } from '@/hooks/useDebounce';
import { supabase } from '@/integrations/supabase/client';

interface SearchSuggestion {
  id: string;
  title: string;
  type: 'recipe' | 'blog_post' | 'glossary_term';
  excerpt?: string;
  image_url?: string;
  url: string;
}

interface GlobalSearchProps {
  onResultClick?: (result: SearchSuggestion) => void;
  placeholder?: string;
  showFilters?: boolean;
  className?: string;
}

export const GlobalSearch = ({ 
  onResultClick, 
  placeholder = "Search recipes, articles, and glossary...",
  showFilters = true,
  className = ""
}: GlobalSearchProps) => {
  const [query, setQuery] = React.useState('');
  const [suggestions, setSuggestions] = React.useState<SearchSuggestion[]>([]);
  const [recentSearches, setRecentSearches] = React.useState<string[]>([]);
  const [popularSearches, setPopularSearches] = React.useState<string[]>([]);
  const [isOpen, setIsOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [selectedFilters, setSelectedFilters] = React.useState<string[]>([]);
  
  const debouncedQuery = useDebounce(query, 300);
  const searchRef = React.useRef<HTMLDivElement>(null);
  
  // Load recent searches from localStorage
  React.useEffect(() => {
    const stored = localStorage.getItem('recent-searches');
    if (stored) {
      setRecentSearches(JSON.parse(stored));
    }
  }, []);

  // Load popular searches
  React.useEffect(() => {
    const loadPopularSearches = async () => {
      try {
        const { data } = await supabase
          .from('search_analytics')
          .select('search_query')
          .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
          .order('created_at', { ascending: false })
          .limit(10);
        
        if (data) {
          const queries = [...new Set(data.map(item => item.search_query))];
          setPopularSearches(queries.slice(0, 5));
        }
      } catch (error) {
        console.error('Error loading popular searches:', error);
      }
    };

    loadPopularSearches();
  }, []);

  // Search suggestions
  React.useEffect(() => {
    if (!debouncedQuery.trim()) {
      setSuggestions([]);
      return;
    }

    const searchContent = async () => {
      setIsLoading(true);
      try {
        const suggestions: SearchSuggestion[] = [];

        // Search recipes
        const { data: recipes } = await supabase.rpc('search_recipes', {
          search_query: debouncedQuery,
          limit_count: 3
        });

        if (recipes) {
          suggestions.push(...recipes.map(recipe => ({
            id: recipe.id,
            title: recipe.title,
            type: 'recipe' as const,
            excerpt: recipe.excerpt,
            image_url: recipe.image_url,
            url: `/recipe/${recipe.slug}`
          })));
        }

        // Search blog posts
        const { data: posts } = await supabase.rpc('search_blog_posts', {
          search_query: debouncedQuery,
          limit_count: 3
        });

        if (posts) {
          suggestions.push(...posts.map(post => ({
            id: post.id,
            title: post.title,
            type: 'blog_post' as const,
            excerpt: post.excerpt,
            image_url: post.hero_image_url,
            url: `/blog/${post.slug}`
          })));
        }

        // Search glossary terms (static data from BreadGlossary component)
        const glossaryMatches = searchGlossaryTerms(debouncedQuery);
        suggestions.push(...glossaryMatches.slice(0, 3));

        setSuggestions(suggestions);
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    searchContent();
  }, [debouncedQuery]);

  // Handle click outside to close
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = React.useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) return;

    // Save to recent searches
    const updated = [searchQuery, ...recentSearches.filter(s => s !== searchQuery)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recent-searches', JSON.stringify(updated));

    // Log search analytics
    await supabase.from('search_analytics').insert({
      search_query: searchQuery,
      search_type: 'global',
      results_count: suggestions.length,
      filters_applied: JSON.stringify({ filters: selectedFilters }),
      search_context: window.location.pathname
    });

    // Navigate to search results page
    window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
  }, [recentSearches, suggestions.length, selectedFilters]);

  const handleSuggestionClick = React.useCallback(async (suggestion: SearchSuggestion) => {
    // Log click analytics
    await supabase.from('search_analytics').insert({
      search_query: query,
      search_type: 'global',
      clicked_result_id: suggestion.id,
      clicked_result_type: suggestion.type,
      search_context: window.location.pathname
    });

    if (onResultClick) {
      onResultClick(suggestion);
    } else {
      window.location.href = suggestion.url;
    }
    setIsOpen(false);
  }, [query, onResultClick]);

  const clearSearch = () => {
    setQuery('');
    setSuggestions([]);
    setIsOpen(false);
  };

  const quickSearches = isOpen && !query.trim() ? [...recentSearches, ...popularSearches] : [];

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSearch(query);
            }
          }}
          className="pl-10 pr-10"
        />
        {query && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Search Dropdown */}
      {isOpen && (
        <Card className="absolute top-full left-0 right-0 mt-1 z-50 bg-background border shadow-lg max-h-[400px] overflow-hidden">
          <CardContent className="p-0">
            {/* Loading state */}
            {isLoading && (
              <div className="p-4 text-center text-muted-foreground">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
                <p className="mt-2">Searching...</p>
              </div>
            )}

            {/* Suggestions */}
            {!isLoading && suggestions.length > 0 && (
              <div className="max-h-80 overflow-y-auto">
                {suggestions.map((suggestion) => (
                  <button
                    key={`${suggestion.type}-${suggestion.id}`}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full p-3 text-left hover:bg-muted transition-colors flex items-start gap-3"
                  >
                    {suggestion.image_url && (
                      <img 
                        src={suggestion.image_url} 
                        alt=""
                        className="w-12 h-12 rounded object-cover flex-shrink-0"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-sm truncate">{suggestion.title}</h4>
                        <Badge variant="secondary" className="text-xs">
                          {suggestion.type.replace('_', ' ')}
                        </Badge>
                      </div>
                      {suggestion.excerpt && (
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {suggestion.excerpt}
                        </p>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Quick searches when no query */}
            {!isLoading && !query.trim() && quickSearches.length > 0 && (
              <div className="p-4">
                {recentSearches.length > 0 && (
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Recent</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {recentSearches.map((search, index) => (
                        <button
                          key={index}
                          onClick={() => handleSearch(search)}
                          className="text-xs px-2 py-1 bg-muted rounded hover:bg-muted/80 transition-colors"
                        >
                          {search}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {popularSearches.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Popular</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {popularSearches.map((search, index) => (
                        <button
                          key={index}
                          onClick={() => handleSearch(search)}
                          className="text-xs px-2 py-1 bg-muted rounded hover:bg-muted/80 transition-colors"
                        >
                          {search}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* No results */}
            {!isLoading && query.trim() && suggestions.length === 0 && (
              <div className="p-4 text-center text-muted-foreground">
                <p>No results found for "{query}"</p>
                <Button 
                  variant="link" 
                  onClick={() => handleSearch(query)}
                  className="mt-2"
                >
                  View all search results
                </Button>
              </div>
            )}

            {/* Search action */}
            {query.trim() && (
              <>
                <Separator />
                <div className="p-3">
                  <Button
                    onClick={() => handleSearch(query)}
                    variant="ghost"
                    className="w-full justify-start"
                  >
                    <Search className="h-4 w-4 mr-2" />
                    Search for "{query}"
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

// Helper function to search static glossary data
function searchGlossaryTerms(query: string): SearchSuggestion[] {
  const mockGlossaryTerms = [
    { id: 'autolyse', term: 'Autolyse', definition: 'A resting period where flour and water are mixed and left to hydrate...' },
    { id: 'gluten', term: 'Gluten', definition: 'A protein network formed when flour proteins combine with water...' },
    { id: 'hydration', term: 'Hydration', definition: 'The ratio of liquid to flour in a dough, expressed as a percentage...' },
  ];

  const matches = mockGlossaryTerms.filter(term =>
    term.term.toLowerCase().includes(query.toLowerCase()) ||
    term.definition.toLowerCase().includes(query.toLowerCase())
  );

  return matches.map(term => ({
    id: term.id,
    title: term.term,
    type: 'glossary_term' as const,
    excerpt: term.definition.substring(0, 100) + '...',
    url: `/glossary#${term.id}`
  }));
}

export default GlobalSearch;