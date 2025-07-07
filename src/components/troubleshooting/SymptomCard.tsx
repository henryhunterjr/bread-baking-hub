import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface Symptom {
  id: string;
  labels: string[];
  category: string;
  quickFix: string;
  deepDive: string;
  images?: {
    before?: string;
    after?: string;
  };
}

interface SymptomCardProps {
  symptom: Symptom;
  isOpen: boolean;
  onToggle: (id: string) => void;
}

const SymptomCard: React.FC<SymptomCardProps> = ({ symptom, isOpen, onToggle }) => {
  const getTitle = (symptom: Symptom) => {
    return symptom.labels[0].charAt(0).toUpperCase() + symptom.labels[0].slice(1);
  };

  return (
    <Card className="bg-stone-50 border-stone-200 shadow-sm hover:shadow-md transition-shadow">
      <Collapsible open={isOpen} onOpenChange={() => onToggle(symptom.id)}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-stone-100 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CardTitle className="text-lg font-serif text-stone-800">
                  {getTitle(symptom)}
                </CardTitle>
                <Badge variant="secondary" className="bg-amber-100 text-amber-800 text-xs">
                  {symptom.category}
                </Badge>
              </div>
              <ChevronDown 
                className={`h-5 w-5 text-stone-600 transition-transform duration-200 ${
                  isOpen ? 'rotate-180' : ''
                }`} 
              />
            </div>
          </CardHeader>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <CardContent className="pt-0 space-y-4">
            {/* Quick Fix */}
            <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-r">
              <h4 className="font-semibold text-amber-800 mb-2">Quick Fix</h4>
              <p className="text-stone-700 text-sm leading-relaxed">{symptom.quickFix}</p>
            </div>

            {/* Deep Dive */}
            <div className="bg-stone-100 p-4 rounded">
              <h4 className="font-semibold text-stone-800 mb-2">The Science</h4>
              <p className="text-stone-700 text-sm leading-relaxed">{symptom.deepDive}</p>
            </div>

            {/* Images */}
            {symptom.images && (symptom.images.before || symptom.images.after) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {symptom.images.before && (
                  <div>
                    <h5 className="text-sm font-medium text-stone-700 mb-2">Problem Example</h5>
                    <img 
                      src={symptom.images.before}
                      alt={`Problem example: ${getTitle(symptom)}`}
                      className="w-full h-32 object-cover rounded border border-stone-200"
                      loading="lazy"
                    />
                  </div>
                )}
                {symptom.images.after && (
                  <div>
                    <h5 className="text-sm font-medium text-stone-700 mb-2">Corrected Result</h5>
                    <img 
                      src={symptom.images.after}
                      alt={`Corrected result: ${getTitle(symptom)}`}
                      className="w-full h-32 object-cover rounded border border-stone-200"
                      loading="lazy"
                    />
                  </div>
                )}
              </div>
            )}

            {/* Related Keywords */}
            <div className="flex flex-wrap gap-1">
              {symptom.labels.slice(1).map((label, index) => (
                <Badge 
                  key={index} 
                  variant="outline" 
                  className="text-xs bg-stone-200 text-stone-600 border-stone-300"
                >
                  {label}
                </Badge>
              ))}
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};

export default SymptomCard;