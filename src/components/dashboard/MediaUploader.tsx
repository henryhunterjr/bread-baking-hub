import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ImageIcon, Video } from 'lucide-react';
import { BlogImageUploader } from '@/components/BlogImageUploader';
import { BlogImageGrid } from '@/components/BlogImageGrid';
import { BlogVideoUploader } from '@/components/BlogVideoUploader';
import { BlogVideoGrid } from '@/components/BlogVideoGrid';

export const MediaUploader = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Media Library</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="images" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="images" className="flex items-center gap-2">
              <ImageIcon className="w-4 h-4" />
              Images
            </TabsTrigger>
            <TabsTrigger value="videos" className="flex items-center gap-2">
              <Video className="w-4 h-4" />
              Videos
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="images" className="space-y-6 mt-6">
            <BlogImageUploader />
            <BlogImageGrid />
          </TabsContent>
          
          <TabsContent value="videos" className="space-y-6 mt-6">
            <BlogVideoUploader />
            <BlogVideoGrid />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
