import { NextRequest } from 'next/server';
import { renderOgHtml } from '../../src/server/og-template';
import { 
  isBotRequest, 
  botHeaders, 
  humanRedirectHeaders, 
  absoluteUrl, 
  resolveSocialImage,
  supabase,
  stripHtml,
  decodeEntities
} from '../_shared';

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