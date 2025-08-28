import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { usePublicRecipe } from '@/hooks/usePublicRecipe';
import { SafeImage } from '@/components/ui/SafeImage';
import { getRecipeImage } from '@/utils/recipeImageMapping';

const RecipePrint = () => {
  const { slug } = useParams<{ slug: string }>();
  const { recipe, loading, error } = usePublicRecipe(slug || '');
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [loadedCount, setLoadedCount] = useState(0);
  const [totalImages, setTotalImages] = useState(0);

  useEffect(() => {
    if (recipe) {
      // Count total images (hero image if exists)
      const imageCount = recipe.image_url ? 1 : 0;
      setTotalImages(imageCount);
      
      if (imageCount === 0) {
        setImagesLoaded(true);
      }
    }
  }, [recipe]);

  useEffect(() => {
    if (imagesLoaded && recipe && !loading) {
      // Small delay to ensure layout is complete
      setTimeout(() => {
        window.print();
        // If this page was opened by the print button, close it after printing
        if (window.opener) {
          window.onafterprint = () => window.close();
        }
      }, 100);
    }
  }, [imagesLoaded, recipe, loading]);

  const handleImageLoad = () => {
    setLoadedCount(prev => {
      const newCount = prev + 1;
      if (newCount >= totalImages) {
        setImagesLoaded(true);
      }
      return newCount;
    });
  };

  const handleImageError = () => {
    // Still count as loaded to prevent hanging
    handleImageLoad();
  };

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <p>Loading recipe...</p>
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h1>Recipe Not Found</h1>
        <p>{error || 'This recipe does not exist or is no longer available.'}</p>
      </div>
    );
  }

  const data = recipe.data;
  const imageUrl = getRecipeImage(recipe.slug, recipe.image_url);

  return (
    <div style={{
      backgroundColor: '#fff',
      color: '#111',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      lineHeight: '1.6',
      margin: '0',
      padding: '40px',
      maxWidth: '800px',
      marginLeft: 'auto',
      marginRight: 'auto'
    }}>
      <style dangerouslySetInnerHTML={{
        __html: `
          @media print {
            body { 
              background: white !important;
              -webkit-print-color-adjust: exact;
              color-adjust: exact;
            }
            img { 
              max-width: 100% !important;
              page-break-inside: avoid;
            }
            h1, h2 { 
              page-break-after: avoid; 
            }
            .page-break { 
              page-break-before: always; 
            }
          }
        `
      }} />
      {/* Header */}
      <div style={{ marginBottom: '30px', textAlign: 'center' }}>
        <h1 style={{
          fontSize: '32px',
          fontWeight: 'bold',
          marginBottom: '10px',
          color: '#2D5016'
        }}>
          {recipe.title}
        </h1>
        <p style={{ fontSize: '14px', color: '#666', margin: '0' }}>
          From Baking Great Bread • Generated on {new Date().toLocaleDateString()}
        </p>
      </div>

      {/* Recipe Image */}
      {imageUrl && (
        <div style={{ marginBottom: '30px', textAlign: 'center' }}>
          <SafeImage
            src={imageUrl}
            alt={recipe.title}
            crossOrigin="anonymous"
            onLoad={handleImageLoad}
            onError={handleImageError}
            style={{
              maxWidth: '100%',
              width: '100%',
              height: 'auto',
              borderRadius: '8px',
              boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
              pageBreakInside: 'avoid'
            }}
          />
        </div>
      )}

      {/* Recipe Metadata */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: '15px',
        marginBottom: '30px',
        padding: '20px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px'
      }}>
        {data?.prepTime && (
          <div>
            <strong>Prep Time:</strong><br />
            {data.prepTime.replace('0 hours ', '')}
          </div>
        )}
        {data?.bakeTime && (
          <div>
            <strong>Bake Time:</strong><br />
            {data.bakeTime.replace('0 hours ', '')}
          </div>
        )}
        {data?.yield && (
          <div>
            <strong>Yield:</strong><br />
            {data.yield}
          </div>
        )}
        {data?.difficulty && (
          <div>
            <strong>Difficulty:</strong><br />
            {data.difficulty}
          </div>
        )}
      </div>

      {/* Ingredients */}
      {data?.ingredients && Array.isArray(data.ingredients) && data.ingredients.length > 0 && (
        <div style={{ marginBottom: '30px' }}>
          <h2 style={{
            fontSize: '24px',
            fontWeight: 'bold',
            marginBottom: '15px',
            color: '#2D5016'
          }}>
            Ingredients
          </h2>
          <ul style={{ margin: '0', paddingLeft: '20px' }}>
            {data.ingredients.map((ingredient: string, index: number) => (
              <li key={index} style={{ marginBottom: '5px' }}>
                {ingredient}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Equipment */}
      {data?.equipment && Array.isArray(data.equipment) && data.equipment.length > 0 && (
        <div style={{ marginBottom: '30px' }}>
          <h2 style={{
            fontSize: '24px',
            fontWeight: 'bold',
            marginBottom: '15px',
            color: '#2D5016'
          }}>
            Equipment
          </h2>
          <ul style={{ margin: '0', paddingLeft: '20px' }}>
            {data.equipment.map((item: string, index: number) => (
              <li key={index} style={{ marginBottom: '5px' }}>
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Method */}
      {data?.method && Array.isArray(data.method) && data.method.length > 0 && (
        <div style={{ marginBottom: '30px' }}>
          <h2 style={{
            fontSize: '24px',
            fontWeight: 'bold',
            marginBottom: '15px',
            color: '#2D5016'
          }}>
            Method
          </h2>
          <ol style={{ margin: '0', paddingLeft: '20px' }}>
            {data.method.map((step: any, index: number) => (
              <li key={index} style={{
                marginBottom: '15px',
                lineHeight: '1.6'
              }}>
                {typeof step === 'string' ? step : step.instruction || step.step || step}
                {typeof step === 'object' && step.image && (
                  <div style={{ marginTop: '10px' }}>
                    <SafeImage
                      src={step.image}
                      alt={`Step ${index + 1} illustration`}
                      style={{
                        maxWidth: '100%',
                        width: '300px',
                        height: 'auto',
                        borderRadius: '8px',
                        display: 'block'
                      }}
                      onLoad={handleImageLoad}
                      onError={handleImageError}
                    />
                  </div>
                )}
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* Notes */}
      {data?.notes && (
        <div style={{ marginBottom: '30px' }}>
          <h2 style={{
            fontSize: '24px',
            fontWeight: 'bold',
            marginBottom: '15px',
            color: '#2D5016'
          }}>
            Baker's Notes
          </h2>
          <div style={{
            padding: '15px',
            backgroundColor: '#f8f9fa',
            borderRadius: '8px',
            borderLeft: '4px solid #2D5016'
          }}>
            {typeof data.notes === 'string' ? (
              <p style={{ margin: '0' }}>{data.notes}</p>
            ) : (
              <div>{data.notes}</div>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <div style={{
        borderTop: '1px solid #ddd',
        paddingTop: '20px',
        textAlign: 'center',
        fontSize: '12px',
        color: '#666'
      }}>
        <p style={{ margin: '0 0 10px 0' }}>
          Recipe from <strong>Baking Great Bread</strong> by Henry Hunter<br />
          Visit us at bread-baking-hub.vercel.app for more great recipes
        </p>
        <p style={{ margin: '0', fontSize: '10px' }}>
          <a 
            href={`https://bread-baking-hub.vercel.app/recipes/${recipe.slug}`}
            style={{ color: '#2D5016', textDecoration: 'none' }}
          >
            View recipe online: https://bread-baking-hub.vercel.app/recipes/{recipe.slug}
          </a>
        </p>
      </div>
    </div>
  );
};

export default RecipePrint;