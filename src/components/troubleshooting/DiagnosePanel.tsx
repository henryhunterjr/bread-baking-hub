import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, Stethoscope } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import SymptomSelector from './SymptomSelector';
import DiagnosisResult from './DiagnosisResult';
import type { DiagnosePanelProps, Symptom } from '@/types/crustAndCrumb';
import { CRUST_AND_CRUMB_CONSTANTS } from '@/utils/crustAndCrumbUtils';

const DiagnosePanel: React.FC<DiagnosePanelProps> = ({ symptoms }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedBreadType, setSelectedBreadType] = useState<string>('');
  const [selectedStage, setSelectedStage] = useState<string>('');
  const [selectedSymptom, setSelectedSymptom] = useState<string>('');
  const [diagnosisResult, setDiagnosisResult] = useState<Symptom | null>(null);

  const handleDiagnose = () => {
    if (selectedSymptom) {
      const result = symptoms.find(s => s.id === selectedSymptom);
      if (result) {
        setDiagnosisResult(result);
        console.log('Diagnosis completed for symptom:', selectedSymptom);
      } else {
        console.warn('Selected symptom not found:', selectedSymptom);
      }
    }
  };

  const handleReset = () => {
    setSelectedBreadType('');
    setSelectedStage('');
    setSelectedSymptom('');
    setDiagnosisResult(null);
    console.log('Diagnosis reset');
  };

  return (
    <Card className="bg-gradient-to-r from-amber-50 to-stone-50 border-amber-200 shadow-md mb-6 sticky top-20 z-10">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-amber-100/50 transition-colors touch-manipulation">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Stethoscope className="h-6 w-6 text-amber-600" />
                <CardTitle className="text-xl font-serif text-stone-800">
                  🧩 Diagnose My Bread
                </CardTitle>
              </div>
              <motion.div
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown className="h-5 w-5 text-stone-600" />
              </motion.div>
            </div>
            <p className="text-sm text-stone-600 mt-1">
              Step-by-step diagnosis to find your exact solution
            </p>
          </CardHeader>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <CardContent className="space-y-6 safe-area-inset-x">
              {!diagnosisResult ? (
                <>
                  <SymptomSelector
                    breadTypes={CRUST_AND_CRUMB_CONSTANTS.BREAD_TYPES}
                    stages={CRUST_AND_CRUMB_CONSTANTS.STAGES}
                    symptoms={symptoms}
                    selectedBreadType={selectedBreadType}
                    selectedStage={selectedStage}
                    selectedSymptom={selectedSymptom}
                    onBreadTypeChange={setSelectedBreadType}
                    onStageChange={setSelectedStage}
                    onSymptomChange={setSelectedSymptom}
                  />
                  
                  <div className="flex gap-3">
                    <Button 
                      onClick={handleDiagnose}
                      disabled={!selectedSymptom}
                      className="bg-amber-600 hover:bg-amber-700 text-white min-h-[44px] touch-manipulation"
                    >
                      Get Diagnosis
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={handleReset}
                      className="border-stone-300 min-h-[44px] touch-manipulation"
                    >
                      Reset
                    </Button>
                  </div>
                </>
              ) : (
                <DiagnosisResult 
                  symptom={diagnosisResult}
                  onReset={handleReset}
                />
              )}
            </CardContent>
          </motion.div>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};

export default DiagnosePanel;