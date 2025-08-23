import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface TourStep {
  id: string;
  title: string;
  content: string;
  target: string; // CSS selector
  position: 'top' | 'bottom' | 'left' | 'right';
  action?: () => void;
}

interface GuidedTourProps {
  tourId: string;
  steps: TourStep[];
  onComplete: () => void;
  onSkip: () => void;
}

export const GuidedTour: React.FC<GuidedTourProps> = ({
  tourId,
  steps,
  onComplete,
  onSkip
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null);

  useEffect(() => {
    // Check if user has completed this tour before
    const completedTours = JSON.parse(localStorage.getItem('completedTours') || '[]');
    if (completedTours.includes(tourId)) {
      setIsActive(false);
      return;
    }

    // Find and highlight target element
    const step = steps[currentStep];
    if (step) {
      const element = document.querySelector(step.target) as HTMLElement;
      if (element) {
        setTargetElement(element);
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        element.classList.add('tour-highlight');
      }
    }

    return () => {
      // Clean up highlights
      document.querySelectorAll('.tour-highlight').forEach(el => {
        el.classList.remove('tour-highlight');
      });
    };
  }, [currentStep, steps, tourId]);

  const handleNext = () => {
    const step = steps[currentStep];
    if (step.action) {
      step.action();
    }

    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    // Mark tour as completed
    const completedTours = JSON.parse(localStorage.getItem('completedTours') || '[]');
    if (!completedTours.includes(tourId)) {
      completedTours.push(tourId);
      localStorage.setItem('completedTours', JSON.stringify(completedTours));
    }

    setIsActive(false);
    onComplete();
  };

  const handleSkip = () => {
    setIsActive(false);
    onSkip();
  };

  if (!isActive || !steps.length) return null;

  const currentStepData = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/20 z-40" />
      
      {/* Tour Card */}
      <div className="fixed z-50" style={{ 
        top: targetElement ? `${targetElement.offsetTop + targetElement.offsetHeight + 10}px` : '50%',
        left: targetElement ? `${targetElement.offsetLeft}px` : '50%',
        transform: !targetElement ? 'translate(-50%, -50%)' : 'none'
      }}>
        <Card className="w-80 shadow-xl">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">{currentStepData.title}</CardTitle>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary" className="text-xs">
                    Step {currentStep + 1} of {steps.length}
                  </Badge>
                  <Target className="h-3 w-3 text-primary" />
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSkip}
                className="h-6 w-6 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            {/* Progress Bar */}
            <div className="w-full bg-secondary rounded-full h-1 mt-2">
              <div 
                className="bg-primary h-1 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              {currentStepData.content}
            </p>

            <div className="flex justify-between items-center">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrevious}
                disabled={currentStep === 0}
                className="flex items-center gap-1"
              >
                <ChevronLeft className="h-3 w-3" />
                Previous
              </Button>

              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSkip}
                >
                  Skip Tour
                </Button>
                <Button
                  size="sm"
                  onClick={handleNext}
                  className="flex items-center gap-1"
                >
                  {currentStep === steps.length - 1 ? 'Finish' : 'Next'}
                  {currentStep < steps.length - 1 && <ChevronRight className="h-3 w-3" />}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Spotlight effect for target element */}
      <style>{`
        .tour-highlight {
          position: relative;
          z-index: 41;
          box-shadow: 0 0 0 4px rgba(var(--primary), 0.5), 0 0 20px rgba(var(--primary), 0.3);
          border-radius: 4px;
        }
      `}</style>
    </>
  );
};