/**
 * Bread baking mathematics utilities
 * Handles baker's percentage calculations with proper levain math
 */

export interface FlourBlend {
  name: string;
  percentage: number;
}

export interface BreadRecipe {
  flourTotal: number;
  waterTotal: number;
  saltGrams: number;
  levainTotal: number;
  levainFlour: number;
  levainWater: number;
  doughTotal: number;
}

export interface SolverInputs {
  hydrationPercent: number;
  saltPercent: number;
  levainPercent: number;
  levainHydration: number;
  numberOfLoaves: number;
  perLoafWeight?: number;
  flourBlend: FlourBlend[];
}

export type KnownPairType = 
  | 'flour-hydration'
  | 'levain-hydration'
  | 'total-hydration'
  | 'flour-levain'
  | 'total-levain';

export interface KnownValues {
  type: KnownPairType;
  value1: number;
  value2: number;
}

/**
 * Validates input ranges for bread calculations
 */
export function validateInputs(inputs: SolverInputs): string[] {
  const errors: string[] = [];
  
  if (inputs.hydrationPercent < 40 || inputs.hydrationPercent > 110) {
    errors.push('Hydration must be between 40% and 110%');
  }
  
  if (inputs.saltPercent < 0.5 || inputs.saltPercent > 3.0) {
    errors.push('Salt must be between 0.5% and 3.0%');
  }
  
  if (inputs.levainPercent < 0 || inputs.levainPercent > 50) {
    errors.push('Levain percentage must be between 0% and 50%');
  }
  
  if (inputs.levainHydration < 50 || inputs.levainHydration > 125) {
    errors.push('Levain hydration must be between 50% and 125%');
  }
  
  if (inputs.flourBlend.length > 0) {
    const totalBlendPercent = inputs.flourBlend.reduce((sum, blend) => sum + blend.percentage, 0);
    if (Math.abs(totalBlendPercent - 100) > 0.01) {
      errors.push('Flour blend percentages must sum to 100%');
    }
  }
  
  return errors;
}

/**
 * Calculates recipe from known flour total and hydration
 */
export function solveFromFlourHydration(
  flourTotal: number,
  hydrationPercent: number,
  inputs: SolverInputs
): BreadRecipe {
  const F = flourTotal;
  const H = hydrationPercent / 100;
  const S = inputs.saltPercent / 100;
  const L = inputs.levainPercent / 100;
  const LH = inputs.levainHydration / 100;
  
  const waterTotal = Math.round(F * H);
  const saltGrams = Math.round(F * S);
  const levainFlour = Math.round(F * L);
  const levainWater = Math.round(levainFlour * LH);
  const levainTotal = levainFlour + levainWater;
  const doughTotal = F + waterTotal + saltGrams;
  
  return {
    flourTotal: Math.round(F),
    waterTotal,
    saltGrams,
    levainTotal,
    levainFlour,
    levainWater,
    doughTotal
  };
}

/**
 * Calculates recipe from known levain total and hydration
 */
export function solveFromLevainHydration(
  levainTotal: number,
  hydrationPercent: number,
  inputs: SolverInputs
): BreadRecipe {
  const L = inputs.levainPercent / 100;
  const LH = inputs.levainHydration / 100;
  const H = hydrationPercent / 100;
  const S = inputs.saltPercent / 100;
  
  // Invert to find levain flour: LT = LF + LF * LH = LF(1 + LH)
  const levainFlour = Math.round(levainTotal / (1 + LH));
  const levainWater = Math.round(levainFlour * LH);
  
  // Find total flour from levain flour
  const flourTotal = Math.round(levainFlour / L);
  const waterTotal = Math.round(flourTotal * H);
  const saltGrams = Math.round(flourTotal * S);
  const doughTotal = flourTotal + waterTotal + saltGrams;
  
  return {
    flourTotal,
    waterTotal,
    saltGrams,
    levainTotal: levainFlour + levainWater,
    levainFlour,
    levainWater,
    doughTotal
  };
}

/**
 * Calculates recipe from known total dough and hydration
 */
export function solveFromTotalHydration(
  targetTotal: number,
  hydrationPercent: number,
  inputs: SolverInputs
): BreadRecipe {
  const H = hydrationPercent / 100;
  const S = inputs.saltPercent / 100;
  const L = inputs.levainPercent / 100;
  const LH = inputs.levainHydration / 100;
  
  // T = F + F*H + F*S => F = T / (1 + H + S)
  const flourTotal = Math.round(targetTotal / (1 + H + S));
  const waterTotal = Math.round(flourTotal * H);
  const saltGrams = Math.round(flourTotal * S);
  const levainFlour = Math.round(flourTotal * L);
  const levainWater = Math.round(levainFlour * LH);
  const levainTotal = levainFlour + levainWater;
  const doughTotal = flourTotal + waterTotal + saltGrams;
  
  return {
    flourTotal,
    waterTotal,
    saltGrams,
    levainTotal,
    levainFlour,
    levainWater,
    doughTotal
  };
}

/**
 * Calculates recipe from known flour total and levain total
 */
