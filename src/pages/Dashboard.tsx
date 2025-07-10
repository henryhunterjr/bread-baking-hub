import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { Navigate } from 'react-router-dom';
import { 
  PenTool, 
  Save, 
  Send, 
  Upload, 
  Eye, 
  Settings, 
  FileText,
  Mail
} from 'lucide-react';
import ContentEditor from '@/components/dashboard/ContentEditor';
import PreviewPanel from '@/components/dashboard/PreviewPanel';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import { supabase } from '@/integrations/supabase/client';

interface BlogPostData {
  id?: string;
  title: string;
  subtitle: string;
  content: string;
  heroImageUrl: string;
  tags: string[];
  publishAsNewsletter: boolean;
  isDraft: boolean;
}

const Dashboard = () => {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('blog');
  const [isPublishing, setIsPublishing] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [postData, setPostData] = useState<BlogPostData>({
    title: '',
    subtitle: '',
    content: '',
    heroImageUrl: '',
    tags: [],
    publishAsNewsletter: false,
    isDraft: true
  });

  // Redirect if not authenticated
  if (!loading && !user) {
    return <Navigate to="/auth" replace />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const handleSaveDraft = async () => {
    setIsSavingDraft(true);
    try {
      const { data, error } = await supabase.functions.invoke('upsert-post', {
        body: { ...postData, isDraft: true }
      });

      if (error) throw error;

      toast({
        title: "Draft saved",
        description: "Your draft has been saved successfully."
      });
    } catch (error) {
      console.error('Error saving draft:', error);
      toast({
        title: "Error",
        description: "Failed to save draft. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSavingDraft(false);
    }
  };

  const handlePublish = async () => {
    if (!postData.title.trim() || !postData.content.trim()) {
      toast({
        title: "Missing content",
        description: "Please add a title and content before publishing.",
        variant: "destructive"
      });
      return;
    }

    setIsPublishing(true);
    try {
      const { data, error } = await supabase.functions.invoke('upsert-post', {
        body: { ...postData, isDraft: false }
      });

      if (error) throw error;

      if (postData.publishAsNewsletter) {
        // Queue newsletter
        const { error: newsletterError } = await supabase.functions.invoke('send-newsletter', {
          body: {
            title: postData.title,
            excerpt: postData.subtitle,
            content: postData.content,
            postUrl: `${window.location.origin}/blog/${data.slug}`
          }
        });

        if (newsletterError) {
          console.error('Newsletter error:', newsletterError);
          toast({
            title: "Blog post published",
            description: "Post is live, but newsletter failed to send."
          });
        } else {
          toast({
            title: "Published & newsletter queued",
            description: "Your blog post is live and newsletter has been queued."
          });
        }
      } else {
        toast({
          title: "Blog post live",
          description: "Your blog post has been published successfully."
        });
      }

      // Reset form
      setPostData({
        title: '',
        subtitle: '',
        content: '',
        heroImageUrl: '',
        tags: [],
        publishAsNewsletter: false,
        isDraft: true
      });
    } catch (error) {
      console.error('Error publishing:', error);
      toast({
        title: "Error",
        description: "Failed to publish post. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsPublishing(false);
    }
  };

  const handleImageUpload = async (file: File) => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${user?.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('hero-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('hero-images')
        .getPublicUrl(filePath);

      setPostData(prev => ({ ...prev, heroImageUrl: data.publicUrl }));
      
      toast({
        title: "Image uploaded",
        description: "Hero image has been uploaded successfully."
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Upload failed",
        description: "Failed to upload image. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <DashboardSidebar />

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-auto">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Content Dashboard</h1>
            <p className="text-muted-foreground">Create and manage your blog posts and newsletters</p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="blog" className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Blog Post
              </TabsTrigger>
              <TabsTrigger value="newsletter" className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Newsletter
              </TabsTrigger>
            </TabsList>

            <TabsContent value="blog" className="space-y-6">
              <BlogPostTab 
                postData={postData}
                setPostData={setPostData}
                onImageUpload={handleImageUpload}
                onSaveDraft={handleSaveDraft}
                onPublish={handlePublish}
                isSavingDraft={isSavingDraft}
                isPublishing={isPublishing}
              />
            </TabsContent>

            <TabsContent value="newsletter" className="space-y-6">
              <NewsletterTab 
                postData={postData}
                setPostData={setPostData}
                onImageUpload={handleImageUpload}
                onSaveDraft={handleSaveDraft}
                onPublish={handlePublish}
                isSavingDraft={isSavingDraft}
                isPublishing={isPublishing}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

interface PostTabProps {
  postData: BlogPostData;
  setPostData: (data: BlogPostData | ((prev: BlogPostData) => BlogPostData)) => void;
  onImageUpload: (file: File) => Promise<void>;
  onSaveDraft: () => Promise<void>;
  onPublish: () => Promise<void>;
  isSavingDraft: boolean;
  isPublishing: boolean;
}

const BlogPostTab = ({ 
  postData, 
  setPostData, 
  onImageUpload, 
  onSaveDraft, 
  onPublish, 
  isSavingDraft, 
  isPublishing 
}: PostTabProps) => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
    {/* Editor Section */}
    <div className="space-y-6">
      <PostForm 
        postData={postData}
        setPostData={setPostData}
        onImageUpload={onImageUpload}
        showNewsletterToggle={true}
      />
      
      <ContentEditor 
        content={postData.content}
        onChange={(content) => setPostData(prev => ({ ...prev, content }))}
      />
      
      <PostActions 
        onSaveDraft={onSaveDraft}
        onPublish={onPublish}
        isSavingDraft={isSavingDraft}
        isPublishing={isPublishing}
      />
    </div>

    {/* Preview Section */}
    <div className="lg:sticky lg:top-6">
      <PreviewPanel postData={postData} />
    </div>
  </div>
);

const NewsletterTab = ({ 
  postData, 
  setPostData, 
  onImageUpload, 
  onSaveDraft, 
  onPublish, 
  isSavingDraft, 
  isPublishing 
}: PostTabProps) => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
    {/* Editor Section */}
    <div className="space-y-6">
      <PostForm 
        postData={postData}
        setPostData={setPostData}
        onImageUpload={onImageUpload}
        showNewsletterToggle={false}
      />
      
      <ContentEditor 
        content={postData.content}
        onChange={(content) => setPostData(prev => ({ ...prev, content }))}
      />
      
      <PostActions 
        onSaveDraft={onSaveDraft}
        onPublish={onPublish}
        isSavingDraft={isSavingDraft}
        isPublishing={isPublishing}
        publishLabel="Send Newsletter"
      />
    </div>

    {/* Preview Section */}
    <div className="lg:sticky lg:top-6">
      <PreviewPanel postData={postData} isNewsletter />
    </div>
  </div>
);

interface PostFormProps {
  postData: BlogPostData;
  setPostData: (data: BlogPostData | ((prev: BlogPostData) => BlogPostData)) => void;
  onImageUpload: (file: File) => Promise<void>;
  showNewsletterToggle: boolean;
}

const PostForm = ({ postData, setPostData, onImageUpload, showNewsletterToggle }: PostFormProps) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <PenTool className="w-5 h-5" />
        Post Details
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={postData.title}
          onChange={(e) => setPostData(prev => ({ ...prev, title: e.target.value }))}
          placeholder="Enter your post title..."
          className="mt-1"
        />
      </div>

      <div>
        <Label htmlFor="subtitle">Subtitle/Excerpt</Label>
        <Input
          id="subtitle"
          value={postData.subtitle}
          onChange={(e) => setPostData(prev => ({ ...prev, subtitle: e.target.value }))}
          placeholder="Brief description or excerpt..."
          className="mt-1"
        />
      </div>

      <div>
        <Label htmlFor="hero-image">Hero Image</Label>
        <div className="mt-1 flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            asChild
            className="cursor-pointer"
          >
            <label htmlFor="image-upload">
              <Upload className="w-4 h-4 mr-2" />
              Upload Image
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) onImageUpload(file);
                }}
              />
            </label>
          </Button>
          {postData.heroImageUrl && (
            <img
              src={postData.heroImageUrl}
              alt="Hero preview"
              className="w-16 h-16 object-cover rounded border"
            />
          )}
        </div>
      </div>

      <div>
        <Label htmlFor="tags">Tags (comma-separated)</Label>
        <Input
          id="tags"
          value={postData.tags.join(', ')}
          onChange={(e) => setPostData(prev => ({ 
            ...prev, 
            tags: e.target.value.split(',').map(tag => tag.trim()).filter(Boolean)
          }))}
          placeholder="baking, bread, recipes..."
          className="mt-1"
        />
      </div>

      {showNewsletterToggle && (
        <div className="flex items-center space-x-2">
          <Switch
            id="newsletter"
            checked={postData.publishAsNewsletter}
            onCheckedChange={(checked) => setPostData(prev => ({ ...prev, publishAsNewsletter: checked }))}
          />
          <Label htmlFor="newsletter">Publish as Newsletter</Label>
        </div>
      )}
    </CardContent>
  </Card>
);

interface PostActionsProps {
  onSaveDraft: () => Promise<void>;
  onPublish: () => Promise<void>;
  isSavingDraft: boolean;
  isPublishing: boolean;
  publishLabel?: string;
}

const PostActions = ({ 
  onSaveDraft, 
  onPublish, 
  isSavingDraft, 
  isPublishing, 
  publishLabel = "Publish" 
}: PostActionsProps) => (
  <Card>
    <CardContent className="pt-6">
      <div className="flex gap-4">
        <Button
          variant="outline"
          onClick={onSaveDraft}
          disabled={isSavingDraft || isPublishing}
          className="flex-1"
        >
          {isSavingDraft ? (
            <>
              <div className="w-4 h-4 border-2 border-muted-foreground border-t-transparent rounded-full animate-spin mr-2" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save Draft
            </>
          )}
        </Button>
        <Button
          onClick={onPublish}
          disabled={isSavingDraft || isPublishing}
          className="flex-1"
        >
          {isPublishing ? (
            <>
              <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2" />
              Publishing...
            </>
          ) : (
            <>
              <Send className="w-4 h-4 mr-2" />
              {publishLabel}
            </>
          )}
        </Button>
      </div>
    </CardContent>
  </Card>
);

export default Dashboard;