import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';
import { 
  FileText, 
  Calendar, 
  ExternalLink, 
  Edit, 
  Share, 
  Copy,
  Facebook,
  Twitter,
  Mail,
  MoreHorizontal,
  Trash2
} from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { SocialShare } from '@/components/blog/SocialShare';

type BlogPost = Tables<'blog_posts'>;

interface PostsListProps {
  filter: 'all' | 'drafts' | 'published';
  onEditPost?: (post: BlogPost) => void;
}

export const PostsList = ({ filter, onEditPost }: PostsListProps) => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, [filter]);

  const fetchPosts = async () => {
    try {
      let query = supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (filter === 'drafts') {
        query = query.eq('is_draft', true);
      } else if (filter === 'published') {
        query = query.eq('is_draft', false);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast({
        title: "Error",
        description: "Failed to load posts.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getPostUrl = (post: BlogPost) => {
    return `${window.location.origin}/blog/${post.slug}`;
  };

  const copyPostUrl = async (post: BlogPost) => {
    const url = getPostUrl(post);
    try {
      await navigator.clipboard.writeText(url);
      toast({
        title: "Link copied",
        description: "Post URL copied to clipboard!"
      });
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Failed to copy link to clipboard.",
        variant: "destructive"
      });
    }
  };

  const shareOnSocial = (platform: string, post: BlogPost) => {
    const url = getPostUrl(post);
    const title = encodeURIComponent(post.title);
    const text = encodeURIComponent(post.subtitle || '');
    
    let shareUrl = '';
    
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${title}&url=${encodeURIComponent(url)}`;
        break;
      case 'email':
        shareUrl = `mailto:?subject=${title}&body=${text}%0A%0A${encodeURIComponent(url)}`;
        break;
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const deletePost = async (post: BlogPost) => {
    try {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', post.id);

      if (error) throw error;

      // Remove the post from local state
      setPosts(currentPosts => currentPosts.filter(p => p.id !== post.id));

      toast({
        title: "Post deleted",
        description: `"${post.title}" has been permanently deleted.`
      });
    } catch (error) {
      console.error('Error deleting post:', error);
      toast({
        title: "Delete failed",
        description: "Failed to delete the post. Please try again.",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-muted rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">
            No {filter === 'drafts' ? 'drafts' : filter === 'published' ? 'published posts' : 'posts'} found
          </h3>
          <p className="text-muted-foreground">
            {filter === 'drafts' 
              ? 'Start writing your first draft!' 
              : filter === 'published' 
              ? 'Publish your first post to see it here.'
              : 'Create your first blog post to get started.'
            }
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">
          {filter === 'drafts' ? 'Drafts' : filter === 'published' ? 'Published Posts' : 'All Posts'}
        </h2>
        <Badge variant="secondary">
          {posts.length} {posts.length === 1 ? 'post' : 'posts'}
        </Badge>
      </div>

      <div className="space-y-3">
        {posts.map((post) => (
          <Card key={post.id} className="group hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold text-foreground truncate">
                      {post.title}
                    </h3>
                    <Badge variant={post.is_draft ? "secondary" : "default"} className="shrink-0">
                      {post.is_draft ? 'Draft' : 'Published'}
                    </Badge>
                  </div>
                  
                  {post.subtitle && (
                    <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                      {post.subtitle}
                    </p>
                  )}
                  
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {post.is_draft ? 'Saved' : 'Published'} {new Date(post.created_at || '').toLocaleDateString()}
                    </div>
                    
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex gap-1">
                        {post.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {post.tags.length > 3 && (
                          <span className="text-muted-foreground">+{post.tags.length - 3} more</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 ml-4">
                  {!post.is_draft && (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.open(getPostUrl(post), '_blank')}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Share className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => copyPostUrl(post)}>
                            <Copy className="w-4 h-4 mr-2" />
                            Copy Link
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => shareOnSocial('facebook', post)}>
                            <Facebook className="w-4 h-4 mr-2" />
                            Share on Facebook
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => shareOnSocial('twitter', post)}>
                            <Twitter className="w-4 h-4 mr-2" />
                            Share on Twitter
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => shareOnSocial('email', post)}>
                            <Mail className="w-4 h-4 mr-2" />
                            Share via Email
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </>
                  )}
                  
                  {onEditPost && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEditPost(post)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                  )}

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Blog Post</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete "{post.title}"? This action cannot be undone and will permanently remove the blog post from your dashboard.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => deletePost(post)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Delete Post
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PostsList;