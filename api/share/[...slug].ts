import { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { renderOgHtml } from '../../src/server/og-template';

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://ojyckskucneljvuqzrsw.supabase.co';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY!;

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Comprehensive bot user agents for social media crawlers
const BOT_USER_AGENTS = [
  'facebookexternalhit',
  'facebot',
  'twitterbot',
  'linkedinbot',
  'slackbot-linkexpanding',
  'slackbot',
  'discordbot',
  'whatsapp',
  'telegrambot',
  'skypeuripreview',
  'googlebot',
  'google-structured-data-testing-tool',
  'pinterestbot',
  'redditbot',
  'applebot',
  'bingbot',
  'yandexbot'
];

function isBotRequest(userAgent: string | null): boolean {
  if (!userAgent) return false;
  const normalizedUA = userAgent.toLowerCase();
  return BOT_USER_AGENTS.some(bot => normalizedUA.includes(bot));
}

// Header helpers for consistent responses
function botHeaders() {
  return {
    'Content-Type': 'text/html; charset=utf-8',
    'Cache-Control': 'public, max-age=0, s-maxage=86400, stale-while-revalidate=604800',
    'Vary': 'User-Agent',
    'X-Robots-Tag': 'noindex'
  };
}

function humanRedirectHeaders(location: string) {
  return {
    'Location': location,
    'Cache-Control': 'public, max-age=0, s-maxage=300',
    'Vary': 'User-Agent',
    'Content-Type': 'text/plain; charset=utf-8'
  };
}

function absoluteUrl(pathOrUrl: string): string {
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  
  const base = process.env.SITE_URL ||
               process.env.NEXT_PUBLIC_SITE_URL ||
               (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : '') ||
               'https://bread-baking-hub.vercel.app';
               
  if (!base) throw new Error('Site URL not configured');
  
  const normalizedPath = pathOrUrl.startsWith('/') ? pathOrUrl : `/${pathOrUrl}`;
  return new URL(normalizedPath, base).toString();
}

function resolveSocialImage(
  socialImageUrl?: string,
  inlineImageUrl?: string,
  heroImageUrl?: string,
  updatedAt?: string
): string {
  const defaultImage = '/og/default.jpg';
  const selectedImage = [socialImageUrl, inlineImageUrl, heroImageUrl, defaultImage]
    .find(Boolean)!
    .toString()
    .trim();
  
  const absoluteImageUrl = absoluteUrl(selectedImage);
  
  // Add stable cache-busting based on updatedAt
  if (updatedAt) {
    const timestamp = new Date(updatedAt).getTime();
    const separator = absoluteImageUrl.includes('?') ? '&' : '?';
    return `${absoluteImageUrl}${separator}v=${timestamp}`;
  }
  
  return absoluteImageUrl;
}

function stripHtml(s: string): string {
  return s.replace(/<[^>]*>/g, '');
}

function decodeEntities(s: string): string {
  return s.replace(/&(#\d+|#x[0-9a-f]+|[a-z]+);/gi, (m) => {
    const txt = new Map([['amp','&'],['lt','<'],['gt','>'],['quot','"'],['apos',"'"]]);
    if (m.startsWith('&#x')) return String.fromCharCode(parseInt(m.slice(3,-1),16));
    if (m.startsWith('&#')) return String.fromCharCode(parseInt(m.slice(2,-1),10));
    return txt.get(m.slice(1,-1)) ?? m;
  });
}

export default async function handler(req: NextRequest) {
  const { pathname } = new URL(req.url);
  const raw = pathname.split('/share/')[1]?.replace(/\/$/, '') || '';
  const slug = decodeURIComponent(raw);
  
  const userAgent = req.headers.get('user-agent');
  const isBot = isBotRequest(userAgent);
  
  console.info(JSON.stringify({ route: 'share', slug, isBot, status: 'processing' }));
  
  // Handle empty slug
  if (!slug) {
    if (!isBot) {
      return new Response(null, { 
        status: 301, 
        headers: humanRedirectHeaders(absoluteUrl('/'))
      });
    }
    const html = renderOgHtml({
      title: 'Baking Great Bread',
      description: 'Master the art of bread baking with expert recipes, troubleshooting guides, and a vibrant community.',
      canonical: absoluteUrl('/'),
      image: { url: absoluteUrl('/og/default.jpg'), width: 1200, height: 630, alt: 'Baking Great Bread' }
    });
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
    // Try to fetch from Supabase first (our main content source)
    const { data: supabasePost } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .single();
    
    if (supabasePost) {
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
    const wpResponse = await fetch(`https://ojyckskucneljvuqzrsw.supabase.co/functions/v1/blog-proxy?endpoint=posts&slug=${slug}&_embed=true`);
    
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
    const html = renderOgHtml({
      title: 'Baking Great Bread',
      description: 'Master the art of bread baking with expert recipes, troubleshooting guides, and a vibrant community led by Henry Hunter.',
      canonical: absoluteUrl('/'),
      image: {
        url: absoluteUrl('/og/default.jpg'),
        width: 1200,
        height: 630,
        alt: 'Baking Great Bread - Master the Art of Bread Making'
      }
    });
    
    return new Response(html, { status: 404, headers: botHeaders() });
    
  } catch (error) {
    console.error('Error in share handler:', error);
    
    // Error fallback
    const html = renderOgHtml({
      title: 'Baking Great Bread',
      description: 'Master the art of bread baking with expert recipes, troubleshooting guides, and a vibrant community led by Henry Hunter.',
      canonical: absoluteUrl('/'),
      image: {
        url: absoluteUrl('/og/default.jpg'),
        width: 1200,
        height: 630,
        alt: 'Baking Great Bread - Master the Art of Bread Making'
      }
    });
    
    return new Response(html, { status: 500, headers: botHeaders() });
  }
}

export const config = {
  runtime: 'edge',
};