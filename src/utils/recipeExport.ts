import html2pdf from 'html2pdf.js';

interface RecipeForExport {
  title: string;
  introduction?: string;
  prep_time?: string;
  cook_time?: string;
  total_time?: string;
  servings?: string;
  ingredients: any;
  method: any;
  tips?: string[];
  image_url?: string;
}

export const generateRecipePDF = async (recipe: RecipeForExport) => {
  // Create a temporary container for PDF content
  const container = document.createElement('div');
  container.style.padding = '20px';
  container.style.fontFamily = 'Arial, sans-serif';
  container.style.maxWidth = '800px';
  container.style.margin = '0 auto';

  // Build HTML content
  let html = `
    <h1 style="color: #1E150F; border-bottom: 3px solid #E0B243; padding-bottom: 10px; margin-bottom: 20px;">
      ${recipe.title}
    </h1>
  `;

  if (recipe.introduction) {
    html += `<p style="font-style: italic; margin-bottom: 20px;">${recipe.introduction}</p>`;
  }

  // Recipe metadata
  if (recipe.prep_time || recipe.cook_time || recipe.total_time || recipe.servings) {
    html += `<div style="display: flex; gap: 20px; margin-bottom: 20px; flex-wrap: wrap;">`;
    if (recipe.prep_time) html += `<div><strong>Prep:</strong> ${recipe.prep_time}</div>`;
    if (recipe.cook_time) html += `<div><strong>Cook:</strong> ${recipe.cook_time}</div>`;
    if (recipe.total_time) html += `<div><strong>Total:</strong> ${recipe.total_time}</div>`;
    if (recipe.servings) html += `<div><strong>Servings:</strong> ${recipe.servings}</div>`;
    html += `</div>`;
  }

  // Ingredients
  if (recipe.ingredients) {
    html += `<h2 style="color: #1E150F; border-left: 4px solid #E0B243; padding-left: 15px; margin: 30px 0 15px 0;">Ingredients</h2>`;
    html += `<ul style="line-height: 1.8;">`;
    
    const ingredients = Array.isArray(recipe.ingredients) 
      ? recipe.ingredients 
      : typeof recipe.ingredients === 'object' 
        ? Object.values(recipe.ingredients).flat()
        : [];
    
    ingredients.forEach((ing: any) => {
      const text = typeof ing === 'string' ? ing : ing.item || '';
      html += `<li style="margin-bottom: 8px;">${text}</li>`;
    });
    html += `</ul>`;
  }

  // Method
  if (recipe.method) {
    html += `<h2 style="color: #1E150F; border-left: 4px solid #E0B243; padding-left: 15px; margin: 30px 0 15px 0;">Method</h2>`;
    html += `<ol style="line-height: 1.8;">`;
    
    const methods = Array.isArray(recipe.method) 
      ? recipe.method 
      : typeof recipe.method === 'object' 
        ? Object.values(recipe.method).flat()
        : [];
    
    methods.forEach((step: any) => {
      const text = typeof step === 'string' ? step : step.instruction || '';
      html += `<li style="margin-bottom: 12px;">${text}</li>`;
    });
    html += `</ol>`;
  }

  // Tips
  if (recipe.tips && recipe.tips.length > 0) {
    html += `<h2 style="color: #1E150F; border-left: 4px solid #E0B243; padding-left: 15px; margin: 30px 0 15px 0;">Tips</h2>`;
    html += `<ul style="line-height: 1.8;">`;
    recipe.tips.forEach(tip => {
      html += `<li style="margin-bottom: 8px;">${tip}</li>`;
    });
    html += `</ul>`;
  }

  container.innerHTML = html;

  // PDF options
  const opt = {
    margin: 15,
    filename: `${recipe.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };

  // Generate and download PDF
  try {
    await html2pdf().set(opt).from(container).save();
    return true;
  } catch (error) {
    console.error('PDF generation error:', error);
    return false;
  }
};

export const copyRecipeLink = async (recipeSlug: string, recipeTitle: string): Promise<boolean> => {
  const url = `${window.location.origin}/recipes/${recipeSlug}`;
  
  try {
    await navigator.clipboard.writeText(url);
    return true;
  } catch (error) {
    console.error('Failed to copy link:', error);
    return false;
  }
};

export const shareRecipe = async (recipeSlug: string, recipeTitle: string, description?: string): Promise<boolean> => {
  const url = `${window.location.origin}/recipes/${recipeSlug}`;
  
  if (navigator.share) {
    try {
      await navigator.share({
        title: recipeTitle,
        text: description || `Check out this recipe: ${recipeTitle}`,
        url: url,
      });
      return true;
    } catch (error) {
      // User cancelled share or error occurred
      console.error('Share failed:', error);
      return false;
    }
  } else {
    // Fallback: copy to clipboard
    return await copyRecipeLink(recipeSlug, recipeTitle);
  }
};
