import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Minus, Calculator, RotateCcw } from 'lucide-react';
import {
  solveBreadRecipe,
  validateInputs,
  calculateFlourBlend,
  calculatePerLoafWeights,
  createHenrysFoolproofPreset,
  type SolverInputs,
  type KnownValues,
  type FlourBlend,
  type BreadRecipe,
  type KnownPairType
} from '@/lib/breadMath';

const knownPairOptions = [
  { value: 'flour-hydration', label: 'Flour total (g) + Hydration (%)' },
  { value: 'levain-hydration', label: 'Levain total (g) + Hydration (%)' },
  { value: 'total-hydration', label: 'Target Total Dough (g) + Hydration (%)' },
  { value: 'flour-levain', label: 'Flour total (g) + Levain total (g)' },
  { value: 'total-levain', label: 'Target Total Dough (g) + Levain total (g)' }
];

export default function BakersPercentSolver() {
  const [searchParams, setSearchParams] = useSearchParams();
  const resultsRef = useRef<HTMLDivElement>(null);

  // State
  const [knownPair, setKnownPair] = useState<KnownPairType>('flour-hydration');
  const [value1, setValue1] = useState<number>(500);
  const [value2, setValue2] = useState<number>(75);
  const [inputs, setInputs] = useState<SolverInputs>({
    hydrationPercent: 75,
    saltPercent: 2,
    levainPercent: 20,
    levainHydration: 100,
    numberOfLoaves: 1,
    perLoafWeight: undefined,
    flourBlend: []
  });
  const [recipe, setRecipe] = useState<BreadRecipe | null>(null);
  const [adjustedLevainPercent, setAdjustedLevainPercent] = useState<number | undefined>();
  const [errors, setErrors] = useState<string[]>([]);

  // Load state from URL on mount
  useEffect(() => {
    const hydration = searchParams.get('h');
    const salt = searchParams.get('s');
    const levain = searchParams.get('l');
    const levainHyd = searchParams.get('lh');
    const loaves = searchParams.get('loaves');
    const perLoaf = searchParams.get('perLoaf');
    const known = searchParams.get('known');
    const v1 = searchParams.get('v1');
    const v2 = searchParams.get('v2');

    if (hydration) setInputs(prev => ({ ...prev, hydrationPercent: Number(hydration) }));
    if (salt) setInputs(prev => ({ ...prev, saltPercent: Number(salt) }));
    if (levain) setInputs(prev => ({ ...prev, levainPercent: Number(levain) }));
    if (levainHyd) setInputs(prev => ({ ...prev, levainHydration: Number(levainHyd) }));
    if (loaves) setInputs(prev => ({ ...prev, numberOfLoaves: Number(loaves) }));
    if (perLoaf) setInputs(prev => ({ ...prev, perLoafWeight: Number(perLoaf) }));
    if (known) setKnownPair(known as KnownPairType);
    if (v1) setValue1(Number(v1));
    if (v2) setValue2(Number(v2));
  }, [searchParams]);

  // Update URL when state changes
  useEffect(() => {
    const params = new URLSearchParams();
    params.set('h', inputs.hydrationPercent.toString());
    params.set('s', inputs.saltPercent.toString());
    params.set('l', inputs.levainPercent.toString());
    params.set('lh', inputs.levainHydration.toString());
    params.set('loaves', inputs.numberOfLoaves.toString());
    if (inputs.perLoafWeight) params.set('perLoaf', inputs.perLoafWeight.toString());
    params.set('known', knownPair);
    params.set('v1', value1.toString());
    params.set('v2', value2.toString());
    setSearchParams(params);
  }, [inputs, knownPair, value1, value2, setSearchParams]);

  const calculate = () => {
    const validationErrors = validateInputs(inputs);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      setRecipe(null);
      return;
    }

    try {
      const knownValues: KnownValues = { type: knownPair, value1, value2 };
      const result = solveBreadRecipe(knownValues, inputs);
      setRecipe(result.recipe);
      setAdjustedLevainPercent(result.adjustedLevainPercent);
      setErrors([]);
      
      // Announce to screen readers
      setTimeout(() => {
        if (resultsRef.current) {
          resultsRef.current.focus();
        }
      }, 100);
    } catch (error) {
      setErrors([error instanceof Error ? error.message : 'Calculation error']);
      setRecipe(null);
    }
  };

  const applyHenrysFoolproof = () => {
    const preset = createHenrysFoolproofPreset();
    setInputs(preset);
    setKnownPair('total-hydration');
    setValue1(900); // per-loaf weight
    setValue2(75); // hydration
    setTimeout(calculate, 0);
  };

  const reset = () => {
    setInputs({
      hydrationPercent: 75,
      saltPercent: 2,
      levainPercent: 20,
      levainHydration: 100,
      numberOfLoaves: 1,
      perLoafWeight: undefined,
      flourBlend: []
    });
    setKnownPair('flour-hydration');
    setValue1(500);
    setValue2(75);
    setRecipe(null);
    setAdjustedLevainPercent(undefined);
    setErrors([]);
  };

  const addFlourBlend = () => {
    setInputs(prev => ({
      ...prev,
      flourBlend: [...prev.flourBlend, { name: '', percentage: 0 }]
    }));
  };

  const removeFlourBlend = (index: number) => {
    setInputs(prev => ({
      ...prev,
      flourBlend: prev.flourBlend.filter((_, i) => i !== index)
    }));
  };

  const updateFlourBlend = (index: number, field: keyof FlourBlend, value: string | number) => {
    setInputs(prev => ({
      ...prev,
      flourBlend: prev.flourBlend.map((blend, i) => 
        i === index ? { ...blend, [field]: value } : blend
      )
    }));
  };

  const isCalculationDisabled = errors.length > 0 || !value1 || !value2;

  const getLabel1 = () => {
    switch (knownPair) {
      case 'flour-hydration': return 'Flour total (g)';
      case 'levain-hydration': return 'Levain total (g)';
      case 'total-hydration': return 'Target Total Dough (g)';
      case 'flour-levain': return 'Flour total (g)';
      case 'total-levain': return 'Target Total Dough (g)';
    }
  };

  const getLabel2 = () => {
    switch (knownPair) {
      case 'flour-hydration':
      case 'levain-hydration': 
      case 'total-hydration': return 'Hydration (%)';
      case 'flour-levain':
      case 'total-levain': return 'Levain total (g)';
    }
  };

  return (
    <div className="space-y-8">
      {/* Known Values Section */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <Label htmlFor="known-pair-select">Choose which two values you know:</Label>
          <Select value={knownPair} onValueChange={(value: KnownPairType) => setKnownPair(value)}>
            <SelectTrigger id="known-pair-select">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {knownPairOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="value1">{getLabel1()}</Label>
            <Input
              id="value1"
              type="number"
              min="1"
              value={value1 || ''}
              onChange={(e) => setValue1(Number(e.target.value))}
              placeholder="Enter value"
            />
          </div>
          <div>
            <Label htmlFor="value2">{getLabel2()}</Label>
            <Input
              id="value2"
              type="number"
              min="1"
              value={value2 || ''}
              onChange={(e) => setValue2(Number(e.target.value))}
              placeholder="Enter value"
            />
          </div>
        </div>
      </div>

      {/* Recipe Parameters */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="hydration">Hydration: {inputs.hydrationPercent}%</Label>
          <Slider
            id="hydration"
            min={50}
            max={95}
            step={1}
            value={[inputs.hydrationPercent]}
            onValueChange={(value) => setInputs(prev => ({ ...prev, hydrationPercent: value[0] }))}
            className="w-full"
          />
          <Input
            type="number"
            min="40"
            max="110"
            step="0.1"
            value={inputs.hydrationPercent}
            onChange={(e) => setInputs(prev => ({ ...prev, hydrationPercent: Number(e.target.value) }))}
            className="mt-2"
          />
        </div>

        <div>
          <Label htmlFor="salt">Salt %</Label>
          <Input
            id="salt"
            type="number"
            min="0.5"
            max="3"
            step="0.1"
            value={inputs.saltPercent}
            onChange={(e) => setInputs(prev => ({ ...prev, saltPercent: Number(e.target.value) }))}
          />
        </div>

        <div>
          <Label htmlFor="levain-percent">Levain % of flour</Label>
          <Input
            id="levain-percent"
            type="number"
            min="0"
            max="50"
            step="1"
            value={inputs.levainPercent}
            onChange={(e) => setInputs(prev => ({ ...prev, levainPercent: Number(e.target.value) }))}
          />
        </div>

        <div>
          <Label htmlFor="levain-hydration">Levain hydration %</Label>
          <Input
            id="levain-hydration"
            type="number"
            min="50"
            max="125"
            step="1"
            value={inputs.levainHydration}
            onChange={(e) => setInputs(prev => ({ ...prev, levainHydration: Number(e.target.value) }))}
          />
        </div>

        <div>
          <Label htmlFor="loaves">Number of loaves</Label>
          <Input
            id="loaves"
            type="number"
            min="1"
            value={inputs.numberOfLoaves}
            onChange={(e) => setInputs(prev => ({ ...prev, numberOfLoaves: Number(e.target.value) }))}
          />
        </div>

        <div>
          <Label htmlFor="per-loaf">Per-loaf target (g) - optional</Label>
          <Input
            id="per-loaf"
            type="number"
            min="100"
            value={inputs.perLoafWeight || ''}
            onChange={(e) => setInputs(prev => ({ 
              ...prev, 
              perLoafWeight: e.target.value ? Number(e.target.value) : undefined 
            }))}
            placeholder="Leave empty to use total"
          />
        </div>
      </div>

      {/* Flour Blend Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>Flour Blend (optional)</Label>
          <Button 
            type="button" 
            variant="outline" 
            size="sm" 
            onClick={addFlourBlend}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Flour
          </Button>
        </div>
        
        {inputs.flourBlend.map((blend, index) => (
          <div key={index} className="grid gap-2 sm:grid-cols-3 items-end">
            <div>
              <Label htmlFor={`flour-name-${index}`}>Flour name</Label>
              <Input
                id={`flour-name-${index}`}
                value={blend.name}
                onChange={(e) => updateFlourBlend(index, 'name', e.target.value)}
                placeholder="e.g., Bread Flour"
              />
            </div>
            <div>
              <Label htmlFor={`flour-percent-${index}`}>% of total flour</Label>
              <Input
                id={`flour-percent-${index}`}
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={blend.percentage}
                onChange={(e) => updateFlourBlend(index, 'percentage', Number(e.target.value))}
              />
            </div>
            <Button 
              type="button" 
              variant="outline" 
              size="sm"
              onClick={() => removeFlourBlend(index)}
              className="flex items-center gap-2"
            >
              <Minus className="h-4 w-4" />
              Remove
            </Button>
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3">
        <Button 
          onClick={calculate} 
          disabled={isCalculationDisabled}
          className="flex items-center gap-2"
        >
          <Calculator className="h-4 w-4" />
          Calculate Recipe
        </Button>
        <Button 
          variant="outline" 
          onClick={applyHenrysFoolproof}
          className="flex items-center gap-2"
        >
          Henry's Foolproof
        </Button>
        <Button 
          variant="outline" 
          onClick={reset}
          className="flex items-center gap-2"
        >
          <RotateCcw className="h-4 w-4" />
          Reset
        </Button>
      </div>

      {/* Error Messages */}
      {errors.length > 0 && (
        <div className="bg-destructive/10 border border-destructive rounded-md p-4" role="alert">
          <h3 className="font-medium text-destructive mb-2">Validation Errors:</h3>
          <ul className="list-disc list-inside text-destructive space-y-1">
            {errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Results */}
      {recipe && (
        <div 
          ref={resultsRef}
          tabIndex={-1}
          className="bg-muted/50 rounded-lg p-6 space-y-6"
          aria-live="polite"
          role="region" 
          aria-label="Recipe calculation results"
        >
          <h3 className="text-2xl font-semibold">Recipe Results</h3>
          
          {adjustedLevainPercent && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md p-3">
              <p className="text-yellow-800 dark:text-yellow-200">
                Note: Levain percentage adjusted to {adjustedLevainPercent}% to match provided values.
              </p>
            </div>
          )}

          <div className="grid gap-6 md:grid-cols-2">
            {/* Main Recipe */}
            <div className="space-y-3">
              <h4 className="text-lg font-medium">Main Recipe</h4>
              <div className="space-y-2 font-mono">
                <div className="flex justify-between">
                  <span>Total Flour:</span>
                  <span className="font-semibold">{recipe.flourTotal}g</span>
                </div>
                <div className="flex justify-between">
                  <span>Water:</span>
                  <span className="font-semibold">{recipe.waterTotal}g</span>
                </div>
                <div className="flex justify-between">
                  <span>Salt:</span>
                  <span className="font-semibold">{recipe.saltGrams}g</span>
                </div>
                <div className="flex justify-between">
                  <span>Levain:</span>
                  <span className="font-semibold">{recipe.levainTotal}g</span>
                </div>
                <div className="flex justify-between border-t pt-2 text-lg">
                  <span>Total Dough:</span>
                  <span className="font-bold">{recipe.doughTotal}g</span>
                </div>
              </div>
            </div>

            {/* Levain Breakdown */}
            <div className="space-y-3">
              <h4 className="text-lg font-medium">Levain Breakdown</h4>
              <div className="space-y-2 font-mono">
                <div className="flex justify-between">
                  <span>Levain Flour:</span>
                  <span className="font-semibold">{recipe.levainFlour}g</span>
                </div>
                <div className="flex justify-between">
                  <span>Levain Water:</span>
                  <span className="font-semibold">{recipe.levainWater}g</span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span>Total Levain:</span>
                  <span className="font-bold">{recipe.levainTotal}g</span>
                </div>
              </div>
            </div>
          </div>

          {/* Per-Loaf Weights */}
          {inputs.numberOfLoaves > 1 && (
            <div className="space-y-3">
              <h4 className="text-lg font-medium">Per-Loaf Weights</h4>
              {(() => {
                const perLoafWeights = calculatePerLoafWeights(recipe, inputs.numberOfLoaves);
                return (
                  <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-5 font-mono text-sm">
                    <div className="text-center">
                      <div className="text-muted-foreground">Flour</div>
                      <div className="font-semibold">{perLoafWeights.flourPerLoaf}g</div>
                    </div>
                    <div className="text-center">
                      <div className="text-muted-foreground">Water</div>
                      <div className="font-semibold">{perLoafWeights.waterPerLoaf}g</div>
                    </div>
                    <div className="text-center">
                      <div className="text-muted-foreground">Salt</div>
                      <div className="font-semibold">{perLoafWeights.saltPerLoaf}g</div>
                    </div>
                    <div className="text-center">
                      <div className="text-muted-foreground">Levain</div>
                      <div className="font-semibold">{perLoafWeights.levainPerLoaf}g</div>
                    </div>
                    <div className="text-center">
                      <div className="text-muted-foreground">Total</div>
                      <div className="font-bold">{perLoafWeights.totalPerLoaf}g</div>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {/* Flour Blend Breakdown */}
          {inputs.flourBlend.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-lg font-medium">Flour Blend Breakdown</h4>
              {(() => {
                const flourBreakdown = calculateFlourBlend(recipe.flourTotal, inputs.flourBlend);
                return (
                  <div className="space-y-2 font-mono">
                    {flourBreakdown.map((flour, index) => (
                      <div key={index} className="flex justify-between">
                        <span>{flour.name}:</span>
                        <span className="font-semibold">{flour.grams}g ({flour.percentage}%)</span>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>
          )}

          {/* Baker's Percentages */}
          <div className="space-y-3">
            <h4 className="text-lg font-medium">Baker's Percentages</h4>
            <div className="space-y-2 font-mono">
              <div className="flex justify-between">
                <span>Flour:</span>
                <span>100%</span>
              </div>
              <div className="flex justify-between">
                <span>Water:</span>
                <span>{inputs.hydrationPercent}%</span>
              </div>
              <div className="flex justify-between">
                <span>Salt:</span>
                <span>{inputs.saltPercent}%</span>
              </div>
              <div className="flex justify-between">
                <span>Levain:</span>
                <span>{inputs.levainPercent}%</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}