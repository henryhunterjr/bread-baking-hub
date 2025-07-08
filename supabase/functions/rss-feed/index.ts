import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const BLOG_PROXY_URL = 'https://ojyckskucneljvuqzrsw.supabase.co/functions/v1/blog-proxy'

// Escape XML characters
const escapeXml = (text: string): string => {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

// Strip HTML tags from content
const stripHtml = (html: string): string => {
  return html.replace(/<[^>]*>/g, '').trim()
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('Generating RSS feed...')
    
    // Fetch latest 50 blog posts
    const response = await fetch(`${BLOG_PROXY_URL}?endpoint=posts&per_page=50`, {
      headers: {
        'Accept': 'application/json',
      }
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch blog posts: ${response.status}`)
    }

    const result = await response.json()
    const posts = result.data

    // Generate RSS feed XML
    const buildDate = new Date().toUTCString()
    const siteUrl = 'https://bakinggreatbread.blog'
    const feedUrl = 'https://ojyckskucneljvuqzrsw.supabase.co/functions/v1/rss-feed'

    let rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Baking Great Bread Blog</title>
    <link>${siteUrl}</link>
    <description>Expert bread baking tips, troubleshooting guides, and recipes from Henry</description>
    <language>en-US</language>
    <lastBuildDate>${buildDate}</lastBuildDate>
    <generator>Baking Great Bread RSS Generator</generator>
    <atom:link href="${feedUrl}" rel="self" type="application/rss+xml"/>
`

    // Add each post as an item
    for (const post of posts) {
      const pubDate = new Date(post.date).toUTCString()
      const cleanTitle = escapeXml(post.title.rendered)
      const cleanExcerpt = escapeXml(stripHtml(post.excerpt.rendered))
      const cleanContent = escapeXml(stripHtml(post.content.rendered))
      const postUrl = escapeXml(post.link)
      
      // Get featured image if available
      const featuredImage = post._embedded?.['wp:featuredmedia']?.[0]?.source_url || ''
      const imageTag = featuredImage ? `
      <enclosure url="${escapeXml(featuredImage)}" type="image/jpeg"/>` : ''

      rssXml += `
    <item>
      <title>${cleanTitle}</title>
      <link>${postUrl}</link>
      <guid isPermaLink="true">${postUrl}</guid>
      <description>${cleanExcerpt}</description>
      <content:encoded><![CDATA[${post.content.rendered}]]></content:encoded>
      <pubDate>${pubDate}</pubDate>${imageTag}
      <author>noreply@bakinggreatbread.blog (Henry)</author>
    </item>`
    }

    rssXml += `
  </channel>
</rss>`

    console.log(`Generated RSS feed with ${posts.length} posts`)

    return new Response(rssXml, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/rss+xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600' // Cache for 1 hour
      }
    })
  } catch (error) {
    console.error('RSS feed generation error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})