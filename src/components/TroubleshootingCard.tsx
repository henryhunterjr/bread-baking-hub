import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';

interface Symptom {
  id: string;
  category: string;
  labels: string[];
  quickFix: string;
  deepDive: string;
  images: { before: string; after: string };
}

interface TroubleshootingCardProps {
  symptom: Symptom;
  isHighlighted?: boolean;
}

const TroubleshootingCard: React.FC<TroubleshootingCardProps> = ({ symptom, isHighlighted = false }) => {
  return (
    <TooltipProvider>
      <Card className={`w-full max-w-2xl mx-auto transition-all duration-300 ${isHighlighted ? 'ring-2 ring-yellow-500 bg-yellow-50 dark:bg-yellow-900/20' : 'bg-gray-50 dark:bg-gray-800'} hover:bg-gray-100 dark:hover:bg-gray-700`}>
        <CardHeader className="py-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <CardTitle className="text-xl font-bold text-primary mb-3">
                {symptom.id.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </CardTitle>
              <div className="flex flex-wrap gap-2">
                <Badge className="capitalize bg-gray-800 text-white dark:bg-gray-200 dark:text-gray-900 font-semibold px-3 py-1">
                  {symptom.category}
                </Badge>
                {symptom.labels.map((label) => (
                  <Tooltip key={label}>
                    <TooltipTrigger asChild>
                      <Badge 
                        variant="outline" 
                        className="text-xs bg-white dark:bg-gray-800 border-2 border-gray-600 dark:border-gray-300 text-gray-800 dark:text-gray-200 hover:bg-yellow-100 dark:hover:bg-yellow-900/30 hover:border-yellow-600 cursor-help font-medium px-2 py-1"
                      >
                        {label}
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs text-sm">{symptom.quickFix}</p>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </div>
            </div>
          </div>
        </CardHeader>
      
        <CardContent className="space-y-6 py-6">
          {/* Quick Fix Section */}
          <div>
            <h3 className="font-semibold text-lg mb-3 text-primary">Quick Fix</h3>
            <p className="text-gray-900 dark:text-gray-100 bg-yellow-100 dark:bg-yellow-900/50 p-4 rounded-lg border-l-4 border-yellow-600 font-medium text-base">
              {symptom.quickFix}
            </p>
          </div>

          <Separator />

          {/* Deep Dive Section */}
          <div>
            <h3 className="font-semibold text-lg mb-3 text-primary">Deep Dive</h3>
            <p className="text-gray-800 dark:text-gray-200 leading-relaxed text-base font-medium">
              {symptom.deepDive}
            </p>
          </div>

          <Separator />

          {/* Images Section */}
          <div>
            <h3 className="font-semibold text-lg mb-4 text-primary">Visual Examples</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-medium text-sm text-destructive">Problem</h4>
                <div className="aspect-video bg-muted rounded-lg flex items-center justify-center border focus:ring-2 focus:ring-yellow-400">
                  <img 
                    src={symptom.images.before} 
                    alt={`${symptom.id} - problem example`}
                    className="w-full h-full object-cover rounded-lg"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      if (target.nextElementSibling) {
                        (target.nextElementSibling as HTMLElement).style.display = 'flex';
                      }
                    }}
                  />
                  <div className="hidden items-center justify-center text-muted-foreground text-sm">
                    Problem Example
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-medium text-sm text-green-600 dark:text-green-400">Solution</h4>
                <div className="aspect-video bg-muted rounded-lg flex items-center justify-center border focus:ring-2 focus:ring-yellow-400">
                  <img 
                    src={symptom.images.after} 
                    alt={`${symptom.id} - solution example`}
                    className="w-full h-full object-cover rounded-lg"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      if (target.nextElementSibling) {
                        (target.nextElementSibling as HTMLElement).style.display = 'flex';
                      }
                    }}
                  />
                  <div className="hidden items-center justify-center text-muted-foreground text-sm">
                    Solution Example
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Symptom ID for Reference */}
          <div className="pt-4 border-t border-border">
            <p className="text-xs text-muted-foreground font-mono">
              ID: {symptom.id}
            </p>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
};

export default TroubleshootingCard;