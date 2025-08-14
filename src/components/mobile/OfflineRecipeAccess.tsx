import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Download, HardDrive, Wifi, WifiOff, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

interface OfflineRecipe {
  id: string;
  title: string;
  slug: string;
  image_url?: string;
  data: any;
  downloadedAt: string;
  size: number; // in bytes
}

const OfflineRecipeAccess = () => {
  const { user } = useAuth();
  const [offlineRecipes, setOfflineRecipes] = useState<OfflineRecipe[]>([]);
  const [downloading, setDownloading] = useState<string[]>([]);
  const [storageUsage, setStorageUsage] = useState(0);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    loadOfflineRecipes();
    calculateStorageUsage();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const loadOfflineRecipes = () => {
    try {
      const stored = localStorage.getItem('offline_recipes');
      if (stored) {
        setOfflineRecipes(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading offline recipes:', error);
    }
  };

  const calculateStorageUsage = () => {
    try {
      const stored = localStorage.getItem('offline_recipes');
      if (stored) {
        const recipes: OfflineRecipe[] = JSON.parse(stored);
        const totalSize = recipes.reduce((sum, recipe) => sum + recipe.size, 0);
        setStorageUsage(totalSize);
      }
    } catch (error) {
      console.error('Error calculating storage:', error);
    }
  };

  const downloadRecipe = async (recipeId: string, recipeTitle: string, recipeSlug: string) => {
    if (!navigator.serviceWorker) {
      toast({
        title: 'Not Supported',
        description: 'Offline downloads are not supported in this browser',
        variant: 'destructive',
      });
      return;
    }

    setDownloading(prev => [...prev, recipeId]);

    try {
      // Simulate downloading recipe data and assets
      const response = await fetch(`/api/recipes/${recipeId}`);
      if (!response.ok) throw new Error('Failed to fetch recipe');
      
      const recipeData = await response.json();
      
      // Calculate approximate size
      const size = new Blob([JSON.stringify(recipeData)]).size;
      
      const offlineRecipe: OfflineRecipe = {
        id: recipeId,
        title: recipeTitle,
        slug: recipeSlug,
        data: recipeData,
        downloadedAt: new Date().toISOString(),
        size,
      };

      // Store in localStorage (in a real app, you'd use IndexedDB for larger data)
      const existing = JSON.parse(localStorage.getItem('offline_recipes') || '[]');
      const updated = [...existing.filter((r: OfflineRecipe) => r.id !== recipeId), offlineRecipe];
      localStorage.setItem('offline_recipes', JSON.stringify(updated));

      // Cache recipe images and assets using service worker
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.ready;
        registration.active?.postMessage({
          type: 'CACHE_RECIPE',
          recipeId,
          urls: [
            `/recipe/${recipeSlug}`,
            recipeData.image_url,
            // Add other assets...
          ].filter(Boolean),
        });
      }

      setOfflineRecipes(updated);
      calculateStorageUsage();

      toast({
        title: 'Downloaded',
        description: `${recipeTitle} is now available offline`,
      });
    } catch (error) {
      console.error('Error downloading recipe:', error);
      toast({
        title: 'Download Failed',
        description: 'Failed to download recipe for offline use',
        variant: 'destructive',
      });
    } finally {
      setDownloading(prev => prev.filter(id => id !== recipeId));
    }
  };

  const removeOfflineRecipe = (recipeId: string) => {
    try {
      const updated = offlineRecipes.filter(r => r.id !== recipeId);
      localStorage.setItem('offline_recipes', JSON.stringify(updated));
      setOfflineRecipes(updated);
      calculateStorageUsage();

      // Remove from service worker cache
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.ready.then(registration => {
          registration.active?.postMessage({
            type: 'REMOVE_RECIPE_CACHE',
            recipeId,
          });
        });
      }

      toast({
        title: 'Removed',
        description: 'Recipe removed from offline storage',
      });
    } catch (error) {
      console.error('Error removing offline recipe:', error);
    }
  };

  const clearAllOfflineRecipes = () => {
    localStorage.removeItem('offline_recipes');
    setOfflineRecipes([]);
    setStorageUsage(0);

    // Clear service worker cache
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(registration => {
        registration.active?.postMessage({
          type: 'CLEAR_RECIPE_CACHE',
        });
      });
    }

    toast({
      title: 'Cleared',
      description: 'All offline recipes removed',
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const maxStorage = 50 * 1024 * 1024; // 50MB limit
  const storagePercentage = (storageUsage / maxStorage) * 100;

  return (
    <div className="space-y-6">
      {/* Status Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HardDrive className="w-5 h-5" />
            Offline Recipe Access
            <Badge variant={isOnline ? 'default' : 'destructive'} className="ml-auto">
              {isOnline ? (
                <>
                  <Wifi className="w-3 h-3 mr-1" />
                  Online
                </>
              ) : (
                <>
                  <WifiOff className="w-3 h-3 mr-1" />
                  Offline
                </>
              )}
            </Badge>
          </CardTitle>
          <CardDescription>
            Download recipes to access them without an internet connection
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Storage Usage */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Storage Used</span>
              <span>{formatFileSize(storageUsage)} / {formatFileSize(maxStorage)}</span>
            </div>
            <Progress value={storagePercentage} className="h-2" />
            {storagePercentage > 80 && (
              <p className="text-sm text-amber-600">
                Storage is getting full. Consider removing some offline recipes.
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={clearAllOfflineRecipes}
              disabled={offlineRecipes.length === 0}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear All
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Offline Recipes */}
      {offlineRecipes.length > 0 ? (
        <div className="space-y-4">
          <h3 className="font-medium">Available Offline ({offlineRecipes.length})</h3>
          <div className="grid gap-4">
            {offlineRecipes.map((recipe) => (
              <Card key={recipe.id}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    {recipe.image_url && (
                      <img
                        src={recipe.image_url}
                        alt={recipe.title}
                        className="w-16 h-16 object-cover rounded"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium truncate">{recipe.title}</h4>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>Downloaded {new Date(recipe.downloadedAt).toLocaleDateString()}</span>
                        <span>{formatFileSize(recipe.size)}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button asChild size="sm">
                        <Link to={`/recipe/${recipe.slug}`}>
                          View
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeOfflineRecipe(recipe.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-8">
            <Download className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="font-medium mb-2">No Offline Recipes</h3>
            <p className="text-muted-foreground">
              Visit any recipe page and tap the download button to save it for offline access
            </p>
          </CardContent>
        </Card>
      )}

      {!isOnline && offlineRecipes.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <WifiOff className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="font-medium mb-2">You're Offline</h3>
            <p className="text-muted-foreground">
              Download recipes when online to access them without internet
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default OfflineRecipeAccess;