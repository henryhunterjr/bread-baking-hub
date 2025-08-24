'use client';
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export default function RecipeUploadForm({ onSuccess }: { onSuccess: (data: any) => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) return;
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const { data, error } = await supabase.functions.invoke('format-recipe', { body: formData });
      if (error) throw new Error(error.message);
      if (data?.recipe) onSuccess(data.recipe);
      else throw new Error('No recipe returned.');
    } catch (err: any) {
      // Handle specific error codes with user-friendly messages
      let userMessage = '';
      if (err?.message?.includes('NO_TEXT_IN_PDF')) {
        userMessage = 'This PDF appears to be scanned. Try converting to images or enable OCR mode.';
      } else if (err?.message?.includes('MISSING_OPENAI_KEY') || err?.message?.includes('openai_auth_error')) {
        userMessage = 'We can\'t reach the formatter right now. Please try again shortly.';
      } else {
        userMessage = err?.message || 'Failed to process recipe.';
      }
      
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
