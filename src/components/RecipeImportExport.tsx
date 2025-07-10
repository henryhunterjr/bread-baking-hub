import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, Download, Upload, Share2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface RecipeImportExportProps {
  recipe?: any;
  onImport: (recipe: any) => void;
}

export const RecipeImportExport = ({ recipe, onImport }: RecipeImportExportProps) => {
  const [importText, setImportText] = useState('');
  const [format, setFormat] = useState('json');

  const exportRecipe = (format: 'json' | 'text' | 'markdown') => {
    if (!recipe) return;

    let content: string;
    let filename: string;
    let mimeType: string;

    switch (format) {
      case 'json':
        content = JSON.stringify(recipe, null, 2);
        filename = `${recipe.title.replace(/[^a-zA-Z0-9]/g, '_')}.json`;
        mimeType = 'application/json';
        break;
      
      case 'text':
        content = formatRecipeAsText(recipe);
        filename = `${recipe.title.replace(/[^a-zA-Z0-9]/g, '_')}.txt`;
        mimeType = 'text/plain';
        break;
      
      case 'markdown':
        content = formatRecipeAsMarkdown(recipe);
        filename = `${recipe.title.replace(/[^a-zA-Z0-9]/g, '_')}.md`;
        mimeType = 'text/markdown';
        break;
      
      default:
        return;
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Recipe exported",
      description: `Recipe exported as ${format.toUpperCase()}`
    });
  };

  const formatRecipeAsText = (recipe: any) => {
    const data = recipe.data;
    let text = `${recipe.title}\n${'='.repeat(recipe.title.length)}\n\n`;

    if (data.description) {
      text += `Description: ${data.description}\n\n`;
    }

    if (data.ingredients && data.ingredients.length > 0) {
      text += `INGREDIENTS:\n`;
      data.ingredients.forEach((ingredient: string, index: number) => {
        text += `${index + 1}. ${ingredient}\n`;
      });
      text += '\n';
    }

    if (data.method && data.method.length > 0) {
      text += `METHOD:\n`;
      data.method.forEach((step: string, index: number) => {
        text += `${index + 1}. ${step}\n`;
      });
      text += '\n';
    }

    if (data.tips && data.tips.length > 0) {
      text += `TIPS:\n`;
      data.tips.forEach((tip: string, index: number) => {
        text += `• ${tip}\n`;
      });
      text += '\n';
    }

    if (data.troubleshooting && data.troubleshooting.length > 0) {
      text += `TROUBLESHOOTING:\n`;
      data.troubleshooting.forEach((item: any) => {
        text += `Problem: ${item.problem}\nSolution: ${item.solution}\n\n`;
      });
    }

    return text;
  };

  const formatRecipeAsMarkdown = (recipe: any) => {
    const data = recipe.data;
    let md = `# ${recipe.title}\n\n`;

    if (data.description) {
      md += `*${data.description}*\n\n`;
    }

    if (data.ingredients && data.ingredients.length > 0) {
      md += `## Ingredients\n\n`;
      data.ingredients.forEach((ingredient: string) => {
        md += `- ${ingredient}\n`;
      });
      md += '\n';
    }

    if (data.method && data.method.length > 0) {
      md += `## Method\n\n`;
      data.method.forEach((step: string, index: number) => {
        md += `${index + 1}. ${step}\n`;
      });
      md += '\n';
    }

    if (data.tips && data.tips.length > 0) {
      md += `## Tips\n\n`;
      data.tips.forEach((tip: string) => {
        md += `- ${tip}\n`;
      });
      md += '\n';
    }

    if (data.troubleshooting && data.troubleshooting.length > 0) {
      md += `## Troubleshooting\n\n`;
      data.troubleshooting.forEach((item: any) => {
        md += `**${item.problem}**\n${item.solution}\n\n`;
      });
    }

    return md;
  };

  const parseRecipeText = (text: string) => {
    const lines = text.split('\n').map(line => line.trim()).filter(line => line);
    
    let title = 'Imported Recipe';
    let ingredients: string[] = [];
    let method: string[] = [];
    let currentSection = '';

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      if (i === 0 && !line.toLowerCase().includes('ingredient') && !line.toLowerCase().includes('method')) {
        title = line.replace(/[#=\-]+/g, '').trim();
        continue;
      }

      if (line.toLowerCase().includes('ingredient')) {
        currentSection = 'ingredients';
        continue;
      }

      if (line.toLowerCase().includes('method') || line.toLowerCase().includes('instruction') || line.toLowerCase().includes('direction')) {
        currentSection = 'method';
        continue;
      }

      if (currentSection === 'ingredients' && line) {
        ingredients.push(line.replace(/^[\d\-•\*]+\.?\s*/, ''));
      } else if (currentSection === 'method' && line) {
        method.push(line.replace(/^[\d\-•\*]+\.?\s*/, ''));
      }
    }

    return {
      title,
      data: {
        ingredients,
        method,
        description: '',
        tips: [],
        troubleshooting: []
      }
    };
  };

  const handleImport = () => {
    if (!importText.trim()) {
      toast({
        title: "Error",
        description: "Please paste recipe content to import",
        variant: "destructive"
      });
      return;
    }

    try {
      let parsedRecipe;

      if (format === 'json') {
        parsedRecipe = JSON.parse(importText);
      } else {
        parsedRecipe = parseRecipeText(importText);
      }

      onImport(parsedRecipe);
      setImportText('');
      
      toast({
        title: "Recipe imported",
        description: "Recipe has been imported successfully"
      });
    } catch (error) {
      toast({
        title: "Import failed",
        description: "Could not parse the recipe. Please check the format.",
        variant: "destructive"
      });
    }
  };

  const shareRecipe = async () => {
    if (!recipe) return;

    const shareData = {
      title: recipe.title,
      text: `Check out this recipe: ${recipe.title}`,
      url: window.location.href
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        toast({
          title: "Recipe shared",
          description: "Recipe shared successfully"
        });
      } catch (error) {
        // User cancelled sharing
      }
    } else {
      // Fallback: copy to clipboard
      const recipeText = formatRecipeAsText(recipe);
      await navigator.clipboard.writeText(recipeText);
      toast({
        title: "Copied to clipboard",
        description: "Recipe copied to clipboard"
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Export Section */}
      {recipe && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="w-5 h-5" />
              Export Recipe
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                onClick={() => exportRecipe('json')}
                className="flex items-center gap-2"
              >
                <FileText className="w-4 h-4" />
                JSON
              </Button>
              <Button
                variant="outline"
                onClick={() => exportRecipe('text')}
                className="flex items-center gap-2"
              >
                <FileText className="w-4 h-4" />
                Text
              </Button>
              <Button
                variant="outline"
                onClick={() => exportRecipe('markdown')}
                className="flex items-center gap-2"
              >
                <FileText className="w-4 h-4" />
                Markdown
              </Button>
              <Button
                variant="outline"
                onClick={shareRecipe}
                className="flex items-center gap-2"
              >
                <Share2 className="w-4 h-4" />
                Share
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Import Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Import Recipe
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="format">Import Format</Label>
            <Select value={format} onValueChange={setFormat}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="json">JSON Format</SelectItem>
                <SelectItem value="text">Plain Text</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="import-text">Recipe Content</Label>
            <Textarea
              id="import-text"
              placeholder={format === 'json' 
                ? 'Paste JSON recipe data here...' 
                : 'Paste recipe text here...\n\nIngredients:\n- 2 cups flour\n- 1 tsp salt\n\nMethod:\n1. Mix ingredients\n2. Bake at 350°F'
              }
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              className="min-h-[200px]"
            />
          </div>

          <Button onClick={handleImport} className="w-full">
            Import Recipe
          </Button>

          <div className="text-xs text-muted-foreground">
            <strong>Tips for text import:</strong>
            <ul className="list-disc list-inside mt-1 space-y-1">
              <li>Include "Ingredients:" and "Method:" sections</li>
              <li>Use numbered or bulleted lists</li>
              <li>Keep formatting simple for best results</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};