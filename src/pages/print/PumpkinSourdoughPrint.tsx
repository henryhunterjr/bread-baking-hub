import { useEffect, useState } from 'react';
import heroImage from '@/assets/recipes/pumpkin-sourdough-hero.jpg';
import mixingImage from '@/assets/recipes/pumpkin-sourdough-mixing.jpg';
import twineSetupImage from '@/assets/recipes/pumpkin-sourdough-twine-setup.jpg';
import bannetonImage from '@/assets/recipes/pumpkin-sourdough-banneton.jpg';
import shapingImage from '@/assets/recipes/pumpkin-sourdough-shaping.jpg';
import scoringImage from '@/assets/recipes/pumpkin-sourdough-scoring.jpg';
import bakedImage from '@/assets/recipes/pumpkin-sourdough-baked.jpg';

const PumpkinSourdoughPrint = () => {
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [loadedCount, setLoadedCount] = useState(0);

  const recipeData = {
    title: "Pumpkin Shaped Sourdough Loaf",
    description: "Pumpkin sourdough shaped with kitchen twine into a pumpkin, then finished with a cinnamon stick stem. Perfect fall centerpiece bread.",
    yield: "1 loaf (8–10 slices)",
    prepTime: "30 minutes",
    bakeTime: "45 minutes",
    totalTime: "6 hours",
    ingredients: [
      "350 g bread flour (about 2 3/4–3 cups)",
      "100 g whole wheat flour (about 3/4–1 cup)", 
      "150 g active sourdough starter, 100% hydration (about 2/3 cup)",
      "200 g pumpkin purée, unsweetened (about 3/4 cup + 1 tbsp)",
      "150–170 g water to start (about 2/3–3/4 cup)",
      "9 g fine sea salt (about 1 1/2 tsp)",
      "1–2 tsp pumpkin pie spice or cinnamon (optional)"
    ],
    instructions: [
      {
        name: "Mix & Autolyse",
        text: "Whisk pumpkin purée and water (start at 150 g) until smooth, then mix in the starter. Add both flours and mix until no dry bits remain. Rest 30–40 minutes.",
        image: mixingImage
      },
      {
        name: "Add Salt", 
        text: "Sprinkle in salt (and spice if using). Pinch and fold to incorporate until even."
      },
      {
        name: "Bulk Fermentation",
        text: "3–4 hours at 75°F/24°C with 3–4 coil folds in the first 2 hours. Target ~50% rise."
      },
      {
        name: "Prepare Twine",
        text: "Lay 4–6 strands of food-safe twine in a star pattern. Flour banneton and surface.",
        image: twineSetupImage
      },
      {
        name: "Shape & Tie", 
        text: "Shape a tight boule, place on twine, and tie gently over the top.",
        image: shapingImage
      },
      {
        name: "Proof",
        text: "Place seam down in banneton. Proof 2–4 hours or cold proof 8–12 hours."
      },
      {
        name: "Score",
        text: "Turn out, dust, and score leaf shapes between twine lines.",
        image: scoringImage
      },
      {
        name: "Bake",
        text: "Bake in preheated Dutch oven: 20 minutes covered at 475°F, then 20–25 minutes uncovered at 450°F.",
        image: bakedImage
      },
      {
        name: "Finish",
        text: "Remove twine while warm. Insert a cinnamon stick as the stem. Cool fully before slicing."
      }
    ],
    equipment: [
      "4–5 qt Dutch oven",
      "Food-safe cotton kitchen twine (4–6 strands)", 
      "Round banneton, well floured",
      "Parchment paper",
      "Lame or razor",
      "Large bowl or tub",
      "Digital scale",
      "Cinnamon stick (stem)"
    ],
    notes: "Baker's math (effective): Treat pumpkin as 85% water. With 150 g water, effective hydration is ~75%. Increase toward 170 g only if dough is tight. This keeps the twine-tied loaf from spreading."
  };

  // Count images for loading
  const stepImages = recipeData.instructions.filter(step => step.image).length;
  const totalImages = stepImages + 1; // +1 for hero image

  useEffect(() => {
    // Auto-print when all images are loaded
    if (loadedCount >= totalImages) {
      setImagesLoaded(true);
      setTimeout(() => {
        window.print();
        // Close window if opened for printing
        if (window.opener) {
          window.onafterprint = () => window.close();
        }
      }, 100);
    }
  }, [loadedCount, totalImages]);

  const handleImageLoad = () => {
    setLoadedCount(prev => prev + 1);
  };

  const handleImageError = () => {
    // Still count as loaded to prevent hanging
    setLoadedCount(prev => prev + 1);
  };

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
          {recipeData.title}
        </h1>
        <p style={{ fontSize: '14px', color: '#666', margin: '0' }}>
          From Baking Great Bread • Generated on {new Date().toLocaleDateString()}
        </p>
      </div>

      {/* Hero Image */}
      <div style={{ marginBottom: '30px', textAlign: 'center' }}>
        <img
          src={heroImage}
          alt="Pumpkin-shaped sourdough loaf with cinnamon stick stem"
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
        <div>
          <strong>Prep Time:</strong><br />
          {recipeData.prepTime}
        </div>
        <div>
          <strong>Bake Time:</strong><br />
          {recipeData.bakeTime}
        </div>
        <div>
          <strong>Yield:</strong><br />
          {recipeData.yield}
        </div>
        <div>
          <strong>Total Time:</strong><br />
          {recipeData.totalTime}
        </div>
      </div>

      {/* Ingredients */}
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
          {recipeData.ingredients.map((ingredient, index) => (
            <li key={index} style={{ marginBottom: '5px' }}>
              {ingredient}
            </li>
          ))}
        </ul>
      </div>

      {/* Equipment */}
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
          {recipeData.equipment.map((item, index) => (
            <li key={index} style={{ marginBottom: '5px' }}>
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Method */}
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
          {recipeData.instructions.map((step, index) => (
            <li key={index} style={{
              marginBottom: '20px',
              lineHeight: '1.6'
            }}>
              <strong>{step.name}:</strong> {step.text}
              {step.image && (
                <div style={{ marginTop: '10px' }}>
                  <img
                    src={step.image}
                    alt={`Step ${index + 1}: ${step.name}`}
                    onLoad={handleImageLoad}
                    onError={handleImageError}
                    style={{
                      maxWidth: '100%',
                      width: '400px',
                      height: 'auto',
                      borderRadius: '8px',
                      display: 'block'
                    }}
                  />
                </div>
              )}
            </li>
          ))}
        </ol>
      </div>

      {/* Notes */}
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
          <p style={{ margin: '0' }}>{recipeData.notes}</p>
          <ul style={{ marginTop: '10px', paddingLeft: '20px' }}>
            <li>If dough feels slack, keep water at 150 g, add an extra coil fold, and extend cold proof.</li>
            <li>Dust with flour before baking for bold segment contrast.</li>
            <li>Twine should be food-safe cotton. Remove before serving.</li>
          </ul>
        </div>
      </div>

      {/* Footer */}
      <div style={{
        borderTop: '1px solid #ddd',
        paddingTop: '20px',
        textAlign: 'center',
        fontSize: '12px',
        color: '#666'
      }}>
        <p style={{ margin: '0' }}>
          Recipe from <strong>Baking Great Bread</strong> by Henry Hunter<br />
          Visit us at bread-baking-hub.vercel.app for more great recipes
        </p>
      </div>
    </div>
  );
};

export default PumpkinSourdoughPrint;