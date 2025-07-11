import { Tables } from '@/integrations/supabase/types';
import { BlogPost } from './blogFetcher';

// Extract YouTube video ID from URL
export const extractYouTubeId = (url: string) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

// Convert Supabase post to BlogPost format
export const convertSupabasePostToBlogPost = (supabasePost: Tables<'blog_posts'>): BlogPost => {
  return {
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
};