import { NextRequest } from 'next/server';
import { renderOgHtml } from '../../src/server/og-template';
import { 
  isBotRequest, 
  botHeaders, 
  baseHeaders,
  humanRedirectHeaders, 
  absoluteUrl, 
  resolveSocialImage,
  stripHtml,
  decodeEntities,
  defaultOgForHome
} from '../_shared';

// Lazy-init Supabase to prevent crashes on missing env vars
function getSupabase() {
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
  const key = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';
  if (!url || !key) return null;
  
  // Only import when we have valid credentials
  const { createClient } = require('@supabase/supabase-js');
  return createClient(url, key);
}

export default async function handler(req: NextRequest) {
  const { pathname } = new URL(req.url);
  const raw = pathname.split('/blog/')[1]?.replace(/\/$/, '') || '';
  const slug = decodeURIComponent(raw);
  
  const userAgent = req.headers.get('user-agent');
  const isBot = isBotRequest(userAgent);
  const supabase = getSupabase();
  
  console.info('BLOG_DETAIL', { 
    slug, 
    uaType: isBot ? 'bot' : 'human', 
    used: 'unknown', 
    status: 'processing',
    note: 'Starting request processing'
  });
  
  // If no Supabase env vars, never crash
  if (!supabase) {
    console.warn('BLOG_DETAIL', { 
      slug, 
      uaType: isBot ? 'bot' : 'human', 
      used: 'none', 
      status: isBot ? 200 : 301, 
      note: 'Missing Supabase credentials - using fallback'
    });
    
    if (!isBot) {
      return new Response(null, { 
        status: 301, 
        headers: humanRedirectHeaders(absoluteUrl(`/blog/${slug}`))
      });
    }
    // Bot fallback: minimal OG so validators don't 500
    return new Response(renderOgHtml(defaultOgForHome()), {
      status: 200,
      headers: baseHeaders({ bot: true }),
    });
  }
  
  // Handle empty slug
  if (!slug) {
    console.info('BLOG_DETAIL', { 
      slug: '', 
      uaType: isBot ? 'bot' : 'human', 
      used: 'none', 
      status: isBot ? 200 : 301, 
      note: 'Empty slug - redirecting to home'
    });
    
    if (!isBot) {
      return new Response(null, { 
        status: 301, 
        headers: humanRedirectHeaders(absoluteUrl('/'))
      });
    }
    const html = renderOgHtml(defaultOgForHome());
    return new Response(html, { status: 200, headers: botHeaders() });
  }
  
  // For human visitors, redirect to the actual blog post
  if (!isBot) {
    console.info('BLOG_DETAIL', { 
      slug, 
      uaType: 'human', 
      used: 'spa', 
      status: 301, 
      note: 'Redirecting human to SPA'
    });
    
    const redirectUrl = absoluteUrl(`/blog/${slug}`);
    return new Response(null, { 
      status: 301, 
      headers: humanRedirectHeaders(redirectUrl)
    });
  }
  
  // Handle test post for validation
  if (slug === 'test-post') {
    const testImage = 'https://ojyckskucneljvuqzrsw.supabase.co/storage/v1/object/public/blog-images/2025-09/general/f4e8420f-af34-442d-be96-77ad8c28546f.png';
    
    console.info('BLOG_DETAIL', { 
      slug, 
      uaType: 'bot', 
      used: 'test-data', 
      status: 200, 
      note: 'Serving test post for validation'
    });
    
    const html = renderOgHtml({
      title: 'Test Post for Open Graph Validation | Baking Great Bread',
      description: 'This is a test post to validate Open Graph and Twitter Card functionality for social media sharing.',
      canonical: absoluteUrl('/blog/test-post'),
      image: {
        url: testImage,
        width: 1200,
        height: 630,
        alt: 'Test image for Open Graph validation'
      }
    });
    
    return new Response(html, { status: 200, headers: botHeaders() });
  }
  
  try {
    // Try to fetch from Supabase first with liberal query but validate in JS
    const { data: supabasePost } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .maybeSingle();
    
    // Validate in JS - only show published posts
    if (supabasePost && !supabasePost.is_draft && supabasePost.published_at) {
      console.info('BLOG_DETAIL', { 
        slug, 
        uaType: 'bot', 
        used: 'supabase', 
        status: 200, 
        note: `Found published post: ${supabasePost.title}`
      });
      
      const title = `${supabasePost.title} | Baking Great Bread`;
      const description = supabasePost.excerpt || supabasePost.meta_description || 'Master the art of bread baking with expert recipes and techniques.';
      const canonical = absoluteUrl(`/blog/${slug}`);
      
      const imageUrl = resolveSocialImage(
        supabasePost.social_image_url,
        supabasePost.inline_image_url,
        supabasePost.hero_image_url,
        supabasePost.updated_at
      );
      
      const html = renderOgHtml({
        title,
        description,
        canonical,
        image: {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: supabasePost.title
        },
        type: 'article',
        publishedAt: supabasePost.published_at,
        modifiedAt: supabasePost.updated_at
      });
      
      return new Response(html, { status: 200, headers: botHeaders() });
    }
    
    // Fallback to WordPress proxy if not found in Supabase
    const baseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || 'https://ojyckskucneljvuqzrsw.supabase.co';
    const wpResponse = await fetch(`${baseUrl}/functions/v1/blog-proxy?endpoint=posts&slug=${slug}&_embed=true`);
    
    if (wpResponse.ok) {
      const wpPosts = await wpResponse.json();
      const wpPost = wpPosts[0];
      
      if (wpPost) {
        console.info('BLOG_DETAIL', { 
          slug, 
          uaType: 'bot', 
          used: 'wordpress', 
          status: 200, 
          note: `Found WordPress post: ${wpPost.title.rendered}`
        });
        
        const title = `${wpPost.title.rendered} | Baking Great Bread`;
        const rawExcerpt = stripHtml(wpPost.excerpt.rendered);
        const description = decodeEntities(rawExcerpt).slice(0, 160);
        const canonical = absoluteUrl(`/blog/${slug}`);
        
        const featuredMedia = wpPost._embedded?.['wp:featuredmedia']?.[0];
        const imageUrl = resolveSocialImage(
          featuredMedia?.source_url,
          undefined,
          undefined,
          wpPost.modified
        );
        
        const html = renderOgHtml({
          title,
          description,
          canonical,
          image: {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: featuredMedia?.alt_text || wpPost.title.rendered
          },
          type: 'article',
          publishedAt: wpPost.date,
          modifiedAt: wpPost.modified
        });
        
        return new Response(html, { status: 200, headers: botHeaders() });
      }
    }
    
    // Fallback for unknown posts (404)
    console.info('BLOG_DETAIL', { 
      slug, 
      uaType: 'bot', 
      used: 'none', 
      status: 404, 
      note: 'Post not found in any source'
    });
    
    const html = renderOgHtml(defaultOgForHome());
    return new Response(html, { status: 404, headers: botHeaders() });
    
  } catch (error) {
    console.error('BLOG_DETAIL', { 
      slug, 
      uaType: 'bot', 
      used: 'none', 
      status: 500, 
      note: 'Error in blog handler',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
    
    // Error fallback
    const html = renderOgHtml(defaultOgForHome());
    return new Response(html, { status: 500, headers: botHeaders() });
  }
}

export const config = {
  runtime: 'edge',
};