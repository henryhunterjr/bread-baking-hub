import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, Filter, X, Clock, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { supabase } from '@/integrations/supabase/client';
import { ImageWithFallback } from '@/components/ui/ImageWithFallback';
import { logger } from '@/utils/logger';

interface SearchResult {
  id: string;
  title: string;
  excerpt: string;
  type: 'recipe' | 'blog_post' | 'glossary_term';
  url: string;
  image_url?: string;
  tags?: string[];
  published_at?: string;
  search_rank?: number;
}

interface SearchFilters {
  contentType: 'all' | 'recipe' | 'blog_post' | 'glossary_term';
  dietaryRestrictions: string[];
  difficulty: string;
  prepTime: string;
  totalTime: string;
  blogTags: string[];
}

const SearchResultsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [totalResults, setTotalResults] = useState(0);

  const [filters, setFilters] = useState<SearchFilters>({
    contentType: 'all',
    dietaryRestrictions: [],
    difficulty: '',
    prepTime: '',
    totalTime: '',
    blogTags: []
  });

  const dietaryOptions = [
    'gluten-free', 'vegan', 'vegetarian', 'dairy-free', 'keto', 'low-carb', 'sourdough'
  ];

  const difficultyOptions = ['beginner', 'intermediate', 'advanced'];

  // Perform search when query or filters change
  useEffect(() => {
    if (query.trim()) {
      performSearch();
    }
  }, [query, filters]);

  // Update URL when query changes
  useEffect(() => {
    if (query) {
      setSearchParams({ q: query });
    }
  }, [query, setSearchParams]);

  const performSearch = async () => {
    setIsLoading(true);
    try {
      const allResults: SearchResult[] = [];
      let hasErrors = false;

      // Search recipes if not filtering to specific type
      if (filters.contentType === 'all' || filters.contentType === 'recipe') {
        try {
          const { data: recipes, error } = await supabase.rpc('search_recipes', {
            search_query: query,
            dietary_filters: filters.dietaryRestrictions,
            difficulty_filter: filters.difficulty || null,
            prep_time_max: filters.prepTime ? parseInt(filters.prepTime) : null,
            total_time_max: filters.totalTime ? parseInt(filters.totalTime) : null,
            limit_count: 20
          });

          if (error) {
            logger.error('Recipe search RPC error:', error);
            hasErrors = true;
          } else if (recipes) {
            allResults.push(...recipes.map(recipe => ({
              id: recipe.id,
              title: recipe.title,
              excerpt: recipe.excerpt || '',
              type: 'recipe' as const,
              url: `/recipes/${recipe.slug}`,
              image_url: recipe.image_url,
              tags: recipe.tags,
              search_rank: recipe.search_rank
            })));
          }
        } catch (error) {
          logger.error('Recipe search failed:', error);
          hasErrors = true;
        }
      }

      // Search blog posts
      if (filters.contentType === 'all' || filters.contentType === 'blog_post') {
        try {
          const { data: posts, error } = await supabase.rpc('search_blog_posts', {
            search_query: query,
            tag_filters: filters.blogTags,
            limit_count: 20
          });

          if (error) {
            logger.error('Blog search RPC error:', error);
            hasErrors = true;
          } else if (posts) {
            allResults.push(...posts.map(post => ({
              id: post.id,
              title: post.title,
              excerpt: post.excerpt || '',
              type: 'blog_post' as const,
              url: `/blog/${post.slug}`,
              image_url: post.hero_image_url,
              tags: post.tags,
              published_at: post.published_at,
              search_rank: post.search_rank
            })));
          }
        } catch (error) {
          logger.error('Blog search failed:', error);
          hasErrors = true;
        }
      }

      // Search glossary terms (mock for now)
      if (filters.contentType === 'all' || filters.contentType === 'glossary_term') {
        const glossaryResults = searchGlossaryTerms(query);
        allResults.push(...glossaryResults);
      }

      // Sort by relevance (search_rank desc), then by published date (desc)
      allResults.sort((a, b) => {
        const rankDiff = (b.search_rank || 0) - (a.search_rank || 0);
        if (rankDiff !== 0) return rankDiff;
        
        // Secondary sort by published date (most recent first)
        const aDate = a.published_at ? new Date(a.published_at).getTime() : 0;
        const bDate = b.published_at ? new Date(b.published_at).getTime() : 0;
        return bDate - aDate;
      });

      setResults(allResults);
      setTotalResults(allResults.length);

      // Log search analytics
      try {
        await supabase.from('search_analytics').insert({
          search_query: query,
          search_type: 'advanced',
          results_count: allResults.length,
          filters_applied: JSON.stringify(filters),
          search_context: 'search_page'
        });
      } catch (error) {
        logger.warn('Failed to log search analytics:', error);
      }

      // Show fallback message if all RPCs failed
      if (hasErrors && allResults.length === 0) {
        logger.warn('All search RPCs failed, showing fallback message');
      }

    } catch (error) {
      logger.error('Search error:', error);
      setResults([]);
      setTotalResults(0);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      contentType: 'all',
      dietaryRestrictions: [],
      difficulty: '',
      prepTime: '',
      totalTime: '',
      blogTags: []
    });
  };

  const highlightText = (text: string, query: string) => {
    if (!query.trim()) return text;
    
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <mark key={index} className="bg-amber-200 dark:bg-amber-800 px-1 rounded">
          {part}
        </mark>
      ) : part
    );
  };

  const filteredResultsByType = {
    all: results,
    recipe: results.filter(r => r.type === 'recipe'),
    blog_post: results.filter(r => r.type === 'blog_post'),
    glossary_term: results.filter(r => r.type === 'glossary_term')
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Search Results</h1>
          
          {/* Search Input */}
          <div className="flex gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search recipes, articles, and glossary..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              Filters
            </Button>
          </div>

          {/* Results Summary */}
          <div className="flex items-center justify-between">
            <p className="text-muted-foreground">
              {isLoading ? 'Searching...' : `${totalResults} results for "${query}"`}
            </p>
            {Object.values(filters).some(f => Array.isArray(f) ? f.length > 0 : f) && (
              <Button variant="ghost" onClick={clearFilters} className="text-sm">
                <X className="h-4 w-4 mr-1" />
                Clear filters
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          {showFilters && (
            <Card className="lg:col-span-1 h-fit">
              <CardHeader>
                <CardTitle className="text-lg">Filters</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Content Type */}
                <div>
                  <Label className="text-sm font-medium mb-3 block">Content Type</Label>
                  <Select
                    value={filters.contentType}
                    onValueChange={(value: any) => handleFilterChange('contentType', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Content</SelectItem>
                      <SelectItem value="recipe">Recipes</SelectItem>
                      <SelectItem value="blog_post">Articles</SelectItem>
                      <SelectItem value="glossary_term">Glossary</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Recipe Filters */}
                {(filters.contentType === 'all' || filters.contentType === 'recipe') && (
                  <>
                    <Separator />
                    <div>
                      <Label className="text-sm font-medium mb-3 block">Dietary Restrictions</Label>
                      <div className="space-y-2">
                        {dietaryOptions.map(option => (
                          <div key={option} className="flex items-center space-x-2">
                            <Checkbox
                              id={option}
                              checked={filters.dietaryRestrictions.includes(option)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  handleFilterChange('dietaryRestrictions', [...filters.dietaryRestrictions, option]);
                                } else {
                                  handleFilterChange('dietaryRestrictions', filters.dietaryRestrictions.filter(d => d !== option));
                                }
                              }}
                            />
                            <Label htmlFor={option} className="text-sm capitalize">
                              {option.replace('-', ' ')}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm font-medium mb-3 block">Difficulty</Label>
                      <Select
                        value={filters.difficulty}
                        onValueChange={(value) => handleFilterChange('difficulty', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Any difficulty" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">Any difficulty</SelectItem>
                          {difficultyOptions.map(option => (
                            <SelectItem key={option} value={option} className="capitalize">
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="text-sm font-medium mb-3 block">Max Prep Time (minutes)</Label>
                      <Select
                        value={filters.prepTime}
                        onValueChange={(value) => handleFilterChange('prepTime', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Any time" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">Any time</SelectItem>
                          <SelectItem value="15">15 minutes</SelectItem>
                          <SelectItem value="30">30 minutes</SelectItem>
                          <SelectItem value="60">1 hour</SelectItem>
                          <SelectItem value="120">2 hours</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          )}

          {/* Results */}
          <div className={showFilters ? "lg:col-span-3" : "lg:col-span-4"}>
            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Searching...</p>
              </div>
            ) : results.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-lg text-muted-foreground mb-4">
                  No results found for "{query}"
                </p>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">Try:</p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Checking your spelling</li>
                    <li>• Using different keywords</li>
                    <li>• Removing some filters</li>
                    <li>• Searching for broader terms</li>
                  </ul>
                  <p className="text-xs text-muted-foreground mt-4">
                    If you're experiencing search issues, please try again later.
                  </p>
                </div>
              </div>
            ) : (
              <Tabs value={filters.contentType} onValueChange={(value: any) => handleFilterChange('contentType', value)}>
                <TabsList className="grid w-full grid-cols-4 mb-6">
                  <TabsTrigger value="all">
                    All ({filteredResultsByType.all.length})
                  </TabsTrigger>
                  <TabsTrigger value="recipe">
                    Recipes ({filteredResultsByType.recipe.length})
                  </TabsTrigger>
                  <TabsTrigger value="blog_post">
                    Articles ({filteredResultsByType.blog_post.length})
                  </TabsTrigger>
                  <TabsTrigger value="glossary_term">
                    Glossary ({filteredResultsByType.glossary_term.length})
                  </TabsTrigger>
                </TabsList>

                {Object.entries(filteredResultsByType).map(([type, typeResults]) => (
                  <TabsContent key={type} value={type} className="space-y-4">
                    {typeResults.map((result) => (
                      <Card key={`${result.type}-${result.id}`} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-6">
                          <Link to={result.url} className="block group">
                            <div className="flex gap-4">
                              <div className="flex-shrink-0">
                                <ImageWithFallback
                                  src={result.image_url || ''}
                                  alt={result.title}
                                  className="w-24 h-24 rounded object-cover"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between mb-2">
                                  <h3 className="text-lg font-semibold group-hover:text-primary transition-colors line-clamp-2">
                                    {highlightText(result.title, query)}
                                  </h3>
                                  <Badge variant="secondary" className="ml-2 flex-shrink-0">
                                    {result.type.replace('_', ' ')}
                                  </Badge>
                                </div>
                                <p className="text-muted-foreground text-sm line-clamp-3 mb-3">
                                  {highlightText(result.excerpt, query)}
                                </p>
                                {result.tags && result.tags.length > 0 && (
                                  <div className="flex flex-wrap gap-1">
                                    {result.tags.slice(0, 3).map(tag => (
                                      <Badge key={tag} variant="outline" className="text-xs">
                                        {tag}
                                      </Badge>
                                    ))}
                                    {result.tags.length > 3 && (
                                      <Badge variant="outline" className="text-xs">
                                        +{result.tags.length - 3} more
                                      </Badge>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          </Link>
                        </CardContent>
                      </Card>
                    ))}
                  </TabsContent>
                ))}
              </Tabs>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

// Helper function to search static glossary data
function searchGlossaryTerms(query: string): SearchResult[] {
  // Mock glossary data - in production this would come from database
  const glossaryTerms = [
    { id: 'autolyse', term: 'Autolyse', definition: 'A resting period where flour and water are mixed and left to hydrate before adding other ingredients. This improves dough extensibility and reduces mixing time.' },
    { id: 'gluten', term: 'Gluten', definition: 'A protein network formed when flour proteins (glutenin and gliadin) combine with water and are developed through mixing or kneading.' },
    { id: 'hydration', term: 'Hydration', definition: 'The ratio of liquid to flour in a dough, expressed as a percentage. Higher hydration creates more open crumb structure but can be harder to handle.' },
    // Add more terms as needed
  ];

  const matches = glossaryTerms.filter(term =>
    term.term.toLowerCase().includes(query.toLowerCase()) ||
    term.definition.toLowerCase().includes(query.toLowerCase())
  );

  return matches.map(term => ({
    id: term.id,
    title: term.term,
    excerpt: term.definition,
    type: 'glossary_term' as const,
    url: `/glossary#${term.id}`,
    search_rank: term.term.toLowerCase().includes(query.toLowerCase()) ? 1 : 0.5
  }));
}

export default SearchResultsPage;