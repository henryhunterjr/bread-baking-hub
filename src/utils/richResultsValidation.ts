// Utility for validating rich results implementation
export const validateRichResults = () => {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check for required structured data
  const structuredDataScripts = document.querySelectorAll('script[type="application/ld+json"]');
  
  if (structuredDataScripts.length === 0) {
    errors.push('No structured data found on page');
    return { errors, warnings, isValid: false };
  }

  structuredDataScripts.forEach((script, index) => {
    try {
      const data = JSON.parse(script.textContent || '');
      
      // Validate based on schema type
      if (data['@type'] === 'Recipe') {
        validateRecipeSchema(data, errors, warnings);
      } else if (data['@type'] === 'BlogPosting') {
        validateBlogPostSchema(data, errors, warnings);
      } else if (data['@type'] === 'Organization') {
        validateOrganizationSchema(data, errors, warnings);
      } else if (data['@type'] === 'Product') {
        validateProductSchema(data, errors, warnings);
      }
    } catch (e) {
      errors.push(`Invalid JSON-LD in script ${index + 1}: ${e}`);
    }
  });

  // Check meta tags for social sharing
  validateMetaTags(errors, warnings);

  return {
    errors,
    warnings,
    isValid: errors.length === 0
  };
};

const validateRecipeSchema = (data: any, errors: string[], warnings: string[]) => {
  // Required fields for Recipe rich results
  const requiredFields = ['name', 'description', 'author', 'recipeIngredient', 'recipeInstructions'];
  
  requiredFields.forEach(field => {
    if (!data[field]) {
      errors.push(`Recipe schema missing required field: ${field}`);
    }
  });

  // Recommended fields
  const recommendedFields = ['image', 'cookTime', 'prepTime', 'recipeYield', 'nutrition'];
  
  recommendedFields.forEach(field => {
    if (!data[field]) {
      warnings.push(`Recipe schema missing recommended field: ${field}`);
    }
  });

  // Validate instructions format
  if (data.recipeInstructions) {
    if (!Array.isArray(data.recipeInstructions)) {
      errors.push('Recipe instructions must be an array');
    } else {
      data.recipeInstructions.forEach((instruction: any, index: number) => {
        if (typeof instruction === 'string') {
          warnings.push(`Instruction ${index + 1} should be a structured object with @type: 'HowToStep'`);
        }
      });
    }
  }

  // Validate author format
  if (data.author && typeof data.author === 'string') {
    warnings.push('Author should be a structured Person object, not a string');
  }
};

const validateBlogPostSchema = (data: any, errors: string[], warnings: string[]) => {
  const requiredFields = ['headline', 'description', 'author', 'datePublished'];
  
  requiredFields.forEach(field => {
    if (!data[field]) {
      errors.push(`BlogPosting schema missing required field: ${field}`);
    }
  });

  const recommendedFields = ['image', 'dateModified', 'publisher', 'mainEntityOfPage'];
  
  recommendedFields.forEach(field => {
    if (!data[field]) {
      warnings.push(`BlogPosting schema missing recommended field: ${field}`);
    }
  });

  // Validate date formats
  if (data.datePublished && !isValidDate(data.datePublished)) {
    errors.push('datePublished must be in ISO 8601 format');
  }

  if (data.dateModified && !isValidDate(data.dateModified)) {
    errors.push('dateModified must be in ISO 8601 format');
  }
};

const validateOrganizationSchema = (data: any, errors: string[], warnings: string[]) => {
  const requiredFields = ['name', 'url'];
  
  requiredFields.forEach(field => {
    if (!data[field]) {
      errors.push(`Organization schema missing required field: ${field}`);
    }
  });

  const recommendedFields = ['logo', 'contactPoint', 'sameAs'];
  
  recommendedFields.forEach(field => {
    if (!data[field]) {
      warnings.push(`Organization schema missing recommended field: ${field}`);
    }
  });
};

const validateProductSchema = (data: any, errors: string[], warnings: string[]) => {
  const requiredFields = ['name', 'description', 'offers'];
  
  requiredFields.forEach(field => {
    if (!data[field]) {
      errors.push(`Product schema missing required field: ${field}`);
    }
  });

  // Validate offers
  if (data.offers) {
    if (!data.offers.price && !data.offers.priceRange) {
      errors.push('Product offers must include price or priceRange');
    }
    if (!data.offers.priceCurrency) {
      errors.push('Product offers must include priceCurrency');
    }
  }
};

const validateMetaTags = (errors: string[], warnings: string[]) => {
  // Required meta tags
  const title = document.querySelector('title');
  if (!title || !title.textContent?.trim()) {
    errors.push('Page missing title tag');
  }

  const description = document.querySelector('meta[name="description"]');
  if (!description || !description.getAttribute('content')?.trim()) {
    errors.push('Page missing meta description');
  }

  // Open Graph tags
  const ogTitle = document.querySelector('meta[property="og:title"]');
  if (!ogTitle) {
    warnings.push('Missing Open Graph title');
  }

  const ogDescription = document.querySelector('meta[property="og:description"]');
  if (!ogDescription) {
    warnings.push('Missing Open Graph description');
  }

  const ogImage = document.querySelector('meta[property="og:image"]');
  if (!ogImage) {
    warnings.push('Missing Open Graph image');
  }

  // Twitter Card tags
  const twitterCard = document.querySelector('meta[name="twitter:card"]');
  if (!twitterCard) {
    warnings.push('Missing Twitter Card type');
  }

  // Canonical URL
  const canonical = document.querySelector('link[rel="canonical"]');
  if (!canonical) {
    warnings.push('Missing canonical URL');
  }
};

const isValidDate = (dateString: string): boolean => {
  const date = new Date(dateString);
  return !isNaN(date.getTime()) && dateString.includes('T'); // ISO 8601 format check
};

// Helper function to run validation and log results
export const runRichResultsValidation = () => {
  const results = validateRichResults();
  
  console.group('Rich Results Validation');
  
  if (results.errors.length > 0) {
    console.error('Errors that prevent rich results:');
    results.errors.forEach(error => console.error(`❌ ${error}`));
  }
  
  if (results.warnings.length > 0) {
    console.warn('Warnings that may affect rich results:');
    results.warnings.forEach(warning => console.warn(`⚠️ ${warning}`));
  }
  
  if (results.isValid && results.warnings.length === 0) {
    console.log('✅ All rich results validation passed!');
  }
  
  console.groupEnd();
  
  return results;
};