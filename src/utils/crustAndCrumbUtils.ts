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
  VERSION: '1.1.0',
  BREAD_TYPES: ['sourdough', 'yeasted', 'quick', 'enriched'],
  STAGES: ['mixing', 'bulk-ferment', 'proofing', 'baking', 'post-bake'],
  PLACEHOLDER_IMAGE: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=300&fit=crop&crop=center',
} as const;

/**
 * Photo diagnosis function - PLACEHOLDER FOR REAL AI INTEGRATION
 * 
 * TO IMPLEMENT REAL AI DIAGNOSIS:
 * 1. Replace this mock function with actual image analysis
 * 2. Options for implementation:
 *    - Upload image to edge function with computer vision model
 *    - Send to external AI service (OpenAI Vision, Google Vision, etc.)
 *    - Use on-device ML models via TensorFlow.js
 * 3. Expected workflow:
 *    - Process uploaded image (resize, compress if needed)
 *    - Send to AI service with breadType context
 *    - Parse AI response to match against symptoms database
 *    - Return most relevant symptoms with confidence scores
 * 4. Fallback: If AI can't determine issue, return general troubleshooting tips
 */
export const mockPhotoDiagnosis = (image: File, breadType?: string): Symptom[] => {
  console.log('Mock photo diagnosis for:', image.name, 'bread type:', breadType);
  
  // MOCK DATA - Replace with actual AI analysis results
  const mockSymptoms: Symptom[] = [
    {
      id: 'mock-dense-crumb',
      labels: ['Dense, Heavy Crumb', 'Poor Rise'],
      category: 'Crumb Issues',
      quickFix: 'Check your starter activity and fermentation time. Dense bread often indicates under-fermentation or weak starter.',
      deepDive: 'Dense bread typically results from insufficient fermentation time, weak or inactive starter, over-kneading, or incorrect hydration levels. Consider extending bulk fermentation time and ensuring your starter is at peak activity.',
      stage: 'bulk-ferment',
      breadType: breadType ? [breadType] : ['sourdough', 'yeasted']
    },
    {
      id: 'mock-pale-crust',
      labels: ['Pale Crust', 'Lack of Color'],
      category: 'Crust Issues', 
      quickFix: 'Increase oven temperature or baking time. Steam may be preventing browning - remove steam earlier.',
      deepDive: 'Pale crusts often result from insufficient baking time, low oven temperature, or excessive steam during the browning phase. Ensure your oven is properly preheated and consider removing steam sources after the first 15-20 minutes.',
      stage: 'baking',
      breadType: breadType ? [breadType] : ['sourdough', 'yeasted']
    }
  ];
  
  // Filter by bread type if provided
  let filteredSymptoms = mockSymptoms;
  if (breadType && breadType !== '') {
    filteredSymptoms = mockSymptoms.filter(symptom => 
      !symptom.breadType || symptom.breadType.includes(breadType)
    );
  }
  
  // Randomly select 1-2 symptoms for demonstration
  const shuffled = [...filteredSymptoms].sort(() => 0.5 - Math.random());
  const numResults = Math.random() > 0.5 ? 2 : 1;
  
  return shuffled.slice(0, numResults);
};