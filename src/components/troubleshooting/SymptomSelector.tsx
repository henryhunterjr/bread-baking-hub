import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import type { SymptomSelectorProps } from '@/types/crustAndCrumb';
import { filterSymptomsByDiagnosis, formatSymptomTitle } from '@/utils/crustAndCrumbUtils';

const SymptomSelector: React.FC<SymptomSelectorProps> = ({
  breadTypes,
  stages,
  symptoms,
  selectedBreadType,
  selectedStage,
  selectedSymptom,
  onBreadTypeChange,
  onStageChange,
  onSymptomChange,
}) => {
  const filteredSymptoms = filterSymptomsByDiagnosis(symptoms, selectedBreadType, selectedStage);

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <div className="space-y-2">
        <Label htmlFor="bread-type" className="text-stone-700 font-medium">
          1. Bread Type
        </Label>
        <Select value={selectedBreadType} onValueChange={onBreadTypeChange}>
          <SelectTrigger className="bg-white border-stone-300 min-h-[44px] touch-manipulation">
            <SelectValue placeholder="Select bread type" />
          </SelectTrigger>
          <SelectContent className="bg-white border-stone-300 z-50">
            {breadTypes.map((type) => (
              <SelectItem key={type} value={type} className="capitalize touch-manipulation min-h-[44px]">
                {type.replace('-', ' ')}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="stage" className="text-stone-700 font-medium">
          2. Problem Stage
        </Label>
        <Select value={selectedStage} onValueChange={onStageChange}>
          <SelectTrigger className="bg-white border-stone-300 min-h-[44px] touch-manipulation">
            <SelectValue placeholder="When did it happen?" />
          </SelectTrigger>
          <SelectContent className="bg-white border-stone-300 z-50">
            {stages.map((stage) => (
              <SelectItem key={stage} value={stage} className="capitalize touch-manipulation min-h-[44px]">
                {stage.replace('-', ' ')}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="symptom" className="text-stone-700 font-medium">
          3. What You See
        </Label>
        <Select value={selectedSymptom} onValueChange={onSymptomChange}>
          <SelectTrigger className="bg-white border-stone-300 min-h-[44px] touch-manipulation">
            <SelectValue placeholder="Describe the issue" />
          </SelectTrigger>
          <SelectContent className="bg-white border-stone-300 z-50">
            {filteredSymptoms.map((symptom) => (
              <SelectItem key={symptom.id} value={symptom.id} className="touch-manipulation min-h-[44px]">
                {formatSymptomTitle(symptom)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default SymptomSelector;