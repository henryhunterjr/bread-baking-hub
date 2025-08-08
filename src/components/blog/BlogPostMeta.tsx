import { Clock, User, Calendar, Tag } from 'lucide-react';
import { BlogPost } from '@/utils/blogFetcher';
import { Badge } from '@/components/ui/badge';
import { ResponsiveImage } from '@/components/ResponsiveImage';

interface BlogPostMetaProps {
  post: BlogPost;
  showTags?: boolean;
  showAuthor?: boolean;
  showFreshness?: boolean;
  compact?: boolean;
}

const BlogPostMeta = ({ 
  post, 
  showTags = true, 
  showAuthor = true, 
  showFreshness = true,
  compact = false 
}: BlogPostMetaProps) => {
  return (
    <div className={`space-y-3 ${compact ? 'text-sm' : ''}`}>
      {/* Author Info */}
      {showAuthor && (
        <div className="flex items-center gap-2">
          <ResponsiveImage 
            src="/lovable-uploads/2684d6d8-b462-457a-b9c0-98603f87a17e.png"
            alt={`${post.author.name} avatar`}
            className="w-6 h-6 rounded-full object-cover"
            loading="lazy"
          />
          <div className="flex items-center gap-1 text-muted-foreground">
            <User className="w-3 h-3" />
            <span>{post.author.name}</span>
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
        {/* Published Date */}
        <div className="flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          <span>{post.date}</span>
        </div>

        {/* Reading Time */}
        <div className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          <span>{post.readTime}</span>
        </div>

        {/* Freshness Indicator */}
        {showFreshness && (
          <div className={`flex items-center gap-1 ${
            post.freshness.daysAgo <= 7 ? 'text-green-600' : 
            post.freshness.daysAgo <= 30 ? 'text-yellow-600' : 
            'text-muted-foreground'
          }`}>
            <span className="text-xs">Updated {post.freshness.label}</span>
          </div>
        )}
      </div>

      {/* Tags */}
      {showTags && post.tags.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          <Tag className="w-3 h-3 text-muted-foreground" />
          <div className="flex gap-1 flex-wrap">
            {post.tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs px-2 py-0.5">
                {tag}
              </Badge>
            ))}
            {post.tags.length > 3 && (
              <span className="text-xs text-muted-foreground">
                +{post.tags.length - 3} more
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogPostMeta;