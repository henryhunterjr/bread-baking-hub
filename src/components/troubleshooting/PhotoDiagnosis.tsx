import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, Image as ImageIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import SymptomCard from './SymptomCard';
import type { Symptom, PhotoDiagnosisProps } from '@/types/crustAndCrumb';
import { mockPhotoDiagnosis, CRUST_AND_CRUMB_CONSTANTS } from '@/utils/crustAndCrumbUtils';

const PhotoDiagnosis: React.FC<PhotoDiagnosisProps> = ({ symptoms }) => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedBreadType, setSelectedBreadType] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [diagnosisResults, setDiagnosisResults] = useState<Symptom[]>([]);
  const [showResults, setShowResults] = useState(false);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      
      // Clear previous results
      setShowResults(false);
      setDiagnosisResults([]);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedImage) return;

    setIsAnalyzing(true);
    
    try {
      // Simulate AI processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const results = mockPhotoDiagnosis(selectedImage, selectedBreadType || undefined);
      setDiagnosisResults(results);
      setShowResults(true);
      
      console.log('Photo diagnosis completed:', results.length, 'results found');
    } catch (error) {
      console.error('Photo diagnosis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setSelectedBreadType('');
    setDiagnosisResults([]);
    setShowResults(false);
  };

  return (
    <div className="space-y-6">
      {!showResults ? (
        <Card className="bg-gradient-to-r from-panthers-blue-50 to-platinum-50 border-panthers-blue-200">
          <CardContent className="p-6 space-y-4">
            {/* Image Upload */}
            <div className="space-y-2">
              <Label className="text-panthers-blue-900 font-medium">
                Upload Photo of Your Bread
              </Label>
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="photo-upload"
                />
                <label
                  htmlFor="photo-upload"
                  className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-panthers-blue-300 rounded-lg cursor-pointer bg-panthers-blue-50/30 hover:bg-panthers-blue-50/50 transition-colors touch-manipulation"
                >
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Bread preview"
                      className="max-h-44 max-w-full object-contain rounded-lg"
                    />
                  ) : (
                    <div className="flex flex-col items-center space-y-2 text-panthers-blue-600">
                      <Upload className="h-8 w-8" />
                      <span className="text-sm font-medium">Click to upload bread photo</span>
                      <span className="text-xs text-panthers-blue-500">JPG, PNG up to 10MB</span>
                    </div>
                  )}
                </label>
              </div>
            </div>

            {/* Bread Type Selection */}
            <div className="space-y-2">
              <Label className="text-panthers-blue-900 font-medium">
                Bread Type (Optional)
              </Label>
              <Select value={selectedBreadType} onValueChange={setSelectedBreadType}>
                <SelectTrigger className="bg-white border-panthers-blue-300 min-h-[44px] touch-manipulation">
                  <SelectValue placeholder="Select bread type for better accuracy" />
                </SelectTrigger>
                <SelectContent className="bg-white border-panthers-blue-300 z-50">
                  {CRUST_AND_CRUMB_CONSTANTS.BREAD_TYPES.map((type) => (
                    <SelectItem key={type} value={type} className="capitalize touch-manipulation min-h-[44px]">
                      {type.replace('-', ' ')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <Button
                onClick={handleAnalyze}
                disabled={!selectedImage || isAnalyzing}
                className="bg-panthers-blue-600 hover:bg-panthers-blue-700 text-white min-h-[44px] touch-manipulation flex-1"
              >
                {isAnalyzing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                    Analyzing Photo...
                  </>
                ) : (
                  <>
                    <ImageIcon className="h-4 w-4 mr-2" />
                    Analyze My Loaf
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                onClick={handleReset}
                className="border-panthers-blue-300 min-h-[44px] touch-manipulation"
              >
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-serif font-bold text-panthers-blue-900">
              📷 Photo Analysis Results
            </h3>
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              className="border-panthers-blue-300"
            >
              Try Another Photo
            </Button>
          </div>

          {diagnosisResults.length > 0 ? (
            <div className="space-y-4">
              <p className="text-panthers-blue-700 text-sm">
                Based on your photo, here are the most likely issues:
              </p>
              {diagnosisResults.map((symptom) => (
                <SymptomCard
                  key={`photo-${symptom.id}`}
                  symptom={symptom}
                  isOpen={false}
                  onToggle={() => {}}
                />
              ))}
            </div>
          ) : (
            <Card className="bg-amber-50 border-amber-200">
              <CardContent className="p-4">
                <p className="text-amber-800 text-sm mb-3">
                  We're not sure, but here's what you can check:
                </p>
                <div className="space-y-2">
                  {symptoms.slice(0, 3).map((symptom) => (
                    <SymptomCard
                      key={`fallback-${symptom.id}`}
                      symptom={symptom}
                      isOpen={false}
                      onToggle={() => {}}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default PhotoDiagnosis;