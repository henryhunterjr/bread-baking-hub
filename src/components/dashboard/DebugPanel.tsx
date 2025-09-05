import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';

const DebugPanel = () => {
  const { user } = useAuth();
  const [isTestingCreate, setIsTestingCreate] = useState(false);

  const testCreatePost = async () => {
    console.log('🧪 DEBUG: Testing basic post creation...');
    setIsTestingCreate(true);

    try {
      const testPostData = {
        title: 'Test Post - ' + new Date().toISOString(),
        subtitle: 'Test subtitle',
        content: 'This is a test post created from the debug panel.',
        heroImageUrl: '',
        inlineImageUrl: '',
        socialImageUrl: '',
        tags: ['test'],
        publishAsNewsletter: false,
        isDraft: true
      };

      console.log('🧪 DEBUG: Test data prepared:', testPostData);
      console.log('🧪 DEBUG: User:', user);

      const { data, error } = await supabase.functions.invoke('upsert-post', {
        body: { 
          postData: testPostData,
          userId: user?.id
        }
      });

      console.log('🧪 DEBUG: Function response:', { data, error });

      if (error) {
        console.error('🧪 DEBUG: Function error:', error);
        throw error;
      }

      console.log('✅ DEBUG: Test post created successfully!');
      toast({
        title: "Debug Test Successful",
        description: "Test post created successfully. Check console for details.",
      });

    } catch (error) {
      console.error('❌ DEBUG: Test failed:', error);
      toast({
        title: "Debug Test Failed",
        description: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive"
      });
    } finally {
      setIsTestingCreate(false);
    }
  };

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="text-sm">🧪 Debug Panel</CardTitle>
      </CardHeader>
      <CardContent>
        <Button 
          onClick={testCreatePost}
          disabled={isTestingCreate}
          variant="outline"
          size="sm"
        >
          {isTestingCreate ? 'Testing...' : 'Test Create Post'}
        </Button>
        <p className="text-xs text-muted-foreground mt-2">
          This will test the basic post creation flow. Check console for detailed logs.
        </p>
      </CardContent>
    </Card>
  );
};

export default DebugPanel;