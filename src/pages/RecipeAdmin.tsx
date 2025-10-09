import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { updatePeachGaletteMetadata } from '@/utils/updatePeachGalette';
import { toast } from 'sonner';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const RecipeAdmin = () => {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdatePeachGalette = async () => {
    setIsUpdating(true);
    try {
      const result = await updatePeachGaletteMetadata();
      if (result.success) {
        toast.success('Recipe updated successfully! The introduction and author are now in the database.');
      } else {
        toast.error('Failed to update recipe. Check console for details.');
        console.error('Update error:', result.error);
      }
    } catch (error) {
      toast.error('An unexpected error occurred.');
      console.error('Unexpected error:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="bg-background text-foreground min-h-screen">
      <Header />
      <main className="py-20 px-4">
        <div className="max-w-4xl mx-auto space-y-6">
          <h1 className="text-4xl font-bold text-primary">Recipe Admin Utilities</h1>
          
          <Card>
            <CardHeader>
              <CardTitle>Update Peach Galette Metadata</CardTitle>
              <CardDescription>
                This will add the introduction and author name (Henry Hunter) to the Rustic Peach Galette recipe in the database.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={handleUpdatePeachGalette} 
                disabled={isUpdating}
                variant="hero"
                size="lg"
              >
                {isUpdating ? 'Updating...' : 'Update Recipe'}
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-muted/50">
            <CardHeader>
              <CardTitle>Note</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-muted-foreground">
                This page provides utilities to fix recipe data issues. After updating, the recipe will display:
              </p>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                <li>Introduction text about the peach galette</li>
                <li>Author name: Henry Hunter</li>
                <li>Correct social media sharing image</li>
              </ul>
              <p className="text-sm text-muted-foreground mt-4">
                You can navigate back to <a href="/recipes/rustic-peach-galette" className="text-primary hover:underline">view the recipe</a> after updating.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default RecipeAdmin;
