import { useEffect, useState, Suspense, lazy } from "react";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SafeImage } from "@/components/ui/SafeImage";

const LazyAIAssistantSidebar = lazy(() => import('@/components/AIAssistantSidebar').then(m => ({ default: m.AIAssistantSidebar })));

interface FavoriteItem {
  created_at: string;
  recipe: {
    id: string;
    title: string;
    slug?: string | null;
    image_url?: string | null;
  } | null;
}

const MyFavorites = () => {
  const { user } = useAuth();
  const [items, setItems] = useState<FavoriteItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      setLoading(true);
      const { data } = await supabase
        .from("user_favorites")
        .select("created_at, recipe:recipes(id,title,slug,image_url)")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      setItems((data as any) || []);
      setLoading(false);
    };
    load();
  }, [user?.id]);

  return (
    <div className="bg-background text-foreground min-h-screen">
      <Helmet>
        <title>My Favorites | Baking Great Bread</title>
        <meta name="description" content="Your saved favorite recipes." />
        <link rel="canonical" href="https://bread-baking-hub.vercel.app/my-favorites" />
        <meta property="og:title" content="My Favorites | Baking Great Bread" />
        <meta property="og:description" content="Your saved favorite recipes." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://bread-baking-hub.vercel.app/my-favorites" />
        <meta property="og:image" content="https://ojyckskucneljvuqzrsw.supabase.co/storage/v1/object/public/blog-images/2025-07/baking-great-bread-at-home-blog/optimizeduploadedbreadhero.avif" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="https://ojyckskucneljvuqzrsw.supabase.co/storage/v1/object/public/blog-images/2025-07/baking-great-bread-at-home-blog/optimizeduploadedbreadhero.avif" />
      </Helmet>
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">My Favorites</h1>
        {(!user) && <p>Please sign in to view your favorites.</p>}
        {user && (
          loading ? (
            <p>Loading…</p>
          ) : items.length === 0 ? (
            <p className="text-muted-foreground">No favorites yet.</p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((it, idx) => (
                <Card key={idx}>
                  <CardHeader>
                    <CardTitle className="text-primary">{it.recipe?.title || 'Untitled Recipe'}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {it.recipe?.image_url && (
                      <SafeImage src={it.recipe.image_url} alt={it.recipe.title} aspectRatio="16 / 9" fit="cover" className="w-full rounded" />
                    )}
                    {it.recipe?.slug && (
                      <Button asChild variant="outline">
                        <a href={`/recipes/${it.recipe.slug}`}>Open Recipe</a>
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )
        )}
      </main>
      <Footer />
      
      <Suspense fallback={null}>
        <LazyAIAssistantSidebar
          isOpen={isSidebarOpen}
          onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        />
      </Suspense>
    </div>
  );
};

export default MyFavorites;
