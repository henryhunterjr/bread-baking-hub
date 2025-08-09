import { useEffect, useMemo, useState } from 'react';
import type { SeasonalRecipe } from '@/hooks/useSeasonalRecipes';

export type OfflineRecipe = Pick<SeasonalRecipe, 'id' | 'title' | 'slug' | 'image_url' | 'data' | 'created_at'>;

const LS_KEY = 'bgb_offline_favorites_v1';
const IMAGE_CACHE_NAME = 'bgb-recipe-images-v1';

async function cacheImage(url?: string | null) {
  if (!url) return;
  try {
    if ('caches' in window) {
      const cache = await caches.open(IMAGE_CACHE_NAME);
      await cache.add(url);
    }
  } catch (e) {
    // ignore cache errors
  }
}

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<OfflineRecipe[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) setFavorites(JSON.parse(raw));
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(favorites));
    } catch {}
  }, [favorites]);

  const isFavorite = (id: string) => favorites.some((f) => f.id === id);

  const add = async (recipe: SeasonalRecipe) => {
    const offline: OfflineRecipe = {
      id: recipe.id,
      title: recipe.title,
      slug: recipe.slug,
      image_url: recipe.image_url,
      data: recipe.data,
      created_at: recipe.created_at,
    };
    setFavorites((prev) => {
      if (prev.some((f) => f.id === offline.id)) return prev;
      return [offline, ...prev];
    });
    await cacheImage(recipe.image_url);
  };

  const remove = (id: string) => setFavorites((prev) => prev.filter((f) => f.id !== id));

  const toggle = async (recipe: SeasonalRecipe) => {
    if (isFavorite(recipe.id)) remove(recipe.id);
    else await add(recipe);
  };

  const search = (query: string) => {
    const q = query.trim().toLowerCase();
    if (!q) return favorites;
    return favorites.filter((r) => {
      const hay = [
        r.title,
        r.slug,
        r.data?.ingredients?.join(' '),
        r.data?.method?.join(' '),
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return hay.includes(q);
    });
  };

  return {
    favorites,
    isFavorite,
    add,
    remove,
    toggle,
    search,
  } as const;
};
