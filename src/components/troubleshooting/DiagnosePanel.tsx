import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, Stethoscope } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SymptomSelector from './SymptomSelector';
import DiagnosisResult from './DiagnosisResult';

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

interface DiagnosePanelProps {
  symptoms: Symptom[];
}

const DiagnosePanel: React.FC<DiagnosePanelProps> = ({ symptoms }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedBreadType, setSelectedBreadType] = useState<string>('');
  const [selectedStage, setSelectedStage] = useState<string>('');
  const [selectedSymptom, setSelectedSymptom] = useState<string>('');
  const [diagnosisResult, setDiagnosisResult] = useState<Symptom | null>(null);

  const breadTypes = ['sourdough', 'yeasted', 'quick', 'enriched'];
  const stages = ['mixing', 'bulk-ferment', 'proofing', 'baking', 'post-bake'];

  const handleDiagnose = () => {
    if (selectedSymptom) {
      const result = symptoms.find(s => s.id === selectedSymptom);
      setDiagnosisResult(result || null);
    }
  };

  const handleReset = () => {
    setSelectedBreadType('');
    setSelectedStage('');
    setSelectedSymptom('');
    setDiagnosisResult(null);
  };

  return (
    <Card className="bg-gradient-to-r from-amber-50 to-stone-50 border-amber-200 shadow-md mb-6">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-amber-100/50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Stethoscope className="h-6 w-6 text-amber-600" />
                <CardTitle className="text-xl font-serif text-stone-800">
                  🧩 Diagnose My Bread
                </CardTitle>
              </div>
              <ChevronDown 
                className={`h-5 w-5 text-stone-600 transition-transform duration-200 ${
                  isOpen ? 'rotate-180' : ''
                }`} 
              />
            </div>
            <p className="text-sm text-stone-600 mt-1">
              Step-by-step diagnosis to find your exact solution
            </p>
          </CardHeader>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <CardContent className="space-y-6">
            {!diagnosisResult ? (
              <>
                <SymptomSelector
                  breadTypes={breadTypes}
                  stages={stages}
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
                    className="bg-amber-600 hover:bg-amber-700 text-white"
                  >
                    Get Diagnosis
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={handleReset}
                    className="border-stone-300"
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
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};

export default DiagnosePanel;