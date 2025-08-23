import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Database, BookOpen, FileText, HelpCircle } from 'lucide-react';
import { ingestAllContent, ingestRecipes, ingestBlogPosts, ingestHelpTopics } from '@/utils/contentIngestion';

export const ContentIngestionPanel = () => {
  const [isIngesting, setIsIngesting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTask, setCurrentTask] = useState('');
  const { toast } = useToast();

  const handleFullIngestion = async () => {
    setIsIngesting(true);
    setProgress(0);
    
    try {
      setCurrentTask('Ingesting recipes...');
      setProgress(25);
      await ingestRecipes();
      
      setCurrentTask('Ingesting blog posts...');
      setProgress(50);
      await ingestBlogPosts();
      
      setCurrentTask('Ingesting help topics...');
      setProgress(75);
      await ingestHelpTopics();
      
      setCurrentTask('Completing...');
      setProgress(100);
      
      toast({
        title: "Content Ingestion Complete",
        description: "All content has been successfully ingested into the RAG system.",
      });
    } catch (error) {
      console.error('Ingestion error:', error);
      toast({
        title: "Ingestion Failed",
        description: "There was an error ingesting the content. Check the console for details.",
        variant: "destructive"
      });
    } finally {
      setIsIngesting(false);
      setProgress(0);
      setCurrentTask('');
    }
  };

  const handleSpecificIngestion = async (type: 'recipes' | 'blog' | 'help') => {
    setIsIngesting(true);
    setProgress(50);
    
    try {
      switch (type) {
        case 'recipes':
          setCurrentTask('Ingesting recipes...');
          await ingestRecipes();
          break;
        case 'blog':
          setCurrentTask('Ingesting blog posts...');
          await ingestBlogPosts();
          break;
        case 'help':
          setCurrentTask('Ingesting help topics...');
          await ingestHelpTopics();
          break;
      }
      
      setProgress(100);
      toast({
        title: "Ingestion Complete",
        description: `${type} content has been successfully ingested.`,
      });
    } catch (error) {
      console.error('Ingestion error:', error);
      toast({
        title: "Ingestion Failed",
        description: "There was an error ingesting the content.",
        variant: "destructive"
      });
    } finally {
      setIsIngesting(false);
      setProgress(0);
      setCurrentTask('');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          RAG Content Ingestion
        </CardTitle>
        <CardDescription>
          Ingest and update content for KRUSTY's knowledge base. This creates embeddings for semantic search.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {isIngesting && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              {currentTask}
            </div>
            <Progress value={progress} className="w-full" />
          </div>
        )}

        <div className="grid gap-4">
          <Button
            onClick={handleFullIngestion}
            disabled={isIngesting}
            className="w-full"
            size="lg"
          >
            {isIngesting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Ingesting Content...
              </>
            ) : (
              <>
                <Database className="mr-2 h-4 w-4" />
                Ingest All Content
              </>
            )}
          </Button>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Button
              variant="outline"
              onClick={() => handleSpecificIngestion('recipes')}
              disabled={isIngesting}
              className="flex items-center gap-2"
            >
              <BookOpen className="h-4 w-4" />
              Recipes Only
            </Button>
            
            <Button
              variant="outline"
              onClick={() => handleSpecificIngestion('blog')}
              disabled={isIngesting}
              className="flex items-center gap-2"
            >
              <FileText className="h-4 w-4" />
              Blog Posts Only
            </Button>
            
            <Button
              variant="outline"
              onClick={() => handleSpecificIngestion('help')}
              disabled={isIngesting}
              className="flex items-center gap-2"
            >
              <HelpCircle className="h-4 w-4" />
              Help Topics Only
            </Button>
          </div>
        </div>

        <div className="text-sm text-muted-foreground bg-muted p-3 rounded-lg">
          <p className="font-medium mb-1">What this does:</p>
          <ul className="space-y-1 text-xs">
            <li>• Extracts content from recipes, blog posts, and help topics</li>
            <li>• Generates embeddings using OpenAI for semantic search</li>
            <li>• Updates KRUSTY's knowledge base for accurate responses</li>
            <li>• Run after publishing new content or updating existing content</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};