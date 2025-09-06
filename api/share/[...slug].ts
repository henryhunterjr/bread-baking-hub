import { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';
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
  return createClient(url, key);
}

export default async function handler(req: NextRequest) {
  const { pathname } = new URL(req.url);
  const raw = pathname.split('/share/')[1]?.replace(/\/$/, '') || '';
  const slug = decodeURIComponent(raw);
  
  const userAgent = req.headers.get('user-agent');
  const isBot = isBotRequest(userAgent);
  const supabase = getSupabase();
  
  console.info(JSON.stringify({ route: 'share', slug, isBot, status: 'processing' }));
  
  // If no Supabase env vars, never crash
  if (!supabase) {
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
    const redirectUrl = absoluteUrl(`/blog/${slug}`);
    return new Response(null, { 
      status: 301, 
      headers: humanRedirectHeaders(redirectUrl)
    });
  }
  
  // Handle test post for validation
  if (slug === 'test-post') {
    const testImage = 'https://ojyckskucneljvuqzrsw.supabase.co/storage/v1/object/public/blog-images/2025-09/general/f4e8420f-af34-442d-be96-77ad8c28546f.png';
    
    const testData = {
      title: 'Test Post for Open Graph Validation | Baking Great Bread',
      description: 'This is a test post to validate Open Graph and Twitter Card functionality for social media sharing. Perfect for testing your social media images!',
      canonical: absoluteUrl('/blog/test-post'),
      image: {
        url: testImage,
        width: 1200,
        height: 630,
        alt: 'Test image for Open Graph validation - Baking Great Bread'
      },
      siteName: 'Baking Great Bread', 
      twitterHandle: '@henrysbread',
      type: 'article'
    };
    
    const html = renderOgHtml(testData);
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
      const title = supabasePost.title ? `${supabasePost.title} | Baking Great Bread` : 'Baking Great Bread';
      const description = supabasePost.subtitle || supabasePost.excerpt || supabasePost.meta_description || 'Master the art of bread baking with expert recipes and techniques.';
      const canonical = absoluteUrl(`/blog/${slug}`);
      
      const imageUrl = resolveSocialImage(
        supabasePost.social_image_url,
        supabasePost.inline_image_url,
        supabasePost.hero_image_url,
        supabasePost.updated_at
      );
      
      const ogData = {
        title,
        description: description.slice(0, 160), // Ensure proper length
        canonical,
        image: {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: supabasePost.title || 'Baking Great Bread'
        },
        siteName: 'Baking Great Bread',
        twitterHandle: '@henrysbread',
        type: 'article',
        publishedAt: supabasePost.published_at,
        modifiedAt: supabasePost.updated_at
      };
      
      const html = renderOgHtml(ogData);
      return new Response(html, { status: 200, headers: botHeaders() });
    }
    
    
    // Fallback to WordPress proxy if not found in Supabase
    const baseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || 'https://ojyckskucneljvuqzrsw.supabase.co';
    const wpResponse = await fetch(`${baseUrl}/functions/v1/blog-proxy?endpoint=posts&slug=${slug}&_embed=true`);
    
    if (wpResponse.ok) {
      const wpPosts = await wpResponse.json();
      const wpPost = wpPosts[0];
      
      if (wpPost) {
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
    const html = renderOgHtml(defaultOgForHome());
    return new Response(html, { status: 404, headers: botHeaders() });
    
  } catch (error) {
    console.error('Error in share handler:', error);
    
    // Error fallback
    const html = renderOgHtml(defaultOgForHome());
    return new Response(html, { status: 500, headers: botHeaders() });
  }
}

export const config = {
  runtime: 'edge',
};