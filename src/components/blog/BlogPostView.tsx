import { useState, useEffect } from 'react';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import BlogPostSEO from './BlogPostSEO';
import BlogPostMeta from './BlogPostMeta';
import CommentsSystem from './CommentsSystem';
import { BlogPost } from '@/utils/blogFetcher';

interface BlogPostViewProps {
  post: BlogPost;
  onBack: () => void;
  showComments?: boolean;
}

export const BlogPostView = ({ post, onBack, showComments = false }: BlogPostViewProps) => {
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true);
        const response = await fetch(post.link);
        const html = await response.text();
        
        // Extract content from the WordPress post
        // This is a simplified extraction - in production you might want more sophisticated parsing
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const contentElement = doc.querySelector('.entry-content, .post-content, main article');
        setContent(contentElement?.innerHTML || post.excerpt);
      } catch (error) {
        console.error('Failed to fetch post content:', error);
        setContent(post.excerpt);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [post]);

  return (
    <div className="min-h-screen bg-background">
      <BlogPostSEO post={post} fullContent={content} />
      
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

        <article className="prose prose-lg max-w-none">
          {/* Featured Image */}
          {post.image && (
            <div className="relative mb-8 rounded-xl overflow-hidden">
              <img
                src={post.image}
                alt={post.imageAlt}
                className="w-full h-64 md:h-96 object-cover"
              />
            </div>
          )}

          {/* Header */}
          <header className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              {post.title}
            </h1>
            
            <BlogPostMeta 
              post={post} 
              showTags={true}
              showAuthor={true}
              showFreshness={true}
              compact={false}
            />
            
            {/* Tags */}
            {post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {post.tags.map(tag => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </header>

          {/* Content */}
          <div className="mb-8">
            {loading ? (
              <div className="space-y-4">
                <div className="h-4 bg-muted rounded animate-pulse" />
                <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
                <div className="h-4 bg-muted rounded animate-pulse w-1/2" />
              </div>
            ) : (
              <div 
                className="prose-content"
                dangerouslySetInnerHTML={{ __html: content }}
              />
            )}
          </div>

          {/* Original Link */}
          <div className="border-t pt-6 mb-8">
            <a
              href={post.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-primary hover:text-primary/80 font-medium"
            >
              View Original Post
              <ExternalLink className="ml-1 h-4 w-4" />
            </a>
          </div>

          {/* Author Bio */}
          <div className="bg-muted/50 rounded-lg p-6 mb-8">
            <div className="flex items-start gap-4">
              <img
                src={post.author.avatar}
                alt={`${post.author.name} avatar`}
                className="w-16 h-16 rounded-full"
              />
              <div>
                <h3 className="font-semibold text-lg mb-2">About {post.author.name}</h3>
                <p className="text-muted-foreground">
                  {post.author.description || 
                   "Expert baker and author sharing knowledge about the art and science of bread making."}
                </p>
              </div>
            </div>
          </div>

          {/* Comments */}
          {showComments && (
            <div className="mt-12">
              <CommentsSystem postId={post.id.toString()} postTitle={post.title} />
            </div>
          )}
        </article>
      </div>
    </div>
  );
};

export default BlogPostView;