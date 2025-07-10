import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Plus, Send } from 'lucide-react';

interface ManualDraftSubmissionProps {
  onDraftSubmitted: () => void;
}

const ManualDraftSubmission = ({ onDraftSubmitted }: ManualDraftSubmissionProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    type: 'blog',
    title: '',
    subtitle: '',
    content: '',
    imageUrl: '',
    tags: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.content.trim()) {
      toast({
        title: "Missing content",
        description: "Please add a title and content.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        [formData.type === 'blog' ? 'blogDraft' : 'newsletterDraft']: {
          title: formData.title,
          subtitle: formData.subtitle || undefined,
          excerpt: formData.subtitle || undefined,
          content: formData.content,
          imageUrl: formData.imageUrl || undefined,
          tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()).filter(Boolean) : []
        }
      };

      const { error } = await supabase
        .from('ai_drafts')
        .insert({
          type: formData.type,
          payload,
          run_date: new Date().toISOString().split('T')[0]
        });

      if (error) throw error;

      toast({
        title: "Draft submitted",
        description: "Your manual draft has been added to the inbox."
      });

      // Reset form
      setFormData({
        type: 'blog',
        title: '',
        subtitle: '',
        content: '',
        imageUrl: '',
        tags: ''
      });

      onDraftSubmitted();
    } catch (error) {
      console.error('Error submitting manual draft:', error);
      toast({
        title: "Error",
        description: "Failed to submit draft. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Submit Manual Draft
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="type">Type</Label>
            <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="blog">Blog Post</SelectItem>
                <SelectItem value="newsletter">Newsletter</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Enter draft title..."
              required
            />
          </div>

          <div>
            <Label htmlFor="subtitle">Subtitle/Excerpt</Label>
            <Input
              id="subtitle"
              value={formData.subtitle}
              onChange={(e) => setFormData(prev => ({ ...prev, subtitle: e.target.value }))}
              placeholder="Brief description..."
            />
          </div>

          <div>
            <Label htmlFor="imageUrl">Image URL (optional)</Label>
            <Input
              id="imageUrl"
              value={formData.imageUrl}
              onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
              placeholder="https://example.com/image.jpg"
              type="url"
            />
          </div>

          <div>
            <Label htmlFor="tags">Tags (comma-separated)</Label>
            <Input
              id="tags"
              value={formData.tags}
              onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
              placeholder="baking, bread, recipes..."
            />
          </div>

          <div>
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
              placeholder="Enter your draft content in markdown format..."
              className="min-h-[200px]"
              required
            />
          </div>

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2" />
                Submitting...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Submit to Inbox
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ManualDraftSubmission;