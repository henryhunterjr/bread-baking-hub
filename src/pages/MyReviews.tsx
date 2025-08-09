import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ReviewItem {
  id: string;
  comment: string;
  photo_url?: string | null;
  created_at: string;
  recipe: {
    id: string;
    title: string;
    slug?: string | null;
  } | null;
}

const MyReviews = () => {
  const { user } = useAuth();
  const [items, setItems] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      setLoading(true);
      const { data } = await supabase
        .from("recipe_reviews")
        .select("id, comment, photo_url, created_at, recipe:recipes(id,title,slug)")
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
        <title>My Reviews | Baking Great Bread</title>
        <meta name="description" content="Your recipe reviews." />
        <link rel="canonical" href="https://bread-baking-hub.vercel.app/my-reviews" />
        <meta property="og:title" content="My Reviews | Baking Great Bread" />
        <meta property="og:description" content="Your recipe reviews." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://bread-baking-hub.vercel.app/my-reviews" />
        <meta property="og:image" content="https://ojyckskucneljvuqzrsw.supabase.co/storage/v1/object/public/blog-images/2025-07/baking-great-bread-at-home-blog/optimizeduploadedbreadhero.avif" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="https://ojyckskucneljvuqzrsw.supabase.co/storage/v1/object/public/blog-images/2025-07/baking-great-bread-at-home-blog/optimizeduploadedbreadhero.avif" />
      </Helmet>
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">My Reviews</h1>
        {(!user) && <p>Please sign in to view your reviews.</p>}
        {user && (
          loading ? (
            <p>Loading…</p>
          ) : items.length === 0 ? (
            <p className="text-muted-foreground">No reviews yet.</p>
          ) : (
            <div className="space-y-4">
              {items.map((it) => (
                <Card key={it.id}>
                  <CardHeader>
                    <CardTitle className="text-primary">{it.recipe?.title || 'Untitled Recipe'}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p className="text-sm leading-relaxed">{it.comment}</p>
                    {it.photo_url && (
                      <img src={it.photo_url} alt="Review photo" className="h-40 w-auto rounded object-cover" loading="lazy" />
                    )}
                    {it.recipe?.slug && (
                      <a href={`/r/${it.recipe.slug}`} className="text-primary underline text-sm">Open Recipe →</a>
                    )}
                    <p className="text-xs text-muted-foreground">{new Date(it.created_at).toLocaleString()}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )
        )}
      </main>
      <Footer />
    </div>
  );
};

export default MyReviews;
