import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Calculator, Download, Printer, Info, RotateCcw } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Recipe {
  name: string;
  flour: number;
  water: number;
  salt: number;
  yeast: number;
  starter: number;
  unit: 'grams' | 'ounces';
  hydration: number;
  totalWeight: number;
}

const BreadCalculator = () => {
  const [currentUnit, setCurrentUnit] = useState<'grams' | 'ounces'>('grams');
  const [recipeName, setRecipeName] = useState('');
  
  // Dough calculator state
  const [flour, setFlour] = useState(500);
  const [water, setWater] = useState(350);
  const [salt, setSalt] = useState(10);
  const [yeast, setYeast] = useState(3);
  const [starter, setStarter] = useState(0);
  
  // Baker's percentages state
  const [targetFlour, setTargetFlour] = useState(1000);
  const [waterPercent, setWaterPercent] = useState(70);
  const [saltPercent, setSaltPercent] = useState(2);
  const [yeastPercent, setYeastPercent] = useState(0.6);
  const [starterPercent, setStarterPercent] = useState(0);
  
  // Scaling state
  const [origFlour, setOrigFlour] = useState(500);
  const [origWater, setOrigWater] = useState(350);
  const [origSalt, setOrigSalt] = useState(10);
  const [origYeast, setOrigYeast] = useState(3);
  const [targetTotal, setTargetTotal] = useState(1000);

  const presets = {
    sourdough: { flour: 500, water: 375, salt: 10, yeast: 0, starter: 100 },
    pizza: { flour: 500, water: 325, salt: 10, yeast: 2, starter: 0 },
    focaccia: { flour: 500, water: 400, salt: 10, yeast: 3, starter: 0 },
    bagel: { flour: 500, water: 300, salt: 10, yeast: 4, starter: 0 }
  };

  const loadPreset = (presetName: keyof typeof presets) => {
    const preset = presets[presetName];
    setFlour(preset.flour);
    setWater(preset.water);
    setSalt(preset.salt);
    setYeast(preset.yeast);
    setStarter(preset.starter);
  };

  const resetForm = () => {
    setFlour(500);
    setWater(350);
    setSalt(10);
    setYeast(3);
    setStarter(0);
    setRecipeName('');
  };

  const calculateDough = () => {
    const totalWeight = flour + water + salt + yeast + starter;
    const hydration = flour > 0 ? Math.round((water / flour) * 100) : 0;
    const saltPercentage = flour > 0 ? ((salt / flour) * 100).toFixed(1) : '0';
    const yeastPercentage = flour > 0 ? ((yeast / flour) * 100).toFixed(1) : '0';
    
    return { totalWeight, hydration, saltPercentage, yeastPercentage };
  };

  const calculateBakersPercentages = () => {
    const waterWeight = Math.round(targetFlour * waterPercent / 100);
    const saltWeight = parseFloat((targetFlour * saltPercent / 100).toFixed(1));
    const yeastWeight = parseFloat((targetFlour * yeastPercent / 100).toFixed(1));
    const starterWeight = Math.round(targetFlour * starterPercent / 100);
    
    return { waterWeight, saltWeight, yeastWeight, starterWeight };
  };

  const scaleRecipe = () => {
    const origTotal = origFlour + origWater + origSalt + origYeast;
    const scaleFactor = targetTotal / origTotal;
    
    const newFlour = Math.round(origFlour * scaleFactor);
    const newWater = Math.round(origWater * scaleFactor);
    const newSalt = parseFloat((origSalt * scaleFactor).toFixed(1));
    const newYeast = parseFloat((origYeast * scaleFactor).toFixed(1));
    
    return { newFlour, newWater, newSalt, newYeast, scaleFactor: scaleFactor.toFixed(2) };
  };

  const getHydrationCategory = (hydration: number) => {
    if (hydration < 60) return { category: 'Low', color: 'bg-red-500' };
    if (hydration < 70) return { category: 'Medium', color: 'bg-yellow-500' };
    if (hydration < 80) return { category: 'High', color: 'bg-green-500' };
    return { category: 'Very High', color: 'bg-blue-500' };
  };

  const exportRecipe = () => {
    const { totalWeight, hydration } = calculateDough();
    const recipe: Recipe = {
      name: recipeName || 'Bread Recipe',
      flour, water, salt, yeast, starter,
      unit: currentUnit,
      hydration,
      totalWeight
    };

    const dataStr = JSON.stringify(recipe, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportFileDefaultName = `${recipe.name.replace(/\s+/g, '-')}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    toast({ title: "Recipe exported successfully!" });
  };

  const printRecipe = () => {
    const { totalWeight, hydration } = calculateDough();
    const unit = currentUnit === 'grams' ? 'g' : 'oz';
    const name = recipeName || 'Bread Recipe';
    
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
        <head>
          <title>${name}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; }
            h1 { color: #8b4513; border-bottom: 2px solid #d7a460; padding-bottom: 10px; }
            .ingredient { margin: 10px 0; font-size: 18px; }
            .total { font-weight: bold; margin-top: 20px; padding-top: 20px; border-top: 1px solid #ccc; }
            .footer { margin-top: 40px; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <h1>${name}</h1>
          <div class="ingredient">Flour: ${flour}${unit}</div>
          <div class="ingredient">Water: ${water}${unit}</div>
          <div class="ingredient">Salt: ${salt}${unit}</div>
          <div class="ingredient">Yeast: ${yeast}${unit}</div>
          ${starter > 0 ? `<div class="ingredient">Starter: ${starter}${unit}</div>` : ''}
          <div class="total">Total Weight: ${totalWeight}${unit}</div>
          <div class="total">Hydration: ${hydration}%</div>
          <div class="footer">Generated by Henry Hunter's Bread Calculator</div>
        </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const saveRecipe = () => {
    const { totalWeight, hydration } = calculateDough();
    const recipe: Recipe = {
      name: recipeName || 'Untitled Recipe',
      flour, water, salt, yeast, starter,
      unit: currentUnit,
      hydration,
      totalWeight
    };

    const savedRecipes = JSON.parse(localStorage.getItem('breadRecipes') || '[]');
    savedRecipes.push({ ...recipe, timestamp: new Date().toISOString() });
    localStorage.setItem('breadRecipes', JSON.stringify(savedRecipes));
    
    toast({ title: "Recipe saved successfully!" });
    setRecipeName('');
  };

  const unit = currentUnit === 'grams' ? 'g' : 'oz';
  const { totalWeight, hydration, saltPercentage, yeastPercentage } = calculateDough();
  const { category, color } = getHydrationCategory(hydration);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-primary-foreground text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-4 mb-4">
            <Calculator className="w-12 h-12" />
            <h1 className="text-5xl font-bold">Professional Bread Calculator</h1>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="icon" className="bg-white/10 border-white/20 hover:bg-white/20">
                  <Info className="w-5 h-5" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Professional Bread Calculator</DialogTitle>
                  <DialogDescription className="text-left space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-2">Perfect Your Dough with Scientific Precision</h3>
                      <p>Stop guessing and start calculating. This professional-grade bread calculator takes the mystery out of bread formulation, giving you the tools to create consistent, delicious results every single time. Whether you're scaling a favorite recipe or experimenting with new ratios, this calculator handles the math so you can focus on the craft.</p>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-2">Three Powerful Calculators in One</h3>
                      <div className="space-y-3">
                        <p><strong>Dough Calculator:</strong> The heart of the tool. Input your ingredients using either precise numbers or intuitive sliders, and instantly see your hydration percentage, baker's ratios, and total dough weight. The visual hydration bar shows you exactly what your percentages mean, while smart tips guide you toward better results.</p>
                        <p><strong>Baker's Percentages:</strong> Work like a professional baker. Set your target flour weight and desired percentages, and the calculator automatically determines exact ingredient weights. This is how bakeries formulate recipes, and now you can too.</p>
                        <p><strong>Recipe Scaling:</strong> Got a recipe that serves 4 but need to feed 12? Or want to scale down that 2-loaf recipe for a single boule? The scaling calculator maintains perfect ratios while adjusting quantities to your exact needs.</p>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-2">Interactive Features That Make Baking Easy</h3>
                      <ul className="list-disc list-inside space-y-1">
                        <li><strong>Smart Sliders:</strong> Drag to adjust ingredients and watch your ratios change in real-time</li>
                        <li><strong>Recipe Presets:</strong> One-click access to proven formulas for Classic Sourdough, Pizza Dough, Focaccia, and Bagels</li>
                        <li><strong>Unit Flexibility:</strong> Switch between grams and ounces instantly with automatic conversions</li>
                        <li><strong>Visual Feedback:</strong> The hydration bar shows what percentages mean and provides handling tips</li>
                        <li><strong>Contextual Tips:</strong> Get specific guidance based on your ingredient ratios</li>
                        <li><strong>Recipe Saving:</strong> Save your perfect formulations for future use</li>
                        <li><strong>Print-Ready Output:</strong> Generate clean, professional recipe cards</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-2">Built for Real Bakers</h3>
                      <p>This isn't just another recipe calculator. It's a teaching tool that helps you understand the science behind great bread. The more you use it, the more intuitive bread formulation becomes. Soon you'll be creating your own recipes and understanding exactly why they work.</p>
                      <p className="mt-3 font-medium">Whether you're making your first loaf or your thousandth, this calculator ensures every bake is your best bake. The math is perfect, the ratios are balanced, and the results are consistently delicious.</p>
                    </div>
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </div>
          <p className="text-xl opacity-90">Perfect your dough with precise calculations</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Unit Toggle */}
        <div className="flex justify-end mb-6">
          <Button
            variant="outline"
            onClick={() => setCurrentUnit(currentUnit === 'grams' ? 'ounces' : 'grams')}
            className="gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Switch to {currentUnit === 'grams' ? 'Ounces' : 'Grams'}
          </Button>
        </div>

        <Tabs defaultValue="dough" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="dough">Dough Calculator</TabsTrigger>
            <TabsTrigger value="bakers">Baker's Percentages</TabsTrigger>
            <TabsTrigger value="scaling">Recipe Scaling</TabsTrigger>
          </TabsList>

          {/* Dough Calculator Tab */}
          <TabsContent value="dough">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Inputs */}
              <Card>
                <CardHeader>
                  <CardTitle>Ingredients</CardTitle>
                  <div className="flex gap-2 flex-wrap">
                    {Object.keys(presets).map((preset) => (
                      <Button
                        key={preset}
                        variant="outline"
                        size="sm"
                        onClick={() => loadPreset(preset as keyof typeof presets)}
                        className="capitalize"
                      >
                        {preset === 'sourdough' ? 'Classic Sourdough' : preset}
                      </Button>
                    ))}
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="flour">Flour ({unit})</Label>
                    <div className="flex items-center gap-4">
                      <Slider
                        value={[flour]}
                        onValueChange={(value) => setFlour(value[0])}
                        max={2000}
                        min={100}
                        step={10}
                        className="flex-1"
                      />
                      <Input
                        id="flour"
                        type="number"
                        value={flour}
                        onChange={(e) => setFlour(Number(e.target.value))}
                        className="w-24"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="water">Water ({unit})</Label>
                    <div className="flex items-center gap-4">
                      <Slider
                        value={[water]}
                        onValueChange={(value) => setWater(value[0])}
                        max={1500}
                        min={50}
                        step={5}
                        className="flex-1"
                      />
                      <Input
                        id="water"
                        type="number"
                        value={water}
                        onChange={(e) => setWater(Number(e.target.value))}
                        className="w-24"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="salt">Salt ({unit})</Label>
                    <div className="flex items-center gap-4">
                      <Slider
                        value={[salt]}
                        onValueChange={(value) => setSalt(value[0])}
                        max={50}
                        min={0}
                        step={0.5}
                        className="flex-1"
                      />
                      <Input
                        id="salt"
                        type="number"
                        value={salt}
                        onChange={(e) => setSalt(Number(e.target.value))}
                        className="w-24"
                        step="0.1"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="yeast">Yeast ({unit})</Label>
                    <div className="flex items-center gap-4">
                      <Slider
                        value={[yeast]}
                        onValueChange={(value) => setYeast(value[0])}
                        max={25}
                        min={0}
                        step={0.1}
                        className="flex-1"
                      />
                      <Input
                        id="yeast"
                        type="number"
                        value={yeast}
                        onChange={(e) => setYeast(Number(e.target.value))}
                        className="w-24"
                        step="0.1"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="starter">Starter (optional, {unit})</Label>
                    <div className="flex items-center gap-4">
                      <Slider
                        value={[starter]}
                        onValueChange={(value) => setStarter(value[0])}
                        max={500}
                        min={0}
                        step={5}
                        className="flex-1"
                      />
                      <Input
                        id="starter"
                        type="number"
                        value={starter}
                        onChange={(e) => setStarter(Number(e.target.value))}
                        className="w-24"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={resetForm} variant="outline" className="gap-2">
                      <RotateCcw className="w-4 h-4" />
                      Reset
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Results */}
              <Card>
                <CardHeader>
                  <CardTitle>Results</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Total Dough Weight:</span>
                      <span className="font-semibold text-primary">{totalWeight}{unit}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Hydration:</span>
                      <span className="font-semibold text-primary">{hydration}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Salt Percentage:</span>
                      <span className="font-semibold text-primary">{saltPercentage}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Yeast Percentage:</span>
                      <span className="font-semibold text-primary">{yeastPercentage}%</span>
                    </div>
                  </div>

                  {/* Hydration Bar */}
                  <div className="space-y-2">
                    <Label>Hydration Level</Label>
                    <div className="relative h-6 bg-muted rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${color} transition-all duration-500`}
                        style={{ width: `${Math.min(hydration, 100)}%` }}
                      />
                      <div className="absolute inset-0 flex items-center justify-center text-sm font-medium text-white">
                        {hydration}% - {category}
                      </div>
                    </div>
                  </div>

                  {/* Recipe Saver */}
                  <div className="border-2 border-dashed border-primary p-4 rounded-lg space-y-3">
                    <Input
                      placeholder="Recipe name (optional)"
                      value={recipeName}
                      onChange={(e) => setRecipeName(e.target.value)}
                    />
                    <div className="flex gap-2">
                      <Button onClick={saveRecipe} className="gap-2">
                        Save Recipe
                      </Button>
                      <Button onClick={exportRecipe} variant="outline" className="gap-2">
                        <Download className="w-4 h-4" />
                        Export
                      </Button>
                      <Button onClick={printRecipe} variant="outline" className="gap-2">
                        <Printer className="w-4 h-4" />
                        Print
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Baker's Percentages Tab */}
          <TabsContent value="bakers">
            <Card>
              <CardHeader>
                <CardTitle>Baker's Percentages</CardTitle>
                <p className="text-muted-foreground">Enter your desired percentages (flour is always 100%)</p>
              </CardHeader>
              <CardContent>
                <div className="grid lg:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label>Target Flour Weight ({unit})</Label>
                      <div className="flex items-center gap-4">
                        <Slider
                          value={[targetFlour]}
                          onValueChange={(value) => setTargetFlour(value[0])}
                          max={5000}
                          min={100}
                          step={50}
                          className="flex-1"
                        />
                        <Input
                          type="number"
                          value={targetFlour}
                          onChange={(e) => setTargetFlour(Number(e.target.value))}
                          className="w-24"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Water %</Label>
                      <div className="flex items-center gap-4">
                        <Slider
                          value={[waterPercent]}
                          onValueChange={(value) => setWaterPercent(value[0])}
                          max={100}
                          min={30}
                          step={1}
                          className="flex-1"
                        />
                        <Input
                          type="number"
                          value={waterPercent}
                          onChange={(e) => setWaterPercent(Number(e.target.value))}
                          className="w-24"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Salt %</Label>
                      <div className="flex items-center gap-4">
                        <Slider
                          value={[saltPercent]}
                          onValueChange={(value) => setSaltPercent(value[0])}
                          max={5}
                          min={0}
                          step={0.1}
                          className="flex-1"
                        />
                        <Input
                          type="number"
                          value={saltPercent}
                          onChange={(e) => setSaltPercent(Number(e.target.value))}
                          className="w-24"
                          step="0.1"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Yeast %</Label>
                      <div className="flex items-center gap-4">
                        <Slider
                          value={[yeastPercent]}
                          onValueChange={(value) => setYeastPercent(value[0])}
                          max={3}
                          min={0}
                          step={0.1}
                          className="flex-1"
                        />
                        <Input
                          type="number"
                          value={yeastPercent}
                          onChange={(e) => setYeastPercent(Number(e.target.value))}
                          className="w-24"
                          step="0.1"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Starter %</Label>
                      <div className="flex items-center gap-4">
                        <Slider
                          value={[starterPercent]}
                          onValueChange={(value) => setStarterPercent(value[0])}
                          max={50}
                          min={0}
                          step={1}
                          className="flex-1"
                        />
                        <Input
                          type="number"
                          value={starterPercent}
                          onChange={(e) => setStarterPercent(Number(e.target.value))}
                          className="w-24"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-4">Calculated Weights</h4>
                    <div className="space-y-3">
                      {(() => {
                        const { waterWeight, saltWeight, yeastWeight, starterWeight } = calculateBakersPercentages();
                        return (
                          <>
                            <div className="flex justify-between py-2 border-b">
                              <span>Flour (100%)</span>
                              <span className="font-medium">{targetFlour}{unit}</span>
                            </div>
                            <div className="flex justify-between py-2 border-b">
                              <span>Water ({waterPercent}%)</span>
                              <span className="font-medium">{waterWeight}{unit}</span>
                            </div>
                            <div className="flex justify-between py-2 border-b">
                              <span>Salt ({saltPercent}%)</span>
                              <span className="font-medium">{saltWeight}{unit}</span>
                            </div>
                            <div className="flex justify-between py-2 border-b">
                              <span>Yeast ({yeastPercent}%)</span>
                              <span className="font-medium">{yeastWeight}{unit}</span>
                            </div>
                            {starterPercent > 0 && (
                              <div className="flex justify-between py-2 border-b">
                                <span>Starter ({starterPercent}%)</span>
                                <span className="font-medium">{starterWeight}{unit}</span>
                              </div>
                            )}
                          </>
                        );
                      })()}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Recipe Scaling Tab */}
          <TabsContent value="scaling">
            <Card>
              <CardHeader>
                <CardTitle>Recipe Scaling</CardTitle>
                <p className="text-muted-foreground">Scale your recipe up or down based on desired dough weight</p>
              </CardHeader>
              <CardContent>
                <div className="grid lg:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <h4 className="font-semibold">Original Recipe</h4>
                    
                    <div className="space-y-2">
                      <Label>Original Flour ({unit})</Label>
                      <div className="flex items-center gap-4">
                        <Slider
                          value={[origFlour]}
                          onValueChange={(value) => setOrigFlour(value[0])}
                          max={2000}
                          min={100}
                          step={10}
                          className="flex-1"
                        />
                        <Input
                          type="number"
                          value={origFlour}
                          onChange={(e) => setOrigFlour(Number(e.target.value))}
                          className="w-24"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Original Water ({unit})</Label>
                      <div className="flex items-center gap-4">
                        <Slider
                          value={[origWater]}
                          onValueChange={(value) => setOrigWater(value[0])}
                          max={1500}
                          min={50}
                          step={5}
                          className="flex-1"
                        />
                        <Input
                          type="number"
                          value={origWater}
                          onChange={(e) => setOrigWater(Number(e.target.value))}
                          className="w-24"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Original Salt ({unit})</Label>
                      <div className="flex items-center gap-4">
                        <Slider
                          value={[origSalt]}
                          onValueChange={(value) => setOrigSalt(value[0])}
                          max={50}
                          min={0}
                          step={0.5}
                          className="flex-1"
                        />
                        <Input
                          type="number"
                          value={origSalt}
                          onChange={(e) => setOrigSalt(Number(e.target.value))}
                          className="w-24"
                          step="0.1"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Original Yeast ({unit})</Label>
                      <div className="flex items-center gap-4">
                        <Slider
                          value={[origYeast]}
                          onValueChange={(value) => setOrigYeast(value[0])}
                          max={25}
                          min={0}
                          step={0.1}
                          className="flex-1"
                        />
                        <Input
                          type="number"
                          value={origYeast}
                          onChange={(e) => setOrigYeast(Number(e.target.value))}
                          className="w-24"
                          step="0.1"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Target Total Weight ({unit})</Label>
                      <div className="flex items-center gap-4">
                        <Slider
                          value={[targetTotal]}
                          onValueChange={(value) => setTargetTotal(value[0])}
                          max={5000}
                          min={200}
                          step={50}
                          className="flex-1"
                        />
                        <Input
                          type="number"
                          value={targetTotal}
                          onChange={(e) => setTargetTotal(Number(e.target.value))}
                          className="w-24"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-4">Scaled Recipe</h4>
                    <div className="space-y-3">
                      {(() => {
                        const { newFlour, newWater, newSalt, newYeast, scaleFactor } = scaleRecipe();
                        return (
                          <>
                            <div className="flex justify-between py-2 border-b">
                              <span>Flour:</span>
                              <span className="font-medium">{newFlour}{unit}</span>
                            </div>
                            <div className="flex justify-between py-2 border-b">
                              <span>Water:</span>
                              <span className="font-medium">{newWater}{unit}</span>
                            </div>
                            <div className="flex justify-between py-2 border-b">
                              <span>Salt:</span>
                              <span className="font-medium">{newSalt}{unit}</span>
                            </div>
                            <div className="flex justify-between py-2 border-b">
                              <span>Yeast:</span>
                              <span className="font-medium">{newYeast}{unit}</span>
                            </div>
                            <div className="flex justify-between py-2 border-b font-semibold">
                              <span>Total Weight:</span>
                              <span>{targetTotal}{unit}</span>
                            </div>
                            <div className="flex justify-between py-2 border-b font-semibold">
                              <span>Scale Factor:</span>
                              <span>{scaleFactor}x</span>
                            </div>
                          </>
                        );
                      })()}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default BreadCalculator;