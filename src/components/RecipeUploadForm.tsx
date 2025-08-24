'use client';
import { useState } from 'react';
import { recipeApiClient } from '@/utils/recipeApiClient';

export default function RecipeUploadForm({ onSuccess }: { onSuccess: (data: any) => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) return;
    setLoading(true);
    setError(null);

    try {
      // Determine source type from file type
      const source_type = file.type === 'application/pdf' ? 'pdf' as const : 'image' as const;
      
      const result = await recipeApiClient.formatRecipe({
        source_type,
        file
      });

      if (!result.ok) {
        // Show error and save draft
        setError(result.message || 'Failed to process recipe');
        
        // For files, we can't save meaningful text draft, but we log the attempt
        try {
          await recipeApiClient.saveDraft({
            source: 'file',
            raw_text: `File: ${file.name} (${file.type})`
          });
        } catch {}
        
        return;
      }

      if (result.recipe) {
        onSuccess(result.recipe);
      } else {
        throw new Error('No recipe returned.');
      }
    } catch (err: any) {
      const userMessage = err?.message || 'Failed to process recipe.';
      setError(userMessage);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-section-background p-6 rounded-xl space-y-4 shadow-xl">
      <h2 className="text-xl font-bold text-foreground">Upload Your Recipe</h2>
      <input
        type="file"
        accept="image/*,application/pdf"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="block w-full text-muted-foreground"
        required
      />
      <button
        type="submit"
        className="bg-amber-600 hover:bg-amber-500 text-primary-foreground px-4 py-2 rounded-md font-semibold"
        disabled={loading}
      >
        {loading ? 'Formatting...' : 'Format My Recipe'}
      </button>
      {error && <p className="text-destructive text-sm">{error}</p>}
    </form>
  );
}
