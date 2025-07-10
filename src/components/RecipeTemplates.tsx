import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { FileText, Plus, Save } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface RecipeTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  template: {
    ingredients: string[];
    method: string[];
    tips: string[];
    description: string;
  };
}

const BUILT_IN_TEMPLATES: RecipeTemplate[] = [
  {
    id: 'basic-bread',
    name: 'Basic Bread',
    category: 'Bread',
    description: 'Simple white bread template',
    template: {
      description: 'A basic white bread recipe perfect for beginners',
      ingredients: [
        '500g bread flour',
        '320ml warm water',
        '7g active dry yeast',
        '10g salt',
        '20ml olive oil',
        '12g sugar'
      ],
      method: [
        'Dissolve yeast and sugar in warm water. Let sit for 5 minutes until foamy.',
        'In a large bowl, mix flour and salt.',
        'Add the yeast mixture and olive oil to the flour.',
        'Mix until a shaggy dough forms.',
        'Knead on a floured surface for 8-10 minutes until smooth and elastic.',
        'Place in oiled bowl, cover, and let rise for 1 hour until doubled.',
        'Punch down, shape into a loaf, and place in greased pan.',
        'Let rise again for 45 minutes.',
        'Bake at 375°F (190°C) for 30-35 minutes until golden brown.',
        'Cool on wire rack before slicing.'
      ],
      tips: [
        'Water temperature should be around 105°F (40°C)',
        'Dough should pass the windowpane test when properly kneaded',
        'Internal temperature should reach 190°F (88°C) when done'
      ]
    }
  },
  {
    id: 'sourdough-starter',
    name: 'Sourdough Starter',
    category: 'Sourdough',
    description: 'Basic sourdough starter creation template',
    template: {
      description: 'Create your own sourdough starter from scratch',
      ingredients: [
        '50g whole wheat flour (Day 1)',
        '50ml room temperature water (Day 1)',
        '50g bread flour (Daily feeding)',
        '50ml room temperature water (Daily feeding)'
      ],
      method: [
        'Day 1: Mix whole wheat flour and water in a clean jar.',
        'Cover with cloth and secure with rubber band.',
        'Leave at room temperature for 24 hours.',
        'Day 2-7: Discard half of starter, add 50g flour and 50ml water.',
        'Mix well and cover. Repeat daily.',
        'Look for bubbles, doubling in size, and pleasant tangy smell.',
        'Starter is ready when it doubles in size within 4-8 hours after feeding.'
      ],
      tips: [
        'Use filtered water if your tap water is heavily chlorinated',
        'Consistency should be like thick pancake batter',
        'Store in refrigerator once established, feed weekly',
        'Bring to room temperature and feed before using in recipes'
      ]
    }
  },
  {
    id: 'pizza-dough',
    name: 'Pizza Dough',
    category: 'Pizza',
    description: 'Classic pizza dough template',
    template: {
      description: 'Perfect pizza dough for homemade pizzas',
      ingredients: [
        '400g bread flour',
        '260ml warm water',
        '5g active dry yeast',
        '8g salt',
        '15ml olive oil',
        '5g sugar'
      ],
      method: [
        'Dissolve yeast and sugar in warm water. Let sit for 5 minutes.',
        'Mix flour and salt in a large bowl.',
        'Add yeast mixture and olive oil to flour.',
        'Mix until dough forms, then knead for 5-8 minutes.',
        'Place in oiled bowl, cover, and rise for 1-2 hours.',
        'Divide into 2-3 portions for individual pizzas.',
        'Roll out on floured surface to desired thickness.',
        'Add toppings and bake at highest oven temperature (500°F+).'
      ],
      tips: [
        'Let dough come to room temperature before rolling',
        'Use semolina flour on pizza peel to prevent sticking',
        'Pre-bake crust for 2-3 minutes for crispier base'
      ]
    }
  }
];

interface RecipeTemplatesProps {
  onUseTemplate: (recipe: any) => void;
}

