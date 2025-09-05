import { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://ojyckskucneljvuqzrsw.supabase.co';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY!;

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

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

export function isBotRequest(userAgent: string | null): boolean {
  if (!userAgent) return false;
  const normalizedUA = userAgent.toLowerCase();
  return BOT_USER_AGENTS.some(bot => normalizedUA.includes(bot));
}

// Header helpers for consistent responses
export function botHeaders() {
  return {
    'Content-Type': 'text/html; charset=utf-8',
    'Cache-Control': 'public, max-age=0, s-maxage=86400, stale-while-revalidate=604800',
    'Vary': 'User-Agent',
    'X-Robots-Tag': 'noindex'
  };
}

export function humanRedirectHeaders(location: string) {
  return {
    'Location': location,
    'Cache-Control': 'public, max-age=0, s-maxage=300',
    'Vary': 'User-Agent',
    'Content-Type': 'text/plain; charset=utf-8'
  };
}

export function absoluteUrl(pathOrUrl: string): string {
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  
  const base = process.env.SITE_URL ||
               process.env.NEXT_PUBLIC_SITE_URL ||
               (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : '') ||
               'https://bread-baking-hub.vercel.app';
               
  if (!base) throw new Error('Site URL not configured');
  
  const normalizedPath = pathOrUrl.startsWith('/') ? pathOrUrl : `/${pathOrUrl}`;
  return new URL(normalizedPath, base).toString();
}

export function resolveSocialImage(
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

export function stripHtml(s: string): string {
  return s.replace(/<[^>]*>/g, '');
}

export function decodeEntities(s: string): string {
  return s.replace(/&(#\d+|#x[0-9a-f]+|[a-z]+);/gi, (m) => {
    const txt = new Map([['amp','&'],['lt','<'],['gt','>'],['quot','"'],['apos',"'"]]);
    if (m.startsWith('&#x')) return String.fromCharCode(parseInt(m.slice(3,-1),16));
    if (m.startsWith('&#')) return String.fromCharCode(parseInt(m.slice(2,-1),10));
    return txt.get(m.slice(1,-1)) ?? m;
  });
}

export interface OgPostData {
  title: string;
  description: string;
  canonical: string;
  image: {
    url: string;
    width: number;
    height: number;
    alt: string;
  };
  type?: string;
  publishedAt?: string;
  modifiedAt?: string;
}

export async function resolvePostBySlug(slug: string): Promise<OgPostData | null> {
  try {
    // Handle test post
    if (slug === 'test-post') {
      const testImage = 'https://ojyckskucneljvuqzrsw.supabase.co/storage/v1/object/public/blog-images/2025-09/general/f4e8420f-af34-442d-be96-77ad8c28546f.png';
      
      return {
        title: 'Test Post for Open Graph Validation | Baking Great Bread',
        description: 'This is a test post to validate Open Graph and Twitter Card functionality for social media sharing.',
        canonical: absoluteUrl(`/blog/${slug}`),
        image: {
          url: testImage,
          width: 1200,
          height: 630,
          alt: 'Test image for Open Graph validation'
        },
        type: 'article'
      };
    }
    
    // Try Supabase first
    const { data: supabasePost } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .single();
    
    if (supabasePost) {
      const title = `${supabasePost.title} | Baking Great Bread`;
      const description = supabasePost.subtitle || 'Master the art of bread baking with expert recipes and techniques.';
      const canonical = absoluteUrl(`/blog/${slug}`);
      
      const imageUrl = resolveSocialImage(
        supabasePost.social_image_url,
        supabasePost.inline_image_url,
        supabasePost.hero_image_url,
        supabasePost.updated_at
      );
      
      return {
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
      };
    }
    
    // Fallback to WordPress proxy
    const wpResponse = await fetch(`${SUPABASE_URL}/functions/v1/blog-proxy?endpoint=posts&slug=${slug}&_embed=true`);
    
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
        
        return {
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
        };
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error resolving post:', error);
    return null;
  }
}