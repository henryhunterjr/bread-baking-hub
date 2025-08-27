import * as React from 'react';
import { Search, X, Clock, TrendingUp, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useDebounce } from '@/hooks/useDebounce';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { SafeImage } from '@/components/ui/SafeImage';
import { useAuth } from '@/hooks/useAuth';
import { log, warn, error } from '@/lib/logger';

interface SearchSuggestion {
  id: string;
  title: string;
  type: 'recipe' | 'blog_post' | 'glossary_term';
  excerpt?: string;
  image_url?: string;
  url: string;
  search_rank?: number;
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
  const { user } = useAuth();
  const [query, setQuery] = React.useState('');
  const [suggestions, setSuggestions] = React.useState<SearchSuggestion[]>([]);
  const [recentSearches, setRecentSearches] = React.useState<string[]>([]);
  const [popularSearches, setPopularSearches] = React.useState<string[]>([]);
  const [isOpen, setIsOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [selectedFilters, setSelectedFilters] = React.useState<string[]>([]);
  const [clientCache, setClientCache] = React.useState<{posts: any[]; recipes: any[]}>({posts: [], recipes: []});
  
  const debouncedQuery = useDebounce(query, 200);
  const searchRef = React.useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  
  // Load recent searches from localStorage
  React.useEffect(() => {
    const stored = localStorage.getItem('recent-searches');
    if (stored) {
      setRecentSearches(JSON.parse(stored));
    }
  }, []);

  // Preload lightweight client cache for fallback search
  React.useEffect(() => {
    let cancelled = false;
    const loadCache = async () => {
      try {
        // Load small payloads: title, slug, excerpt, tags, image
        const { data: posts, error: pErr } = await supabase
          .from('blog_posts')
          .select('id,title,slug,subtitle,tags,hero_image_url,published_at,is_draft')
          .eq('is_draft', false)
          .not('published_at', 'is', null)
          .limit(250);
        if (pErr) warn('blog_posts preload error', pErr);

        const { data: recipes, error: rErr } = await supabase
          .from('recipes')
          .select('id,title,slug,tags,image_url,data,is_public')
          .eq('is_public', true)
          .limit(250);
        if (rErr) warn('recipes preload error', rErr);

        if (!cancelled) {
          setClientCache({
            posts: posts ?? [],
            recipes: recipes ?? []
          });
          // Log preload telemetry
          log('preload', { posts: (posts ?? []).length, recipes: (recipes ?? []).length });
        }
      } catch (e) {
        error('preload failed', e);
      }
    };
    loadCache();
    return () => { cancelled = true; };
  }, []);

  // Load popular searches - only for admin users
  React.useEffect(() => {
    const loadPopularSearches = async () => {
      try {
        // Check if user is admin before attempting to query search_analytics
        if (!user?.id) return;
        
        const { data: profile } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('user_id', user.id)
          .single();
          
        if (!profile?.is_admin) return;
        
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
        error('Error loading popular searches:', error);
      }
    };

    loadPopularSearches();
  }, [user]);

  // Helper function to check if user is admin
  const isUserAdmin = React.useCallback(async () => {
    if (!user?.id) return false;
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('user_id', user.id)
        .single();
      return profile?.is_admin || false;
    } catch {
      return false;
    }
  }, [user]);
  // Client-side fallback search
  const clientFilter = React.useCallback((q: string) => {
    if (!q.trim()) return [];
    const tokens = q.toLowerCase().split(/\s+/).filter(Boolean);
    
    const match = (text: string, tags: string[] = []) => 
      tokens.every(t =>
        text.toLowerCase().includes(t) || 
        tags.some(tag => tag.toLowerCase().includes(t))
      );

    const score = (title: string, excerpt: string, tags: string[] = []) => {
      const hayTitle = title.toLowerCase();
      const hayExcerpt = (excerpt || '').toLowerCase();
      const hayTags = tags.map(t => t.toLowerCase());
      let s = 0;
      
      tokens.forEach(t => {
        if (hayTitle.includes(t)) s += 2;     // Title matches (+2) - highest priority
        if (hayTags.some(tag => tag.includes(t))) s += 1.5; // Tag matches (+1.5) - high priority  
        if (hayExcerpt.includes(t)) s += 1;   // Excerpt matches (+1) - medium priority
      });
      return s;
    };

    const postResults = clientCache.posts
      .filter(p => match(`${p.title} ${p.excerpt || ''}`, p.tags || []))
      .map(p => ({
        id: p.id,
        title: p.title,
        type: 'blog_post' as const,
        excerpt: p.excerpt || '',
        image_url: p.hero_image_url,
        url: `/blog/${p.slug}`,
        search_rank: score(p.title, p.excerpt, p.tags)
      }));

    const recResults = clientCache.recipes
      .filter(r => match(`${r.title} ${r.data?.description || ''}`, r.tags || []))
      .map(r => ({
        id: r.id,
        title: r.title,
        type: 'recipe' as const,
        excerpt: r.data?.description || '',
        image_url: r.image_url,
        url: `/recipes/${r.slug ?? r.id}`,
        search_rank: score(r.title, r.data?.description || '', r.tags)
      }));

    return [...postResults, ...recResults]
      .sort((a, b) => (b.search_rank ?? 0) - (a.search_rank ?? 0))
      .slice(0, 8);
  }, [clientCache]);

