import React, { useState, useEffect, useCallback } from 'react';
import { Search, X, Heart, ChevronLeft, ChevronRight, Plus, Book } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface GlossaryTerm {
  term: string;
  definition: string;
  categories: string[];
  related?: string[];
}

const glossaryData: GlossaryTerm[] = [
  {
    term: "Absorption",
    definition: "Flour's water-holding capacity, typically 55-65% for bread flour. This determines how much water the flour can absorb and affects final dough consistency.",
    categories: ["technique"],
    related: ["Hydration", "Flour", "Water"]
  },
  {
    term: "Active Dry Yeast",
    definition: "Granular yeast requiring activation in warm water (105-110°F). Unlike instant yeast, it must be dissolved in liquid before use to ensure proper fermentation.",
    categories: ["ingredient"],
    related: ["Yeast", "Fermentation", "Temperature"]
  },
  {
    term: "Aliquot Jar",
    definition: "Small container to monitor exact dough rise percentage during fermentation. This allows precise tracking of bulk fermentation progress.",
    categories: ["tool"],
    related: ["Bulk Fermentation", "Monitoring", "Timing"]
  },
  {
    term: "Autolyse",
    definition: "Resting flour and water (no yeast/salt) to improve gluten development (30min-1hr). This technique allows flour to fully hydrate and makes dough easier to work with.",
    categories: ["technique"],
    related: ["Gluten", "Hydration", "Mixing"]
  },
  {
    term: "Baguette",
    definition: "Long thin French bread with crisp crust (traditionally 250g, 55-65cm long). The classic French bread shape requiring specific shaping and scoring techniques.",
    categories: ["bread"],
    related: ["Shaping", "Scoring", "French Bread"]
  },
  {
    term: "Baker's Percentage",
    definition: "System where flour=100%, other ingredients are % of flour weight. This standardized method allows easy recipe scaling and comparison.",
    categories: ["technique"],
    related: ["Scaling", "Ratios", "Recipe"]
  },
  {
    term: "Banneton",
    definition: "Rattan proofing basket creating spiral patterns (use rice flour to prevent sticking). Essential tool for shaping and supporting artisan loaves during final proof.",
    categories: ["tool"],
    related: ["Proofing", "Shaping", "Rice Flour"]
  },
  {
    term: "Bassinage",
    definition: "Gradually adding reserved water to dough for better gluten control. This technique helps manage high-hydration doughs by developing strength first.",
    categories: ["technique"],
    related: ["Hydration", "Gluten", "Mixing"]
  },
  {
    term: "Bench Knife",
    definition: "Metal rectangle for dividing dough and cleaning surfaces. Essential tool for portioning, transferring, and maintaining workspace cleanliness.",
    categories: ["tool"],
    related: ["Dividing", "Portioning", "Workspace"]
  },
  {
    term: "Bigas",
    definition: "Italian stiff pre-ferment (50-60% hydration) using commercial yeast. Creates complex flavors and improves dough structure in Italian breads.",
    categories: ["ingredient"],
    related: ["Pre-ferment", "Italian Bread", "Fermentation"]
  },
  {
    term: "Boule",
    definition: "Round loaf shape (French for 'ball'). One of the classic artisan bread shapes, requiring proper shaping technique for good structure.",
    categories: ["bread"],
    related: ["Shaping", "Artisan Bread", "French"]
  },
  {
    term: "Ciabatta",
    definition: "Italian 'slipper' bread with irregular holes (high hydration 75-80%). Known for its open crumb structure and rustic appearance.",
    categories: ["bread"],
    related: ["High Hydration", "Italian Bread", "Open Crumb"]
  },
  {
    term: "Cold Retardation",
    definition: "Slowing fermentation via refrigeration (34-38°F) for flavor development. This technique improves taste complexity and extends working time.",
    categories: ["technique"],
    related: ["Fermentation", "Temperature", "Flavor"]
  },
  {
    term: "Cornicione",
    definition: "Pizza's puffed outer crust edge (Neapolitan style should be 1-2cm tall). The hallmark of properly fermented and baked Neapolitan pizza.",
    categories: ["pizza"],
    related: ["Pizza", "Neapolitan", "Fermentation"]
  },
  {
    term: "Couche",
    definition: "Heavy linen for supporting baguettes during proofing. Provides structure and absorbs moisture while maintaining proper shape.",
    categories: ["tool"],
    related: ["Baguette", "Proofing", "Shaping"]
  },
  {
    term: "Crumb",
    definition: "Bread's internal structure ('open'=large holes, 'tight'=uniform small holes). The texture inside the loaf that indicates fermentation quality.",
    categories: ["technique"],
    related: ["Texture", "Fermentation", "Structure"]
  },
  {
    term: "Diastatic Malt",
    definition: "Enzyme-rich malt powder aiding starch-to-sugar conversion (use 0.5-1%). Improves fermentation activity and crust color.",
    categories: ["ingredient"],
    related: ["Enzymes", "Fermentation", "Crust Color"]
  },
  {
    term: "Dutch Oven",
    definition: "Cast iron pot creating steam environment for crust development. Essential for achieving professional-quality crust at home.",
    categories: ["tool"],
    related: ["Steam", "Crust", "Home Baking"]
  },
  {
    term: "Ear",
    definition: "Raised crust edge from proper scoring (hold lame at 30° angle). The signature of well-executed scoring technique.",
    categories: ["technique"],
    related: ["Scoring", "Lame", "Crust"]
  },
  {
    term: "Enriched Dough",
    definition: "Contains fats/eggs/dairy (e.g., brioche: 20-25% butter, 10% eggs). Creates tender, rich breads with extended shelf life.",
    categories: ["ingredient"],
    related: ["Butter", "Eggs", "Dairy", "Brioche"]
  },
  {
    term: "Flying Crust",
    definition: "Hollow gap between crust and crumb from underproofing. A defect indicating insufficient fermentation time.",
    categories: ["technique"],
    related: ["Proofing", "Fermentation", "Defects"]
  },
  {
    term: "Focaccia",
    definition: "Italian olive oil-rich flatbread (hydrations 70-75%). Characterized by dimpled surface and herb toppings.",
    categories: ["bread"],
    related: ["Italian Bread", "Olive Oil", "Flatbread"]
  },
  {
    term: "Gluten",
    definition: "Elastic protein network (gliadin + glutenin) developed through kneading. Provides structure, elasticity, and gas retention in bread.",
    categories: ["ingredient"],
    related: ["Protein", "Kneading", "Structure"]
  },
  {
    term: "Grigne",
    definition: "French for the 'ear' formed by proper scoring. The opened scoring cut that creates the characteristic crust feature.",
    categories: ["technique"],
    related: ["Scoring", "Ear", "French"]
  },
  {
    term: "High-Hydration Dough",
    definition: "Contains >75% water relative to flour weight. Creates open crumb but requires advanced handling techniques.",
    categories: ["technique"],
    related: ["Hydration", "Open Crumb", "Handling"]
  },
  {
    term: "Hoagie Roll",
    definition: "Soft sandwich roll with slight crust (often contains oil/sugar). American-style roll designed for sandwiches.",
    categories: ["bread"],
    related: ["Sandwich", "Soft Roll", "American"]
  },
  {
    term: "Kaiser Roll",
    definition: "Round crusty roll with 5-petal shape (traditionally 90g each). Austrian-style roll with distinctive star pattern.",
    categories: ["bread"],
    related: ["Austrian", "Shaping", "Rolls"]
  },
  {
    term: "Lame",
    definition: "Razor blade for scoring (curved blades best for ears). Essential tool for controlled expansion and decorative patterns.",
    categories: ["tool"],
    related: ["Scoring", "Ear", "Razor"]
  },
  {
    term: "Levain",
    definition: "French sourdough starter (typically 20% of total flour weight). Active culture used to leaven bread naturally.",
    categories: ["ingredient"],
    related: ["Sourdough", "Starter", "French"]
  },
  {
    term: "Maillard Reaction",
    definition: "Browning process at 285°F+ creating crust flavor. Chemical reaction between amino acids and sugars that develops color and taste.",
    categories: ["process"],
    related: ["Browning", "Flavor", "Temperature"]
  },
  {
    term: "Mise en Place",
    definition: "'Everything in place' organization before baking. French culinary principle of preparing and organizing all ingredients and tools.",
    categories: ["technique"],
    related: ["Organization", "Preparation", "French"]
  },
  {
    term: "Oven Spring",
    definition: "Final rapid rise when dough hits heat (ideal oven temp 450-500°F). Critical phase determining final loaf volume and texture.",
    categories: ["process"],
    related: ["Temperature", "Volume", "Baking"]
  },
  {
    term: "Poolish",
    definition: "100% hydration pre-ferment (equal flour/water by weight). French pre-ferment technique for flavor development.",
    categories: ["ingredient"],
    related: ["Pre-ferment", "Hydration", "French"]
  },
  {
    term: "Pâte Fermentée",
    definition: "'Old dough' saved from previous batch (extends fermentation). French technique using yesterday's dough to improve today's bread.",
    categories: ["ingredient"],
    related: ["Pre-ferment", "Fermentation", "French"]
  },
  {
    term: "Scoring",
    definition: "Strategic cuts controlling bread expansion ('grignes' require shallow angle). Essential technique for proper oven spring and appearance.",
    categories: ["technique"],
    related: ["Expansion", "Lame", "Grigne"]
  },
  {
    term: "Sourdough Starter",
    definition: "Wild yeast culture (feed 1:1:1 ratio flour/water/starter). Living culture requiring regular maintenance for bread leavening.",
    categories: ["ingredient"],
    related: ["Wild Yeast", "Feeding", "Culture"]
  },
  {
    term: "Tangzhong",
    definition: "Cooked flour-water roux for softer breads (65°C gelation point). Asian technique creating incredibly soft, long-lasting bread texture.",
    categories: ["technique"],
    related: ["Roux", "Soft Bread", "Asian"]
  },
  {
    term: "Tunnels",
    definition: "Large irregular holes from inadequate degassing. Defect caused by insufficient handling during shaping.",
    categories: ["technique"],
    related: ["Degassing", "Shaping", "Defects"]
  },
  {
    term: "Vital Wheat Gluten",
    definition: "75-80% protein additive (use +1-2% for whole grain). Supplement to strengthen low-protein or whole grain flours.",
    categories: ["ingredient"],
    related: ["Protein", "Whole Grain", "Strengthening"]
  },
  {
    term: "Yeast",
    definition: "Saccharomyces cerevisiae converts sugars to CO₂ (optimal 75-78°F). Living organism responsible for fermentation and leavening.",
    categories: ["ingredient"],
    related: ["Fermentation", "Temperature", "Leavening"]
  },
  {
    term: "00 Flour",
    definition: "Italian fine-milled wheat (9-11% protein, ideal for Neapolitan pizza). Specially processed flour for authentic Italian pizza and pasta.",
    categories: ["ingredient"],
    related: ["Italian", "Pizza", "Protein"]
  },
  {
    term: "Canotto",
    definition: "Ultra-puffy cornicione style (proof 8-12hrs at 75°F). Neapolitan pizza style characterized by extremely airy crust edges.",
    categories: ["pizza"],
    related: ["Neapolitan", "Proofing", "Cornicione"]
  },
  {
    term: "Leoparding",
    definition: "Charred spotting on Neapolitan pizza crust (900°F+ ovens). Distinctive marks from high-temperature wood-fired ovens.",
    categories: ["pizza"],
    related: ["Neapolitan", "High Temperature", "Charring"]
  }
];

