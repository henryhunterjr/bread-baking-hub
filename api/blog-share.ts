import { NextRequest } from 'next/server';
import { renderOgHtml } from '../src/server/og-template';
import { 
  isBotRequest, 
  botHeaders, 
  resolvePostBySlug, 
  absoluteUrl 
} from './_shared';

export const config = { runtime: 'edge' };

export default async function handler(req: NextRequest) {
  const url = new URL(req.url);
  const slug = decodeURIComponent(url.searchParams.get('slug') || '').trim();
  const userAgent = req.headers.get('user-agent');
  const isBot = isBotRequest(userAgent);

  console.info(JSON.stringify({ route: 'blog-share', slug, isBot, status: 'processing' }));

  // Handle empty slug
  if (!slug) {
    if (!isBot) {
      // For humans, serve SPA index.html so routing takes over
      const spaResponse = await fetch(new URL('/', url));
      return new Response(await spaResponse.text(), {
        status: spaResponse.status,
        headers: {
          ...Object.fromEntries(spaResponse.headers),
          'Cache-Control': 'public, max-age=0, s-maxage=300',
        }
      });
    }
    
    const html = renderOgHtml({
      title: 'Baking Great Bread',
      description: 'Master the art of bread baking with expert recipes, troubleshooting guides, and a vibrant community.',
      canonical: absoluteUrl('/blog'),
      image: { url: absoluteUrl('/og/default.jpg'), width: 1200, height: 630, alt: 'Baking Great Bread' }
    });
    return new Response(html, { status: 200, headers: botHeaders() });
  }

  if (isBot) {
    // Bot: serve OG HTML
    const post = await resolvePostBySlug(slug);
    
    if (post) {
      const html = renderOgHtml(post);
      return new Response(html, { status: 200, headers: botHeaders() });
    }
    
    // 404 for bots with default OG
    const html = renderOgHtml({
      title: 'Baking Great Bread',
      description: 'Recipe not found.',
      canonical: absoluteUrl('/blog'),
      image: { url: absoluteUrl('/og/default.jpg'), width: 1200, height: 630, alt: 'Baking Great Bread' }
    });
    return new Response(html, { status: 404, headers: botHeaders() });
  }

  // Human: serve SPA index.html so routing takes over
  try {
    const spaResponse = await fetch(new URL('/', url));
    return new Response(await spaResponse.text(), {
      status: spaResponse.status,
      headers: {
        ...Object.fromEntries(spaResponse.headers),
        'Cache-Control': 'public, max-age=0, s-maxage=300',
      }
    });
  } catch (error) {
    console.error('Error serving SPA:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}