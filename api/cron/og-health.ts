/**
 * OG Image Health Scanner
 * Scans latest 50 posts, validates OG images, captures dimensions
 */

import { NextRequest } from 'next/server'

export const runtime = 'edge'

interface OGHealthResult {
  url: string
  status: 'valid' | 'invalid' | 'missing' | 'error'
  width?: number
  height?: number
  size?: number
  responseTime?: number
  error?: string
}

interface PostSource {
  title: string
  slug: string
  ogImage?: string
  url: string
  source: 'supabase' | 'wordpress'
}

async function checkImageHealth(imageUrl: string): Promise<OGHealthResult> {
  const startTime = Date.now()
  
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 5000) // 5s timeout
    
    const response = await fetch(imageUrl, {
      method: 'HEAD',
      signal: controller.signal,
      headers: {
        'User-Agent': 'BakingGreatBread-OGHealthScanner/1.0'
      }
    })
    
    clearTimeout(timeoutId)
    const responseTime = Date.now() - startTime
    
    if (!response.ok) {
      return {
        url: imageUrl,
        status: 'invalid',
        responseTime,
        error: `HTTP ${response.status}`
      }
    }
    
    const contentType = response.headers.get('content-type')
    if (!contentType?.startsWith('image/')) {
      return {
        url: imageUrl,
        status: 'invalid',
        responseTime,
        error: 'Not an image'
      }
    }
    
    const contentLength = response.headers.get('content-length')
    const size = contentLength ? parseInt(contentLength) : undefined
    
    // Try to get dimensions from headers (some CDNs provide this)
    const width = response.headers.get('x-image-width')
    const height = response.headers.get('x-image-height')
    
    return {
      url: imageUrl,
      status: 'valid',
      width: width ? parseInt(width) : undefined,
      height: height ? parseInt(height) : undefined,
      size,
      responseTime
    }
  } catch (error: any) {
    return {
      url: imageUrl,
      status: 'error',
      responseTime: Date.now() - startTime,
      error: error.message
    }
  }
}

async function getLatestPosts(): Promise<PostSource[]> {
  const posts: PostSource[] = []
  
  try {
    // Try Supabase first
    const supabaseResponse = await fetch(
      `https://ojyckskucneljvuqzrsw.supabase.co/functions/v1/blog-proxy`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({
          endpoint: 'posts',
          page: '1',
          per_page: '25'
        })
      }
    )
    
    if (supabaseResponse.ok) {
      const supabaseData = await supabaseResponse.json()
      const wpPosts = supabaseData.data || []
      
      posts.push(...wpPosts.map((post: any) => ({
        title: post.title?.rendered || '',
        slug: post.slug,
        ogImage: post._embedded?.['wp:featuredmedia']?.[0]?.source_url,
        url: `https://bakinggreatbread.com/blog/${post.slug}`,
        source: 'wordpress' as const
      })))
    }
  } catch (error) {
    console.warn('Supabase blog-proxy failed, trying WordPress direct:', error)
  }
  
  // Fallback to direct WordPress if needed
  if (posts.length === 0) {
    try {
      const wpResponse = await fetch(
        'https://bakinggreatbread.blog/wp-json/wp/v2/posts?_embed=1&per_page=25',
        {
          headers: {
            'User-Agent': 'BakingGreatBread-OGHealthScanner/1.0'
          }
        }
      )
      
      if (wpResponse.ok) {
        const wpPosts = await wpResponse.json()
        posts.push(...wpPosts.map((post: any) => ({
          title: post.title?.rendered || '',
          slug: post.slug,
          ogImage: post._embedded?.['wp:featuredmedia']?.[0]?.source_url,
          url: `https://bakinggreatbread.com/blog/${post.slug}`,
          source: 'wordpress' as const
        })))
      }
    } catch (error) {
      console.error('WordPress direct fetch failed:', error)
    }
  }
  
  // Add Supabase recipes/blog posts
  try {
    const supabaseUrl = `https://ojyckskucneljvuqzrsw.supabase.co/rest/v1/blog_posts?select=title,slug,hero_image_url&is_draft=eq.false&published_at=not.is.null&order=published_at.desc&limit=25`
    
    const supabaseRecipesResponse = await fetch(supabaseUrl, {
      headers: {
        'apikey': process.env.SUPABASE_ANON_KEY || '',
        'Authorization': `Bearer ${process.env.SUPABASE_ANON_KEY}`
      }
    })
    
    if (supabaseRecipesResponse.ok) {
      const supabasePosts = await supabaseRecipesResponse.json()
      posts.push(...supabasePosts.map((post: any) => ({
        title: post.title,
        slug: post.slug,
        ogImage: post.hero_image_url,
        url: `https://bakinggreatbread.com/blog/${post.slug}`,
        source: 'supabase' as const
      })))
    }
  } catch (error) {
    console.warn('Supabase direct fetch failed:', error)
  }
  
  return posts.slice(0, 50) // Limit to 50 posts
}

