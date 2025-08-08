import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, RotateCcw, HelpCircle } from 'lucide-react';
import { ResponsiveImage } from '@/components/ResponsiveImage';

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

interface DiagnosisResultProps {
  symptom: Symptom;
  onReset: () => void;
}

const DiagnosisResult: React.FC<DiagnosisResultProps> = ({ symptom, onReset }) => {
  const getTitle = (symptom: Symptom) => {
    return symptom.labels[0].charAt(0).toUpperCase() + symptom.labels[0].slice(1);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-green-600" />
          <h3 className="text-lg font-semibold text-stone-800">Diagnosis Complete</h3>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onReset}
          className="border-stone-300"
        >
          <RotateCcw className="h-4 w-4 mr-1" />
          Try Again
        </Button>
      </div>

      <Card className="bg-white border-stone-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-serif text-stone-800">
              {getTitle(symptom)}
            </CardTitle>
            <Badge variant="secondary" className="bg-amber-100 text-amber-800">
              {symptom.category}
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Quick Fix */}
          <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-r">
            <h4 className="font-semibold text-green-800 mb-2">✅ Quick Fix</h4>
            <p className="text-stone-700 text-sm leading-relaxed">{symptom.quickFix}</p>
          </div>

          {/* Deep Dive */}
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r">
            <h4 className="font-semibold text-blue-800 mb-2">🔬 The Science</h4>
            <p className="text-stone-700 text-sm leading-relaxed">{symptom.deepDive}</p>
          </div>

          {/* Images */}
          {symptom.images && (symptom.images.before || symptom.images.after) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {symptom.images.before && (
                <div>
                  <h5 className="text-sm font-medium text-stone-700 mb-2">Problem Example</h5>
                  <ResponsiveImage 
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
                  <ResponsiveImage 
                    src={symptom.images.after}
                    alt={`Corrected result: ${getTitle(symptom)}`}
                    className="w-full h-32 object-cover rounded border border-stone-200"
                    loading="lazy"
                  />
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Still Not Sure Section */}
      <Card className="bg-amber-50 border-amber-200">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <HelpCircle className="h-5 w-5 text-amber-600" />
            <div className="flex-1">
              <h4 className="font-medium text-amber-800">Still not sure?</h4>
              <p className="text-sm text-amber-700">Get additional help with your specific case</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="border-amber-300 text-amber-700">
                Upload Photo
              </Button>
              <Button variant="outline" size="sm" className="border-amber-300 text-amber-700">
                Ask Expert
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DiagnosisResult;