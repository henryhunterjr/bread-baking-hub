import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '@/store/useStore';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import RecipeAnalysisSection from '@/components/troubleshooting/RecipeAnalysisSection';
import ScanHistorySection from '@/components/troubleshooting/ScanHistorySection';
import TroubleshootingVisualGuide from '@/components/troubleshooting/TroubleshootingVisualGuide';
import TroubleshootingContent from '@/components/troubleshooting/TroubleshootingContent';
import { Hero } from '@/components/ui/Hero';
import { useToast } from '@/hooks/use-toast';
import { detectSymptoms } from '@/utils/SymptomMatcher';
import symptomsData from '@/data/symptoms.json';
import { format } from 'date-fns';
import { Suspense, lazy } from 'react';

const LazyAIAssistantSidebar = lazy(() => import('@/components/AIAssistantSidebar').then(m => ({ default: m.AIAssistantSidebar })));

export default function TroubleshootingPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
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
    <div className="bg-background text-foreground min-h-screen">
      <Header />
      <Hero 
        imageSrc="/lovable-uploads/929d8961-290b-4bf6-a6a1-16fee8b2a307.png"
        imageAlt="Troubleshooting - Bread baking tools and ingredients on wooden surface"
        title="Troubleshooting"
        subtitle="Solve your bread baking challenges"
        variant="overlay"
        textPosition="center"
        priority
      />
      
      <main className="container mx-auto px-4 py-8">
        <RecipeAnalysisSection 
          recipeText={recipeText}
          setRecipeText={setRecipeText}
          onAnalyze={handleAnalyze}
        />

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">
            Bread Troubleshooting
          </h1>
          <p className="text-muted-foreground">
            Analyze your bread issues and get expert solutions
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          <ScanHistorySection 
            history={history}
            symptoms={symptoms}
            onHistoryClick={handleHistoryClick}
            onRerunScan={handleRerunScan}
          />

          {/* Right Panel */}
          <div className="w-full lg:w-3/4" ref={resultsRef}>
            <TroubleshootingVisualGuide />
            
            <TroubleshootingContent 
              viewMode={viewMode}
              setViewMode={setViewMode}
              results={results}
              symptoms={symptoms}
              expandedCards={expandedCards}
              toggleCardExpansion={toggleCardExpansion}
            />
          </div>
        </div>
      </main>
      
      <Footer />
      
      <Suspense fallback={null}>
        <LazyAIAssistantSidebar
          isOpen={isSidebarOpen}
          onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        />
      </Suspense>
    </div>
  );
}