async function reportOGMissing(url: string, reason: string) {
  try {
    await fetch(`https://ojyckskucneljvuqzrsw.supabase.co/functions/v1/analytics-tracker`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.SUPABASE_ANON_KEY}`
      },
      body: JSON.stringify({
        event_type: 'og_missing',
        path: new URL(url).pathname,
        meta: {
          url,
          reason,
          scanner: 'og-health-cron'
        }
      })
    })
  } catch (error) {
    console.warn('Failed to report OG missing event:', error)
  }
}

export default async function handler(req: NextRequest) {
  // Verify cron secret
  const cronSecret = req.nextUrl.searchParams.get('secret')
  if (cronSecret !== process.env.CRON_SECRET) {
    return new Response('Unauthorized', { status: 401 })
  }
  
  if (req.method !== 'GET') {
    return new Response('Method not allowed', { status: 405 })
  }
  
  const startTime = Date.now()
  
  try {
    // Get latest posts
    const posts = await getLatestPosts()
    console.log(`Scanning ${posts.length} posts for OG health`)
    
    // Check each post's OG image
    const healthResults: OGHealthResult[] = []
    let validCount = 0
    let missingCount = 0
    let invalidCount = 0
    let errorCount = 0
    
    for (const post of posts) {
      if (!post.ogImage) {
        missingCount++
        await reportOGMissing(post.url, 'No OG image specified')
        healthResults.push({
          url: post.url,
          status: 'missing',
          error: 'No OG image specified'
        })
        continue
      }
      
      const result = await checkImageHealth(post.ogImage)
      healthResults.push(result)
      
      switch (result.status) {
        case 'valid':
          validCount++
          // Check if image meets social media requirements (1200x630)
          if (result.width && result.height) {
            const aspectRatio = result.width / result.height
            const isOptimalSize = result.width >= 1200 && result.height >= 630
            const isOptimalRatio = Math.abs(aspectRatio - 1.91) < 0.1 // 1200/630 ≈ 1.91
            
            if (!isOptimalSize || !isOptimalRatio) {
              await reportOGMissing(post.url, `Suboptimal dimensions: ${result.width}x${result.height}`)
            }
          }
          break
        case 'invalid':
          invalidCount++
          await reportOGMissing(post.url, `Invalid image: ${result.error}`)
          break
        case 'error':
          errorCount++
          await reportOGMissing(post.url, `Image error: ${result.error}`)
          break
      }
      
      // Small delay to avoid overwhelming servers
      await new Promise(resolve => setTimeout(resolve, 100))
    }
    
    const totalScanned = posts.length
    const coveragePercent = totalScanned > 0 ? Math.round((validCount / totalScanned) * 100) : 0
    
    const scanTime = Date.now() - startTime
    
    const summary = {
      timestamp: new Date().toISOString(),
      totalScanned,
      validCount,
      missingCount,
      invalidCount,
      errorCount,
      coveragePercent,
      scanTimeMs: scanTime,
      results: healthResults.slice(0, 10) // Return first 10 detailed results
    }
    
    console.log('OG Health Scan Summary:', {
      totalScanned,
      coveragePercent,
      scanTimeMs: scanTime
    })
    
    return new Response(JSON.stringify(summary), {
      headers: { 'Content-Type': 'application/json' }
    })
    
  } catch (error: any) {
    console.error('OG health scan failed:', error)
    
    return new Response(JSON.stringify({
      error: 'OG health scan failed',
      details: error.message,
      timestamp: new Date().toISOString()
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}