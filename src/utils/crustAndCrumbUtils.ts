import type { Symptom } from '@/types/crustAndCrumb';

/**
 * Filters symptoms based on bread type and stage
 */
export const filterSymptomsByDiagnosis = (
  symptoms: Symptom[],
  breadType: string,
  stage: string
): Symptom[] => {
  return symptoms.filter(symptom => {
    const matchesBreadType = !breadType || 
      !symptom.breadType || 
      symptom.breadType.includes(breadType);
    const matchesStage = !stage || 
      !symptom.stage || 
      symptom.stage === stage;
    return matchesBreadType && matchesStage;
  });
};

/**
 * Groups symptoms by category
 */
export const groupSymptomsByCategory = (symptoms: Symptom[]): { [key: string]: Symptom[] } => {
  const groups: { [key: string]: Symptom[] } = {};
  symptoms.forEach(symptom => {
    if (!groups[symptom.category]) {
      groups[symptom.category] = [];
    }
    groups[symptom.category].push(symptom);
  });
  return groups;
};

/**
 * Gets unique categories from symptoms
 */
export const getUniqueCategories = (symptoms: Symptom[]): string[] => {
  const uniqueCategories = [...new Set(symptoms.map(symptom => symptom.category))];
  return uniqueCategories.sort();
};

/**
 * Formats symptom title for display
 */
export const formatSymptomTitle = (symptom: Symptom): string => {
  if (!symptom.labels || symptom.labels.length === 0) {
    console.warn('Symptom missing labels:', symptom.id);
    return 'Unknown Issue';
  }
  return symptom.labels[0].charAt(0).toUpperCase() + symptom.labels[0].slice(1);
};

/**
 * Validates symptom data structure
 */
export const validateSymptom = (symptom: any): symptom is Symptom => {
  if (!symptom.id) {
    console.warn('Symptom missing id:', symptom);
    return false;
  }
  if (!symptom.labels || !Array.isArray(symptom.labels) || symptom.labels.length === 0) {
    console.warn('Symptom missing or invalid labels:', symptom.id);
    return false;
  }
  if (!symptom.category) {
    console.warn('Symptom missing category:', symptom.id);
    return false;
  }
  if (!symptom.quickFix) {
    console.warn('Symptom missing quickFix:', symptom.id);
    return false;
  }
  if (!symptom.deepDive) {
    console.warn('Symptom missing deepDive:', symptom.id);
    return false;
  }
  return true;
};

/**
 * Filters and validates symptoms from raw data
 */
export const processSymptoms = (rawSymptoms: any[]): Symptom[] => {
  if (!Array.isArray(rawSymptoms)) {
    console.error('Invalid symptoms data: expected array');
    return [];
  }
  
  return rawSymptoms.filter(validateSymptom);
};

/**
 * Constants for the Crust & Crumb module
 */
export const CRUST_AND_CRUMB_CONSTANTS = {
  VERSION: '1.0.0',
  BREAD_TYPES: ['sourdough', 'yeasted', 'quick', 'enriched'],
  STAGES: ['mixing', 'bulk-ferment', 'proofing', 'baking', 'post-bake'],
  PLACEHOLDER_IMAGE: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=300&fit=crop&crop=center',
} as const;