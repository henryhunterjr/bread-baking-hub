import { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { toast } from '@/hooks/use-toast';
import { useRecipes } from '@/hooks/useRecipes';
import { Trash2 } from 'lucide-react';

const AdminRecipes = () => {
  const { recipes, loading, updateRecipe, updateRecipeTitle, deleteRecipe } = useRecipes();
  const [search, setSearch] = useState('');
  const [savingId, setSavingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return recipes.filter((r: any) => {
      if (!q) return true;
      const title = (r.title || '').toLowerCase();
      const folder = (r.folder || '').toLowerCase();
      const tags = ((r.tags || []) as string[]).join(',').toLowerCase();
      return title.includes(q) || folder.includes(q) || tags.includes(q);
    });
  }, [recipes, search]);

  const saveTitle = async (id: string, value: string) => {
    setSavingId(id);
    const ok = await updateRecipeTitle(id, value);
    setSavingId(null);
    if (!ok) toast({ title: 'Save failed', description: 'Could not update title', variant: 'destructive' });
  };

  const saveField = async (id: string, updates: any) => {
    setSavingId(id);
    const ok = await updateRecipe(id, updates);
    setSavingId(null);
    if (!ok) toast({ title: 'Save failed', description: 'Could not update recipe', variant: 'destructive' });
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    const ok = await deleteRecipe(id);
    setDeletingId(null);
    if (!ok) toast({ title: 'Delete failed', description: 'Could not delete recipe', variant: 'destructive' });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recipes</CardTitle>
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search title, folder, or tags..."
          aria-label="Search recipes"
          className="max-w-sm"
        />
      </CardHeader>
      <CardContent>
        <Table>
          <TableCaption>{filtered.length} {filtered.length === 1 ? 'recipe' : 'recipes'}</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Folder</TableHead>
              <TableHead>Tags</TableHead>
              <TableHead>Public</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground">Loading...</TableCell>
              </TableRow>
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">No recipes found</TableCell>
              </TableRow>
            ) : (
              filtered.map((r: any) => (
                <TableRow key={r.id}>
                  <TableCell>
                    <Input
                      defaultValue={r.title}
                      onBlur={(e) => {
                        const v = e.target.value.trim();
                        if (v && v !== r.title) saveTitle(r.id, v);
                      }}
                      onKeyDown={(e) => e.key === 'Enter' && (e.target as HTMLInputElement).blur()}
                      disabled={savingId === r.id}
                      className="h-8 max-w-md"
                      aria-label="Edit recipe title"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      defaultValue={r.folder || ''}
                      placeholder="Folder"
                      onBlur={(e) => {
                        const v = e.target.value;
                        if (v !== (r.folder || '')) saveField(r.id, { folder: v || null });
                      }}
                      onKeyDown={(e) => e.key === 'Enter' && (e.target as HTMLInputElement).blur()}
                      disabled={savingId === r.id}
                      className="h-8 max-w-[160px]"
                      aria-label="Edit folder"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      defaultValue={(r.tags || []).join(', ')}
                      placeholder="comma,separated,tags"
                      onBlur={(e) => {
                        const v = e.target.value;
                        const arr = v.split(',').map((t) => t.trim()).filter(Boolean);
                        if (JSON.stringify(arr) !== JSON.stringify(r.tags || [])) {
                          saveField(r.id, { tags: arr });
                        }
                      }}
                      onKeyDown={(e) => e.key === 'Enter' && (e.target as HTMLInputElement).blur()}
                      disabled={savingId === r.id}
                      className="h-8 max-w-md"
                      aria-label="Edit tags"
                    />
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={!!r.is_public}
                      onCheckedChange={(checked) => saveField(r.id, { is_public: checked })}
                      aria-label="Toggle public"
                    />
                  </TableCell>
                  <TableCell>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          disabled={deletingId === r.id}
                          aria-label="Delete recipe"
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Recipe</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "{r.title}"? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(r.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default AdminRecipes;
