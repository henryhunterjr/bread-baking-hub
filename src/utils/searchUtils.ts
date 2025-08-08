import { logger } from '@/utils/logger';
// Simple search utility - no external dependencies
export interface SearchablePost {
  title: string;
  excerpt: string;
  tags: string[];
}

export const filterPosts = (posts: SearchablePost[], query: string): SearchablePost[] => {
  if (!query.trim()) return posts;
  
  const searchLower = query.toLowerCase();
  logger.log('Filtering posts with query:', searchLower);
  
  return posts.filter(post => {
    const titleMatch = post.title.toLowerCase().includes(searchLower);
    const excerptMatch = post.excerpt.toLowerCase().includes(searchLower);
    const tagMatch = post.tags.some(tag => tag.toLowerCase().includes(searchLower));
    
    return titleMatch || excerptMatch || tagMatch;
  });
};