const categories = ['all', 'technique', 'ingredient', 'tool', 'process', 'bread', 'pizza'];
const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

const BreadGlossary = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLetter, setSelectedLetter] = useState('all');
  const [filteredTerms, setFilteredTerms] = useState<GlossaryTerm[]>(glossaryData);
  const [selectedTerm, setSelectedTerm] = useState<GlossaryTerm | null>(null);
  const [currentTermIndex, setCurrentTermIndex] = useState(0);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showSuggestForm, setShowSuggestForm] = useState(false);
  const [suggestTerm, setSuggestTerm] = useState('');
  const [suggestDefinition, setSuggestDefinition] = useState('');
  const { toast } = useToast();

  // Load favorites from localStorage
  useEffect(() => {
    const savedFavorites = localStorage.getItem('bread-glossary-favorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  // Filter terms based on search, category, and letter
  useEffect(() => {
    let filtered = [...glossaryData];

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(term =>
        term.term.toLowerCase().includes(query) ||
        term.definition.toLowerCase().includes(query) ||
        term.categories.some(cat => cat.toLowerCase().includes(query))
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(term => term.categories.includes(selectedCategory));
    }

    // Filter by letter
    if (selectedLetter !== 'all') {
      filtered = filtered.filter(term => term.term.charAt(0).toUpperCase() === selectedLetter);
    }

    setFilteredTerms(filtered);
  }, [searchQuery, selectedCategory, selectedLetter]);

  const toggleFavorite = useCallback((termName: string) => {
    const newFavorites = favorites.includes(termName)
      ? favorites.filter(fav => fav !== termName)
      : [...favorites, termName];
    
    setFavorites(newFavorites);
    localStorage.setItem('bread-glossary-favorites', JSON.stringify(newFavorites));
  }, [favorites]);

  const openTermModal = useCallback((term: GlossaryTerm) => {
    setSelectedTerm(term);
    setCurrentTermIndex(filteredTerms.findIndex(t => t.term === term.term));
  }, [filteredTerms]);

  const navigateTerm = useCallback((direction: 'prev' | 'next') => {
    const newIndex = direction === 'prev' ? currentTermIndex - 1 : currentTermIndex + 1;
    if (newIndex >= 0 && newIndex < filteredTerms.length) {
      setCurrentTermIndex(newIndex);
      setSelectedTerm(filteredTerms[newIndex]);
    }
  }, [currentTermIndex, filteredTerms]);

  const handleSuggestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!suggestTerm.trim() || !suggestDefinition.trim()) {
      toast({
        title: "Error",
        description: "Please fill in both fields",
        variant: "destructive"
      });
      return;
    }

    // Check if term already exists
    if (glossaryData.some(t => t.term.toLowerCase() === suggestTerm.toLowerCase())) {
      toast({
        title: "Error",
        description: "This term already exists in the glossary",
        variant: "destructive"
      });
      return;
    }

    // Store suggestion
    const suggestions = JSON.parse(localStorage.getItem('bread-glossary-suggestions') || '[]');
    suggestions.push({
      term: suggestTerm.trim(),
      definition: suggestDefinition.trim(),
      timestamp: new Date().toISOString(),
      status: 'pending'
    });
    localStorage.setItem('bread-glossary-suggestions', JSON.stringify(suggestions));

    toast({
      title: "Success",
      description: "Thank you for your suggestion! It will be reviewed and added to the glossary."
    });

    setSuggestTerm('');
    setSuggestDefinition('');
    setShowSuggestForm(false);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedLetter('all');
  };

  const highlightText = (text: string, query: string) => {
    if (!query.trim()) return text;
    
    const regex = new RegExp(`(${query})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) =>
      regex.test(part) ? (
        <span key={index} className="bg-warning/30 px-1 rounded font-medium">{part}</span>
      ) : part
    );
  };

  return (
    <div className="bg-background text-foreground">
      <Header />
      
      {/* Hero Section */}
      <section className="relative h-80 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: `url(/lovable-uploads/a7440ca6-c641-4ad7-a994-f6ef4a375679.png)`
          }}
        />
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative h-full flex items-end justify-center pb-8">
          <div className="text-center text-white">
            <p className="text-lg md:text-xl mb-2 drop-shadow-md">
              Your comprehensive guide to bread baking terminology
            </p>
            <p className="text-base md:text-lg text-amber-200 drop-shadow-md">by Henry Hunter</p>
          </div>
        </div>
      </section>

      <main className="container mx-auto px-4 py-8">
        {/* Search and Filters */}
        <Card className="mb-8 bg-card shadow-stone">
          <CardContent className="p-6">
            {/* Search Bar */}
            <div className="flex gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search terms and definitions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="stone" onClick={clearFilters}>
                <X className="h-4 w-4 mr-2" />
                Clear
              </Button>
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-2 mb-6">
              {categories.map(category => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "warm" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className="capitalize"
                >
                  {category === 'all' ? 'All Terms' : category}
                </Button>
              ))}
            </div>

            {/* Letter Filters */}
            <div className="flex flex-wrap gap-2 justify-center">
              <Button
                variant={selectedLetter === 'all' ? "warm" : "outline"}
                size="sm"
                onClick={() => setSelectedLetter('all')}
              >
                All
              </Button>
              {alphabet.map(letter => (
                <Button
                  key={letter}
                  variant={selectedLetter === letter ? "warm" : "outline"}
                  size="sm"
                  onClick={() => setSelectedLetter(letter)}
                  className="w-10 h-10 p-0"
                >
                  {letter}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Terms Grid */}
        {filteredTerms.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Search className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-30" />
              <h3 className="text-xl font-semibold mb-2">No terms found</h3>
              <p className="text-muted-foreground">Try adjusting your search or filters</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {filteredTerms.map((term) => (
              <Card key={term.term} className="cursor-pointer hover:shadow-warm transition-all duration-300 hover:-translate-y-1 relative group">
                <CardContent className="p-6">
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`absolute top-4 right-4 ${favorites.includes(term.term) ? 'text-destructive' : 'text-muted-foreground'}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(term.term);
                    }}
                  >
                    <Heart className={`h-5 w-5 ${favorites.includes(term.term) ? 'fill-current' : ''}`} />
                  </Button>
                  
                  <div className="flex justify-between items-start mb-4" onClick={() => openTermModal(term)}>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-primary mb-2">
                        {highlightText(term.term, searchQuery)}
                      </h3>
                    </div>
                    <div className="bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ml-4">
                      {term.term.charAt(0).toUpperCase()}
                    </div>
                  </div>
                  
                  <div onClick={() => openTermModal(term)}>
                    <p className="text-muted-foreground text-sm line-clamp-3">
                      {highlightText(
                        term.definition.length > 120 
                          ? term.definition.substring(0, 120) + '...' 
                          : term.definition,
                        searchQuery
                      )}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Suggest Term Section */}
        <Card className="bg-section shadow-stone">
          <CardContent className="p-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-primary mb-4">Suggest a Term</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Know a bread baking term that's missing? Help our community by suggesting it!
              </p>
            </div>

            {!showSuggestForm ? (
              <div className="text-center">
                <Button variant="warm" size="lg" onClick={() => setShowSuggestForm(true)}>
                  <Plus className="h-5 w-5 mr-2" />
                  Suggest a New Term
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSuggestSubmit} className="max-w-md mx-auto space-y-4">
                <div>
                  <Label htmlFor="suggest-term">Term</Label>
                  <Input
                    id="suggest-term"
                    value={suggestTerm}
                    onChange={(e) => setSuggestTerm(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="suggest-definition">Definition</Label>
                  <Textarea
                    id="suggest-definition"
                    value={suggestDefinition}
                    onChange={(e) => setSuggestDefinition(e.target.value)}
                    placeholder="Provide a clear, helpful definition..."
                    required
                    rows={4}
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="submit" variant="warm" className="flex-1">
                    <Plus className="h-4 w-4 mr-2" />
                    Submit Suggestion
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setShowSuggestForm(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </main>

      {/* Term Detail Modal */}
      <Dialog open={!!selectedTerm} onOpenChange={() => setSelectedTerm(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedTerm && (
            <>
              <DialogHeader>
                <div className="text-sm text-muted-foreground mb-2">
                  <span 
                    className="cursor-pointer hover:underline"
                    onClick={() => {
                      setSelectedLetter(selectedTerm.term.charAt(0).toUpperCase());
                      setSelectedTerm(null);
                    }}
                  >
                    {selectedTerm.term.charAt(0).toUpperCase()}
                  </span>
                  {' > '}
                  <span>{selectedTerm.term}</span>
                </div>
                <DialogTitle className="text-2xl">{selectedTerm.term}</DialogTitle>
              </DialogHeader>
              
              <div className="space-y-6">
                <p className="text-lg leading-relaxed">{selectedTerm.definition}</p>
                
                {selectedTerm.related && selectedTerm.related.length > 0 && (
                  <div>
                    <h4 className="text-lg font-semibold mb-3 text-primary">Related Terms</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedTerm.related.map(relatedTerm => {
                        const related = glossaryData.find(t => t.term === relatedTerm);
                        return related ? (
                          <Button
                            key={relatedTerm}
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedTerm(related)}
                            className="bg-amber-50 hover:bg-amber-100 border-amber-200"
                          >
                            {relatedTerm}
                          </Button>
                        ) : null;
                      })}
                    </div>
                  </div>
                )}
                
                <div className="flex justify-between items-center pt-4 border-t">
                  <Button
                    variant="outline"
                    onClick={() => navigateTerm('prev')}
                    disabled={currentTermIndex === 0}
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Previous
                  </Button>
                  
                  <span className="text-sm text-muted-foreground">
                    {currentTermIndex + 1} of {filteredTerms.length}
                  </span>
                  
                  <Button
                    variant="outline"
                    onClick={() => navigateTerm('next')}
                    disabled={currentTermIndex === filteredTerms.length - 1}
                  >
                    Next
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default BreadGlossary;