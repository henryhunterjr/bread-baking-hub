import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Clock, Tag } from 'lucide-react';
import SocialShare from './SocialShare';
import NewsletterSignup from '../NewsletterSignup';
import BlogHeroBanner from '../BlogHeroBanner';
import { Tables } from '@/integrations/supabase/types';
import { BlogPost } from '@/utils/blogFetcher';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface SupabasePostViewProps {
  post: BlogPost;
  supabasePost: Tables<'blog_posts'>;
  onBack: () => void;
}

const SupabasePostView = ({ post, supabasePost, onBack }: SupabasePostViewProps) => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Banner at the very top */}
      <BlogHeroBanner />
      
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

          {/* Featured Image */}
          {supabasePost.hero_image_url && (
            <img
              src={supabasePost.hero_image_url}
              alt={supabasePost.title}
              className="w-full h-64 sm:h-80 lg:h-96 object-cover rounded-lg mb-8"
            />
          )}

          {/* Main Content */}
          <div className="prose prose-lg max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {supabasePost.content}
            </ReactMarkdown>
          </div>

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

export default SupabasePostView;