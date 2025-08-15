import { describe, it, expect } from 'vitest';
import {
  validateInputs,
  solveFromFlourHydration,
  solveFromLevainHydration,
  solveFromTotalHydration,
  solveFromFlourLevain,
  solveFromTotalLevain,
  solveBreadRecipe,
  calculateFlourBlend,
  calculatePerLoafWeights,
  createHenrysFoolproofPreset,
  type SolverInputs,
  type KnownValues
} from '../lib/breadMath';

const defaultInputs: SolverInputs = {
  hydrationPercent: 75,
  saltPercent: 2,
  levainPercent: 20,
  levainHydration: 100,
  numberOfLoaves: 1,
  flourBlend: []
};

describe('breadMath', () => {
  describe('validateInputs', () => {
    it('should return no errors for valid inputs', () => {
      const errors = validateInputs(defaultInputs);
      expect(errors).toHaveLength(0);
    });

    it('should validate hydration range', () => {
      const invalidInputs = { ...defaultInputs, hydrationPercent: 35 };
      const errors = validateInputs(invalidInputs);
      expect(errors).toContain('Hydration must be between 40% and 110%');
    });

    it('should validate salt range', () => {
      const invalidInputs = { ...defaultInputs, saltPercent: 0.3 };
      const errors = validateInputs(invalidInputs);
      expect(errors).toContain('Salt must be between 0.5% and 3.0%');
    });

    it('should validate levain percentage range', () => {
      const invalidInputs = { ...defaultInputs, levainPercent: 55 };
      const errors = validateInputs(invalidInputs);
      expect(errors).toContain('Levain percentage must be between 0% and 50%');
    });

    it('should validate flour blend sums to 100%', () => {
      const invalidInputs = {
        ...defaultInputs,
        flourBlend: [
          { name: 'Bread Flour', percentage: 80 },
          { name: 'Whole Wheat', percentage: 15 }
        ]
      };
      const errors = validateInputs(invalidInputs);
      expect(errors).toContain('Flour blend percentages must sum to 100%');
    });
  });

  describe('solveFromFlourHydration', () => {
    it('should calculate recipe from flour and hydration', () => {
      const recipe = solveFromFlourHydration(1000, 75, defaultInputs);
      
      expect(recipe.flourTotal).toBe(1000);
      expect(recipe.waterTotal).toBe(750);
      expect(recipe.saltGrams).toBe(20);
      expect(recipe.levainFlour).toBe(200);
      expect(recipe.levainWater).toBe(200);
      expect(recipe.levainTotal).toBe(400);
      expect(recipe.doughTotal).toBe(1770);
    });

    it('should handle different levain hydration', () => {
      const inputs = { ...defaultInputs, levainHydration: 75 };
      const recipe = solveFromFlourHydration(1000, 75, inputs);
      
      expect(recipe.levainFlour).toBe(200);
      expect(recipe.levainWater).toBe(150);
      expect(recipe.levainTotal).toBe(350);
    });
  });

  describe('solveFromLevainHydration', () => {
    it('should calculate recipe from levain total and hydration', () => {
      const recipe = solveFromLevainHydration(400, 75, defaultInputs);
      
      expect(recipe.levainFlour).toBe(200);
      expect(recipe.levainWater).toBe(200);
      expect(recipe.levainTotal).toBe(400);
      expect(recipe.flourTotal).toBe(1000);
      expect(recipe.waterTotal).toBe(750);
      expect(recipe.saltGrams).toBe(20);
    });
  });

  describe('solveFromTotalHydration', () => {
    it('should calculate recipe from total dough and hydration', () => {
      const recipe = solveFromTotalHydration(1770, 75, defaultInputs);
      
      // Should solve to approximately the same values as flour-hydration method
      expect(recipe.flourTotal).toBeCloseTo(1000, -1);
      expect(recipe.waterTotal).toBeCloseTo(750, -1);
      expect(recipe.saltGrams).toBeCloseTo(20, -1);
      expect(recipe.doughTotal).toBeCloseTo(1770, -1);
    });
  });

  describe('solveFromFlourLevain', () => {
    it('should calculate recipe from flour and levain totals', () => {
      const result = solveFromFlourLevain(1000, 400, defaultInputs);
      
      expect(result.recipe.flourTotal).toBe(1000);
      expect(result.recipe.levainTotal).toBe(400);
      expect(result.adjustedLevainPercent).toBeUndefined(); // Should match expected 20%
    });

    it('should adjust levain percentage when mismatch', () => {
      const result = solveFromFlourLevain(1000, 300, defaultInputs);
      
      expect(result.recipe.flourTotal).toBe(1000);
      expect(result.recipe.levainTotal).toBe(300);
      expect(result.adjustedLevainPercent).toBeDefined();
      expect(result.adjustedLevainPercent).toBeCloseTo(15, 1);
    });
  });

  describe('solveFromTotalLevain', () => {
    it('should calculate recipe from total dough and levain', () => {
      const recipe = solveFromTotalLevain(1770, 400, defaultInputs);
      
      expect(recipe.levainTotal).toBe(400);
      expect(recipe.doughTotal).toBeCloseTo(1770, -1);
    });
  });

  describe('solveBreadRecipe', () => {
    it('should route to correct solver based on known values type', () => {
      const knownValues: KnownValues = {
        type: 'flour-hydration',
        value1: 1000,
        value2: 75
      };
      
      const result = solveBreadRecipe(knownValues, defaultInputs);
      expect(result.recipe.flourTotal).toBe(1000);
      expect(result.recipe.waterTotal).toBe(750);
    });

    it('should handle per-loaf targeting for total dough calculations', () => {
      const inputsWithPerLoaf = {
        ...defaultInputs,
        numberOfLoaves: 2,
        perLoafWeight: 900
      };
      
      const knownValues: KnownValues = {
        type: 'total-hydration',
        value1: 1500, // This should be overridden by perLoafWeight calculation
        value2: 75
      };
      
      const result = solveBreadRecipe(knownValues, inputsWithPerLoaf);
      // Total should be 2 * 900 = 1800, not 1500
      expect(result.recipe.doughTotal).toBeCloseTo(1800, -1);
    });
  });

  describe('calculateFlourBlend', () => {
    it('should calculate flour blend breakdown in grams', () => {
      const blend = [
        { name: 'Bread Flour', percentage: 90 },
        { name: 'Whole Wheat', percentage: 10 }
      ];
      
      const breakdown = calculateFlourBlend(1000, blend);
      
      expect(breakdown).toHaveLength(2);
      expect(breakdown[0].grams).toBe(900);
      expect(breakdown[1].grams).toBe(100);
      expect(breakdown[0].name).toBe('Bread Flour');
      expect(breakdown[1].name).toBe('Whole Wheat');
    });
  });

  describe('calculatePerLoafWeights', () => {
    it('should calculate per-loaf weights correctly', () => {
      const recipe = {
        flourTotal: 1000,
        waterTotal: 750,
        saltGrams: 20,
        levainTotal: 400,
        levainFlour: 200,
        levainWater: 200,
        doughTotal: 1770
      };
      
      const perLoaf = calculatePerLoafWeights(recipe, 2);
      
      expect(perLoaf.flourPerLoaf).toBe(500);
      expect(perLoaf.waterPerLoaf).toBe(375);
      expect(perLoaf.saltPerLoaf).toBe(10);
      expect(perLoaf.levainPerLoaf).toBe(200);
      expect(perLoaf.totalPerLoaf).toBe(885);
    });
  });

  describe('createHenrysFoolproofPreset', () => {
    it('should create correct preset values', () => {
      const preset = createHenrysFoolproofPreset();
      
      expect(preset.hydrationPercent).toBe(75);
      expect(preset.saltPercent).toBe(2);
      expect(preset.levainPercent).toBe(20);
      expect(preset.levainHydration).toBe(100);
      expect(preset.numberOfLoaves).toBe(1);
      expect(preset.perLoafWeight).toBe(900);
      expect(preset.flourBlend).toHaveLength(2);
      expect(preset.flourBlend[0].name).toBe('Bread Flour');
      expect(preset.flourBlend[0].percentage).toBe(90);
      expect(preset.flourBlend[1].name).toBe('Whole Wheat');
      expect(preset.flourBlend[1].percentage).toBe(10);
    });
  });

  describe('rounding consistency', () => {
    it('should maintain consistent totals after rounding', () => {
      const recipe = solveFromFlourHydration(333, 66.7, defaultInputs);
      
      // All values should be rounded to nearest gram
      expect(recipe.flourTotal).toBe(333);
      expect(Number.isInteger(recipe.waterTotal)).toBe(true);
      expect(Number.isInteger(recipe.saltGrams)).toBe(true);
      expect(Number.isInteger(recipe.levainFlour)).toBe(true);
      expect(Number.isInteger(recipe.levainWater)).toBe(true);
      expect(Number.isInteger(recipe.levainTotal)).toBe(true);
      expect(Number.isInteger(recipe.doughTotal)).toBe(true);
    });
  });
});