import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Bot, Lightbulb, Plus, X } from 'lucide-react';
import affiliateProducts from '@/data/affiliate-products.json';

interface KrustyAssistantProps {
  content: string;
  onInsertContent: (content: string) => void;
}

interface ProductSuggestion {
  id: string;
  name: string;
  description: string;
  category: string;
  relevanceScore: number;
  suggestedText: string;
  affiliate_link: string;
  keywords: string[];
}

const KrustyAssistant = ({ content, onInsertContent }: KrustyAssistantProps) => {
  const [isEnabled, setIsEnabled] = useState(true);
  const [suggestions, setSuggestions] = useState<ProductSuggestion[]>([]);
  const [dismissedSuggestions, setDismissedSuggestions] = useState<Set<string>>(new Set());

  // Analyze content and suggest relevant products
  useEffect(() => {
    if (!isEnabled || !content.trim()) {
      setSuggestions([]);
      return;
    }

    const analyzeContent = () => {
      const contentLower = content.toLowerCase();
      const wordCount = content.split(/\s+/).length;
      
      // Only suggest products for substantial content (50+ words)
      if (wordCount < 50) {
        setSuggestions([]);
        return;
      }

      const productSuggestions: ProductSuggestion[] = [];

      affiliateProducts.products.forEach((product) => {
        // Skip dismissed suggestions
        if (dismissedSuggestions.has(product.id)) return;

        let relevanceScore = 0;
        const matchedKeywords: string[] = [];

        // Check for keyword matches
        product.keywords.forEach((keyword) => {
          if (contentLower.includes(keyword.toLowerCase())) {
            relevanceScore += 1;
            matchedKeywords.push(keyword);
          }
        });

        // Boost score for featured products
        if (product.featured) {
          relevanceScore += 0.5;
        }

        // Create contextual suggestion text based on content and product
        let suggestedText = '';
        if (contentLower.includes('starter') && product.category === 'proofing') {
          suggestedText = `For consistent starter maintenance, consider the ${product.name}. This temperature-controlled solution ensures your starter stays active and healthy.`;
        } else if (contentLower.includes('shaping') && product.category === 'shaping') {
          suggestedText = `Professional shaping requires the right tools. The ${product.name} can help achieve consistent results.`;
        } else if (contentLower.includes('measuring') && product.category === 'measuring') {
          suggestedText = `Precision is key in bread making. The ${product.name} provides the accuracy needed for consistent results.`;
        } else if (contentLower.includes('scoring') && product.category === 'scoring') {
          suggestedText = `Achieve beautiful scoring patterns with the ${product.name}. Clean, controlled cuts make all the difference.`;
        } else {
          suggestedText = `The ${product.name} could be a valuable addition to your baking toolkit for this technique.`;
        }

        // Only suggest if there's meaningful relevance
        if (relevanceScore >= 1) {
          productSuggestions.push({
            id: product.id,
            name: product.name,
            description: product.description,
            category: product.category,
            relevanceScore,
            suggestedText,
            affiliate_link: product.affiliate_link,
            keywords: matchedKeywords,
          });
        }
      });

      // Sort by relevance score and limit to top 3
      const topSuggestions = productSuggestions
        .sort((a, b) => b.relevanceScore - a.relevanceScore)
        .slice(0, 3);

      setSuggestions(topSuggestions);
    };

    // Debounce analysis
    const timeoutId = setTimeout(analyzeContent, 1000);
    return () => clearTimeout(timeoutId);
  }, [content, isEnabled, dismissedSuggestions]);

  const insertProductRecommendation = (suggestion: ProductSuggestion) => {
    const buttonText = `Shop ${suggestion.name}`;
    const recommendationText = `\n\n## ${suggestion.name}\n\n${suggestion.suggestedText}\n\n[button:${buttonText}](${suggestion.affiliate_link})\n\n`;
    onInsertContent(recommendationText);
    
    // Mark as dismissed
    setDismissedSuggestions(prev => new Set([...prev, suggestion.id]));
  };

  const dismissSuggestion = (suggestionId: string) => {
    setDismissedSuggestions(prev => new Set([...prev, suggestionId]));
  };

  const resetDismissed = () => {
    setDismissedSuggestions(new Set());
  };

  if (!isEnabled) {
    return (
      <Card className="w-full">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Bot className="w-4 h-4 text-muted-foreground" />
              Krusty Assistant
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Switch
                id="krusty-enabled"
                checked={isEnabled}
                onCheckedChange={setIsEnabled}
              />
              <Label htmlFor="krusty-enabled" className="text-xs">Enable</Label>
            </div>
          </div>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-sm">
            <Bot className="w-4 h-4 text-primary" />
            Krusty Assistant
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Switch
              id="krusty-enabled"
              checked={isEnabled}
              onCheckedChange={setIsEnabled}
            />
            <Label htmlFor="krusty-enabled" className="text-xs">Enable</Label>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {suggestions.length === 0 ? (
          <div className="text-center py-4">
            <Lightbulb className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">
              {content.split(/\s+/).length < 50 
                ? "Keep writing... I'll suggest relevant products as your content develops."
                : "No product suggestions for current content."}
            </p>
            {dismissedSuggestions.size > 0 && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={resetDismissed}
                className="mt-2 text-xs"
              >
                Reset dismissed suggestions
              </Button>
            )}
          </div>
        ) : (
          <ScrollArea className="max-h-64">
            <div className="space-y-3">
              {suggestions.map((suggestion) => (
                <div key={suggestion.id} className="p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{suggestion.name}</h4>
                      <Badge variant="secondary" className="text-xs mt-1">
                        {suggestion.category}
                      </Badge>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => dismissSuggestion(suggestion.id)}
                      className="h-6 w-6 p-0"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">
                    {suggestion.suggestedText}
                  </p>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {suggestion.keywords.slice(0, 3).map((keyword) => (
                      <Badge key={keyword} variant="outline" className="text-xs px-1">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                  <Button
                    size="sm"
                    onClick={() => insertProductRecommendation(suggestion)}
                    className="w-full text-xs"
                  >
                    <Plus className="w-3 h-3 mr-1" />
                    Add Recommendation
                  </Button>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};

export default KrustyAssistant;