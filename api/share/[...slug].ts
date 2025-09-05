import { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { renderOgHtml } from '../../src/server/og-template';

const SUPABASE_URL = 'https://ojyckskucneljvuqzrsw.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9qeWNrc2t1Y25lbGp2dXF6cnN3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY3NDI0MTUsImV4cCI6MjA1MjMxODQxNX0.-Bx7Y0d_aMcHakE27Z5QKriY6KPpG1m8n0uuLaamFfY';

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

function absoluteUrl(pathOrUrl: string): string {
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  
  const base = process.env.VITE_SITE_URL || 
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
  const defaultImage = '/lovable-uploads/f2a6c7d6-5a78-4068-94bd-1810dd3ebd96.png';
  const selectedImage = socialImageUrl || inlineImageUrl || heroImageUrl || defaultImage;
  
  const absoluteImageUrl = absoluteUrl(selectedImage);
  
  // Add stable cache-busting based on updatedAt
  if (updatedAt) {
    const timestamp = Math.floor(new Date(updatedAt).getTime() / 1000);
    const separator = absoluteImageUrl.includes('?') ? '&' : '?';
    return `${absoluteImageUrl}${separator}v=${timestamp}`;
  }
  
  return absoluteImageUrl;
}

export default async function handler(req: NextRequest) {
  const { pathname } = new URL(req.url);
  const slug = pathname.split('/share/')[1]?.replace(/\/$/, '') || '';
  
  const userAgent = req.headers.get('user-agent');
  const isBot = isBotRequest(userAgent);
  
  console.log(`Request to /share/${slug} from UA: ${userAgent} (isBot: ${isBot})`);
  
  // For human visitors, redirect to the actual blog post
  if (!isBot) {
    const redirectUrl = absoluteUrl(`/blog/${slug}`);
    return Response.redirect(redirectUrl, 301);
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
    
    return new Response(html, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, max-age=300', // 5 minutes
      },
    });
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
        type: 'article'
      });
      
      return new Response(html, {
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'public, max-age=300', // 5 minutes
        },
      });
    }
    
    
    // Fallback to WordPress proxy if not found in Supabase
    const wpResponse = await fetch(`https://ojyckskucneljvuqzrsw.supabase.co/functions/v1/blog-proxy?endpoint=posts&slug=${slug}&_embed=true`);
    
    if (wpResponse.ok) {
      const wpPosts = await wpResponse.json();
      const wpPost = wpPosts[0];
      
      if (wpPost) {
        const title = `${wpPost.title.rendered} | Baking Great Bread`;
        const description = wpPost.excerpt.rendered.replace(/<[^>]*>/g, '').substring(0, 160);
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
          type: 'article'
        });
        
        return new Response(html, {
          headers: {
            'Content-Type': 'text/html; charset=utf-8',
            'Cache-Control': 'public, max-age=300', // 5 minutes
          },
        });
      }
    }
    
    // Fallback for unknown posts
    const html = renderOgHtml({
      title: 'Baking Great Bread',
      description: 'Master the art of bread baking with expert recipes, troubleshooting guides, and a vibrant community led by Henry Hunter.',
      canonical: absoluteUrl('/'),
      image: {
        url: absoluteUrl('/lovable-uploads/f2a6c7d6-5a78-4068-94bd-1810dd3ebd96.png'),
        width: 1200,
        height: 630,
        alt: 'Baking Great Bread - Master the Art of Bread Making'
      }
    });
    
    return new Response(html, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, max-age=300',
      },
    });
    
  } catch (error) {
    console.error('Error in share handler:', error);
    
    // Error fallback
    const html = renderOgHtml({
      title: 'Baking Great Bread',
      description: 'Master the art of bread baking with expert recipes, troubleshooting guides, and a vibrant community led by Henry Hunter.',
      canonical: absoluteUrl('/'),
      image: {
        url: absoluteUrl('/lovable-uploads/f2a6c7d6-5a78-4068-94bd-1810dd3ebd96.png'),
        width: 1200,
        height: 630,
        alt: 'Baking Great Bread - Master the Art of Bread Making'
      }
    });
    
    return new Response(html, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, max-age=60', // Shorter cache for errors
      },
    });
  }
}

export const config = {
  runtime: 'edge',
};