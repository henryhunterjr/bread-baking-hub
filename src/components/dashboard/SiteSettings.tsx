import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Upload, Image as ImageIcon } from 'lucide-react';
import { clearHeroBannerCache } from '@/utils/imageUtils';

export const SiteSettings = () => {
  const [heroBannerUrl, setHeroBannerUrl] = useState('');
  const [updating, setUpdating] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Clear cache first to ensure fresh data
    clearHeroBannerCache();
    loadSiteSettings();
  }, []);

  const loadSiteSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('setting_value')
        .eq('setting_key', 'hero_banner_url')
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 is "not found" error
        console.error('Error loading site settings:', error);
        return;
      }

      if (data) {
        setHeroBannerUrl(data.setting_value || '');
      }
    } catch (error) {
      console.error('Failed to load site settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateHeroBanner = async () => {
    if (!heroBannerUrl) {
      toast({
        title: 'Error',
        description: 'Please enter a hero banner URL',
        variant: 'destructive'
      });
      return;
    }

    setUpdating(true);
    try {
      const { error } = await supabase
        .from('site_settings')
        .upsert({
          setting_key: 'hero_banner_url',
          setting_value: heroBannerUrl
        });

      if (error) throw error;

      // Clear the cache so new banner loads immediately
      clearHeroBannerCache();
      
      // Also clear cache after successful update to ensure immediate loading
      setTimeout(() => clearHeroBannerCache(), 100);
      
      toast({
        title: 'Success',
        description: 'Hero banner updated successfully!'
      });
    } catch (error) {
      console.error('Failed to update hero banner:', error);
      toast({
        title: 'Error',
        description: 'Failed to update hero banner',
        variant: 'destructive'
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleImageUpload = async (file: File) => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `hero-banner-${Math.random()}.${fileExt}`;
      const filePath = `site/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('hero-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('hero-images')
        .getPublicUrl(filePath);

      setHeroBannerUrl(data.publicUrl);
      
      toast({
        title: "Image uploaded",
        description: "Hero banner image uploaded successfully."
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

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Site Settings</CardTitle>
          <CardDescription>Loading site configuration...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Site Settings</CardTitle>
        <CardDescription>
          Configure global site elements that appear on all pages
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium mb-2">Hero Banner</h3>
            <p className="text-sm text-muted-foreground mb-4">
              This banner appears at the top of every blog post and newsletter (recommended: 1200 × 250px)
            </p>
            
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="cursor-pointer"
                >
                  <label htmlFor="hero-banner-upload">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Banner
                    <input
                      id="hero-banner-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageUpload(file);
                      }}
                    />
                  </label>
                </Button>
                
                {heroBannerUrl && (
                  <div className="flex items-center gap-2">
                    <img
                      src={heroBannerUrl}
                      alt="Hero banner preview"
                      className="w-32 h-16 object-cover rounded border"
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="text-xs text-muted-foreground">
                      <p>✓ Banner set</p>
                      <p>1200 × 250 recommended</p>
                    </div>
                  </div>
                )}
              </div>

              {!heroBannerUrl && (
                <div className="p-4 bg-muted/50 rounded-lg border-2 border-dashed border-muted-foreground/25">
                  <div className="text-center">
                    <ImageIcon className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">No hero banner uploaded</p>
                    <p className="text-xs text-muted-foreground">
                      Upload an image to display on all blog posts
                    </p>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium">Banner URL</label>
                <Input 
                  placeholder="/lovable-uploads/hero-banner.png"
                  value={heroBannerUrl}
                  onChange={(e) => setHeroBannerUrl(e.target.value)}
                />
              </div>
              
              <Button 
                onClick={updateHeroBanner}
                disabled={updating || !heroBannerUrl}
              >
                {updating ? 'Updating...' : 'Update Hero Banner'}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};