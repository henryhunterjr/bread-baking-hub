import React, { useState, useEffect } from 'react';
import { useStore } from '@/store/useStore';
import TroubleshootingTable from '@/components/TroubleshootingTable';
import TroubleshootingCard from '@/components/TroubleshootingCard';
import CommunityBridge from '@/components/CommunityBridge';
import EmptyState from '@/components/EmptyState';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { detectSymptoms } from '@/utils/SymptomMatcher';
import symptomsData from '@/data/symptoms.json';
import { format } from 'date-fns';

export default function TroubleshootingPage() {
  const [recipeText, setRecipeText] = useState<string>("");
  const [results, setResults] = useState<string[] | null>(null);
  
  const { symptoms, filters, history, loadSymptoms, recordScan } = useStore();

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
  }

  function handleHistoryClick(historyEntry: any) {
    setResults(historyEntry.symptomIds);
  }

  return (
    <div className="bg-background text-foreground min-h-screen">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
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
            <div className="p-4 border border-border rounded-lg bg-card">
              <h2 className="text-lg font-semibold mb-4">Scan History</h2>
              
              {history.length === 0 ? (
                <p className="text-sm text-muted-foreground">No scans yet</p>
              ) : (
                <div className="space-y-2">
                  {history.map((entry, index) => (
                    <div
                      key={index}
                      onClick={() => handleHistoryClick(entry)}
                      className="p-3 border border-border rounded cursor-pointer hover:bg-muted/50 transition-colors"
                    >
                      <div className="text-sm font-medium">
                        {format(new Date(entry.timestamp), 'MMM d, yyyy')}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {entry.symptomIds.length} issues found
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Panel */}
          <div className="w-full lg:w-3/4">
            <div className="p-4">
              {/* Recipe Input */}
              <div className="mb-6">
                <label htmlFor="recipe-text" className="block text-sm font-medium mb-2">
                  Recipe or Problem Description
                </label>
                <textarea
                  id="recipe-text"
                  value={recipeText}
                  onChange={e => setRecipeText(e.target.value)}
                  placeholder="Paste your recipe here or describe the problem you're experiencing..."
                  className="w-full p-3 border border-input rounded-md h-24 resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button 
                  onClick={handleAnalyze}
                  disabled={!recipeText.trim()}
                  className="mt-2 px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Analyze
                </button>
              </div>

              {/* Content */}
              <div>
                {results === null ? (
                  <TroubleshootingTable />
                ) : results.length === 0 ? (
                  <EmptyState />
                ) : (
                  <div className="space-y-8">
                    {results.map(id => {
                      const symptom = symptoms.find(s => s.id === id);
                      return symptom ? (
                        <div key={id} className="mb-8">
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
        </div>
      </main>
      
      <Footer />
    </div>
  );
}