import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Header from '../components/Header';
import Footer from '../components/Footer';
import BlogPostView from '../components/blog/BlogPostView';
import BlogPostSEO from '../components/blog/BlogPostSEO';
import { LoadingState } from '../components/LoadingState';
import { fetchBlogPosts, type BlogPost } from '@/utils/blogFetcher';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPost = async () => {
      if (!slug) return;
      
      try {
        setLoading(true);
        setError(null);
        
        console.log('Looking for blog post with slug:', slug);
        
        // Search for post by slug - fetch more posts to increase chances of finding it
        const response = await fetchBlogPosts(1, undefined, 100);
        console.log('Fetched posts:', response.posts.length);
        
        const foundPost = response.posts.find(p => {
          // Extract slug from WordPress URL same way as BlogPostGrid
          const urlParts = p.link.split('/');
          const postSlug = urlParts[urlParts.length - 2] || urlParts[urlParts.length - 1];
          console.log('Comparing post slug:', postSlug, 'with:', slug, 'for post:', p.title);
          return postSlug === slug;
        });
        
        if (foundPost) {
          console.log('Found post:', foundPost.title);
          setPost(foundPost);
        } else {
          console.log('No post found for slug:', slug);
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
        <BlogPostView post={post} onBack={handleBack} showComments={false} />
        <Footer />
      </div>
    </>
  );
};

export default BlogPost;