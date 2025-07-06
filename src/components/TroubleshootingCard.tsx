import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

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
}

const TroubleshootingCard: React.FC<TroubleshootingCardProps> = ({ symptom }) => {
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <CardTitle className="text-xl font-bold text-primary mb-2">
              {symptom.id.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </CardTitle>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="capitalize">
                {symptom.category}
              </Badge>
              {symptom.labels.map((label) => (
                <Badge key={label} variant="outline" className="text-xs">
                  {label}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Quick Fix Section */}
        <div>
          <h3 className="font-semibold text-lg mb-2 text-primary">Quick Fix</h3>
          <p className="text-foreground bg-secondary/30 p-3 rounded-md border-l-4 border-primary">
            {symptom.quickFix}
          </p>
        </div>

        <Separator />

        {/* Deep Dive Section */}
        <div>
          <h3 className="font-semibold text-lg mb-2 text-primary">Deep Dive</h3>
          <p className="text-muted-foreground leading-relaxed">
            {symptom.deepDive}
          </p>
        </div>

        <Separator />

        {/* Images Section */}
        <div>
          <h3 className="font-semibold text-lg mb-3 text-primary">Visual Examples</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium text-sm text-destructive">Problem</h4>
              <div className="aspect-video bg-muted rounded-lg flex items-center justify-center border">
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
            
            <div className="space-y-2">
              <h4 className="font-medium text-sm text-green-600 dark:text-green-400">Solution</h4>
              <div className="aspect-video bg-muted rounded-lg flex items-center justify-center border">
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
        <div className="pt-2">
          <p className="text-xs text-muted-foreground font-mono">
            ID: {symptom.id}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default TroubleshootingCard;