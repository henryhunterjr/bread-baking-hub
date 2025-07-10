import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { History, RotateCcw, Eye, Save } from 'lucide-react';
import { useRecipeVersions } from '@/hooks/useRecipeVersions';
import { formatDistanceToNow } from 'date-fns';
import { toast } from '@/hooks/use-toast';

interface RecipeVersionManagerProps {
  recipeId: string;
  onVersionRestored?: () => void;
}

export const RecipeVersionManager = ({ recipeId, onVersionRestored }: RecipeVersionManagerProps) => {
  const { versions, loading, createVersion, revertToVersion } = useRecipeVersions(recipeId);
  const [isCreatingVersion, setIsCreatingVersion] = useState(false);
  const [selectedVersion, setSelectedVersion] = useState<any>(null);

  const handleCreateVersion = async () => {
    setIsCreatingVersion(true);
    try {
      await createVersion(recipeId, 'Manual backup');
      toast({
        title: "Version created",
        description: "Recipe version saved successfully."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create version.",
        variant: "destructive"
      });
    } finally {
      setIsCreatingVersion(false);
    }
  };

  const handleRevertToVersion = async (versionId: string) => {
    try {
      await revertToVersion(recipeId, versionId);
      toast({
        title: "Version restored",
        description: "Recipe has been reverted to selected version."
      });
      onVersionRestored?.();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to revert to version.",
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <History className="w-4 h-4 mr-2" />
          Version History
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Recipe Version History</DialogTitle>
        </DialogHeader>
        
        <div className="flex gap-4">
          <Button 
            onClick={handleCreateVersion}
            disabled={isCreatingVersion}
            size="sm"
          >
            <Save className="w-4 h-4 mr-2" />
            {isCreatingVersion ? 'Creating...' : 'Create Version'}
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[60vh]">
          {/* Version List */}
          <div>
            <h3 className="font-semibold mb-4">Versions ({versions.length})</h3>
            <ScrollArea className="h-full">
              <div className="space-y-3">
                {loading ? (
                  <div className="text-center py-4">Loading versions...</div>
                ) : versions.length === 0 ? (
                  <div className="text-center py-4 text-muted-foreground">
                    No versions found. Create your first version to start tracking changes.
                  </div>
                ) : (
                  versions.map((version) => (
                    <Card 
                      key={version.id} 
                      className={`cursor-pointer transition-colors hover:bg-muted/50 ${
                        selectedVersion?.id === version.id ? 'ring-2 ring-primary' : ''
                      }`}
                      onClick={() => setSelectedVersion(version)}
                    >
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <Badge variant="secondary">
                              Version {version.version_number}
                            </Badge>
                            <p className="text-sm font-medium mt-1">{version.title}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRevertToVersion(version.id);
                            }}
                          >
                            <RotateCcw className="w-4 h-4" />
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(version.created_at), { addSuffix: true })}
                        </p>
                        {version.version_notes && (
                          <p className="text-xs mt-1 italic">{version.version_notes}</p>
                        )}
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </ScrollArea>
          </div>

          {/* Version Preview */}
          <div>
            <h3 className="font-semibold mb-4">Preview</h3>
            {selectedVersion ? (
              <ScrollArea className="h-full">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">{selectedVersion.title}</CardTitle>
                    <div className="flex gap-2">
                      <Badge>Version {selectedVersion.version_number}</Badge>
                      <Badge variant="outline">
                        {formatDistanceToNow(new Date(selectedVersion.created_at), { addSuffix: true })}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {selectedVersion.image_url && (
                      <img 
                        src={selectedVersion.image_url} 
                        alt={selectedVersion.title}
                        className="w-full h-32 object-cover rounded mb-4"
                      />
                    )}
                    
                    <div className="space-y-4">
                      {selectedVersion.data.ingredients && (
                        <div>
                          <h4 className="font-medium mb-2">Ingredients</h4>
                          <ul className="text-sm space-y-1">
                            {selectedVersion.data.ingredients.map((ingredient: string, index: number) => (
                              <li key={index}>• {ingredient}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {selectedVersion.data.method && (
                        <div>
                          <h4 className="font-medium mb-2">Method</h4>
                          <ol className="text-sm space-y-1">
                            {selectedVersion.data.method.map((step: string, index: number) => (
                              <li key={index}>{index + 1}. {step}</li>
                            ))}
                          </ol>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </ScrollArea>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                <div className="text-center">
                  <Eye className="w-8 h-8 mx-auto mb-2" />
                  <p>Select a version to preview</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};