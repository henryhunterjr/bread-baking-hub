import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { MessageCircle, Send, User } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Comment {
  id: string;
  author_name: string;
  author_email: string;
  content: string;
  created_at: string;
  user_id?: string;
}

interface CommentsSystemProps {
  postId: string;
  postTitle: string;
  enabled?: boolean;
}

const CommentsSystem = ({ postId, postTitle, enabled = false }: CommentsSystemProps) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState({
    author_name: '',
    author_email: '',
    content: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (enabled) {
      loadComments();
    }
  }, [postId, enabled]);

  const loadComments = async () => {
    try {
      setIsLoading(true);
      // In a real implementation, you'd have a comments table
      // For now, we'll simulate it
      setComments([]);
    } catch (error) {
      console.error('Failed to load comments:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newComment.content.trim() || !newComment.author_name.trim() || !newComment.author_email.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // In a real implementation, you'd save to a comments table
      // For now, we'll just show a success message
      toast.success('Comment submitted for moderation');
      setNewComment({ author_name: '', author_email: '', content: '' });
    } catch (error) {
      console.error('Failed to submit comment:', error);
      toast.error('Failed to submit comment');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!enabled) {
    return (
      <Card className="mt-8">
        <CardContent className="p-6 text-center">
          <MessageCircle className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-muted-foreground">
            Comments are currently disabled for this blog.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="mt-8 space-y-6">
      <div className="flex items-center gap-2">
        <MessageCircle className="w-5 h-5" />
        <h3 className="text-xl font-bold">Comments</h3>
      </div>

      {/* Comments List */}
      {isLoading ? (
        <div className="text-center py-4">
          <p className="text-muted-foreground">Loading comments...</p>
        </div>
      ) : comments.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">
              No comments yet. Be the first to share your thoughts!
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <Card key={comment.id}>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{comment.author_name}</span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(comment.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm">{comment.content}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Comment Form */}
      <Card>
        <CardContent className="p-6">
          <h4 className="font-medium mb-4">Leave a Comment</h4>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                placeholder="Your Name"
                value={newComment.author_name}
                onChange={(e) => setNewComment(prev => ({ ...prev, author_name: e.target.value }))}
                required
              />
              <Input
                type="email"
                placeholder="Your Email"
                value={newComment.author_email}
                onChange={(e) => setNewComment(prev => ({ ...prev, author_email: e.target.value }))}
                required
              />
            </div>
            <Textarea
              placeholder="Share your thoughts..."
              value={newComment.content}
              onChange={(e) => setNewComment(prev => ({ ...prev, content: e.target.value }))}
              className="min-h-[100px]"
              required
            />
            <div className="flex justify-between items-center">
              <p className="text-xs text-muted-foreground">
                Comments are moderated and will appear after approval.
              </p>
              <Button type="submit" disabled={isSubmitting} className="flex items-center gap-2">
                <Send className="w-4 h-4" />
                {isSubmitting ? 'Submitting...' : 'Submit Comment'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CommentsSystem;