import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Filter, X } from 'lucide-react';
import { BlogPost } from '@/utils/blogFetcher';

interface TagFilterProps {
  posts: BlogPost[];
  selectedTags: string[];
  onTagChange: (tags: string[]) => void;
  className?: string;
}

const TagFilter = ({ posts, selectedTags, onTagChange, className }: TagFilterProps) => {
  const [showAll, setShowAll] = useState(false);
  
  // Get all unique tags with counts
  const tagCounts = posts.reduce((acc, post) => {
    post.tags.forEach(tag => {
      acc[tag] = (acc[tag] || 0) + 1;
    });
    return acc;
  }, {} as Record<string, number>);

  const allTags = Object.entries(tagCounts)
    .sort(([, a], [, b]) => b - a) // Sort by count descending
    .map(([tag, count]) => ({ tag, count }));

  const displayTags = showAll ? allTags : allTags.slice(0, 8);

  const handleTagToggle = (tag: string) => {
    if (selectedTags.includes(tag)) {
      onTagChange(selectedTags.filter(t => t !== tag));
    } else {
      onTagChange([...selectedTags, tag]);
    }
  };

  const clearAllTags = () => {
    onTagChange([]);
  };

  if (allTags.length === 0) return null;

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium">Filter by Tags</span>
          {selectedTags.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllTags}
              className="h-6 px-2 text-xs"
            >
              <X className="w-3 h-3 mr-1" />
              Clear
            </Button>
          )}
        </div>
        
        {allTags.length > 8 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAll(!showAll)}
            className="text-xs"
          >
            {showAll ? 'Show Less' : `Show All (${allTags.length})`}
          </Button>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {displayTags.map(({ tag, count }) => (
          <Badge
            key={tag}
            variant={selectedTags.includes(tag) ? "default" : "outline"}
            className="cursor-pointer hover:bg-primary/10 transition-colors"
            onClick={() => handleTagToggle(tag)}
          >
            {tag} ({count})
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default TagFilter;