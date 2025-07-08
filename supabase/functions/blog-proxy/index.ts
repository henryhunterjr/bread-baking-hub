import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

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

    return new Response(
      JSON.stringify({
        data,
        totalPages: parseInt(totalPages),
        currentPage: parseInt(page)
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
          'X-WP-TotalPages': totalPages
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