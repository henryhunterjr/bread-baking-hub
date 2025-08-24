import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, Upload, FileText, Edit3, Save, AlertCircle } from 'lucide-react';

type WorkspaceState = 'idle' | 'validating' | 'uploading' | 'formatting' | 'editable' | 'saving' | 'saved' | 'error';

interface WorkspaceStatusIndicatorProps {
  state: WorkspaceState;
  progress?: number;
}

const stateConfig = {
  idle: {
    icon: Upload,
    label: 'Ready to upload',
    description: 'Choose a file to get started',
    progress: 0,
    variant: 'default' as const
  },
  validating: {
    icon: FileText,
    label: 'Validating file',
    description: 'Checking file format and size',
    progress: 20,
    variant: 'default' as const
  },
  uploading: {
    icon: Upload,
    label: 'Uploading file',
    description: 'Sending your file for processing',
    progress: 40,
    variant: 'default' as const
  },
  formatting: {
    icon: FileText,
    label: 'Formatting recipe',
    description: 'AI is extracting recipe details',
    progress: 70,
    variant: 'default' as const
  },
  editable: {
    icon: Edit3,
    label: 'Recipe ready',
    description: 'Review and edit your recipe',
    progress: 90,
    variant: 'default' as const
  },
  saving: {
    icon: Save,
    label: 'Saving recipe',
    description: 'Adding to your library',
    progress: 95,
    variant: 'default' as const
  },
  saved: {
    icon: CheckCircle2,
    label: 'Recipe saved',
    description: 'Successfully added to your library',
    progress: 100,
    variant: 'success' as const
  },
  error: {
    icon: AlertCircle,
    label: 'Error occurred',
    description: 'Please try again or use manual entry',
    progress: 0,
    variant: 'destructive' as const
  }
};

export const WorkspaceStatusIndicator: React.FC<WorkspaceStatusIndicatorProps> = ({
  state,
  progress
}) => {
  const config = stateConfig[state];
  const Icon = config.icon;
  const currentProgress = progress ?? config.progress;

  return (
    <Card className={`transition-all duration-300 ${
      config.variant === 'success' ? 'border-green-200 bg-green-50 dark:bg-green-950/10' :
      config.variant === 'destructive' ? 'border-red-200 bg-red-50 dark:bg-red-950/10' :
      ''
    }`}>
      <CardContent className="p-4">
        <div className="flex items-center gap-3 mb-3">
          <Icon className={`h-5 w-5 ${
            config.variant === 'success' ? 'text-green-600 dark:text-green-400' :
            config.variant === 'destructive' ? 'text-red-600 dark:text-red-400' :
            'text-primary'
          }`} />
          <div className="flex-1">
            <div className="font-medium text-sm">{config.label}</div>
            <div className="text-xs text-muted-foreground">{config.description}</div>
          </div>
        </div>
        
        {state !== 'idle' && state !== 'error' && (
          <Progress 
            value={currentProgress} 
            className="h-2"
          />
        )}
      </CardContent>
    </Card>
  );
};