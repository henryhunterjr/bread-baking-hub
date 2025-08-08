import { useState, useEffect } from 'react';
import { BlogPost, fetchBlogPosts } from '@/utils/blogFetcher';
import { ArrowRight } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { ResponsiveImage } from '@/components/ResponsiveImage';

interface RelatedPostsProps {
  currentPostId: number;
  categories: number[];
  className?: string;
}

const RelatedPosts = ({ currentPostId, categories, className }: RelatedPostsProps) => {
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRelatedPosts = async () => {
      try {
        setLoading(true);
        
        // Fetch posts from the same categories
        const promises = categories.map(categoryId => 
          fetchBlogPosts(1, categoryId, 6)
        );
        
        const results = await Promise.all(promises);
        
        // Combine and deduplicate posts
        const allPosts = results.flatMap(result => result.posts);
        const uniquePosts = allPosts.filter((post, index, self) => 
          post.id !== currentPostId && 
          self.findIndex(p => p.id === post.id) === index
        );
        
        // Take first 3 related posts
        setRelatedPosts(uniquePosts.slice(0, 3));
      } catch (error) {
        console.error('Failed to fetch related posts:', error);
      } finally {
        setLoading(false);
      }
    };

    if (categories.length > 0) {
      fetchRelatedPosts();
    } else {
      setLoading(false);
    }
  }, [currentPostId, categories]);

  if (loading) {
    return (
      <div className={`space-y-6 ${className}`}>
        <h3 className="text-2xl font-bold text-primary">Related Articles</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="bg-card rounded-xl overflow-hidden shadow-stone">
              <Skeleton className="w-full h-32" />
              <div className="p-4 space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (relatedPosts.length === 0) {
    return null;
  }

  return (
    <div className={`space-y-6 ${className}`}>
      <h3 className="text-2xl font-bold text-primary">Related Articles</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {relatedPosts.map((post) => (
          <article key={post.id} className="bg-card rounded-xl overflow-hidden shadow-stone hover:shadow-warm transition-all duration-300 group">
            <div className="relative overflow-hidden">
              {post.image ? (
                <ResponsiveImage 
                  src={post.image} 
                  alt={post.imageAlt || `Featured image for ${post.title}`}
                  className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-32 bg-muted flex items-center justify-center">
                  <span className="text-muted-foreground text-sm">No Image</span>
                </div>
              )}
            </div>
            <div className="p-4 space-y-3">
              <h4 className="font-bold text-card-foreground line-clamp-2 group-hover:text-primary transition-colors">
                {post.title}
              </h4>
              <p className="text-sm text-muted-foreground line-clamp-2">{post.excerpt}</p>
              <a 
                href={post.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-primary hover:text-primary/80 font-medium transition-colors text-sm group-hover:underline"
              >
                Read More
                <ArrowRight className="ml-1 w-3 h-3" />
              </a>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default RelatedPosts;