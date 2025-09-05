import { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://ojyckskucneljvuqzrsw.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9qeWNrc2t1Y25lbGp2dXF6cnN3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY3NDI0MTUsImV4cCI6MjA1MjMxODQxNX0.-Bx7Y0d_aMcHakE27Z5QKriY6KPpG1m8n0uuLaamFfY';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Bot user agents that need pre-rendered HTML
const BOT_USER_AGENTS = [
  'facebookexternalhit',
  'Twitterbot',
  'linkedinbot',
  'Slackbot',
  'Discordbot',
  'WhatsApp',
  'TelegramBot',
  'SkypeUriPreview',
  'GoogleBot',
];

function isBotRequest(userAgent: string | null): boolean {
  if (!userAgent) return false;
  return BOT_USER_AGENTS.some(bot => 
    userAgent.toLowerCase().includes(bot.toLowerCase())
  );
}

function absoluteUrl(pathOrUrl: string): string {
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  const base = process.env.VITE_SITE_URL || 'https://bread-baking-hub.vercel.app';
  const normalizedPath = pathOrUrl.startsWith('/') ? pathOrUrl : `/${pathOrUrl}`;
  return `${base}${normalizedPath}`;
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

function generateBotHTML({
  title,
  description,
  canonical,
  imageUrl,
  imageAlt,
  type = 'article',
  siteName = 'Baking Great Bread',
  twitterHandle = '@henrysbread'
}: {
  title: string;
  description: string;
  canonical: string;
  imageUrl: string;
  imageAlt: string;
  type?: string;
  siteName?: string;
  twitterHandle?: string;
}): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  
  <!-- Basic SEO -->
  <title>${title}</title>
  <meta name="description" content="${description}">
  <link rel="canonical" href="${canonical}">
  
  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="${type}">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}">
  <meta property="og:url" content="${canonical}">
  <meta property="og:site_name" content="${siteName}">
  <meta property="og:image" content="${imageUrl}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="${imageAlt}">
  <meta property="og:locale" content="en_US">
  
  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${title}">
  <meta name="twitter:description" content="${description}">
  <meta name="twitter:image" content="${imageUrl}">
  <meta name="twitter:image:alt" content="${imageAlt}">
  <meta name="twitter:site" content="${twitterHandle}">
  <meta name="twitter:creator" content="${twitterHandle}">
  
  <!-- Redirect to full article for any human visitors -->
  <meta http-equiv="refresh" content="0; url=${canonical}">
</head>
<body>
  <div style="text-align: center; padding: 50px; font-family: Arial, sans-serif;">
    <h1>${title}</h1>
    <p>${description}</p>
    <p><a href="${canonical}" style="color: #D97706; text-decoration: none; font-weight: bold;">Continue to full article →</a></p>
  </div>
</body>
</html>`;
}

export default async function handler(req: NextRequest) {
  const { pathname } = new URL(req.url);
  const slug = pathname.split('/share/')[1]?.replace(/\/$/, '') || '';
  
  const userAgent = req.headers.get('user-agent');
  const isBot = isBotRequest(userAgent);
  
  // For human visitors, redirect to the actual blog post
  if (!isBot) {
    const redirectUrl = absoluteUrl(`/blog/${slug}`);
    return Response.redirect(redirectUrl, 301);
  }
  
  // Handle test post for validation
  if (slug === 'test-post') {
    const testImage = 'https://ojyckskucneljvuqzrsw.supabase.co/storage/v1/object/public/blog-images/2025-09/general/f4e8420f-af34-442d-be96-77ad8c28546f.png';
    const html = generateBotHTML({
      title: 'Test Post for Open Graph Validation | Baking Great Bread',
      description: 'This is a test post to validate Open Graph and Twitter Card functionality for social media sharing.',
      canonical: absoluteUrl('/blog/test-post'),
      imageUrl: testImage,
      imageAlt: 'Test image for Open Graph validation'
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
      
      const html = generateBotHTML({
        title,
        description,
        canonical,
        imageUrl,
        imageAlt: supabasePost.title,
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
        
        const html = generateBotHTML({
          title,
          description,
          canonical,
          imageUrl,
          imageAlt: featuredMedia?.alt_text || wpPost.title.rendered,
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
    const html = generateBotHTML({
      title: 'Baking Great Bread',
      description: 'Master the art of bread baking with expert recipes, troubleshooting guides, and a vibrant community led by Henry Hunter.',
      canonical: absoluteUrl('/'),
      imageUrl: absoluteUrl('/lovable-uploads/f2a6c7d6-5a78-4068-94bd-1810dd3ebd96.png'),
      imageAlt: 'Baking Great Bread - Master the Art of Bread Making'
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
    const html = generateBotHTML({
      title: 'Baking Great Bread',
      description: 'Master the art of bread baking with expert recipes, troubleshooting guides, and a vibrant community led by Henry Hunter.',
      canonical: absoluteUrl('/'),
      imageUrl: absoluteUrl('/lovable-uploads/f2a6c7d6-5a78-4068-94bd-1810dd3ebd96.png'),
      imageAlt: 'Baking Great Bread - Master the Art of Bread Making'
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