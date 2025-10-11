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
  container.style.padding = '15mm';
  container.style.fontFamily = 'Arial, sans-serif';
  container.style.fontSize = '11pt';
  container.style.lineHeight = '1.4';
  container.style.color = '#000';

  // Build compact HTML content for printing
  let html = `
    <div style="margin-bottom: 12px; border-bottom: 2px solid #333; padding-bottom: 8px;">
      <h1 style="margin: 0 0 4px 0; font-size: 18pt; font-weight: bold; color: #000;">
        ${recipe.title}
      </h1>
  `;

  if (recipe.introduction) {
    const intro = recipe.introduction.length > 150 
      ? recipe.introduction.substring(0, 150) + '...' 
      : recipe.introduction;
    html += `<p style="margin: 4px 0; font-size: 10pt; color: #333;">${intro}</p>`;
  }
  html += `</div>`;

  // Recipe metadata - compact format
  if (recipe.prep_time || recipe.cook_time || recipe.total_time || recipe.servings) {
    html += `<div style="display: flex; gap: 15px; margin-bottom: 12px; font-size: 10pt; flex-wrap: wrap;">`;
    if (recipe.prep_time) html += `<span><strong>Prep:</strong> ${recipe.prep_time}</span>`;
    if (recipe.cook_time) html += `<span><strong>Cook:</strong> ${recipe.cook_time}</span>`;
    if (recipe.total_time) html += `<span><strong>Total:</strong> ${recipe.total_time}</span>`;
    if (recipe.servings) html += `<span><strong>Servings:</strong> ${recipe.servings}</span>`;
    html += `</div>`;
  }

  // Ingredients - both metric and volume in compact format
  if (recipe.ingredients) {
    html += `<h2 style="font-size: 13pt; font-weight: bold; margin: 15px 0 8px 0; color: #000; border-bottom: 1px solid #666; padding-bottom: 4px;">Ingredients</h2>`;
    
    // Parse ingredients structure
    let metricIngredients: any[] = [];
    let volumeIngredients: any[] = [];
    
    if (Array.isArray(recipe.ingredients)) {
      metricIngredients = recipe.ingredients;
      volumeIngredients = recipe.ingredients;
    } else if (typeof recipe.ingredients === 'object') {
      if (recipe.ingredients.metric) {
        metricIngredients = Array.isArray(recipe.ingredients.metric) 
          ? recipe.ingredients.metric 
          : Object.values(recipe.ingredients.metric);
      }
      if (recipe.ingredients.volume) {
        volumeIngredients = Array.isArray(recipe.ingredients.volume)
          ? recipe.ingredients.volume
          : Object.values(recipe.ingredients.volume);
      }
      
      // Fallback if no metric/volume split
      if (metricIngredients.length === 0 && volumeIngredients.length === 0) {
        metricIngredients = Object.values(recipe.ingredients).flat();
        volumeIngredients = metricIngredients;
      }
    }

    // Display both metric and volume side by side
    const maxLength = Math.max(metricIngredients.length, volumeIngredients.length);
    
    if (maxLength > 0) {
      html += `
        <table style="width: 100%; border-collapse: collapse; font-size: 10pt; margin-bottom: 15px;">
          <thead>
            <tr>
              <th style="text-align: left; padding: 4px 8px; border-bottom: 1px solid #999; width: 50%; font-weight: bold;">Metric</th>
              <th style="text-align: left; padding: 4px 8px; border-bottom: 1px solid #999; width: 50%; font-weight: bold;">Volume</th>
            </tr>
          </thead>
          <tbody>
      `;
      
      // Ensure we display ALL ingredients including the last one
      for (let i = 0; i < maxLength; i++) {
        const metricIng = metricIngredients[i];
        const volumeIng = volumeIngredients[i];
        
        const metricText = metricIng ? (typeof metricIng === 'string' ? metricIng : metricIng.item || metricIng.ingredient || '') : '';
        const volumeText = volumeIng ? (typeof volumeIng === 'string' ? volumeIng : volumeIng.item || volumeIng.ingredient || '') : '';
        
        html += `
          <tr>
            <td style="padding: 3px 8px; border-bottom: 1px solid #eee; vertical-align: top;">• ${metricText}</td>
            <td style="padding: 3px 8px; border-bottom: 1px solid #eee; vertical-align: top;">• ${volumeText}</td>
          </tr>
        `;
      }
      
      html += `</tbody></table>`;
    }
  }

  // Method
  if (recipe.method) {
    html += `<h2 style="font-size: 13pt; font-weight: bold; margin: 15px 0 8px 0; color: #000; border-bottom: 1px solid #666; padding-bottom: 4px;">Instructions</h2>`;
    html += `<ol style="margin: 0; padding-left: 20px; font-size: 10pt;">`;
    
    const methods = Array.isArray(recipe.method) 
      ? recipe.method 
      : typeof recipe.method === 'object' 
        ? Object.values(recipe.method).flat()
        : [];
    
    // Ensure all steps are included
    methods.forEach((step: any, index: number) => {
      const text = typeof step === 'string' ? step : step.instruction || step.step || '';
      if (text) {
        html += `<li style="margin-bottom: 8px; line-height: 1.5;">${text}</li>`;
      }
    });
    html += `</ol>`;
  }

  // Tips - compact format
  if (recipe.tips && recipe.tips.length > 0) {
    html += `<h2 style="font-size: 13pt; font-weight: bold; margin: 15px 0 8px 0; color: #000; border-bottom: 1px solid #666; padding-bottom: 4px;">Tips & Notes</h2>`;
    html += `<ul style="margin: 0; padding-left: 20px; font-size: 10pt;">`;
    recipe.tips.forEach(tip => {
      html += `<li style="margin-bottom: 6px;">${tip}</li>`;
    });
    html += `</ul>`;
  }

  // Minimal footer
  html += `
    <div style="margin-top: 20px; padding-top: 10px; border-top: 1px solid #ccc; font-size: 9pt; color: #666; text-align: center;">
      <p style="margin: 0;">From Baking Great Bread | bakinggreatbread.com</p>
    </div>
  `;

  container.innerHTML = html;

  // PDF options - optimized for compact printing
  const opt = {
    margin: [10, 10, 10, 10], // Smaller margins
    filename: `${recipe.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`,
    image: { type: 'jpeg', quality: 0.95 },
    html2canvas: { 
      scale: 2,
      useCORS: true,
      logging: false
    },
    jsPDF: { 
      unit: 'mm', 
      format: 'a4', 
      orientation: 'portrait',
      compress: true
    },
    pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
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
