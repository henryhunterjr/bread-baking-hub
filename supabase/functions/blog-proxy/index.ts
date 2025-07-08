import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// In-memory cache with 15-minute TTL
interface CacheEntry {
  data: any;
  timestamp: number;
  totalPages?: number;
}

const cache = new Map<string, CacheEntry>();
const CACHE_TTL = 15 * 60 * 1000; // 15 minutes in milliseconds

const getCacheKey = (endpoint: string, page?: string, perPage?: string, categoryId?: string) => {
  const params = new URLSearchParams();
  if (page) params.set('page', page);
  if (perPage) params.set('per_page', perPage);
  if (categoryId) params.set('categories', categoryId);
  
  return `${endpoint}?${params.toString()}`;
};

const isCacheValid = (entry: CacheEntry): boolean => {
  return Date.now() - entry.timestamp < CACHE_TTL;
};

const getCachedData = (cacheKey: string): CacheEntry | null => {
  const entry = cache.get(cacheKey);
  if (entry && isCacheValid(entry)) {
    console.log('Cache hit for:', cacheKey);
    return entry;
  }
  
  if (entry) {
    cache.delete(cacheKey);
    console.log('Cache expired for:', cacheKey);
  }
  
  return null;
};

const setCachedData = (cacheKey: string, data: any, totalPages?: number): void => {
  cache.set(cacheKey, {
    data,
    timestamp: Date.now(),
    totalPages
  });
  console.log('Cached data for:', cacheKey);
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const url = new URL(req.url)
    const endpoint = url.searchParams.get('endpoint')
    const page = url.searchParams.get('page') || '1'
    const perPage = url.searchParams.get('per_page') || '6'
    const categoryId = url.searchParams.get('categories')

    if (!endpoint) {
      return new Response(
        JSON.stringify({ error: 'Missing endpoint parameter' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Generate cache key
    const cacheKey = getCacheKey(endpoint, page, perPage, categoryId);
    
    // Check cache first
    const cachedEntry = getCachedData(cacheKey);
    if (cachedEntry) {
      return new Response(
        JSON.stringify({
          data: cachedEntry.data,
          totalPages: cachedEntry.totalPages || 1,
          currentPage: parseInt(page),
          cached: true
        }),
        {
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
            'X-Cache': 'HIT'
          }
        }
      );
    }

    let fetchUrl = `https://bakinggreatbread.blog/wp-json/wp/v2/${endpoint}`
    
    if (endpoint === 'posts') {
      fetchUrl += `?_embed&page=${page}&per_page=${perPage}`
      if (categoryId) {
        fetchUrl += `&categories=${categoryId}`
      }
    } else if (endpoint === 'categories') {
      fetchUrl += `?per_page=100`
    }

    console.log('Fetching from WordPress:', fetchUrl)

    const response = await fetch(fetchUrl, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'BakingGreatBread-Site/1.0'
      }
    })

    if (!response.ok) {
      throw new Error(`WordPress API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    const totalPages = response.headers.get('X-WP-TotalPages') || '1'
    
    // Cache the response
    setCachedData(cacheKey, data, parseInt(totalPages));

    return new Response(
      JSON.stringify({
        data,
        totalPages: parseInt(totalPages),
        currentPage: parseInt(page),
        cached: false
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
          'X-WP-TotalPages': totalPages,
          'X-Cache': 'MISS'
        }
      }
    )
  } catch (error) {
    console.error('Blog proxy error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})