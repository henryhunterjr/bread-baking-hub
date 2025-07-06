import { describe, it, expect, vi, beforeEach } from 'vitest';
import { detectSymptoms, scanWithAI, analyzeSymptoms } from '../SymptomMatcher';

// Mock symptoms data
const mockSymptoms = [
  {
    id: 'gummy-crumb',
    labels: ['gummy', 'sticky', 'undercooked', 'wet', 'dense'],
    category: 'crumb',
    quickFix: 'Bake longer at lower temperature',
    deepDive: 'Detailed explanation...',
    images: { before: '/before.jpg', after: '/after.jpg' }
  },
  {
    id: 'burnt-bottom',
    labels: ['burnt', 'bottom', 'dark', 'over-baked', 'charred'],
    category: 'baking',
    quickFix: 'Move to higher rack',
    deepDive: 'Another detailed explanation...',
    images: { before: '/before2.jpg', after: '/after2.jpg' }
  }
];

// Mock the symptoms.json import
vi.mock('@/data/symptoms.json', () => ({
  default: { symptoms: mockSymptoms }
}));

// Mock fetch for scanWithAI tests
global.fetch = vi.fn();

describe('SymptomMatcher', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('detectSymptoms', () => {
    it('should detect matching symptoms by exact label match', () => {
      const text = 'My bread has a gummy crumb texture';
      const result = detectSymptoms(text);
      
      expect(result).toContain('gummy-crumb');
    });

    it('should detect multiple symptoms', () => {
      const text = 'The bread is gummy and the bottom is burnt';
      const result = detectSymptoms(text);
      
      expect(result).toContain('gummy-crumb');
      expect(result).toContain('burnt-bottom');
    });

    it('should handle case-insensitive matching', () => {
      const text = 'My bread has GUMMY texture';
      const result = detectSymptoms(text);
      
      expect(result).toContain('gummy-crumb');
    });

    it('should return empty array for non-matching text', () => {
      const text = 'My bread is perfect and delicious';
      const result = detectSymptoms(text);
      
      expect(result).toEqual([]);
    });

    it('should handle word boundary checks', () => {
      // Should match 'wet' as a complete word
      const text1 = 'The crumb is wet';
      const result1 = detectSymptoms(text1);
      expect(result1).toContain('gummy-crumb');

      // Should not match 'wet' as part of 'sweater'
      const text2 = 'I wore my sweater while baking';
      const result2 = detectSymptoms(text2);
      expect(result2).toEqual([]);
    });

    it('should handle empty or invalid input', () => {
      expect(detectSymptoms('')).toEqual([]);
      expect(detectSymptoms(null as any)).toEqual([]);
      expect(detectSymptoms(undefined as any)).toEqual([]);
    });

    it('should remove duplicate symptom IDs', () => {
      const text = 'The bread is gummy and sticky and wet';
      const result = detectSymptoms(text);
      
      // All these labels point to the same symptom
      expect(result).toEqual(['gummy-crumb']);
      expect(result.length).toBe(1);
    });
  });

  describe('scanWithAI', () => {
    it('should call the correct API endpoint', async () => {
      const mockResponse = [
        { id: 'gummy-crumb', score: 0.8 },
        { id: 'burnt-bottom', score: 0.6 }
      ];

      (fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const text = 'My bread has issues';
      const result = await scanWithAI(text);

      expect(fetch).toHaveBeenCalledWith(
        'https://ojyckskucneljvuqzrsw.supabase.co/functions/v1/scan-symptoms',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ text })
        }
      );

      expect(result).toEqual(mockResponse);
    });

    it('should handle API errors gracefully', async () => {
      (fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error'
      });

      const result = await scanWithAI('test text');
      expect(result).toEqual([]);
    });

    it('should handle invalid response format', async () => {
      (fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => 'invalid response'
      });

      const result = await scanWithAI('test text');
      expect(result).toEqual([]);
    });

    it('should filter out invalid result objects', async () => {
      const mockResponse = [
        { id: 'gummy-crumb', score: 0.8 }, // valid
        { id: 'invalid', score: 'not-a-number' }, // invalid score
        { score: 0.6 }, // missing id
        { id: 'burnt-bottom', score: 1.5 }, // score out of range
        { id: 'valid-symptom', score: 0.5 } // valid
      ];

      (fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const result = await scanWithAI('test text');
      
      expect(result).toEqual([
        { id: 'gummy-crumb', score: 0.8 },
        { id: 'valid-symptom', score: 0.5 }
      ]);
    });

    it('should handle network errors', async () => {
      (fetch as any).mockRejectedValueOnce(new Error('Network error'));

      const result = await scanWithAI('test text');
      expect(result).toEqual([]);
    });

    it('should handle empty or invalid input', async () => {
      const result1 = await scanWithAI('');
      const result2 = await scanWithAI(null as any);
      const result3 = await scanWithAI(undefined as any);

      expect(result1).toEqual([]);
      expect(result2).toEqual([]);
      expect(result3).toEqual([]);
    });
  });

  describe('analyzeSymptoms', () => {
    it('should combine keyword matches and AI results', async () => {
      const mockAIResponse = [
        { id: 'burnt-bottom', score: 0.9 },
        { id: 'new-symptom', score: 0.7 }
      ];

      (fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockAIResponse
      });

      const text = 'My bread is gummy and burnt on the bottom';
      const result = await analyzeSymptoms(text);

      expect(result.keywordMatches).toContain('gummy-crumb');
      expect(result.keywordMatches).toContain('burnt-bottom');
      expect(result.aiResults).toEqual(mockAIResponse);
      
      // Should combine results with higher scores taking precedence
      expect(result.combinedResults).toEqual(
        expect.arrayContaining([
          { id: 'burnt-bottom', score: 0.9 }, // AI score higher than keyword
          { id: 'gummy-crumb', score: 0.7 }, // Keyword match base score
          { id: 'new-symptom', score: 0.7 } // AI only
        ])
      );
    });

    it('should sort combined results by score descending', async () => {
      (fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => [
          { id: 'low-score', score: 0.3 },
          { id: 'high-score', score: 0.9 }
        ]
      });

      const result = await analyzeSymptoms('test with gummy texture');
      
      // Should be sorted by score descending
      const scores = result.combinedResults.map(r => r.score);
      expect(scores).toEqual([...scores].sort((a, b) => b - a));
    });
  });
});