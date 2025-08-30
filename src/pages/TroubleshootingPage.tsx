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
import { Helmet } from 'react-helmet-async';

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
    <>
      <Helmet>
        <title>Troubleshooting | Baking Great Bread at Home</title>
        <meta name="description" content="Professional bread troubleshooting tool with step-by-step diagnosis. Solve sourdough, yeasted, and quick bread problems with expert guidance and visual examples." />
        <meta name="keywords" content="bread troubleshooting, sourdough problems, bread baking help, crust and crumb, bread diagnosis" />
        <link rel="canonical" href="https://bread-baking-hub.vercel.app/troubleshooting" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Troubleshooting | Baking Great Bread at Home" />
        <meta property="og:description" content="Professional bread troubleshooting tool with step-by-step diagnosis. Solve sourdough, yeasted, and quick bread problems with expert guidance and visual examples." />
        <meta property="og:url" content="https://bread-baking-hub.vercel.app/troubleshooting" />
        <meta property="og:image" content="https://ojyckskucneljvuqzrsw.supabase.co/storage/v1/object/public/blog-images/2025-08/troubleshooting-solve-your-bread-baking-challenges-and-problems/troubleshooting.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Troubleshooting bread baking problems - diagnostic tools and solutions" />
        <meta property="og:site_name" content="Baking Great Bread at Home" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Troubleshooting | Baking Great Bread at Home" />
        <meta name="twitter:description" content="Professional bread troubleshooting tool with step-by-step diagnosis. Solve bread problems with expert guidance." />
        <meta name="twitter:image" content="https://ojyckskucneljvuqzrsw.supabase.co/storage/v1/object/public/blog-images/2025-08/troubleshooting-solve-your-bread-baking-challenges-and-problems/troubleshooting.png" />
        <meta name="twitter:image:alt" content="Troubleshooting bread baking problems - diagnostic tools and solutions" />
      </Helmet>
      
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
    </>
  );
}