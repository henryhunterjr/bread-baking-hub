import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { Navigate, useSearchParams } from 'react-router-dom';
import { 
  PenTool, 
  Save, 
  Send, 
  Upload, 
  Eye, 
  Settings, 
  FileText,
  Mail,
  Inbox,
  Image as ImageIcon
} from 'lucide-react';
import ContentEditor from '@/components/dashboard/ContentEditor';
import PreviewPanel from '@/components/dashboard/PreviewPanel';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import InboxTab from '@/components/dashboard/InboxTab';
import InboxBadge from '@/components/dashboard/InboxBadge';
import PostsList from '@/components/dashboard/PostsList';
import { BlogImageUploader } from '@/components/BlogImageUploader';
import { BlogImageGrid } from '@/components/BlogImageGrid';
import { UpdateThumbnail } from '@/components/dashboard/UpdateThumbnail';
import { SiteSettings } from '@/components/dashboard/SiteSettings';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';

interface BlogPostData {
  id?: string;
  title: string;
  subtitle: string;
  content: string;
  heroImageUrl: string; // Keep for backward compatibility
  inlineImageUrl?: string;
  socialImageUrl?: string;
  tags: string[];
  publishAsNewsletter: boolean;
  isDraft: boolean;
}

const Dashboard = () => {
  const { user, loading } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(() => {
    const newParam = searchParams.get('new');
    if (newParam === 'true') return 'blog';
    return searchParams.get('tab') || 'posts';
  });
  const [isPublishing, setIsPublishing] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [postData, setPostData] = useState<BlogPostData>({
    title: '',
    subtitle: '',
    content: '',
    heroImageUrl: '', // Keep for backward compatibility
    inlineImageUrl: '',
    socialImageUrl: '',
    tags: [],
    publishAsNewsletter: false,
    isDraft: true
  });

  // Handle draft import from URL parameter
  useEffect(() => {
    const draftId = searchParams.get('draftId');
    if (draftId) {
      const loadDraft = async () => {
        try {
          const { data, error } = await supabase.functions.invoke(`ai-drafts/${draftId}`);
          if (error) throw error;
          
          const draft = data;
          const payload = draft.payload;
          const draftContent = payload.blogDraft || payload.newsletterDraft || payload;
          
          setPostData({
            title: draftContent.title || '',
            subtitle: draftContent.excerpt || draftContent.subtitle || '',
            content: draftContent.body || draftContent.content || '',
            heroImageUrl: draftContent.imageUrl || (draftContent.imageUrls && draftContent.imageUrls[0]) || '',
            tags: draftContent.tags || [],
            publishAsNewsletter: draft.type === 'newsletter',
            isDraft: true
          });
          
          // Set appropriate tab based on draft type
          setActiveTab(draft.type === 'newsletter' ? 'newsletter' : 'blog');
          
          // Clear the draftId from URL
          const newSearchParams = new URLSearchParams(searchParams);
          newSearchParams.delete('draftId');
          setSearchParams(newSearchParams);
        } catch (error) {
          console.error('Error loading draft:', error);
          toast({
            title: "Error",
            description: "Failed to load AI draft.",
            variant: "destructive"
          });
        }
      };
      
      loadDraft();
    }
  }, [searchParams, setSearchParams]);

  const handleImportDraft = async (importData: any) => {
    const { postData: importedData } = importData;
    if (importedData) {
      setPostData(importedData);
      setActiveTab(importedData.publishAsNewsletter ? 'newsletter' : 'blog');
      
      // Auto-save the imported draft to prevent loss on refresh
      try {
        await supabase.functions.invoke('upsert-post', {
          body: { 
            postData: { ...importedData, isDraft: true },
            userId: user.id
          }
        });
        
        toast({
          title: "Draft imported & saved",
          description: "AI draft has been imported and automatically saved."
        });
      } catch (error) {
        console.error('Error auto-saving imported draft:', error);
        toast({
          title: "Draft imported",
          description: "AI draft imported but couldn't auto-save. Please save manually."
        });
      }
    }
  };

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
        body: { 
          postData: { ...postData, isDraft: true },
          userId: user.id
        }
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
      console.log('Publishing post with data:', { ...postData, isDraft: false });
      
      const response = await supabase.functions.invoke('upsert-post', {
        body: { 
          postData: { ...postData, isDraft: false },
          userId: user.id
        }
      });
      
      console.log('Supabase function response:', response);
      
      if (response.error) {
        console.error('Function invocation error:', response.error);
        throw response.error;
      }
      
      const { data, error } = response;
      if (error) throw error;

      // Fetch the actual post data to get the correct slug
      const { data: publishedPost } = await supabase
        .from('blog_posts')
        .select('slug')
        .eq('id', data.id)
        .single();
      
      const actualSlug = publishedPost?.slug || data.slug;
      
      // Debug logging
      console.log('Published post slug:', publishedPost?.slug);
      console.log('Data slug:', data.slug);
      console.log('Actual slug used:', actualSlug);
      
      if (!actualSlug) {
        console.error('No slug found for published post');
        toast({
          title: "Published with warning",
          description: "Post is live but slug generation failed. Check your posts list.",
          variant: "destructive"
        });
        return;
      }
      
      if (postData.publishAsNewsletter) {
        // Queue newsletter
        const { error: newsletterError } = await supabase.functions.invoke('send-newsletter', {
          body: {
            title: postData.title,
            excerpt: postData.subtitle,
            content: postData.content,
            postUrl: `${window.location.origin}/blog/${actualSlug}`
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
        const postUrl = `${window.location.origin}/blog/${actualSlug}`;
        toast({
          title: "Blog post live",
          description: (
            <div className="space-y-2">
              <p>Your blog post has been published successfully!</p>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => navigator.clipboard.writeText(postUrl)}
                className="w-full"
              >
                Copy Share Link
              </Button>
            </div>
          ),
        });
      }

      // Switch to posts tab to show the new post
      setActiveTab('posts');
      
      // Reset form
      setPostData({
        title: '',
        subtitle: '',
        content: '',
        heroImageUrl: '',
        inlineImageUrl: '',
        socialImageUrl: '',
        tags: [],
        publishAsNewsletter: false,
        isDraft: true
      });
    } catch (error) {
      console.error('Error publishing:', error);
      
      // Extract meaningful error message from Supabase function response
      let errorMessage = "Failed to publish post. Please try again.";
      
      // Check if it's a FunctionsHttpError with a response body
      if (error && typeof error === 'object' && 'name' in error && error.name === 'FunctionsHttpError') {
        try {
          // For Supabase function errors, the actual error message is usually in the response body
          // We need to check the data property which contains the parsed response
          if ((error as any).context && (error as any).context.data) {
            const responseData = (error as any).context.data;
            if (responseData.error) {
              errorMessage = responseData.error;
            }
          }
        } catch (parseError) {
          console.error('Error parsing function error:', parseError);
        }
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsPublishing(false);
    }
  };

  const handleImageUpload = async (file: File, imageType: 'hero' | 'inline' | 'social' = 'hero') => {
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

      // Update the appropriate field based on image type
      setPostData(prev => {
        switch (imageType) {
          case 'inline':
            return { ...prev, inlineImageUrl: data.publicUrl };
          case 'social':
            return { ...prev, socialImageUrl: data.publicUrl };
          case 'hero':
          default:
            return { ...prev, heroImageUrl: data.publicUrl };
        }
      });
      
      toast({
        title: "Image uploaded",
        description: `Your ${imageType} image has been uploaded successfully.`
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
            <TabsList className="grid w-full max-w-4xl grid-cols-6">
              <TabsTrigger value="posts" className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                All Posts
              </TabsTrigger>
              <TabsTrigger value="inbox" className="flex items-center gap-2">
                <Inbox className="w-4 h-4" />
                Inbox
                <InboxBadge />
              </TabsTrigger>
              <TabsTrigger value="blog" className="flex items-center gap-2">
                <PenTool className="w-4 h-4" />
                Create
              </TabsTrigger>
              <TabsTrigger value="newsletter" className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Newsletter
              </TabsTrigger>
              <TabsTrigger value="images" className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4" />
                Images
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Settings
              </TabsTrigger>
            </TabsList>

            <TabsContent value="posts" className="space-y-6">
              <PostsList 
                filter="all"
                onEditPost={(post) => {
                  setPostData({
                    id: post.id,
                    title: post.title,
                    subtitle: post.subtitle || '',
                    content: post.content,
                    heroImageUrl: post.hero_image_url || '',
                    inlineImageUrl: (post as any).inline_image_url || '',
                    socialImageUrl: (post as any).social_image_url || '',
                    tags: post.tags || [],
                    publishAsNewsletter: post.publish_as_newsletter || false,
                    isDraft: post.is_draft || false
                  });
                  setActiveTab('blog');
                }}
              />
            </TabsContent>

            <TabsContent value="inbox" className="space-y-6">
              <InboxTab onImportDraft={handleImportDraft} />
            </TabsContent>

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

            <TabsContent value="images" className="space-y-6">
              <UpdateThumbnail 
                selectedPostId={postData.id}
                selectedPostTitle={postData.title}
              />
              <BlogImageUploader />
              <BlogImageGrid />
            </TabsContent>

            <TabsContent value="settings">
              <SiteSettings />
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
  onImageUpload: (file: File, imageType?: 'hero' | 'inline' | 'social') => Promise<void>;
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

      {/* Inline Thumbnail - First image in post body */}
      <div>
        <Label htmlFor="inline-image" className="text-sm font-medium">
          Inline Thumbnail
        </Label>
        <p className="text-xs text-muted-foreground mb-2">
          The main image that appears in the post content (optional)
        </p>
        <div className="mt-1 flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            asChild
            className="cursor-pointer"
          >
            <label htmlFor="inline-image-upload">
              <Upload className="w-4 h-4 mr-2" />
              Upload Image
              <input
                id="inline-image-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) onImageUpload(file, 'inline');
                }}
              />
            </label>
          </Button>
          {postData.inlineImageUrl && (
            <div className="flex items-center gap-2">
              <img
                src={postData.inlineImageUrl}
                alt="Inline content preview"
                className="w-20 h-20 object-cover rounded border"
              />
              <div className="text-xs text-muted-foreground">
                <p>✓ Inline image set</p>
                <p>Appears in post body</p>
              </div>
            </div>
          )}
        </div>
        {!postData.inlineImageUrl && (
          <div className="mt-2 p-3 bg-muted/50 rounded-lg border-2 border-dashed border-muted-foreground/25">
            <div className="text-center">
              <ImageIcon className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">No inline image</p>
              <p className="text-xs text-muted-foreground">
                Upload an image to display in your post content
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Social Preview - For social media sharing */}
      <div>
        <Label htmlFor="social-image" className="text-sm font-medium">
          Social Preview
        </Label>
        <p className="text-xs text-muted-foreground mb-2">
          Image shown when sharing on social media platforms (Facebook, Twitter, etc.)
        </p>
        <div className="mt-1 flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            asChild
            className="cursor-pointer"
          >
            <label htmlFor="social-image-upload">
              <Upload className="w-4 h-4 mr-2" />
              Upload Preview
              <input
                id="social-image-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) onImageUpload(file, 'social');
                }}
              />
            </label>
          </Button>
          {postData.socialImageUrl && (
            <div className="flex items-center gap-2">
              <img
                src={postData.socialImageUrl}
                alt="Social media preview"
                className="w-20 h-20 object-cover rounded border"
              />
              <div className="text-xs text-muted-foreground">
                <p>✓ Social preview set</p>
                <p>Optimized for sharing</p>
              </div>
            </div>
          )}
        </div>
        {!postData.socialImageUrl && (
          <div className="mt-2 p-3 bg-muted/50 rounded-lg border-2 border-dashed border-muted-foreground/25">
            <div className="text-center">
              <ImageIcon className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">No social preview</p>
              <p className="text-xs text-muted-foreground">
                Upload an image for social media previews
              </p>
            </div>
          </div>
        )}
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