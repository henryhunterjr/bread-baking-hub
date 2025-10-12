export interface ParsedRecipeSection {
  type: 'header' | 'subheader' | 'bullet' | 'text' | 'numberedList';
  content: string;
  level?: number;
  items?: string[];
}

export interface ParsedIngredientSection {
  header?: string;
  items: string[];
}

export interface ParsedMethodSection {
  header: string;
  subSections: {
    title?: string;
    steps: string[];
  }[];
}

export interface ParsedRecipe {
  introduction?: string;
  whatMakesThisWork?: string;
  ingredients: ParsedIngredientSection[];
  method: ParsedMethodSection[];
  bakersNotes?: string;
  troubleshooting?: string;
  whyThisWorks?: string;
  equipment?: string[];
  timing?: string;
  yield?: string;
}

/**
 * Parses markdown recipe content and returns structured data
 * with proper hierarchy preserved
 */
export const parseMarkdownRecipe = (markdown: string): ParsedRecipe => {
  const lines = markdown.split('\n');
  const result: ParsedRecipe = {
    ingredients: [],
    method: []
  };

  let currentSection: string | null = null;
  let currentIngredientGroup: ParsedIngredientSection | null = null;
  let currentMethodGroup: ParsedMethodSection | null = null;
  let currentMethodSubSection: { title?: string; steps: string[] } | null = null;
  let contentBuffer: string[] = [];

  const flushContentBuffer = (target: 'introduction' | 'whatMakesThisWork' | 'bakersNotes' | 'troubleshooting' | 'whyThisWorks' | 'timing' | 'yield') => {
    if (contentBuffer.length > 0) {
      result[target] = contentBuffer.join('\n').trim();
      contentBuffer = [];
    }
  };

  const flushIngredientGroup = () => {
    if (currentIngredientGroup && currentIngredientGroup.items.length > 0) {
      result.ingredients.push(currentIngredientGroup);
      currentIngredientGroup = null;
    }
  };

  const flushMethodSubSection = () => {
    if (currentMethodSubSection && currentMethodSubSection.steps.length > 0 && currentMethodGroup) {
      currentMethodGroup.subSections.push(currentMethodSubSection);
      currentMethodSubSection = null;
    }
  };

  const flushMethodGroup = () => {
    flushMethodSubSection();
    if (currentMethodGroup && currentMethodGroup.subSections.length > 0) {
      result.method.push(currentMethodGroup);
      currentMethodGroup = null;
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    if (!line) continue;

    // Detect section headers
    if (line.match(/^#{1,2}\s+Ingredients?$/i)) {
      flushContentBuffer('introduction');
      currentSection = 'ingredients';
      continue;
    }

    if (line.match(/^#{1,2}\s+(Instructions?|Method)$/i)) {
      flushIngredientGroup();
      currentSection = 'method';
      continue;
    }

    if (line.match(/^#{1,2}\s+What Makes This Recipe Work$/i)) {
      flushContentBuffer('introduction');
      currentSection = 'whatMakesThisWork';
      continue;
    }

    if (line.match(/^#{1,2}\s+Baker'?s? Notes?$/i)) {
      flushMethodGroup();
      currentSection = 'bakersNotes';
      continue;
    }

    if (line.match(/^#{1,2}\s+Troubleshooting$/i)) {
      flushContentBuffer('bakersNotes');
      currentSection = 'troubleshooting';
      continue;
    }

    if (line.match(/^#{1,2}\s+Why This Recipe Works$/i)) {
      flushContentBuffer('troubleshooting');
      currentSection = 'whyThisWorks';
      continue;
    }

    if (line.match(/^#{1,2}\s+Equipment( Needed)?$/i)) {
      flushContentBuffer('whyThisWorks');
      currentSection = 'equipment';
      continue;
    }

    if (line.match(/^#{1,2}\s+Timing$/i)) {
      currentSection = 'timing';
      continue;
    }

    if (line.match(/^#{1,2}\s+Yield$/i)) {
      currentSection = 'yield';
      continue;
    }

    // Process content based on current section
    if (!currentSection) {
      // Before any section = introduction
      contentBuffer.push(line);
      continue;
    }

    switch (currentSection) {
      case 'whatMakesThisWork':
      case 'bakersNotes':
      case 'troubleshooting':
      case 'whyThisWorks':
      case 'timing':
      case 'yield':
        contentBuffer.push(line);
        break;

      case 'ingredients':
        // ### Header (ingredient group)
        if (line.match(/^###/)) {
          flushIngredientGroup();
          currentIngredientGroup = {
            header: line.replace(/^###\s*/, '').trim(),
            items: []
          };
        }
        // Bullet point (ingredient item)
        else if (line.match(/^[-*•]/)) {
          if (!currentIngredientGroup) {
            currentIngredientGroup = { items: [] };
          }
          currentIngredientGroup.items.push(line.replace(/^[-*•]\s*/, '').trim());
        }
        break;

      case 'method':
        // ### Header (main time/day section)
        if (line.match(/^###/)) {
          flushMethodGroup();
          currentMethodGroup = {
            header: line.replace(/^###\s*/, '').trim(),
            subSections: []
          };
          currentMethodSubSection = null;
        }
        // #### Subheader (instruction step header like "Mix the Dough")
        else if (line.match(/^####/)) {
          flushMethodSubSection();
          currentMethodSubSection = {
            title: line.replace(/^####\s*/, '').trim(),
            steps: []
          };
        }
        // Bullet point (instruction step)
        else if (line.match(/^[-*•]/)) {
          if (!currentMethodGroup) {
            currentMethodGroup = {
              header: 'Instructions',
              subSections: []
            };
          }
          if (!currentMethodSubSection) {
            currentMethodSubSection = { steps: [] };
          }
          currentMethodSubSection.steps.push(line.replace(/^[-*•]\s*/, '').trim());
        }
        break;

      case 'equipment':
        if (line.match(/^[-*•]/)) {
          if (!result.equipment) {
            result.equipment = [];
          }
          result.equipment.push(line.replace(/^[-*•]\s*/, '').trim());
        }
        break;
    }
  }

  // Flush any remaining buffers
  flushContentBuffer(currentSection as any);
  flushIngredientGroup();
  flushMethodGroup();

  return result;
};
