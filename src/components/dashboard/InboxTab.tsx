import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Inbox, Calendar, Mail, FileText, Import, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

interface AIDraft {
  id: string;
  type: 'blog' | 'newsletter';
  payload: any;
  run_date: string;
  created_at: string;
  imported: boolean;
}

interface InboxTabProps {
  onImportDraft: (draftData: any) => void;
}

const InboxTab = ({ onImportDraft }: InboxTabProps) => {
  const [drafts, setDrafts] = useState<AIDraft[]>([]);
  const [loading, setLoading] = useState(true);
  const [importing, setImporting] = useState<string | null>(null);
  const [discarding, setDiscarding] = useState<string | null>(null);

  const fetchDrafts = async () => {
    try {
      console.log('Fetching AI drafts...');
      const { data, error } = await supabase.functions.invoke('ai-drafts', {
        method: 'GET'
      });

      console.log('AI drafts response:', { data, error });
      if (error) throw error;
      setDrafts(data || []);
    } catch (error) {
      console.error('Error fetching drafts:', error);
      toast({
        title: "Error",
        description: "Failed to load AI drafts. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrafts();
  }, []);

  const handleImport = async (draft: AIDraft) => {
    setImporting(draft.id);
    try {
      const { data, error } = await supabase.functions.invoke('import-draft', {
        body: { draftId: draft.id }
      });

      if (error) throw error;

      toast({
        title: "Draft imported",
        description: "AI draft has been imported successfully."
      });

      // Call the parent function to populate the editor
      onImportDraft(data);
      
      // Remove from drafts list
      setDrafts(prev => prev.filter(d => d.id !== draft.id));
    } catch (error) {
      console.error('Error importing draft:', error);
      toast({
        title: "Error",
        description: "Failed to import draft. Please try again.",
        variant: "destructive"
      });
    } finally {
      setImporting(null);
    }
  };

  const handleDiscard = async (draftId: string) => {
    setDiscarding(draftId);
    try {
      const { error } = await supabase.functions.invoke(`ai-drafts/${draftId}`, {
        method: 'DELETE'
      });

      if (error) throw error;

      toast({
        title: "Draft discarded",
        description: "AI draft has been discarded."
      });

      // Remove from drafts list
      setDrafts(prev => prev.filter(d => d.id !== draftId));
    } catch (error) {
      console.error('Error discarding draft:', error);
      toast({
        title: "Error",
        description: "Failed to discard draft. Please try again.",
        variant: "destructive"
      });
    } finally {
      setDiscarding(null);
    }
  };

  const getImageUrls = (payload: any): string[] => {
    const blogDraft = payload.blogDraft || payload;
    if (blogDraft.imageUrls && Array.isArray(blogDraft.imageUrls)) {
      return blogDraft.imageUrls.slice(0, 3);
    }
    if (blogDraft.imageUrl) {
      return [blogDraft.imageUrl];
    }
    return [];
  };

  const getTitle = (payload: any): string => {
    const draft = payload.blogDraft || payload.newsletterDraft || payload;
    return draft.title || 'Untitled Draft';
  };

  const getExcerpt = (payload: any): string => {
    const draft = payload.blogDraft || payload.newsletterDraft || payload;
    return draft.excerpt || draft.subtitle || '';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading AI drafts...</p>
        </div>
      </div>
    );
  }

  if (drafts.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Inbox className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No AI Drafts</h3>
          <p className="text-muted-foreground max-w-md">
            When your AI agent submits content, it will appear here for review and import.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">AI Drafts Inbox</h2>
        <Button variant="outline" onClick={fetchDrafts} size="sm">
          Refresh
        </Button>
      </div>

      <div className="grid gap-4">
        {drafts.map((draft) => {
          const imageUrls = getImageUrls(draft.payload);
          const title = getTitle(draft.payload);
          const excerpt = getExcerpt(draft.payload);

          return (
            <Card key={draft.id} className="overflow-hidden">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-lg">{title}</CardTitle>
                      <Badge variant={draft.type === 'blog' ? 'default' : 'secondary'}>
                        {draft.type === 'blog' ? (
                          <><FileText className="w-3 h-3 mr-1" /> Blog</>
                        ) : (
                          <><Mail className="w-3 h-3 mr-1" /> Newsletter</>
                        )}
                      </Badge>
                    </div>
                    {excerpt && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {excerpt}
                      </p>
                    )}
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="w-3 h-3" />
                      <span>Run Date: {format(new Date(draft.run_date), 'MMM d, yyyy')}</span>
                      <span>•</span>
                      <span>Received: {format(new Date(draft.created_at), 'MMM d, yyyy h:mm a')}</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 ml-4">
                    <Button
                      size="sm"
                      onClick={() => handleImport(draft)}
                      disabled={importing === draft.id || discarding === draft.id}
                    >
                      {importing === draft.id ? (
                        <>
                          <div className="w-3 h-3 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-1" />
                          Importing...
                        </>
                      ) : (
                        <>
                          <Import className="w-3 h-3 mr-1" />
                          Import
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDiscard(draft.id)}
                      disabled={importing === draft.id || discarding === draft.id}
                    >
                      {discarding === draft.id ? (
                        <>
                          <div className="w-3 h-3 border-2 border-muted-foreground border-t-transparent rounded-full animate-spin mr-1" />
                          Discarding...
                        </>
                      ) : (
                        <>
                          <Trash2 className="w-3 h-3 mr-1" />
                          Discard
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              {imageUrls.length > 0 && (
                <CardContent>
                  <div className="flex gap-2">
                    {imageUrls.map((url, index) => (
                      <img
                        key={index}
                        src={url}
                        alt={`AI generated image ${index + 1}`}
                        className="w-20 h-20 object-cover rounded border"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    ))}
                  </div>
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default InboxTab;