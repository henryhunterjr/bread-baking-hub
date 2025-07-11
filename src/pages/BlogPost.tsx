import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Header from '../components/Header';
import Footer from '../components/Footer';
import BlogPostView from '../components/blog/BlogPostView';
import BlogPostSEO from '../components/blog/BlogPostSEO';
import SupabasePostView from '../components/blog/SupabasePostView';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useBlogPost } from '@/hooks/useBlogPost';

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { post, supabasePost, loading, error } = useBlogPost(slug);

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