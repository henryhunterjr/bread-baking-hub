import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, ChefHat, Edit, Save } from 'lucide-react';
import { WorkspaceStep } from '@/types/recipe-workspace';

interface WorkflowProgressProps {
  currentStep: WorkspaceStep;
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

export const WorkflowProgress = ({ currentStep }: WorkflowProgressProps) => {
  const steps: WorkspaceStep[] = ['upload', 'review', 'edit', 'save'];

  return (
    <Card className="shadow-warm">
      <CardHeader>
        <CardTitle className="text-center">Workflow Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center">
          {steps.map((step, index) => (
            <div key={step} className="flex flex-col items-center">
              <div className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-colors ${
                currentStep === step 
                  ? 'bg-primary text-primary-foreground border-primary' 
                  : index < steps.indexOf(currentStep)
                  ? 'bg-primary/20 text-primary border-primary'
                  : 'bg-muted text-muted-foreground border-muted-foreground'
              }`}>
                {getStepIcon(step)}
              </div>
              <span className={`text-sm mt-2 font-medium ${
                currentStep === step ? 'text-primary' : 'text-muted-foreground'
              }`}>
                {getStepTitle(step)}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};