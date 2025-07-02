import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import Header from '../components/Header';
import Footer from '../components/Footer';

interface FormattedRecipe {
  title: string;
  introduction: string;
  ingredients: {
    metric: string[];
    volume: string[];
  };
  method: string[];
  tips: string[];
  troubleshooting: string[];
}

const RecipeFormatter = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formattedRecipe, setFormattedRecipe] = useState<FormattedRecipe | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedFile) return;

    setIsLoading(true);
    
    // Dummy fetch logic - replace with actual API call later
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Dummy response data
      const dummyResponse: FormattedRecipe = {
        title: "Classic Sourdough Bread",
        introduction: "This traditional sourdough recipe creates a perfectly tangy loaf with a crispy crust and airy crumb. Perfect for beginners and experienced bakers alike.",
        ingredients: {
          metric: [
            "500g bread flour",
            "375ml water",
            "100g active sourdough starter", 
            "10g salt"
          ],
          volume: [
            "4 cups bread flour",
            "1½ cups water",
            "½ cup active sourdough starter",
            "2 tsp salt"
          ]
        },
        method: [
          "Mix flour and water in a large bowl until just combined. Let rest for 30 minutes (autolyse).",
          "Add sourdough starter and salt to the dough. Mix by hand until well incorporated.",
          "Perform stretch and folds every 30 minutes for the first 2 hours of bulk fermentation.",
          "Continue bulk fermentation until dough increases by 50% (4-6 hours total).",
          "Shape the dough and place in a banneton for final proof.",
          "Proof overnight in refrigerator or 2-3 hours at room temperature.",
          "Preheat Dutch oven to 450°F (230°C).",
          "Score the dough and bake covered for 20 minutes, then uncovered for 20-25 minutes."
        ],
        tips: [
          "Use a kitchen scale for accurate measurements",
          "Water temperature should be around 75-80°F for optimal fermentation",
          "The dough should feel slightly sticky but manageable after mixing"
        ],
        troubleshooting: [
          "Dense bread: Check starter activity and fermentation time",
          "Flat loaf: Ensure proper shaping and proofing",
          "Gummy crumb: Allow bread to cool completely before slicing"
        ]
      };
      
      setFormattedRecipe(dummyResponse);
    } catch (error) {
      console.error('Error formatting recipe:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-background text-foreground min-h-screen">
      <Header />
      <main className="py-20 px-4">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-primary">Upload Your Recipe</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Upload a photo or PDF of your handwritten recipe and our AI will format it into a beautiful, 
              easy-to-follow digital recipe with metric and volume measurements.
            </p>
          </div>

          <Card className="shadow-warm">
            <CardHeader>
              <CardTitle className="text-primary">Recipe Upload</CardTitle>
              <CardDescription>
                Supported formats: JPG, PNG, PDF (max 10MB)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="recipe-file" className="text-base font-semibold">
                    Choose Recipe File
                  </Label>
                  <Input
                    id="recipe-file"
                    type="file"
                    accept="image/*,.pdf"
                    onChange={handleFileChange}
                    className="cursor-pointer"
                    disabled={isLoading}
                  />
                  {selectedFile && (
                    <p className="text-sm text-muted-foreground">
                      Selected: {selectedFile.name}
                    </p>
                  )}
                </div>
                
                <Button 
                  type="submit" 
                  variant="hero" 
                  size="lg" 
                  disabled={!selectedFile || isLoading}
                  className="w-full"
                >
                  {isLoading ? 'Formatting Recipe...' : 'Format My Recipe'}
                </Button>
              </form>

              {isLoading && (
                <div className="mt-6 space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Processing your recipe...</span>
                    <span className="text-primary font-semibold">Please wait</span>
                  </div>
                  <Progress value={33} className="h-2" />
                  <p className="text-xs text-muted-foreground text-center">
                    This may take a few moments while our AI analyzes your recipe
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {formattedRecipe && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-primary text-center">Formatted Recipe</h2>
              
              <Card className="shadow-warm">
                <CardHeader>
                  <CardTitle className="text-2xl text-primary">{formattedRecipe.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">{formattedRecipe.introduction}</p>
                </CardContent>
              </Card>

              <div className="grid md:grid-cols-2 gap-6">
                <Card className="shadow-warm">
                  <CardHeader>
                    <CardTitle className="text-primary">Ingredients (Metric)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {formattedRecipe.ingredients.metric.map((ingredient, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <span className="text-primary font-semibold">•</span>
                          <span>{ingredient}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card className="shadow-warm">
                  <CardHeader>
                    <CardTitle className="text-primary">Ingredients (Volume)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {formattedRecipe.ingredients.volume.map((ingredient, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <span className="text-primary font-semibold">•</span>
                          <span>{ingredient}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>

              <Card className="shadow-warm">
                <CardHeader>
                  <CardTitle className="text-primary">Method</CardTitle>
                </CardHeader>
                <CardContent>
                  <ol className="space-y-3">
                    {formattedRecipe.method.map((step, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold flex-shrink-0 mt-0.5">
                          {index + 1}
                        </span>
                        <span className="leading-relaxed">{step}</span>
                      </li>
                    ))}
                  </ol>
                </CardContent>
              </Card>

              <div className="grid md:grid-cols-2 gap-6">
                <Card className="shadow-warm">
                  <CardHeader>
                    <CardTitle className="text-primary">Tips</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {formattedRecipe.tips.map((tip, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <span className="text-primary font-semibold">💡</span>
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card className="shadow-warm">
                  <CardHeader>
                    <CardTitle className="text-primary">Troubleshooting</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {formattedRecipe.troubleshooting.map((item, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <span className="text-primary font-semibold">🔧</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default RecipeFormatter;