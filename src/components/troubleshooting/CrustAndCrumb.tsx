import React, { useState, useEffect, useMemo } from 'react';
import CategoryFilter from './CategoryFilter';
import SymptomCard from './SymptomCard';
import DiagnosePanel from './DiagnosePanel';
import symptomsData from '@/data/symptoms.json';
import { useIsMobile } from '@/hooks/use-mobile';

interface Symptom {
  id: string;
  labels: string[];
  category: string;
  breadType?: string[];
  stage?: string;
  tags?: string[];
  quickFix: string;
  deepDive: string;
  images?: {
    before?: string;
    after?: string;
  };
}

const CrustAndCrumb: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [openCards, setOpenCards] = useState<Set<string>>(new Set());
  const isMobile = useIsMobile();

  const symptoms: Symptom[] = symptomsData.symptoms;

  // Extract unique categories
  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(symptoms.map(symptom => symptom.category))];
    return uniqueCategories.sort();
  }, [symptoms]);

  // Filter symptoms by active category
  const filteredSymptoms = useMemo(() => {
    if (activeCategory === 'all') {
      return symptoms;
    }
    return symptoms.filter(symptom => symptom.category === activeCategory);
  }, [symptoms, activeCategory]);

  // Group symptoms by category for display
  const groupedSymptoms = useMemo(() => {
    const groups: { [key: string]: Symptom[] } = {};
    filteredSymptoms.forEach(symptom => {
      if (!groups[symptom.category]) {
        groups[symptom.category] = [];
      }
      groups[symptom.category].push(symptom);
    });
    return groups;
  }, [filteredSymptoms]);

  const handleCardToggle = (symptomId: string) => {
    setOpenCards(prev => {
      const newSet = new Set(prev);
      
      if (isMobile) {
        // On mobile, only one card open at a time
        newSet.clear();
        if (!prev.has(symptomId)) {
          newSet.add(symptomId);
        }
      } else {
        // On desktop, allow multiple cards open
        if (newSet.has(symptomId)) {
          newSet.delete(symptomId);
        } else {
          newSet.add(symptomId);
        }
      }
      
      return newSet;
    });
  };

  // Clear open cards when category changes
  useEffect(() => {
    setOpenCards(new Set());
  }, [activeCategory]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 to-amber-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-100 to-stone-100 border-b border-stone-200">
        <div className="container mx-auto px-4 py-8 text-center">
          <div className="mb-4">
            <img 
              src="/lovable-uploads/3850aa1b-5d06-48a3-91c7-d9405d23ea7a.png"
              alt="Crust & Crumb Logo"
              className="w-24 h-24 mx-auto mb-4 rounded-full shadow-lg"
            />
          </div>
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-stone-800 mb-2">
            Crust & Crumb
          </h1>
          <p className="text-lg text-stone-600 font-medium">
            Bread Troubleshooting Assistant
          </p>
          <p className="text-sm text-stone-500 mt-2 max-w-2xl mx-auto">
            Diagnose and solve your bread baking challenges with expert guidance and proven solutions
          </p>
        </div>
      </div>

      {/* Category Filter */}
      <CategoryFilter 
        categories={categories}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        {/* Diagnostic Panel */}
        <DiagnosePanel symptoms={symptoms} />
        
        {activeCategory === 'all' ? (
          // Show grouped by category
          <div className="space-y-8">
            {Object.entries(groupedSymptoms).map(([category, categorySymptoms]) => (
              <div key={category}>
                <h2 className="text-2xl font-serif font-bold text-stone-800 mb-4 border-b border-stone-300 pb-2">
                  {category} Issues
                </h2>
                <div className="grid gap-4">
                  {categorySymptoms.map((symptom) => (
                    <SymptomCard
                      key={symptom.id}
                      symptom={symptom}
                      isOpen={openCards.has(symptom.id)}
                      onToggle={handleCardToggle}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Show filtered category
          <div>
            <h2 className="text-2xl font-serif font-bold text-stone-800 mb-6">
              {activeCategory} Issues ({filteredSymptoms.length})
            </h2>
            <div className="grid gap-4">
              {filteredSymptoms.map((symptom) => (
                <SymptomCard
                  key={symptom.id}
                  symptom={symptom}
                  isOpen={openCards.has(symptom.id)}
                  onToggle={handleCardToggle}
                />
              ))}
            </div>
          </div>
        )}

        {filteredSymptoms.length === 0 && (
          <div className="text-center py-12">
            <div className="text-stone-500 text-lg">
              No issues found in the {activeCategory} category.
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="bg-stone-100 border-t border-stone-200 mt-12">
        <div className="container mx-auto px-4 py-6 text-center text-stone-600 text-sm">
          <p>Part of the Crust & Crumb toolset for better bread baking</p>
        </div>
      </div>
    </div>
  );
};

export default CrustAndCrumb;