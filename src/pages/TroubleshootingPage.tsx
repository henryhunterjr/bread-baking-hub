import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '@/store/useStore';
import TroubleshootingTable from '@/components/TroubleshootingTable';
import TroubleshootingCard from '@/components/TroubleshootingCard';
import CommunityBridge from '@/components/CommunityBridge';
import EmptyState from '@/components/EmptyState';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { useToast } from '@/hooks/use-toast';
import { detectSymptoms } from '@/utils/SymptomMatcher';
import symptomsData from '@/data/symptoms.json';
import { format } from 'date-fns';
import { RotateCcw, Grid3X3, Table, ChevronRight, ChevronDown } from 'lucide-react';

export default function TroubleshootingPage() {
  const [recipeText, setRecipeText] = useState<string>("");
  const [results, setResults] = useState<string[] | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());
  const resultsRef = useRef<HTMLDivElement>(null);
  
  const { symptoms, filters, history, loadSymptoms, recordScan } = useStore();
  const { toast } = useToast();

  // Load symptoms on mount
  useEffect(() => {
    if (symptoms.length === 0) {
      loadSymptoms(symptomsData.symptoms);
    }
  }, [symptoms.length, loadSymptoms]);

  async function handleAnalyze() {
    const detected = await detectSymptoms(recipeText);
    setResults(detected);
    recordScan(detected);
    
    // Show toast notification
    const issueCount = detected.length;
    toast({
      title: issueCount > 0 ? `✅ ${issueCount} issue${issueCount !== 1 ? 's' : ''} found!` : "No issues detected",
      description: issueCount > 0 ? "Scroll down to see the analysis" : "Your recipe looks good!",
      duration: 3000,
    });
    
    // Auto-scroll to results
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }

  function handleHistoryClick(historyEntry: any) {
    setResults(historyEntry.symptomIds);
    toast({
      title: "Previous scan loaded",
      description: `${historyEntry.symptomIds.length} issues from ${format(new Date(historyEntry.timestamp), 'MMM d, yyyy')}`,
      duration: 2000,
    });
  }

  function handleRerunScan(historyEntry: any) {
    setResults(historyEntry.symptomIds);
    toast({
      title: "Scan re-run complete",
      description: `${historyEntry.symptomIds.length} issues found`,
      duration: 2000,
    });
  }

  function toggleCardExpansion(cardId: string) {
    setExpandedCards(prev => {
      const newSet = new Set(prev);
      if (newSet.has(cardId)) {
        newSet.delete(cardId);
      } else {
        newSet.add(cardId);
      }
      return newSet;
    });
  }

  return (
    <TooltipProvider>
      <div className="bg-background text-foreground min-h-screen">
        <Header />
        
        <main className="container mx-auto px-4 py-8">
          {/* Promoted Recipe Input */}
          <div className="mb-8 p-6 bg-muted/30 border border-border rounded-lg">
            <label htmlFor="recipe-text" className="block text-lg font-semibold mb-3 text-primary">
              Analyze Your Recipe
            </label>
            <textarea
              id="recipe-text"
              value={recipeText}
              onChange={e => setRecipeText(e.target.value)}
              placeholder="Paste your recipe here or describe the problem you're experiencing..."
              className="w-full p-4 border border-input rounded-lg h-32 resize-none focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
            />
            <Button 
              onClick={handleAnalyze}
              disabled={!recipeText.trim()}
              className="mt-3 bg-yellow-500 hover:bg-yellow-600 text-black font-medium focus:ring-2 focus:ring-yellow-400"
            >
              Analyze Recipe
            </Button>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-primary mb-2">
              Bread Troubleshooting
            </h1>
            <p className="text-muted-foreground">
              Analyze your bread issues and get expert solutions
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Left Panel - Scan History */}
            <div className="w-full lg:w-1/4">
              {/* Mobile Accordion */}
              <div className="lg:hidden">
                <Accordion type="single" collapsible>
                  <AccordionItem value="history">
                    <AccordionTrigger className="text-lg font-semibold">
                      Scan History ({history.length})
                    </AccordionTrigger>
                    <AccordionContent>
                      {history.length === 0 ? (
                        <p className="text-sm text-muted-foreground py-4">No scans yet</p>
                      ) : (
                        <div className="space-y-3 py-2">
                          {history.map((entry, index) => (
                            <Card key={index} className="bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                              <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                  <div 
                                    onClick={() => handleHistoryClick(entry)}
                                    className="flex-1 cursor-pointer"
                                  >
                                    <div className="text-sm font-medium">
                                      {format(new Date(entry.timestamp), 'MMM d, yyyy')}
                                    </div>
                                    <div className="flex flex-wrap gap-1 mt-2">
                                      {entry.symptomIds.slice(0, 3).map(id => {
                                        const symptom = symptoms.find(s => s.id === id);
                                        return symptom ? (
                                          <Badge key={id} variant="secondary" className="text-xs">
                                            {symptom.category}
                                          </Badge>
                                        ) : null;
                                      })}
                                      {entry.symptomIds.length > 3 && (
                                        <Badge variant="outline" className="text-xs">
                                          +{entry.symptomIds.length - 3}
                                        </Badge>
                                      )}
                                    </div>
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleRerunScan(entry)}
                                    className="ml-2 hover:bg-yellow-500/20 focus:ring-2 focus:ring-yellow-400"
                                  >
                                    <RotateCcw className="h-4 w-4" />
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>

              {/* Desktop Sidebar */}
              <div className="hidden lg:block">
                <Card className="bg-gray-50 dark:bg-gray-800">
                  <CardHeader>
                    <CardTitle className="text-lg">Scan History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {history.length === 0 ? (
                      <p className="text-sm text-muted-foreground">No scans yet</p>
                    ) : (
                      <div className="space-y-3">
                        {history.map((entry, index) => (
                          <Card key={index} className="bg-background hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between">
                                <div 
                                  onClick={() => handleHistoryClick(entry)}
                                  className="flex-1 cursor-pointer"
                                >
                                  <div className="text-sm font-medium">
                                    {format(new Date(entry.timestamp), 'MMM d, yyyy')}
                                  </div>
                                  <div className="flex flex-wrap gap-1 mt-2">
                                    {entry.symptomIds.slice(0, 2).map(id => {
                                      const symptom = symptoms.find(s => s.id === id);
                                      return symptom ? (
                                        <Badge key={id} variant="secondary" className="text-xs">
                                          {symptom.category}
                                        </Badge>
                                      ) : null;
                                    })}
                                    {entry.symptomIds.length > 2 && (
                                      <Badge variant="outline" className="text-xs">
                                        +{entry.symptomIds.length - 2}
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleRerunScan(entry)}
                                  className="ml-2 hover:bg-yellow-500/20 focus:ring-2 focus:ring-yellow-400"
                                >
                                  <RotateCcw className="h-4 w-4" />
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Right Panel */}
            <div className="w-full lg:w-3/4" ref={resultsRef}>
              {/* Proofing Problems Visual Guide */}
              <div className="mb-8">
                <Accordion type="single" collapsible>
                  <AccordionItem value="proofing" className="border border-yellow-500/30 rounded-lg bg-yellow-50/50 dark:bg-yellow-900/10">
                    <AccordionTrigger className="px-6 py-4 text-lg font-semibold hover:bg-yellow-100/50 dark:hover:bg-yellow-900/20">
                      🕒 Proofing Problems - Visual Diagnosis Guide
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-6">
                      <p className="text-muted-foreground mb-6 text-sm">
                        Wondering if your dough is proofed just right? Compare your crumb to these real loaves.
                      </p>
                      
                      <div className="space-y-8" data-section="real-photo-crumb-diagnosis">
                        {/* Underproofed Section */}
                        <div>
                          <h4 className="text-lg font-semibold text-red-600 dark:text-red-400 mb-4">UNDERPROOFED</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <Card className="bg-background hover:shadow-lg transition-shadow cursor-pointer" onClick={() => window.open('/lovable-uploads/0ba59526-59a0-4dc4-ac14-27d171d6425e.png', '_blank')}>
                              <CardContent className="p-4">
                                <img 
                                  src="/lovable-uploads/0ba59526-59a0-4dc4-ac14-27d171d6425e.png" 
                                  alt="Slightly Underproofed bread crumb"
                                  className="w-full h-32 object-cover rounded-lg mb-3"
                                />
                                <h5 className="font-semibold text-sm mb-2">Slightly Underproofed</h5>
                                <p className="text-xs text-muted-foreground mb-2">Dense crumb with smaller holes, dough didn't fully develop.</p>
                                <p className="text-xs text-blue-600 dark:text-blue-400">Fix: Allow longer bulk fermentation or final proof.</p>
                              </CardContent>
                            </Card>
                            
                            <Card className="bg-background hover:shadow-lg transition-shadow cursor-pointer" onClick={() => window.open('/lovable-uploads/9b10f418-f94f-420b-8126-409a16a4eace.png', '_blank')}>
                              <CardContent className="p-4">
                                <img 
                                  src="/lovable-uploads/9b10f418-f94f-420b-8126-409a16a4eace.png" 
                                  alt="Significantly Underproofed bread crumb"
                                  className="w-full h-32 object-cover rounded-lg mb-3"
                                />
                                <h5 className="font-semibold text-sm mb-2">Significantly Underproofed</h5>
                                <p className="text-xs text-muted-foreground mb-2">Very dense, gummy crumb with large irregular holes.</p>
                                <p className="text-xs text-blue-600 dark:text-blue-400">Fix: Extend fermentation time and check dough temperature.</p>
                              </CardContent>
                            </Card>
                          </div>
                        </div>

                        {/* Well-Proofed Section */}
                        <div>
                          <h4 className="text-lg font-semibold text-green-600 dark:text-green-400 mb-4">WELL-PROOFED</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <Card className="bg-background hover:shadow-lg transition-shadow cursor-pointer" onClick={() => window.open('/lovable-uploads/71542cc4-5cca-4b79-9b32-f7550884b84e.png', '_blank')}>
                              <CardContent className="p-4">
                                <img 
                                  src="/lovable-uploads/71542cc4-5cca-4b79-9b32-f7550884b84e.png" 
                                  alt="Nicely Proofed bread crumb"
                                  className="w-full h-32 object-cover rounded-lg mb-3"
                                />
                                <h5 className="font-semibold text-sm mb-2">Nicely Proofed</h5>
                                <p className="text-xs text-muted-foreground mb-2">Even, open crumb structure with good hole distribution.</p>
                                <p className="text-xs text-green-600 dark:text-green-400">Perfect! This is your target crumb structure.</p>
                              </CardContent>
                            </Card>
                          </div>
                        </div>

                        {/* Overproofed Section */}
                        <div>
                          <h4 className="text-lg font-semibold text-orange-600 dark:text-orange-400 mb-4">OVERPROOFED</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <Card className="bg-background hover:shadow-lg transition-shadow cursor-pointer" onClick={() => window.open('/lovable-uploads/a439508d-31d4-4791-997e-3fd30946ca10.png', '_blank')}>
                              <CardContent className="p-4">
                                <img 
                                  src="/lovable-uploads/a439508d-31d4-4791-997e-3fd30946ca10.png" 
                                  alt="Slightly Overproofed bread crumb"
                                  className="w-full h-32 object-cover rounded-lg mb-3"
                                />
                                <h5 className="font-semibold text-sm mb-2">Slightly Overproofed</h5>
                                <p className="text-xs text-muted-foreground mb-2">Larger holes, structure still intact but losing some strength.</p>
                                <p className="text-xs text-orange-600 dark:text-orange-400">Fix: Reduce proofing time or lower temperature next time.</p>
                              </CardContent>
                            </Card>
                            
                            <Card className="bg-background hover:shadow-lg transition-shadow cursor-pointer" onClick={() => window.open('/lovable-uploads/e40cd78a-5af5-4ba1-9c1f-28b66e1d2495.png', '_blank')}>
                              <CardContent className="p-4">
                                <img 
                                  src="/lovable-uploads/e40cd78a-5af5-4ba1-9c1f-28b66e1d2495.png" 
                                  alt="Significantly Overproofed bread crumb"
                                  className="w-full h-32 object-cover rounded-lg mb-3"
                                />
                                <h5 className="font-semibold text-sm mb-2">Significantly Overproofed</h5>
                                <p className="text-xs text-muted-foreground mb-2">Flat, dense crumb with loss of structure and shape.</p>
                                <p className="text-xs text-orange-600 dark:text-orange-400">Fix: Watch timing more carefully and test with poke test.</p>
                              </CardContent>
                            </Card>
                          </div>
                        </div>

                        {/* Comparison Grid */}
                        <div className="mt-8 p-4 bg-muted/30 rounded-lg">
                          <h4 className="text-lg font-semibold mb-4">Quick Reference Comparison</h4>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <img 
                              src="/lovable-uploads/6576db00-103a-4cb4-93b3-2613f56d9e47.png" 
                              alt="Bread crumb comparison grid"
                              className="w-full rounded-lg cursor-pointer hover:shadow-lg transition-shadow"
                              onClick={() => window.open('/lovable-uploads/6576db00-103a-4cb4-93b3-2613f56d9e47.png', '_blank')}
                            />
                            <img 
                              src="/lovable-uploads/2f9d94ed-1d8a-4e00-9ae0-45dfec7907ae.png" 
                              alt="Proofing stages comparison"
                              className="w-full rounded-lg cursor-pointer hover:shadow-lg transition-shadow"
                              onClick={() => window.open('/lovable-uploads/2f9d94ed-1d8a-4e00-9ae0-45dfec7907ae.png', '_blank')}
                            />
                          </div>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>

              {/* View Toggle */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium">View:</span>
                  <div className="flex items-center gap-2">
                    <Grid3X3 className="h-4 w-4" />
                    <Switch
                      checked={viewMode === 'table'}
                      onCheckedChange={(checked) => setViewMode(checked ? 'table' : 'grid')}
                      className="focus:ring-2 focus:ring-yellow-400"
                    />
                    <Table className="h-4 w-4" />
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {viewMode === 'table' ? 'Table View' : 'Grid View'}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div>
                {results === null ? (
                  viewMode === 'table' ? (
                    <TroubleshootingTable />
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                      {symptoms.map(symptom => (
                        <Card key={symptom.id} className="bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 cursor-pointer py-4">
                          <CardHeader className="pb-3">
                            <CardTitle className="text-lg font-bold text-primary">
                              {symptom.id.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </CardTitle>
                            <div className="flex flex-wrap gap-1">
                              <Badge variant="secondary" className="capitalize">
                                {symptom.category}
                              </Badge>
                              {symptom.labels.slice(0, 2).map((label) => (
                                <Tooltip key={label}>
                                  <TooltipTrigger asChild>
                                    <Badge variant="outline" className="text-xs hover:bg-yellow-500/20">
                                      {label}
                                    </Badge>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p className="max-w-xs">{symptom.quickFix}</p>
                                  </TooltipContent>
                                </Tooltip>
                              ))}
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="hidden md:block">
                              <p className="text-sm text-muted-foreground mb-3">
                                {symptom.quickFix}
                              </p>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => toggleCardExpansion(symptom.id)}
                                className="w-full hover:bg-yellow-500/20 focus:ring-2 focus:ring-yellow-400"
                              >
                                {expandedCards.has(symptom.id) ? (
                                  <>
                                    <ChevronDown className="h-4 w-4 mr-2" />
                                    Hide Details
                                  </>
                                ) : (
                                  <>
                                    <ChevronRight className="h-4 w-4 mr-2" />
                                    View Details
                                  </>
                                )}
                              </Button>
                              {expandedCards.has(symptom.id) && (
                                <div className="mt-4 p-4 bg-background rounded-lg border animate-accordion-down">
                                  <TroubleshootingCard symptom={symptom} />
                                </div>
                              )}
                            </div>
                            <div className="md:hidden">
                              <TroubleshootingCard symptom={symptom} />
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )
                ) : results.length === 0 ? (
                  <EmptyState />
                ) : (
                  <div className="space-y-8">
                    {results.map(id => {
                      const symptom = symptoms.find(s => s.id === id);
                      return symptom ? (
                        <div key={id} className="ring-2 ring-yellow-500 rounded-lg p-4 bg-yellow-50 dark:bg-yellow-900/20 animate-fade-in">
                          <TroubleshootingCard symptom={symptom} />
                          <div className="mt-4">
                            <CommunityBridge symptomId={id} />
                          </div>
                        </div>
                      ) : null;
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    </TooltipProvider>
  );
}