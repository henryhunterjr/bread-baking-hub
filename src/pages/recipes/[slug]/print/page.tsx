import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { usePublicRecipe } from '@/hooks/usePublicRecipe';
import { PrintableRecipe } from '@/components/PrintableRecipe';
import { mapLegacyToStandard } from '@/types/recipe';

const RecipePrintPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { recipe, loading, error } = usePublicRecipe(slug || '');

  useEffect(() => {
    if (recipe && !loading) {
      // Small delay to ensure layout is complete, then trigger print
      setTimeout(() => {
        window.print();
        // If this page was opened by the print button, close it after printing
        if (window.opener) {
          window.onafterprint = () => window.close();
        }
      }, 300);
    }
  }, [recipe, loading]);

  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <p>Loading recipe for printing...</p>
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h1>Recipe Not Found</h1>
        <p>{error || 'This recipe does not exist or is no longer available.'}</p>
      </div>
    );
  }

  // Convert to standard recipe format
  const standardRecipe = mapLegacyToStandard(recipe);

  return <PrintableRecipe recipe={standardRecipe} />;
};

export default RecipePrintPage;