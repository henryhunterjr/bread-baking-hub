export interface Symptom {
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

export interface DiagnosisState {
  breadType: string;
  stage: string;
  symptom: string;
  result: Symptom | null;
}

export interface CrustAndCrumbProps {
  className?: string;
}

export interface CategoryFilterProps {
  categories: string[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

export interface SymptomCardProps {
  symptom: Symptom;
  isOpen: boolean;
  onToggle: (id: string) => void;
}

export interface DiagnosePanelProps {
  symptoms: Symptom[];
}

export interface PhotoDiagnosisProps {
  symptoms: Symptom[];
}

export interface SymptomSelectorProps {
  breadTypes: readonly string[];
  stages: readonly string[];
  symptoms: Symptom[];
  selectedBreadType: string;
  selectedStage: string;
  selectedSymptom: string;
  onBreadTypeChange: (value: string) => void;
  onStageChange: (value: string) => void;
  onSymptomChange: (value: string) => void;
}

export interface DiagnosisResultProps {
  symptom: Symptom;
  onReset: () => void;
}

// Error boundary types
export interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error?: Error }>;
}