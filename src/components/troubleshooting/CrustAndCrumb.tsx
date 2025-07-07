import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import CategoryFilter from './CategoryFilter';
import SymptomCard from './SymptomCard';
import DiagnosePanel from './DiagnosePanel';
import LoadingSkeleton from './LoadingSkeleton';
import ErrorBoundary from './ErrorBoundary';
import CrustAndCrumbSEO from './CrustAndCrumbSEO';
import symptomsData from '@/data/symptoms.json';
import { useIsMobile } from '@/hooks/use-mobile';
import type { Symptom } from '@/types/crustAndCrumb';
import { 
  processSymptoms, 
  getUniqueCategories, 
  groupSymptomsByCategory, 
  CRUST_AND_CRUMB_CONSTANTS 
} from '@/utils/crustAndCrumbUtils';

const CrustAndCrumb: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [openCards, setOpenCards] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [symptoms, setSymptoms] = useState<Symptom[]>([]);
  const isMobile = useIsMobile();

  // Process and validate symptoms data
  useEffect(() => {
    try {
      const processedSymptoms = processSymptoms(symptomsData.symptoms);
      setSymptoms(processedSymptoms);
      
      if (processedSymptoms.length === 0) {
        console.warn('No valid symptoms found in data');
      }
      
      setIsLoading(false);
    } catch (error) {
      console.error('Error processing symptoms:', error);
      setIsLoading(false);
    }
  }, []);

  // Extract unique categories
  const categories = useMemo(() => getUniqueCategories(symptoms), [symptoms]);

  // Filter symptoms by active category
  const filteredSymptoms = useMemo(() => {
    if (activeCategory === 'all') {
      return symptoms;
    }
    return symptoms.filter(symptom => symptom.category === activeCategory);
  }, [symptoms, activeCategory]);

  // Group symptoms by category for display
  const groupedSymptoms = useMemo(() => groupSymptomsByCategory(filteredSymptoms), [filteredSymptoms]);

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

  // TODO: Future features to implement
  // - Photo upload for AI diagnosis
  // - User bookmarks/favorites in localStorage
  // - Search functionality across symptoms
  // - User-submitted questions/tips
  // - Integration with bread calculator
  // - Export diagnosis results as PDF

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-stone-50 to-amber-50">
        <CrustAndCrumbSEO />
        <div className="container mx-auto px-4 py-8">
          <LoadingSkeleton />
        </div>
      </div>
    );
  }

  if (symptoms.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-stone-50 to-amber-50 flex items-center justify-center">
        <CrustAndCrumbSEO />
        <div className="text-center p-8">
          <h2 className="text-2xl font-serif text-stone-800 mb-4">No Troubleshooting Data Available</h2>
          <p className="text-stone-600">
            We're sorry, but the troubleshooting database is currently unavailable. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-white via-panthers-blue-50 to-platinum-100">
        <CrustAndCrumbSEO />
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-r from-panthers-blue-900 to-platinum-900 border-b border-panthers-blue-700 shadow-electric"
        >
          <div className="container mx-auto px-4 py-8">
            {/* Navigation */}
            <div className="flex items-center justify-between mb-6">
              <Link to="/">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-panthers-blue-100 hover:text-white hover:bg-panthers-blue-800 transition-colors"
                >
                  ← Back to Home
                </Button>
              </Link>
              <div className="text-xs text-panthers-blue-200">
                Version {CRUST_AND_CRUMB_CONSTANTS.VERSION}
              </div>
            </div>

            {/* Title Section */}
            <div className="text-center">
              <div className="mb-4">
                <motion.img 
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  src="/lovable-uploads/3850aa1b-5d06-48a3-91c7-d9405d23ea7a.png"
                  alt="Crust & Crumb Logo"
                  className="w-24 h-24 mx-auto mb-4 rounded-full shadow-electric border-2 border-panthers-blue-400"
                />
              </div>
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="text-3xl md:text-4xl font-serif font-bold text-white mb-2"
              >
                Crust & Crumb
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="text-lg text-panthers-blue-100 font-medium"
              >
                Professional Bread Troubleshooting
              </motion.p>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="text-sm text-panthers-blue-200 mt-2 max-w-2xl mx-auto safe-area-inset-x"
              >
                Elite diagnostic solutions for the discerning baker
              </motion.p>
            </div>
          </div>
        </motion.div>

        {/* Category Filter */}
        <CategoryFilter 
          categories={categories}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />

        {/* Main Content */}
        <div className="container mx-auto px-4 py-6 safe-area-inset-x">
          {/* Diagnostic Panel */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <DiagnosePanel symptoms={symptoms} />
          </motion.div>
          
          <AnimatePresence mode="wait">
            {activeCategory === 'all' ? (
              // Show grouped by category
              <motion.div 
                key="all-categories"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="space-y-8"
              >
                {Object.entries(groupedSymptoms).map(([category, categorySymptoms]) => (
                  <div key={category}>
                    <h2 className="text-2xl font-serif font-bold text-panthers-blue-900 mb-4 border-b border-panthers-blue-300 pb-2">
                      {category} Issues ({categorySymptoms.length})
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
              </motion.div>
            ) : (
              // Show filtered category
              <motion.div
                key={`category-${activeCategory}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-2xl font-serif font-bold text-panthers-blue-900 mb-6">
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
              </motion.div>
            )}
          </AnimatePresence>

          {filteredSymptoms.length === 0 && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="text-center py-12"
            >
              <div className="text-stone-500 text-lg">
                No issues found in the {activeCategory} category.
              </div>
            </motion.div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gradient-to-r from-panthers-blue-900 to-platinum-800 border-t border-panthers-blue-600 mt-12 safe-area-inset-x">
          <div className="container mx-auto px-4 py-6 text-center text-panthers-blue-100 text-sm">
            <p>Elite Bread Troubleshooting • Crust & Crumb Professional</p>
            <p className="mt-1 text-xs text-panthers-blue-200">
              Version {CRUST_AND_CRUMB_CONSTANTS.VERSION} • Premium Diagnostic Solutions
            </p>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default CrustAndCrumb;