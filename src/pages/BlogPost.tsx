import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Header from '../components/Header';
import Footer from '../components/Footer';
import BlogPostView from '../components/blog/BlogPostView';
import BlogPostSEO from '../components/blog/BlogPostSEO';
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

// Component for rendering Supabase blog posts with professional typography
const SupabasePostView = ({ 
  post, 
  supabasePost, 
  onBack 
}: { 
  post: BlogPost; 
  supabasePost: Tables<'blog_posts'>; 
  onBack: () => void; 
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

        {/* Professional Blog Content */}
        <div className="blog-content">
          {/* Blog Title */}
          <h1>{supabasePost.title}</h1>
          
          {/* Author and Meta Information */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-8 justify-center">
            <div className="flex items-center gap-3">
              <img
                src="/lovable-uploads/075e9974-b456-4062-b427-d167d61a6e70.png"
                alt="Henry Hunter"
                className="w-8 h-8 rounded-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/placeholder-avatar.png';
                }}
              />
              <span className="font-semibold text-foreground text-base">Henry Hunter</span>
            </div>
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

          {/* Featured Image */}
          {supabasePost.hero_image_url && (
            <img
              src={supabasePost.hero_image_url}
              alt={supabasePost.title}
              className="w-full h-64 sm:h-80 lg:h-96 object-cover rounded-lg mb-8"
            />
          )}

          {/* Main Content */}
          <ReactMarkdown 
            remarkPlugins={[remarkGfm]}
            components={{
              img: ({ src, alt, ...props }) => (
                <img 
                  src={src} 
                  alt={alt} 
                  loading="lazy"
                  {...props}
                />
              ),
              a: ({ href, children, ...props }) => (
                <a 
                  href={href} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  {...props}
                >
                  {children}
                </a>
              ),
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
              image={supabasePost.hero_image_url || ''}
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPost = async () => {
      if (!slug) return;
      
      try {
        setLoading(true);
        setError(null);
        
        console.log('Looking for blog post with slug:', slug);
        console.log('Full URL pathname:', window.location.pathname);
        
        // Find the post in Supabase (dashboard-created posts only)
        console.log('Searching for Supabase post with slug:', slug);
        
        // First try with is_draft = false (published posts)
        let { data: supabasePost, error: supabaseError } = await supabase
          .from('blog_posts')
          .select('*')
          .eq('slug', slug)
          .eq('is_draft', false)
          .single();

        // If not found, try with any draft status (in case it's still marked as draft)
        if (!supabasePost && supabaseError) {
          console.log('Post not found with is_draft=false, trying any draft status...');
          const { data: draftPost, error: draftError } = await supabase
            .from('blog_posts')
            .select('*')
            .eq('slug', slug)
            .single();
          
          if (draftPost) {
            console.log('Found post with draft status:', draftPost.is_draft);
            supabasePost = draftPost;
            supabaseError = draftError;
          }
        }

        if (supabasePost && !supabaseError) {
          console.log('Found Supabase post:', supabasePost.title, 'Draft status:', supabasePost.is_draft);
          
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
            }
          };
          
          setPost(convertedPost);
          setSupabasePost(supabasePost);
          return;
        } else {
          console.log('Supabase query error:', supabaseError);
          console.log('No Supabase post found with slug:', slug);
          setError('Blog post not found');
        }
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
      <BlogPostSEO 
        post={post}
        canonical={`${window.location.origin}/blog/${slug}`}
      />

      <div className="min-h-screen bg-background">
        <Header />
        {supabasePost ? (
          <SupabasePostView post={post} supabasePost={supabasePost} onBack={handleBack} />
        ) : (
          <BlogPostView post={post} onBack={handleBack} showComments={false} />
        )}
        <Footer />
      </div>
    </>
  );
};

export default BlogPost;