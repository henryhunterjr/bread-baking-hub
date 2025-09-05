import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Header from '../components/Header';
import Footer from '../components/Footer';
import BlogPostView from '../components/blog/BlogPostView';
import BlogPostSEO from '../components/blog/BlogPostSEO';
import MetadataManager from '@/components/MetadataManager';
import { LoadingState } from '../components/LoadingState';
import { fetchBlogPosts, type BlogPost } from '@/utils/blogFetcher';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Clock, Tag, Share } from 'lucide-react';
import SocialShare from '../components/blog/SocialShare';
import NewsletterSignup from '../components/NewsletterSignup';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getHeroBannerUrl, getSocialImageUrl } from '@/utils/imageUtils';
import { ResponsiveImage } from '@/components/ResponsiveImage';

// Extract YouTube video ID from URL
const extractYouTubeId = (url: string) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

// Component for rendering Supabase blog posts with professional typography
const SupabasePostView = ({ 
  post, 
  supabasePost, 
  onBack,
  heroBannerUrl
}: { 
  post: BlogPost; 
  supabasePost: Tables<'blog_posts'>; 
  onBack: () => void;
  heroBannerUrl: string;
}) => {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={onBack}
          className="mb-6 -ml-2"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Blog
        </Button>

        {/* Global Hero Banner */}
        <div className="mb-8">
          <ResponsiveImage
            src={heroBannerUrl}
            alt="Baking Great Bread At Home Blog"
            className="w-full h-32 md:h-48 object-cover rounded-lg"
            loading="lazy"
          />
        </div>

        {/* Professional Blog Content */}
        <div className="blog-content">
          {/* Blog Title */}
          <h1>{supabasePost.title}</h1>
          
          {/* Author and Meta Information */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-8 justify-center">
            <span className="font-semibold text-foreground text-base">Henry Hunter</span>
            <span>•</span>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{post.readTime}</span>
            </div>
            <span>•</span>
            <span>{post.date}</span>
            
            {supabasePost.tags && supabasePost.tags.length > 0 && (
              <>
                <span>•</span>
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4" />
                  <div className="flex gap-1">
                    {supabasePost.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Subtitle as Lead Paragraph */}
          {supabasePost.subtitle && (
            <div className="lead-paragraph">
              {supabasePost.subtitle}
            </div>
          )}

          {/* Inline Thumbnail */}
          {(supabasePost as any).inline_image_url && (
            <ResponsiveImage
              src={(supabasePost as any).inline_image_url}
              alt={supabasePost.title}
              className="w-full h-64 sm:h-80 lg:h-96 object-cover rounded-lg mb-8"
              loading="lazy"
            />
          )}

          {/* Main Content */}
          <ReactMarkdown 
            remarkPlugins={[remarkGfm]}
            components={{
              img: ({ src, alt, ...props }) => {
                // Simple clickable image implementation
                // We'll use a simpler approach and check the alt text for URL
                // If alt contains a URL, make the image clickable
                const urlMatch = alt?.match(/(https?:\/\/[^\s]+)/);
                
                if (urlMatch) {
                  const url = urlMatch[0];
                  // Remove the URL from alt text for display
                  const cleanAlt = alt?.replace(urlMatch[0], '').trim();
                  
                  return (
                    <div className="my-6">
                      <a 
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block cursor-pointer group relative overflow-hidden rounded-lg"
                        title="Click to visit link"
                      >
                        <ResponsiveImage 
                          src={src || ''} 
                          alt={cleanAlt} 
                          loading="lazy"
                          className="w-full h-auto rounded-lg shadow-lg transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl group-hover:shadow-primary/20"
                        />
                        <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />
                        <div className="absolute bottom-4 left-4 right-4 text-center bg-background/90 backdrop-blur-sm rounded px-3 py-2 text-sm text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          Click to visit →
                        </div>
                      </a>
                    </div>
                  );
                }

                // Regular image without link
                return (
                  <div className="my-6">
                    <ResponsiveImage 
                      src={src || ''} 
                      alt={alt || ''} 
                      loading="lazy"
                      className="w-full h-auto rounded-lg shadow-lg"
                    />
                  </div>
                );
              },
              a: ({ href, children, ...props }) => {
                // Handle button syntax: [button:text](url)
                if (typeof children === 'string' && children.startsWith('button:')) {
                  const buttonText = children.replace('button:', '');
                  return (
                    <div className="my-6">
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 no-underline"
                      >
                        {buttonText}
                      </a>
                    </div>
                  );
                }
                
                // Auto-embed YouTube links
                const youtubeId = extractYouTubeId(href || '');
                if (youtubeId && typeof children === 'string' && (children === href || children.includes('youtube.com') || children.includes('youtu.be'))) {
                  return (
                    <div className="relative w-full h-0 pb-[56.25%] rounded-lg overflow-hidden my-6 bg-muted">
                      <iframe
                        src={`https://www.youtube.com/embed/${youtubeId}`}
                        title="YouTube video"
                        className="absolute top-0 left-0 w-full h-full"
                        allowFullScreen
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      />
                    </div>
                  );
                }
                
                return (
                  <a 
                    href={href} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    {...props}
                  >
                    {children}
                  </a>
                );
              },
              p: ({ children }) => {
                // Handle standalone YouTube URLs in paragraphs
                if (typeof children === 'string') {
                  const youtubeId = extractYouTubeId(children);
                  if (youtubeId && (children.includes('youtube.com') || children.includes('youtu.be'))) {
                    return (
                      <div className="relative w-full h-0 pb-[56.25%] rounded-lg overflow-hidden my-6 bg-muted">
                        <iframe
                          src={`https://www.youtube.com/embed/${youtubeId}`}
                          title="YouTube video"
                          className="absolute top-0 left-0 w-full h-full"
                          allowFullScreen
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        />
                      </div>
                    );
                  }
                }
                return <p>{children}</p>;
              },
              h1: ({ children, ...props }) => (
                <h2 {...props}>{children}</h2>
              ),
              h2: ({ children, ...props }) => (
                <h2 {...props}>{children}</h2>
              ),
              h3: ({ children, ...props }) => (
                <h3 {...props}>{children}</h3>
              ),
              h4: ({ children, ...props }) => (
                <h4 {...props}>{children}</h4>
              )
            }}
          >
            {supabasePost.content}
          </ReactMarkdown>

          {/* Social Sharing */}
          <div className="mt-12 pt-8 border-t border-border text-center">
            <h3 className="text-lg font-semibold mb-4">Share This Post</h3>
            <SocialShare
              url={`${window.location.origin}/blog/${supabasePost.slug}`}
              title={supabasePost.title}
              description={supabasePost.subtitle || ''}
              image={getSocialImageUrl(
                (supabasePost as any).social_image_url,
                (supabasePost as any).inline_image_url,
                heroBannerUrl
              )}
            />
          </div>

          {/* Newsletter Signup */}
          <div className="mt-12">
            <NewsletterSignup />
          </div>
        </div>
      </div>
    </div>
  );
};

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [supabasePost, setSupabasePost] = useState<Tables<'blog_posts'> | null>(null);
  const [heroBannerUrl, setHeroBannerUrl] = useState<string>('');
  const [socialImageUrl, setSocialImageUrl] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPost = async () => {
      if (!slug) return;
      
      try {
        setLoading(true);
        setError(null);
        
        // Load hero banner URL
        const heroBanner = await getHeroBannerUrl();
        setHeroBannerUrl(heroBanner);
        
        console.log('Looking for blog post with slug:', slug);
        console.log('Full URL pathname:', window.location.pathname);
        
        // Normalize slug once (lowercase/trim/decode)
        const normalizedSlug = decodeURIComponent(slug).trim().toLowerCase();
        console.log('🔍 Normalized slug:', normalizedSlug);
        
        // Try Supabase first - liberal fetch, validate in JS
        const { data: supabasePost, error: supabaseError } = await supabase
          .from('blog_posts')
          .select('*')
          .eq('slug', normalizedSlug)
          .maybeSingle();

        console.log('📊 Supabase query result:', {
          found: !!supabasePost,
          error: supabaseError?.message,
          title: supabasePost?.title,
          isDraft: supabasePost?.is_draft,
          publishedAt: supabasePost?.published_at
        });

        // Guard in JS (instead of SQL filters)
        const isPublishable = !!supabasePost && 
          supabasePost.is_draft === false && 
          !!supabasePost.published_at;

        if (isPublishable) {
          console.info('BLOG_DETAIL', { 
            slug: normalizedSlug, 
            uaType: 'human', 
            used: 'supabase', 
            status: 200, 
            note: `Found published post: ${supabasePost.title}`
          });
          
          // Convert Supabase post to BlogPost format
          const convertedPost: BlogPost = {
            id: parseInt(supabasePost.id.slice(0, 8), 16),
            title: supabasePost.title,
            excerpt: supabasePost.subtitle || '',
            author: {
              id: 1,
              name: 'Henry Hunter',
              description: 'Master Baker',
              avatar: '/placeholder-avatar.png'
            },
            date: new Date(supabasePost.published_at || supabasePost.created_at || '').toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            }),
            modified: supabasePost.updated_at || '',
            image: supabasePost.hero_image_url || '',
            imageAlt: supabasePost.title,
            link: `${window.location.origin}/blog/${supabasePost.slug}`,
            readTime: `${Math.ceil(supabasePost.content.split(' ').length / 200)} min read`,
            categories: [],
            tags: supabasePost.tags || [],
            freshness: {
              daysAgo: Math.floor((new Date().getTime() - new Date(supabasePost.published_at || supabasePost.created_at || '').getTime()) / (1000 * 60 * 60 * 24)),
              label: 'Recently published'
            },
            source: 'supabase',
            published_at: supabasePost.published_at || supabasePost.created_at || ''
          };
          
          setPost(convertedPost);
          setSupabasePost(supabasePost);
          
          // Calculate social image URL after heroBannerUrl is loaded
          const finalSocialImageUrl = getSocialImageUrl(
            (supabasePost as any).social_image_url,
            (supabasePost as any).inline_image_url,
            heroBanner
          );
          setSocialImageUrl(finalSocialImageUrl);
          console.log('Final social image URL calculated:', finalSocialImageUrl);
          
          return;
        }

        // If we reach here, either no Supabase post found or not publishable
        if (supabasePost && !isPublishable) {
          console.info('BLOG_DETAIL', { 
            slug: normalizedSlug, 
            uaType: 'human', 
            used: 'none', 
            status: 'draft', 
            note: 'Supabase post found but not publishable (draft or no publish date)'
          });
        } else if (supabaseError) {
          console.info('BLOG_DETAIL', { 
            slug: normalizedSlug, 
            uaType: 'human', 
            used: 'none', 
            status: 'error', 
            note: `Supabase query error: ${supabaseError.message}`
          });
        } else {
          console.info('BLOG_DETAIL', { 
            slug: normalizedSlug, 
            uaType: 'human', 
            used: 'none', 
            status: 'not-found', 
            note: 'No Supabase post found for slug'
          });
        }

        // Fallback to WordPress by slug
        console.log('🔄 Trying WordPress fallback for slug:', normalizedSlug);
        try {
          const wpUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/blog-proxy?endpoint=posts&slug=${normalizedSlug}&_embed=true`;
          console.log('📡 WordPress API call:', wpUrl);
          
          const wpResponse = await fetch(wpUrl, { 
            headers: { 'Accept': 'application/json' }
          });
          
          if (wpResponse.ok) {
            const wpPosts = await wpResponse.json();
            const wpPost = wpPosts[0];
            
            if (wpPost) {
              console.info('BLOG_DETAIL', { 
                slug: normalizedSlug, 
                uaType: 'human', 
                used: 'wordpress', 
                status: 200, 
                note: `WordPress fallback success: ${wpPost.title.rendered}`
              });
                
                // Convert WordPress post to BlogPost format
                const convertedPost: BlogPost = {
                  id: wpPost.id,
                  title: wpPost.title.rendered,
                  excerpt: wpPost.excerpt.rendered.replace(/<[^>]*>/g, '').slice(0, 160),
                  author: {
                    id: 1,
                    name: 'Henry Hunter',
                    description: 'Master Baker',
                    avatar: '/placeholder-avatar.png'
                  },
                  date: new Date(wpPost.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  }),
                  modified: wpPost.modified,
                  image: wpPost._embedded?.['wp:featuredmedia']?.[0]?.source_url || '',
                  imageAlt: wpPost._embedded?.['wp:featuredmedia']?.[0]?.alt_text || wpPost.title.rendered,
                  link: `${window.location.origin}/blog/${normalizedSlug}`,
                  readTime: `${Math.ceil(wpPost.content.rendered.split(' ').length / 200)} min read`,
                  categories: wpPost._embedded?.['wp:term']?.[0] || [],
                  tags: wpPost._embedded?.['wp:term']?.[1] || [],
                  freshness: {
                    daysAgo: Math.floor((new Date().getTime() - new Date(wpPost.date).getTime()) / (1000 * 60 * 60 * 24)),
                    label: 'Recently published'
                  },
                  source: 'wordpress',
                  published_at: wpPost.date
                };
                
                setPost(convertedPost);
                
                // Set social image from featured media
                const featuredMedia = wpPost._embedded?.['wp:featuredmedia']?.[0];
                const finalSocialImageUrl = getSocialImageUrl(
                  featuredMedia?.source_url,
                  undefined,
                  heroBanner
                );
                setSocialImageUrl(finalSocialImageUrl);
                console.log('📱 WordPress social image URL:', finalSocialImageUrl);
                
                return;
              } else {
                console.log('❌ WordPress returned empty result for slug:', normalizedSlug);
              }
            } else {
              console.log('❌ WordPress API error:', wpResponse.status, wpResponse.statusText);
            }
          } catch (wpError) {
            console.error('❌ WordPress fallback failed:', wpError);
          }
          
          console.info('BLOG_DETAIL', { 
            slug: normalizedSlug, 
            uaType: 'human', 
            used: 'none', 
            status: 404, 
            note: 'Blog post not found in any source'
          });
          setError(`Blog post not found: ${normalizedSlug}`);
        } catch (err) {
        setError('Failed to load blog post');
        console.error('Failed to load post:', err);
      } finally {
        setLoading(false);
      }
    };

    loadPost();
  }, [slug]);

  const handleBack = () => {
    navigate('/blog');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-xl text-muted-foreground">Loading blog post...</div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold text-primary mb-4">Blog Post Not Found</h1>
          <p className="text-muted-foreground mb-8">{error || 'The requested blog post could not be found.'}</p>
          <Button onClick={handleBack} variant="warm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Blog
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <>
      <MetadataManager
        title={post.title}
        description={post.excerpt}
        canonical={`/blog/${slug}`}
        type="article"
        socialImageUrl={(supabasePost as any)?.social_image_url}
        inlineImageUrl={(supabasePost as any)?.inline_image_url}
        heroImageUrl={heroBannerUrl}
        imageAlt={post.imageAlt}
        author={post.author.name}
        publishedAt={supabasePost?.published_at}
        updatedAt={supabasePost?.updated_at}
        tags={post.tags}
        section="Bread Baking"
        debug={import.meta.env.DEV}
      />

      <div className="min-h-screen bg-background">
        <Header />
        {supabasePost ? (
          <SupabasePostView 
            post={post} 
            supabasePost={supabasePost} 
            onBack={handleBack} 
            heroBannerUrl={heroBannerUrl}
          />
        ) : (
          <BlogPostView post={post} onBack={handleBack} showComments={false} />
        )}
        <Footer />
      </div>
    </>
  );
};

export default BlogPost;