  // Search suggestions
  React.useEffect(() => {
    if (!debouncedQuery.trim()) {
      setSuggestions([]);
      return;
    }

    let cancelled = false;
    const searchContent = async () => {
      setIsLoading(true);
      try {
        const merged: SearchSuggestion[] = [];

        // Try server-side search first with error handling
        try {
          const { data: recipes, error: rErr } = await supabase.rpc('search_recipes', {
            search_query: debouncedQuery,
            limit_count: 5
          });
          if (rErr) throw rErr;

          if (recipes) {
            merged.push(...recipes.map((r: any) => ({
              id: r.id,
              title: r.title,
              type: 'recipe' as const,
              excerpt: r.excerpt ?? '',
              image_url: r.image_url,
              url: `/recipes/${r.slug ?? r.id}`,
              search_rank: r.search_rank ?? 0
            })));
          }
        } catch (rpcError) {
          warn('search_recipes RPC failed:', rpcError);
        }

        try {
          const { data: posts, error: pErr } = await supabase.rpc('search_blog_posts', {
            search_query: debouncedQuery,
            limit_count: 5
          });
          if (pErr) throw pErr;

          if (posts) {
            merged.push(...posts.map((p: any) => ({
              id: p.id,
              title: p.title,
              type: 'blog_post' as const,
              excerpt: p.excerpt ?? '',
              image_url: p.hero_image_url,
              url: `/blog/${p.slug}`,
              search_rank: p.search_rank ?? 0
            })));
          }
        } catch (rpcError) {
          warn('search_blog_posts RPC failed:', rpcError);
        }

        // Add glossary terms
        const glossaryMatches = searchGlossaryTerms(debouncedQuery);
        merged.push(...glossaryMatches.slice(0, 2));

        // Strict fallback trigger: use client search only if server results are empty
        const mergedCount = merged.length;
        const usingFallback = mergedCount === 0;
        let final: SearchSuggestion[];
        if (usingFallback) {
          final = clientFilter(debouncedQuery);
        } else {
          final = merged.sort((a, b) => (b.search_rank ?? 0) - (a.search_rank ?? 0)).slice(0, 8);
        }
        
        // Log search telemetry
        log('globalSearch', {
          q: debouncedQuery,
          mergedCount,
          localPosts: clientCache.posts.length,
          localRecipes: clientCache.recipes.length,
          usingFallback
        });

        if (!cancelled) setSuggestions(final);
      } catch (error) {
        error('Search error:', error);
        // Fallback to client search on any error
        if (!cancelled) setSuggestions(clientFilter(debouncedQuery));
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    searchContent();
    return () => { cancelled = true; };
  }, [debouncedQuery, clientFilter]);

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

    // Log search analytics (only for admin users)
    try {
      if (user?.id) {
        const adminCheck = await isUserAdmin();
        if (adminCheck) {
          await supabase.from('search_analytics').insert({
            search_query: searchQuery,
            search_type: 'global',
            results_count: suggestions.length,
            filters_applied: JSON.stringify({ filters: selectedFilters }),
            search_context: window.location.pathname
          });
        }
      }
    } catch (error) {
      warn('Failed to log search analytics:', error);
    }

    // Navigate to search results page using React Router
    navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    setIsOpen(false);
  }, [recentSearches, suggestions.length, selectedFilters, navigate, isUserAdmin]);

  const handleSuggestionClick = React.useCallback(async (suggestion: SearchSuggestion) => {
    // Log click analytics (only for admin users)
    try {
      if (user?.id) {
        const adminCheck = await isUserAdmin();
        if (adminCheck) {
          await supabase.from('search_analytics').insert({
            search_query: query,
            search_type: 'global',
            clicked_result_id: suggestion.id,
            clicked_result_type: suggestion.type,
            search_context: window.location.pathname
          });
        }
      }
    } catch (error) {
      warn('Failed to log click analytics:', error);
    }

    if (onResultClick) {
      onResultClick(suggestion);
    } else {
      navigate(suggestion.url);
    }
    setIsOpen(false);
  }, [query, onResultClick, navigate, isUserAdmin]);

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
              e.preventDefault();
              handleSearch(query);
            } else if (e.key === 'Escape') {
              clearSearch();
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
                <div className="text-sm">Searching…</div>
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
                       <SafeImage
                         src={suggestion.image_url || '/images/placeholder.png'}
                         alt={suggestion.title}
                         width={48}
                         height={48}
                         fit="cover"
                         className="rounded flex-shrink-0"
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