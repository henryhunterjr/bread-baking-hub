import symptomsData from '@/data/symptoms.json';
import { trackSymptomDetection } from '@/utils/appEvents';

interface Symptom {
  id: string;
  labels: string[];
  category: string;
  quickFix: string;
  deepDive: string;
  images: { before: string; after: string };
}

interface ScanResult {
  id: string;
  score: number;
}

/**
 * Detects symptoms by matching keywords in text against symptom labels
 * @param text - The text to analyze for symptoms
 * @returns Array of matching symptom IDs
 */
export function detectSymptoms(text: string): string[] {
  if (!text || typeof text !== 'string') {
    return [];
  }

  const normalizedText = text.toLowerCase().trim();
  const matchingIds: string[] = [];
  
  const symptoms = symptomsData.symptoms as Symptom[];

  symptoms.forEach((symptom) => {
    const hasMatch = symptom.labels.some((label) => {
      const normalizedLabel = label.toLowerCase();
      
      // Check for exact word match (not just substring)
      const wordBoundaryRegex = new RegExp(`\\b${normalizedLabel.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
      
      return wordBoundaryRegex.test(normalizedText) || 
             normalizedText.includes(normalizedLabel);
    });

    if (hasMatch) {
      matchingIds.push(symptom.id);
    }
  });

  return [...new Set(matchingIds)]; // Remove duplicates
}

/**
 * Scans text using AI to detect bread troubleshooting symptoms
 * @param text - The recipe or problem description text
 * @returns Promise resolving to array of symptoms with confidence scores
 */
export async function scanWithAI(text: string): Promise<ScanResult[]> {
  if (!text || typeof text !== 'string') {
    return [];
  }

  try {
    const response = await fetch('https://ojyckskucneljvuqzrsw.supabase.co/functions/v1/scan-symptoms', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      console.warn(`AI scan API request failed: ${response.status} ${response.statusText}`);
      return [];
    }

    const data = await response.json();
    
    // Validate response structure
    if (!Array.isArray(data)) {
      console.warn('AI scan response is not an array:', data);
      return [];
    }

    // Validate each result object
    const validResults = data.filter((result: any) => 
      result && 
      typeof result.id === 'string' && 
      typeof result.score === 'number' &&
      result.score >= 0 && 
      result.score <= 1
    );

    return validResults as ScanResult[];
  } catch (error) {
    console.warn('AI scan temporarily unavailable:', error instanceof Error ? error.message : 'Unknown error');
    return [];
  }
}

/**
 * Combines keyword detection and AI scanning for comprehensive symptom analysis
 * @param text - The text to analyze
 * @returns Promise resolving to combined results with keyword matches and AI scores
 */
export async function analyzeSymptoms(text: string): Promise<{
  keywordMatches: string[];
  aiResults: ScanResult[];
  combinedResults: ScanResult[];
}> {
  const keywordMatches = detectSymptoms(text);
  const aiResults = await scanWithAI(text);
  
  // Combine results, giving keyword matches a base score if not found by AI
  const combinedMap = new Map<string, number>();
  
  // Add keyword matches with base score
  keywordMatches.forEach(id => {
    combinedMap.set(id, 0.7); // High confidence for keyword matches
  });
  
  // Add or update with AI scores
  aiResults.forEach(result => {
    const existingScore = combinedMap.get(result.id) || 0;
    // Take the higher score between keyword match and AI
    combinedMap.set(result.id, Math.max(existingScore, result.score));
  });
  
  const combinedResults = Array.from(combinedMap.entries())
    .map(([id, score]) => ({ id, score }))
    .sort((a, b) => b.score - a.score); // Sort by confidence descending
  
  return {
    keywordMatches,
    aiResults,
    combinedResults
  };
}

/**
 * High-level function that performs symptom analysis with automatic tracking
 * @param text - The text to analyze
 * @returns Promise resolving to analysis results
 */
export async function performSymptomAnalysis(text: string) {
  const results = await analyzeSymptoms(text);
  
  // Track the analysis
  if (results.combinedResults.length > 0) {
    const symptomIds = results.combinedResults.map(r => r.id);
    trackSymptomDetection(symptomIds, 'combined');
  }
  
  return results;
}