export const RecipeTemplates = ({ onUseTemplate }: RecipeTemplatesProps) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [customTemplate, setCustomTemplate] = useState({
    name: '',
    description: '',
    category: '',
    ingredients: '',
    method: '',
    tips: ''
  });
  const [showCustomForm, setShowCustomForm] = useState(false);

  const categories = ['all', ...Array.from(new Set(BUILT_IN_TEMPLATES.map(t => t.category)))];
  
  const filteredTemplates = selectedCategory === 'all' 
    ? BUILT_IN_TEMPLATES 
    : BUILT_IN_TEMPLATES.filter(t => t.category === selectedCategory);

  const handleUseTemplate = (template: RecipeTemplate) => {
    const recipe = {
      title: template.name,
      data: template.template,
      folder: template.category,
      tags: [template.category.toLowerCase()]
    };

    onUseTemplate(recipe);
    
    toast({
      title: "Template applied",
      description: `${template.name} template is ready for customization`
    });
  };

  const handleCreateCustomTemplate = () => {
    if (!customTemplate.name.trim()) {
      toast({
        title: "Missing information",
        description: "Please provide a template name",
        variant: "destructive"
      });
      return;
    }

    const recipe = {
      title: customTemplate.name,
      data: {
        description: customTemplate.description,
        ingredients: customTemplate.ingredients.split('\n').filter(line => line.trim()),
        method: customTemplate.method.split('\n').filter(line => line.trim()),
        tips: customTemplate.tips.split('\n').filter(line => line.trim())
      },
      folder: customTemplate.category || 'Custom',
      tags: ['custom', 'template']
    };

    onUseTemplate(recipe);
    
    // Reset form
    setCustomTemplate({
      name: '',
      description: '',
      category: '',
      ingredients: '',
      method: '',
      tips: ''
    });
    setShowCustomForm(false);
    
    toast({
      title: "Custom template created",
      description: "Your custom template is ready for use"
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Recipe Templates
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="category">Filter by Category</Label>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredTemplates.map(template => (
              <Card key={template.id} className="border-2 hover:border-primary/50 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold">{template.name}</h3>
                      <Badge variant="secondary" className="text-xs">
                        {template.category}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    {template.description}
                  </p>
                  <div className="text-xs text-muted-foreground mb-3">
                    <div>Ingredients: {template.template.ingredients.length}</div>
                    <div>Steps: {template.template.method.length}</div>
                    <div>Tips: {template.template.tips.length}</div>
                  </div>
                  <Button 
                    size="sm" 
                    onClick={() => handleUseTemplate(template)}
                    className="w-full"
                  >
                    Use Template
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Create Custom Template</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowCustomForm(!showCustomForm)}
            >
              <Plus className="w-4 h-4 mr-2" />
              {showCustomForm ? 'Cancel' : 'New Template'}
            </Button>
          </div>

          {showCustomForm && (
            <Card className="border-dashed">
              <CardContent className="p-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="template-name">Template Name</Label>
                    <Input
                      id="template-name"
                      value={customTemplate.name}
                      onChange={(e) => setCustomTemplate(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="My Custom Template"
                    />
                  </div>
                  <div>
                    <Label htmlFor="template-category">Category</Label>
                    <Input
                      id="template-category"
                      value={customTemplate.category}
                      onChange={(e) => setCustomTemplate(prev => ({ ...prev, category: e.target.value }))}
                      placeholder="Custom Category"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="template-description">Description</Label>
                  <Input
                    id="template-description"
                    value={customTemplate.description}
                    onChange={(e) => setCustomTemplate(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Brief description of this template"
                  />
                </div>

                <div>
                  <Label htmlFor="template-ingredients">Ingredients (one per line)</Label>
                  <Textarea
                    id="template-ingredients"
                    value={customTemplate.ingredients}
                    onChange={(e) => setCustomTemplate(prev => ({ ...prev, ingredients: e.target.value }))}
                    placeholder="500g flour&#10;300ml water&#10;10g salt"
                    className="min-h-[100px]"
                  />
                </div>

                <div>
                  <Label htmlFor="template-method">Method (one step per line)</Label>
                  <Textarea
                    id="template-method"
                    value={customTemplate.method}
                    onChange={(e) => setCustomTemplate(prev => ({ ...prev, method: e.target.value }))}
                    placeholder="Mix ingredients in bowl&#10;Knead for 10 minutes&#10;Let rise for 1 hour"
                    className="min-h-[100px]"
                  />
                </div>

                <div>
                  <Label htmlFor="template-tips">Tips (one per line)</Label>
                  <Textarea
                    id="template-tips"
                    value={customTemplate.tips}
                    onChange={(e) => setCustomTemplate(prev => ({ ...prev, tips: e.target.value }))}
                    placeholder="Use room temperature ingredients&#10;Don't over-knead the dough"
                    className="min-h-[80px]"
                  />
                </div>

                <Button onClick={handleCreateCustomTemplate} className="w-full">
                  <Save className="w-4 h-4 mr-2" />
                  Create Template
                </Button>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
};