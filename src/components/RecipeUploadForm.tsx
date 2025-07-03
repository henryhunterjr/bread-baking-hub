
'use client';
import { useState } from 'react';

export default function RecipeUploadForm({ onSuccess }: { onSuccess: (data: any) => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('https://ojyckskucneljvuqzrsw.supabase.co/functions/v1/format-recipe', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9qeWNrc2t1Y25lbGp2dXF6cnN3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY3NDI0MTUsImV4cCI6MjA1MjMxODQxNX0.-Bx7Y0d_aMcHakE27Z5QKriY6KPpG1m8n0uuLaamFfY`,
        },
        body: formData,
      });
      const data = await res.json();
      if (data.recipe) onSuccess(data.recipe);
      else throw new Error('No recipe returned.');
    } catch (err: any) {
      setError('Failed to process recipe.');
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
