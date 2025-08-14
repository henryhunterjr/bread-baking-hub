// Utility to check for /lovable-uploads/ paths and suggest replacements
export const checkLovableUploads = () => {
  const violations: Array<{
    element: Element;
    attribute: string;
    value: string;
    suggestion: string;
  }> = [];

  // Check img src attributes
  document.querySelectorAll('img[src*="/lovable-uploads/"]').forEach(img => {
    violations.push({
      element: img,
      attribute: 'src',
      value: img.getAttribute('src') || '',
      suggestion: 'Move image to /src/assets/ or Supabase storage and update import'
    });
  });

  // Check CSS background-image properties
  document.querySelectorAll('*').forEach(element => {
    const computedStyle = window.getComputedStyle(element);
    const backgroundImage = computedStyle.backgroundImage;
    
    if (backgroundImage && backgroundImage.includes('/lovable-uploads/')) {
      violations.push({
        element,
        attribute: 'background-image',
        value: backgroundImage,
        suggestion: 'Move background image to permanent storage location'
      });
    }
  });

  // Check for inline style attributes
  document.querySelectorAll('[style*="/lovable-uploads/"]').forEach(element => {
    const style = element.getAttribute('style') || '';
    violations.push({
      element,
      attribute: 'style',
      value: style,
      suggestion: 'Replace inline style with permanent asset reference'
    });
  });

  return violations;
};

// Function to highlight violations on the page
export const highlightLovableUploadViolations = () => {
  const violations = checkLovableUploads();
  
  violations.forEach(violation => {
    violation.element.setAttribute('data-lovable-violation', 'true');
    (violation.element as HTMLElement).style.outline = '3px solid red';
    (violation.element as HTMLElement).style.outlineOffset = '2px';
    
    // Add tooltip with suggestion
    const tooltip = document.createElement('div');
    tooltip.textContent = violation.suggestion;
    tooltip.style.cssText = `
      position: absolute;
      background: #333;
      color: white;
      padding: 8px;
      border-radius: 4px;
      font-size: 12px;
      z-index: 10000;
      max-width: 200px;
      word-wrap: break-word;
      pointer-events: none;
    `;
    
    violation.element.addEventListener('mouseenter', (e) => {
      const rect = (e.target as Element).getBoundingClientRect();
      tooltip.style.left = rect.left + 'px';
      tooltip.style.top = (rect.bottom + 5) + 'px';
      document.body.appendChild(tooltip);
    });
    
    violation.element.addEventListener('mouseleave', () => {
      if (tooltip.parentNode) {
        tooltip.parentNode.removeChild(tooltip);
      }
    });
  });

  return violations;
};

// Function to clear violation highlights
export const clearLovableUploadHighlights = () => {
  document.querySelectorAll('[data-lovable-violation="true"]').forEach(element => {
    element.removeAttribute('data-lovable-violation');
    (element as HTMLElement).style.outline = '';
    (element as HTMLElement).style.outlineOffset = '';
  });
};