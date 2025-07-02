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
    
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const response = await fetch('https://ojyckskucneljvuqzrsw.supabase.co/functions/v1/format-recipe', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9qeWNrc2t1Y25lbGp2dXF6cnN3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY3NDI0MTUsImV4cCI6MjA1MjMxODQxNX0.-Bx7Y0d_aMcHakE27Z5QKriY6KPpG1m8n0uuLaamFfY`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to format recipe');
      }

      const data = await response.json();
      setFormattedRecipe(data.recipe);
    } catch (error) {
      console.error('Error formatting recipe:', error);
      // You could add a toast notification here for better UX
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