export function solveFromFlourLevain(
  flourTotal: number,
  levainTotal: number,
  inputs: SolverInputs
): { recipe: BreadRecipe; adjustedLevainPercent?: number } {
  const H = inputs.hydrationPercent / 100;
  const S = inputs.saltPercent / 100;
  const LH = inputs.levainHydration / 100;
  
  // Calculate what levain flour should be based on levain total
  const levainFlour = Math.round(levainTotal / (1 + LH));
  const levainWater = Math.round(levainFlour * LH);
  
  // Check if this matches expected levain percentage
  const actualLevainPercent = (levainFlour / flourTotal) * 100;
  const expectedLevainPercent = inputs.levainPercent;
  
  const waterTotal = Math.round(flourTotal * H);
  const saltGrams = Math.round(flourTotal * S);
  const doughTotal = flourTotal + waterTotal + saltGrams;
  
  const recipe = {
    flourTotal,
    waterTotal,
    saltGrams,
    levainTotal: levainFlour + levainWater,
    levainFlour,
    levainWater,
    doughTotal
  };
  
  // Return adjusted levain percentage if different
  if (Math.abs(actualLevainPercent - expectedLevainPercent) > 0.5) {
    return { recipe, adjustedLevainPercent: Math.round(actualLevainPercent * 10) / 10 };
  }
  
  return { recipe };
}

/**
 * Calculates recipe from known total dough and levain total
 */
export function solveFromTotalLevain(
  targetTotal: number,
  levainTotal: number,
  inputs: SolverInputs
): BreadRecipe {
  const L = inputs.levainPercent / 100;
  const LH = inputs.levainHydration / 100;
  const H = inputs.hydrationPercent / 100;
  const S = inputs.saltPercent / 100;
  
  // Calculate levain flour from levain total
  const levainFlour = Math.round(levainTotal / (1 + LH));
  const levainWater = Math.round(levainFlour * LH);
  
  // Calculate total flour from levain flour
  const flourTotal = Math.round(levainFlour / L);
  
  // Adjust water to hit target total (water is last component)
  const saltGrams = Math.round(flourTotal * S);
  const waterTotal = Math.round(targetTotal - flourTotal - saltGrams);
  const doughTotal = flourTotal + waterTotal + saltGrams;
  
  return {
    flourTotal,
    waterTotal,
    saltGrams,
    levainTotal: levainFlour + levainWater,
    levainFlour,
    levainWater,
    doughTotal
  };
}

/**
 * Main solver function that routes to appropriate calculation
 */
export function solveBreadRecipe(
  knownValues: KnownValues,
  inputs: SolverInputs
): { recipe: BreadRecipe; adjustedLevainPercent?: number } {
  // Handle per-loaf targeting
  let targetTotal = inputs.perLoafWeight ? inputs.numberOfLoaves * inputs.perLoafWeight : undefined;
  
  switch (knownValues.type) {
    case 'flour-hydration':
      return { recipe: solveFromFlourHydration(knownValues.value1, knownValues.value2, inputs) };
    
    case 'levain-hydration':
      return { recipe: solveFromLevainHydration(knownValues.value1, knownValues.value2, inputs) };
    
    case 'total-hydration':
      const total = targetTotal || knownValues.value1;
      return { recipe: solveFromTotalHydration(total, knownValues.value2, inputs) };
    
    case 'flour-levain':
      return solveFromFlourLevain(knownValues.value1, knownValues.value2, inputs);
    
    case 'total-levain':
      const totalForLevain = targetTotal || knownValues.value1;
      return { recipe: solveFromTotalLevain(totalForLevain, knownValues.value2, inputs) };
    
    default:
      throw new Error('Invalid known values type');
  }
}

/**
 * Calculates flour blend breakdown in grams
 */
export function calculateFlourBlend(flourTotal: number, blend: FlourBlend[]): Array<FlourBlend & { grams: number }> {
  return blend.map(flour => ({
    ...flour,
    grams: Math.round(flourTotal * (flour.percentage / 100))
  }));
}

/**
 * Calculates per-loaf weights
 */
export function calculatePerLoafWeights(recipe: BreadRecipe, numberOfLoaves: number) {
  return {
    flourPerLoaf: Math.round(recipe.flourTotal / numberOfLoaves),
    waterPerLoaf: Math.round(recipe.waterTotal / numberOfLoaves),
    saltPerLoaf: Math.round(recipe.saltGrams / numberOfLoaves),
    levainPerLoaf: Math.round(recipe.levainTotal / numberOfLoaves),
    totalPerLoaf: Math.round(recipe.doughTotal / numberOfLoaves)
  };
}

/**
 * Creates Henry's Foolproof preset
 */
export function createHenrysFoolproofPreset(): SolverInputs {
  return {
    hydrationPercent: 75,
    saltPercent: 2,
    levainPercent: 20,
    levainHydration: 100,
    numberOfLoaves: 1,
    perLoafWeight: 900,
    flourBlend: [
      { name: 'Bread Flour', percentage: 90 },
      { name: 'Whole Wheat', percentage: 10 }
    ]
  };
}