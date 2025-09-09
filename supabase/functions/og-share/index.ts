// Deno runtime
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const BOT_UA = [
  "facebookexternalhit","facebot","twitterbot","linkedinbot",
  "slackbot","discordbot","whatsapp","telegrambot","skypeuripreview",
  "googlebot","google-structured-data-testing-tool","pinterestbot",
  "redditbot","applebot","bingbot","yandexbot"
];

function isBot(ua: string | null) {
  if (!ua) return false;
  const l = ua.toLowerCase();
  return BOT_UA.some(b => l.includes(b));
}

function siteUrl() {
  // Use SITE_URL secret; fallback to prod
  return Deno.env.get("SITE_URL") || "https://bakinggreatbread.com";
}

function absoluteUrl(pathOrUrl: string) {
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  return new URL(pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`, siteUrl()).toString();
}

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]!));
}

function renderHtml(meta: {
  title: string; description: string; canonical: string;
  image: { url: string; width?: number; height?: number; alt?: string };
  type?: string;
  publishedAt?: string;
  modifiedAt?: string;
}) {
  const { title, description, canonical, image, type="article", publishedAt, modifiedAt } = meta;
  const w = image.width ?? 1200, h = image.height ?? 630, alt = image.alt ?? title;
  
  return `<!doctype html><html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${escapeHtml(title)}</title>
<meta name="description" content="${escapeHtml(description)}">
<link rel="canonical" href="${canonical}">

<!-- Open Graph / Facebook -->
<meta property="og:type" content="${type}">
<meta property="og:url" content="${canonical}">
<meta property="og:title" content="${escapeHtml(title)}">
<meta property="og:description" content="${escapeHtml(description)}">
<meta property="og:site_name" content="Baking Great Bread">
<meta property="og:image" content="${image.url}">
<meta property="og:image:width" content="${w}">
<meta property="og:image:height" content="${h}">
<meta property="og:image:alt" content="${escapeHtml(alt)}">
<meta property="og:locale" content="en_US">
${publishedAt ? `<meta property="article:published_time" content="${publishedAt}">` : ''}
${modifiedAt ? `<meta property="article:modified_time" content="${modifiedAt}">` : ''}

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${escapeHtml(title)}">
<meta name="twitter:description" content="${escapeHtml(description)}">
<meta name="twitter:image" content="${image.url}">
<meta name="twitter:image:alt" content="${escapeHtml(alt)}">
<meta name="twitter:site" content="@henrysbread">
<meta name="twitter:creator" content="@henrysbread">

<meta name="robots" content="noindex">
</head><body>
<div style="text-align: center; padding: 50px; font-family: Arial, sans-serif;">
  <h1>${escapeHtml(title)}</h1>
  <p>${escapeHtml(description)}</p>
  <p><a href="${canonical}" style="color: #D97706; text-decoration: none; font-weight: bold;">Continue to full article →</a></p>
</div>
<script>
// Fallback redirect for any browsers that reach this page
if (typeof window !== 'undefined') {
  window.location.replace(${JSON.stringify(canonical)});
}
</script>
</body></html>`;
}

function ok(html: string, status = 200) {
  return new Response(html, {
    status,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=86400, stale-while-revalidate=604800",
      "Vary": "User-Agent",
      "X-Robots-Tag": "noindex",
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    }
  });
}

function redirect(url: string, status: 301 | 302 = 301) {
  return new Response(null, { 
    status, 
    headers: { 
      Location: url,
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    } 
  });
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    // Support /og-share/:slug or ?slug=
    const pathSlug = url.pathname.replace(/^\/?og-share\/?/, "");
    const slug = (url.searchParams.get("slug") || pathSlug || "").trim().replace(/^\/|\/$/g,"");
    const ua = req.headers.get("user-agent");

    console.log(`OG request for slug: ${slug}, bot: ${isBot(ua)}, UA: ${ua}`);

    if (!slug) {
      const html = renderHtml({
        title: "Baking Great Bread",
        description: "Master the art of bread baking with expert recipes and techniques.",
        canonical: absoluteUrl("/"),
        image: { 
          url: "https://ojyckskucneljvuqzrsw.supabase.co/storage/v1/object/public/blog-images/2025-09/general/f4e8420f-af34-442d-be96-77ad8c28546f.png",
          width: 1200,
          height: 630,
          alt: "Baking Great Bread - Master the art of bread baking"
        },
        type: "website"
      });
      return ok(html, 404);
    }

    // Humans → redirect to recipes, not blog
    if (!isBot(ua)) {
      console.log(`Redirecting human to /recipes/${slug}`);
      return redirect(absoluteUrl(`/recipes/${slug}`), 301);
    }

    // Bots → fetch post and render
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY");
    const sb = (SUPABASE_URL && SUPABASE_ANON_KEY)
      ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
      : null;

    let post: any = null;
    let isRecipe = false;

    if (sb) {
      console.log(`Fetching content from Supabase: ${slug}`);
      
      // Try recipes first (primary content type)
      let recipeData = null;
      const { data: directRecipe } = await sb.from("recipes").select("*").eq("slug", slug).eq("is_public", true).maybeSingle();
      
      // If not found and slug ends with -1, try without the suffix
      if (!directRecipe && slug.endsWith('-1')) {
        const baseSlug = slug.slice(0, -2);
        console.log(`Trying base slug: ${baseSlug}`);
        const { data: baseRecipe } = await sb.from("recipes").select("*").eq("slug", baseSlug).eq("is_public", true).maybeSingle();
        recipeData = baseRecipe;
      } else {
        recipeData = directRecipe;
      }
      
      if (recipeData) {
        isRecipe = true;
        // Convert recipe to post-like structure for OG tags
        post = {
          title: recipeData.title,
          subtitle: recipeData.data?.seoDescription || recipeData.data?.description?.slice(0, 160) || recipeData.data?.introduction?.slice(0, 160) || "A delicious bread recipe from Baking Great Bread",
          updated_at: recipeData.updated_at,
          published_at: recipeData.created_at,
          social_image_url: recipeData.image_url,
          hero_image_url: recipeData.image_url
        };
        console.log(`Found Supabase recipe: ${post.title}`);
      } else {
        // Fallback to blog posts only if no recipe found
        const { data: blogData } = await sb.from("blog_posts").select("*").eq("slug", slug).maybeSingle();
        if (blogData && !blogData.is_draft && blogData.published_at) {
          post = blogData;
          console.log(`Found Supabase blog post: ${post.title}`);
        }
      }
    }

    // Fallback: WordPress proxy
    if (!post) {
      console.log(`Trying WordPress fallback for: ${slug}`);
      const baseUrl = Deno.env.get("SUPABASE_URL") || "https://ojyckskucneljvuqzrsw.supabase.co";
      const wpUrl = `${baseUrl}/functions/v1/blog-proxy?endpoint=posts&slug=${encodeURIComponent(slug)}&_embed=true`;
      
      try {
        const wp = await fetch(wpUrl);
        if (wp.ok) {
          const arr = await wp.json();
          if (Array.isArray(arr) && arr[0]) {
            const p = arr[0];
            post = {
              title: p.title?.rendered || "Blog Post",
              subtitle: (p.excerpt?.rendered || "").replace(/<[^>]*>/g,"").slice(0, 160),
              updated_at: p.modified,
              published_at: p.date,
              social_image_url: p._embedded?.["wp:featuredmedia"]?.[0]?.source_url
            };
            console.log(`Found WordPress post: ${post.title}`);
          }
        }
      } catch (e) {
        console.error(`WordPress fallback failed: ${e.message}`);
      }
    }

    // No hardcoded exceptions - use database data only

    // Compose meta for found content
    const title = post ? `${post.title} | Baking Great Bread` : "Baking Great Bread";
    const description = (post?.subtitle || post?.excerpt || post?.meta_description || "Master the art of bread baking with expert recipes and techniques.").slice(0, 160);
    const canonical = absoluteUrl(isRecipe ? `/recipes/${slug}` : `/blog/${slug}`);

    // Resolve image URL - ensure public 1200x630 for OG
    let imgUrl = post?.social_image_url || post?.inline_image_url || post?.hero_image_url;
    
    // Default fallback image (publicly accessible)
    if (!imgUrl) {
      imgUrl = absoluteUrl("/og-default.jpg");
    }

    // Ensure absolute URL
    if (!imgUrl.includes("http")) {
      imgUrl = absoluteUrl(imgUrl);
    }

    // No signed URLs for OG images - use public storage URLs only
    if (imgUrl.includes("token=") || imgUrl.includes("sign=")) {
      imgUrl = absoluteUrl("/og-default.jpg");
    }

    const finalImg = imgUrl;

    console.log(`Rendering OG for ${slug}: ${title}`);
    console.log(`Using image: ${finalImg}`);

    const html = renderHtml({
      title, 
      description, 
      canonical,
      image: { 
        url: finalImg, 
        width: 1200, 
        height: 630, 
        alt: post?.title || "Baking Great Bread" 
      },
      type: post ? "article" : "website",
      publishedAt: post?.published_at,
      modifiedAt: post?.updated_at
    });

    return ok(html, post ? 200 : 404);
    
  } catch (e) {
    console.error(`OG generation error: ${e.message}`);
    
    const html = renderHtml({
      title: "Baking Great Bread",
      description: "Master the art of bread baking with expert recipes and techniques.",
      canonical: absoluteUrl("/"),
      image: { 
        url: "https://ojyckskucneljvuqzrsw.supabase.co/storage/v1/object/public/blog-images/2025-09/general/f4e8420f-af34-442d-be96-77ad8c28546f.png",
        width: 1200,
        height: 630,
        alt: "Baking Great Bread"
      },
      type: "website"
    });
    return ok(html, 500);
  }
});