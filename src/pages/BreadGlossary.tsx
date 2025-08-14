import React, { useState, useEffect, useCallback } from 'react';
import { Search, Heart, Plus, X, ChevronLeft, ChevronRight, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import glossaryHero from '@/assets/glossary-hero.png';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Label } from '@/components/ui/label';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface GlossaryTerm {
  id: string;
  term: string;
  definition: string;
  categories: string[];
  relatedTerms?: string[];
}

// Static glossary data with comprehensive bread-making terms
const glossaryData: GlossaryTerm[] = [
  {
    id: 'absorption',
    term: 'Absorption',
    definition: 'The amount of liquid that flour can absorb, typically expressed as a percentage of the flour weight. Higher protein flours generally have higher absorption rates.',
    categories: ['technique'],
    relatedTerms: ['hydration', 'protein', 'gluten']
  },
  {
    id: 'active-dry-yeast',
    term: 'Active Dry Yeast',
    definition: 'A form of commercial yeast that has been dried and granulated. Must be dissolved in warm liquid before use to activate the yeast cells.',
    categories: ['ingredient'],
    relatedTerms: ['instant-yeast', 'fresh-yeast', 'proofing']
  },
  {
    id: 'aliquot-jar',
    term: 'Aliquot Jar',
    definition: 'A small container used to hold a sample portion of sourdough starter to monitor its rise and activity without disturbing the main culture.',
    categories: ['tool'],
    relatedTerms: ['sourdough-starter', 'float-test', 'peak-activity']
  },
  {
    id: 'autolyse',
    term: 'Autolyse',
    definition: 'A resting period where flour and water are mixed and left to hydrate before adding other ingredients. This improves dough extensibility and reduces mixing time.',
    categories: ['technique'],
    relatedTerms: ['hydration', 'gluten-development', 'extensibility']
  },
  {
    id: 'baker-percentage',
    term: 'Baker\'s Percentage',
    definition: 'A system of measuring ingredients as percentages of the total flour weight, where flour is always 100%. This allows easy scaling of recipes.',
    categories: ['technique'],
    relatedTerms: ['scaling', 'hydration', 'formula']
  },
  {
    id: 'banneton',
    term: 'Banneton',
    definition: 'A coiled cane or rattan basket used for the final proofing of bread dough, particularly sourdough. Creates distinctive spiral patterns on the crust.',
    categories: ['tool'],
    relatedTerms: ['proofing', 'final-proof', 'shaping']
  },
  {
    id: 'bench-knife',
    term: 'Bench Knife',
    definition: 'A rectangular blade tool used for cutting, dividing, and moving dough. Also called a bench scraper or dough scraper.',
    categories: ['tool'],
    relatedTerms: ['dividing', 'portioning', 'shaping']
  },
  {
    id: 'bulk-fermentation',
    term: 'Bulk Fermentation',
    definition: 'The first rise of bread dough after mixing, during which the dough develops flavor and structure through fermentation.',
    categories: ['process'],
    relatedTerms: ['fermentation', 'first-rise', 'gluten-development']
  },
  {
    id: 'crumb',
    term: 'Crumb',
    definition: 'The interior texture and structure of bread, characterized by the size, shape, and distribution of air pockets or holes.',
    categories: ['bread'],
    relatedTerms: ['texture', 'gluten-network', 'fermentation']
  },
  {
    id: 'dough-temperature',
    term: 'Dough Temperature',
    definition: 'The temperature of mixed dough, typically targeted between 75-78°F (24-26°C) for optimal fermentation rate and flavor development.',
    categories: ['technique'],
    relatedTerms: ['fermentation', 'yeast-activity', 'temperature-control']
  },
  {
    id: 'fermentation',
    term: 'Fermentation',
    definition: 'The process by which yeast converts sugars into carbon dioxide and alcohol, creating the gas that makes bread rise and developing flavor compounds.',
    categories: ['process'],
    relatedTerms: ['yeast', 'rise', 'flavor-development']
  },
  {
    id: 'final-proof',
    term: 'Final Proof',
    definition: 'The last rise of shaped bread dough before baking, when the dough develops its final volume and texture.',
    categories: ['process'],
    relatedTerms: ['proofing', 'second-rise', 'oven-spring']
  },
  {
    id: 'gluten',
    term: 'Gluten',
    definition: 'A protein network formed when flour proteins (glutenin and gliadin) combine with water and are developed through mixing or kneading.',
    categories: ['ingredient'],
    relatedTerms: ['protein', 'kneading', 'dough-strength']
  },
  {
    id: 'hydration',
    term: 'Hydration',
    definition: 'The ratio of liquid to flour in a dough, expressed as a percentage. Higher hydration creates more open crumb structure but can be harder to handle.',
    categories: ['technique'],
    relatedTerms: ['absorption', 'liquid', 'crumb-structure']
  },
  {
    id: 'kneading',
    term: 'Kneading',
    definition: 'The process of working dough to develop the gluten network through stretching and folding motions, creating dough strength and elasticity.',
    categories: ['technique'],
    relatedTerms: ['gluten-development', 'mixing', 'dough-strength']
  },
  {
    id: 'lame',
    term: 'Lame',
    definition: 'A razor blade holder used for scoring bread dough before baking. Allows for precise, clean cuts that control how the bread expands in the oven.',
    categories: ['tool'],
    relatedTerms: ['scoring', 'slashing', 'oven-spring']
  },
  {
    id: 'levain',
    term: 'Levain',
    definition: 'A portion of sourdough starter that has been refreshed and built up specifically for use in a bread recipe. Often used interchangeably with "starter."',
    categories: ['ingredient'],
    relatedTerms: ['sourdough-starter', 'natural-leaven', 'fermentation']
  },
  {
    id: 'oven-spring',
    term: 'Oven Spring',
    definition: 'The rapid rise that occurs when bread first enters the hot oven, caused by expanding gases and steam formation before the crust sets.',
    categories: ['process'],
    relatedTerms: ['baking', 'steam', 'crust-formation']
  },
  {
    id: 'poke-test',
    term: 'Poke Test',
    definition: 'A method to test if dough is properly proofed by gently poking it with a finger. Properly proofed dough will spring back slowly, leaving a slight indentation.',
    categories: ['technique'],
    relatedTerms: ['proofing', 'final-proof', 'readiness-test']
  },
  {
    id: 'poolish',
    term: 'Poolish',
    definition: 'A liquid pre-ferment made with equal weights of flour and water plus a small amount of yeast. Aged 12-24 hours to develop flavor.',
    categories: ['technique'],
    relatedTerms: ['pre-ferment', 'biga', 'flavor-development']
  },
  {
    id: 'scoring',
    term: 'Scoring',
    definition: 'Making cuts on the surface of shaped dough before baking to control expansion and create decorative patterns. Also called slashing.',
    categories: ['technique'],
    relatedTerms: ['lame', 'expansion', 'decoration']
  },
  {
    id: 'sourdough-starter',
    term: 'Sourdough Starter',
    definition: 'A culture of wild yeast and bacteria maintained in a mixture of flour and water, used as a natural leavening agent for bread.',
    categories: ['ingredient'],
    relatedTerms: ['wild-yeast', 'natural-leaven', 'fermentation']
  },
  {
    id: 'steam',
    term: 'Steam',
    definition: 'Moisture introduced to the oven during the early stages of baking to keep the crust flexible longer, allowing for better oven spring and crust development.',
    categories: ['technique'],
    relatedTerms: ['oven-spring', 'crust', 'baking-technique']
  },
  {
    id: 'stretch-and-fold',
    term: 'Stretch and Fold',
    definition: 'A gentle technique for developing gluten strength during bulk fermentation by stretching the dough and folding it over itself.',
    categories: ['technique'],
    relatedTerms: ['gluten-development', 'bulk-fermentation', 'dough-strength']
  },
  {
    id: 'windowpane-test',
    term: 'Windowpane Test',
    definition: 'A test for gluten development where a small piece of dough is stretched thin enough to see light through it without tearing.',
    categories: ['technique'],
    relatedTerms: ['gluten-development', 'kneading', 'dough-readiness']
  },
  // Pizza-specific terms
  {
    id: 'pizza-stone',
    term: 'Pizza Stone',
    definition: 'A thick, flat stone used in the oven to provide even heat distribution and create a crispy pizza crust bottom.',
    categories: ['pizza', 'tool'],
    relatedTerms: ['heat-retention', 'crispy-crust', 'thermal-mass']
  },
  {
    id: 'neapolitan-style',
    term: 'Neapolitan Style',
    definition: 'Traditional Italian pizza style featuring a thin, soft crust with slightly charred edges, typically baked at very high temperatures.',
    categories: ['pizza'],
    relatedTerms: ['thin-crust', 'high-heat', 'traditional']
  },
  {
    id: 'pizza-peel',
    term: 'Pizza Peel',
    definition: 'A flat, shovel-like tool used to slide pizzas into and out of ovens, typically made of wood or metal.',
    categories: ['pizza', 'tool'],
    relatedTerms: ['pizza-stone', 'launching', 'retrieval']
  },
  {
    id: 'pizza-dough-balls',
    term: 'Pizza Dough Balls',
    definition: 'Individual portions of pizza dough that have been shaped into balls and allowed to rest before stretching into pizza bases.',
    categories: ['pizza', 'technique'],
    relatedTerms: ['portioning', 'resting', 'shaping']
  },
  {
    id: 'stretching',
    term: 'Stretching',
    definition: 'The technique of expanding pizza dough into a flat circle using hands or gravity, preserving the gas bubbles formed during fermentation.',
    categories: ['pizza', 'technique'],
    relatedTerms: ['pizza-dough-balls', 'gas-bubbles', 'thin-crust']
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
      filtered = filtered.filter(term =>
        term.categories.includes(selectedCategory)
      );
    }

    // Filter by letter
    if (selectedLetter !== 'all') {
      filtered = filtered.filter(term =>
        term.term.toLowerCase().startsWith(selectedLetter.toLowerCase())
      );
    }

    // Sort alphabetically
    filtered.sort((a, b) => a.term.localeCompare(b.term));

    setFilteredTerms(filtered);
  }, [searchQuery, selectedCategory, selectedLetter]);

  const toggleFavorite = useCallback((termId: string) => {
    setFavorites(prev => {
      const newFavorites = prev.includes(termId)
        ? prev.filter(id => id !== termId)
        : [...prev, termId];
      
      localStorage.setItem('bread-glossary-favorites', JSON.stringify(newFavorites));
      
      toast({
        title: prev.includes(termId) ? "Removed from favorites" : "Added to favorites",
        description: prev.includes(termId) 
          ? "Term removed from your favorites list" 
          : "Term added to your favorites list",
      });
      
      return newFavorites;
    });
  }, [toast]);

  const openTermModal = useCallback((term: GlossaryTerm) => {
    setSelectedTerm(term);
    const index = filteredTerms.findIndex(t => t.id === term.id);
    setCurrentTermIndex(index);
  }, [filteredTerms]);

  const navigateTerms = useCallback((direction: 'prev' | 'next') => {
    const newIndex = direction === 'prev' 
      ? Math.max(0, currentTermIndex - 1)
      : Math.min(filteredTerms.length - 1, currentTermIndex + 1);
    
    setCurrentTermIndex(newIndex);
    setSelectedTerm(filteredTerms[newIndex]);
  }, [currentTermIndex, filteredTerms]);

  const handleSuggestSubmit = useCallback(() => {
    if (!suggestTerm.trim() || !suggestDefinition.trim()) {
      toast({
        title: "Incomplete suggestion",
        description: "Please provide both a term and definition",
        variant: "destructive"
      });
      return;
    }

    // In a real app, this would send to a backend
    toast({
      title: "Thank you!",
      description: "Your term suggestion has been submitted for review",
    });

    setSuggestTerm('');
    setSuggestDefinition('');
    setShowSuggestForm(false);
  }, [suggestTerm, suggestDefinition, toast]);

  const clearFilters = useCallback(() => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedLetter('all');
  }, []);

  const highlightSearchTerm = (text: string, query: string): React.ReactNode => {
    if (!query.trim()) return text;
    
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <mark key={index} className="bg-amber-200 dark:bg-amber-800 px-1 rounded">
          {part}
        </mark>
      ) : part
    );
  };

  const getRelatedTermsText = (relatedTerms?: string[]): React.ReactNode => {
    if (!relatedTerms?.length) return null;
    
    return relatedTerms.map((termId, index) => {
      const relatedTerm = glossaryData.find(t => t.id === termId);
      if (!relatedTerm) return termId;
      
      const termText = relatedTerm.term;
      const highlighted = searchQuery.trim() 
        ? highlightSearchTerm(termText, searchQuery)
        : termText;
      
      return (
        <React.Fragment key={termId}>
          <button
            onClick={() => openTermModal(relatedTerm)}
            className="text-primary hover:text-primary/80 underline transition-colors"
          >
            {highlighted}
          </button>
          {index < relatedTerms.length - 1 && ', '}
        </React.Fragment>
      );
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      {/* Hero Section */}
      <section className="relative h-80 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: `url(${glossaryHero})`
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

        {/* Results Count */}
        <div className="mb-6 text-center">
          <p className="text-muted-foreground">
            Showing {filteredTerms.length} term{filteredTerms.length !== 1 ? 's' : ''}
            {searchQuery && ` for "${searchQuery}"`}
            {selectedCategory !== 'all' && ` in ${selectedCategory}`}
            {selectedLetter !== 'all' && ` starting with "${selectedLetter}"`}
          </p>
        </div>

        {/* Terms Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-12">
          {filteredTerms.map((term) => (
            <Card 
              key={term.id} 
              className="hover:shadow-stone-lg transition-all duration-200 cursor-pointer bg-card border-stone group"
              onClick={() => openTermModal(term)}
            >
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-bold text-primary group-hover:text-primary/80 transition-colors">
                    {highlightSearchTerm(term.term, searchQuery)}
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(term.id);
                    }}
                    className="text-rose-500 hover:text-rose-600 transition-colors p-1"
                  >
                    <Heart 
                      className={`h-5 w-5 ${
                        favorites.includes(term.id) ? 'fill-current' : ''
                      }`} 
                    />
                  </Button>
                </div>
                
                <p className="text-muted-foreground mb-4 line-clamp-3">
                  {highlightSearchTerm(term.definition, searchQuery)}
                </p>
                
                <div className="flex flex-wrap gap-2">
                  {term.categories.map(category => (
                    <Badge key={category} variant="secondary" className="text-xs">
                      {category}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No Results */}
        {filteredTerms.length === 0 && (
          <div className="text-center py-12">
            <p className="text-xl text-muted-foreground mb-4">No terms found</p>
            <p className="text-muted-foreground mb-6">
              Try adjusting your search or filters, or suggest a new term below.
            </p>
            <Button variant="warm" onClick={() => setShowSuggestForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Suggest a Term
            </Button>
          </div>
        )}

        {/* Suggest New Term Section */}
        <Card className="bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800">
          <CardContent className="p-6">
            <div className="text-center mb-4">
              <h2 className="text-2xl font-bold text-primary mb-2">Know a term we're missing?</h2>
              <p className="text-muted-foreground">
                Help us build the most comprehensive bread baking glossary by suggesting new terms.
              </p>
            </div>
            
            {!showSuggestForm ? (
              <div className="text-center">
                <Button variant="warm" onClick={() => setShowSuggestForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Suggest a Term
                </Button>
              </div>
            ) : (
              <div className="space-y-4 max-w-md mx-auto">
                <div>
                  <Label htmlFor="suggest-term">Term</Label>
                  <Input
                    id="suggest-term"
                    placeholder="Enter the term..."
                    value={suggestTerm}
                    onChange={(e) => setSuggestTerm(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="suggest-definition">Definition</Label>
                  <Textarea
                    id="suggest-definition"
                    placeholder="Provide a clear definition..."
                    value={suggestDefinition}
                    onChange={(e) => setSuggestDefinition(e.target.value)}
                    rows={3}
                  />
                </div>
                <div className="flex gap-2 justify-center">
                  <Button variant="warm" onClick={handleSuggestSubmit}>
                    Submit Suggestion
                  </Button>
                  <Button variant="outline" onClick={() => {
                    setShowSuggestForm(false);
                    setSuggestTerm('');
                    setSuggestDefinition('');
                  }}>
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      {/* Term Detail Modal */}
      <Dialog open={!!selectedTerm} onOpenChange={(open) => !open && setSelectedTerm(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          {selectedTerm && (
            <>
              <DialogHeader>
                <div className="flex items-center justify-between">
                  <DialogTitle className="text-2xl font-bold text-primary">
                    {selectedTerm.term}
                  </DialogTitle>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleFavorite(selectedTerm.id)}
                      className="text-rose-500 hover:text-rose-600"
                    >
                      <Heart 
                        className={`h-5 w-5 ${
                          favorites.includes(selectedTerm.id) ? 'fill-current' : ''
                        }`} 
                      />
                    </Button>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigateTerms('prev')}
                        disabled={currentTermIndex === 0}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <span className="text-sm text-muted-foreground">
                        {currentTermIndex + 1} of {filteredTerms.length}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigateTerms('next')}
                        disabled={currentTermIndex === filteredTerms.length - 1}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {selectedTerm.categories.map(category => (
                    <Badge key={category} variant="secondary">
                      {category}
                    </Badge>
                  ))}
                </div>
                
                <p className="text-muted-foreground leading-relaxed">
                  {highlightSearchTerm(selectedTerm.definition, searchQuery)}
                </p>
                
                {selectedTerm.relatedTerms && selectedTerm.relatedTerms.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-primary mb-2">Related Terms:</h4>
                    <p className="text-muted-foreground">
                      {getRelatedTermsText(selectedTerm.relatedTerms)}
                    </p>
                  </div>
                )}
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