import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, ChefHat, Edit, Save } from 'lucide-react';
import { WorkspaceStep } from '@/types/recipe-workspace';

interface WorkflowProgressProps {
  currentStep: WorkspaceStep;
  onStepClick?: (step: WorkspaceStep) => void;
}

const getStepIcon = (step: WorkspaceStep) => {
  switch (step) {
    case 'upload': return <Upload className="h-5 w-5" />;
    case 'review': return <ChefHat className="h-5 w-5" />;
    case 'edit': return <Edit className="h-5 w-5" />;
    case 'save': return <Save className="h-5 w-5" />;
  }
};

const getStepTitle = (step: WorkspaceStep) => {
  switch (step) {
    case 'upload': return 'Upload Recipe';
    case 'review': return 'Review & Format';
    case 'edit': return 'Edit Details';
    case 'save': return 'Save & Share';
  }
};

export const WorkflowProgress = ({ currentStep, onStepClick }: WorkflowProgressProps) => {
  const steps: WorkspaceStep[] = ['upload', 'review', 'edit', 'save'];

  const isStepAccessible = (step: WorkspaceStep): boolean => {
    const currentIndex = steps.indexOf(currentStep);
    const stepIndex = steps.indexOf(step);
    return stepIndex <= currentIndex;
  };

  return (
    <Card className="shadow-warm">
      <CardHeader>
        <CardTitle className="text-center">Workflow Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center">
          {steps.map((step, index) => {
            const isActive = currentStep === step;
            const isCompleted = index < steps.indexOf(currentStep);
            const isAccessible = isStepAccessible(step);

            return (
              <div key={step} className="flex flex-col items-center">
                <Button
                  variant="ghost"
                  disabled={!isAccessible || !onStepClick}
                  onClick={() => isAccessible && onStepClick?.(step)}
                  className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-colors p-0 hover:scale-105 ${
                    isActive
                      ? 'bg-primary text-primary-foreground border-primary hover:bg-primary/90' 
                      : isCompleted
                      ? 'bg-primary/20 text-primary border-primary hover:bg-primary/30'
                      : 'bg-muted text-muted-foreground border-muted-foreground hover:bg-muted/80'
                  } ${isAccessible && onStepClick ? 'cursor-pointer' : 'cursor-default'}`}
                >
                  {getStepIcon(step)}
                </Button>
                <span className={`text-sm mt-2 font-medium ${
                  isActive ? 'text-primary' : 'text-muted-foreground'
                }`}>
                  {getStepTitle(step)}
                </span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};