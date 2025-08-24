import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { AlertTriangle, Edit3, Upload } from 'lucide-react';

interface WorkspaceErrorFallbackProps {
  errorMessage: string;
  extractedText?: string;
  onRetry: () => void;
  onManualEntry: (text: string) => void;
}

export const WorkspaceErrorFallback: React.FC<WorkspaceErrorFallbackProps> = ({
  errorMessage,
  extractedText,
  onRetry,
  onManualEntry
}) => {
  const [manualText, setManualText] = useState(extractedText || '');

  const handleManualSubmit = () => {
    if (manualText.trim()) {
      onManualEntry(manualText.trim());
    }
  };

  return (
    <Card className="border-destructive/20 bg-destructive/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-destructive">
          <AlertTriangle className="h-5 w-5" />
          Upload Failed
        </CardTitle>
        <CardDescription>
          {errorMessage}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Button 
            onClick={onRetry}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Upload className="h-4 w-4" />
            Try Again
          </Button>
        </div>
        
        {/* Manual entry fallback */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Edit3 className="h-4 w-4" />
            Or paste your recipe text below:
          </div>
          <Textarea
            placeholder="Paste your recipe text here..."
            value={manualText}
            onChange={(e) => setManualText(e.target.value)}
            rows={6}
            className="resize-none"
          />
          <Button 
            onClick={handleManualSubmit}
            disabled={!manualText.trim()}
            className="w-full"
          >
            Format Recipe from Text
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};