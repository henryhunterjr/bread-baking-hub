import { ArrowRight } from 'lucide-react';
import { BlogPost } from '@/utils/blogFetcher';
import { trackBlogClick } from '@/utils/blogEvents';
import BlogPostMeta from './BlogPostMeta';
import BlogPostSEO from './BlogPostSEO';
import SocialShare from './SocialShare';
import { ResponsiveImage } from '@/components/ResponsiveImage';

interface BlogCardProps {
  post: BlogPost;
  categories?: Array<{ id: number; name: string }>;
  enableSEO?: boolean;
}

const BlogCard = ({ post, categories = [], enableSEO = false }: BlogCardProps) => {
  const handlePostClick = () => {
    // Get category names for this post
    const postCategoryNames = post.categories
      .map(catId => categories.find(cat => cat.id === catId)?.name)
      .filter(Boolean) as string[];

    trackBlogClick({
      post_id: post.id.toString(),
      post_title: post.title,
      post_url: post.link,
      category_names: postCategoryNames
    });
  };

  return (
    <article className="bg-card rounded-xl overflow-hidden shadow-stone hover:shadow-warm transition-all duration-300 group">
      {enableSEO && <BlogPostSEO post={post} />}
      <a 
        href={post.link}
        onClick={handlePostClick}
        className="block"
        target="_blank"
        rel="noopener noreferrer"
      >
        <div className="relative overflow-hidden">
          <div className="w-full h-48 bg-muted">
            {post.image ? (
              <ResponsiveImage 
                src={post.image} 
                alt={post.imageAlt || `Featured image for ${post.title}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
                aspectRatio="16/9"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-muted-foreground">No Image</span>
              </div>
            )}
          </div>
          <div className="absolute top-4 right-4 bg-black/70 text-foreground px-2 py-1 rounded text-sm">
            {post.readTime}
          </div>
        </div>
      </a>
      <div className="p-6 space-y-4">
        <a 
          href={post.link}
          onClick={handlePostClick}
          className="block"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h3 className="text-xl font-bold text-card-foreground line-clamp-2 group-hover:text-primary transition-colors">
            {post.title}
          </h3>
        </a>
        
        <BlogPostMeta 
          post={post} 
          showTags={true}
          showAuthor={true}
          showFreshness={true}
          compact={true}
        />
        
        <p className="text-muted-foreground line-clamp-3">{post.excerpt}</p>
        
        <div className="flex items-center justify-between">
          <a 
            href={`/go?u=${encodeURIComponent(post.link)}`}
            onClick={handlePostClick}
            className="inline-flex items-center text-primary hover:text-primary/80 font-medium transition-colors group-hover:underline"
            target="_self"
            rel="noopener noreferrer"
          >
            Read More
            <ArrowRight className="ml-1 w-4 h-4" />
          </a>
          
          <SocialShare
            url={post.link}
            title={post.title}
            description={post.excerpt}
            image={post.image}
            compact={true}
          />
        </div>
      </div>
    </article>
  );
};

export default BlogCard;