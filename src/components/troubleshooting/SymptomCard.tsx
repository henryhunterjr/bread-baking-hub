import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, Info, Lightbulb, Microscope } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { motion, AnimatePresence } from 'framer-motion';
import type { SymptomCardProps } from '@/types/crustAndCrumb';
import { formatSymptomTitle, CRUST_AND_CRUMB_CONSTANTS } from '@/utils/crustAndCrumbUtils';
import { ResponsiveImage } from '@/components/ResponsiveImage';

// Import troubleshooting images
import sunkenMiddleBefore from '@/assets/troubleshooting/sunken_middle_before.jpg';
import sunkenMiddleAfter from '@/assets/troubleshooting/sunken_middle_after.jpg';
import gummyCrumbBefore from '@/assets/troubleshooting/gummy_crumb_before.jpg';
import gummyCrumbAfter from '@/assets/troubleshooting/gummy_crumb_after.jpg';
import burntBottomBefore from '@/assets/troubleshooting/burnt_bottom_before.jpg';
import burntBottomAfter from '@/assets/troubleshooting/burnt_bottom_after.jpg';
import paleCrustBefore from '@/assets/troubleshooting/pale_crust_before.jpg';
import paleCrustAfter from '@/assets/troubleshooting/pale_crust_after.jpg';

const SymptomCard: React.FC<SymptomCardProps> = ({ symptom, isOpen, onToggle }) => {
  // Map symptom IDs to imported images
  const imageMap: Record<string, { before?: string; after?: string }> = {
    'sunken-middle': { before: sunkenMiddleBefore, after: sunkenMiddleAfter },
    'gummy-crumb': { before: gummyCrumbBefore, after: gummyCrumbAfter },
    'burnt-bottom': { before: burntBottomBefore, after: burntBottomAfter },
    'pale-crust': { before: paleCrustBefore, after: paleCrustAfter },
  };

  const getImageSrc = (type: 'before' | 'after'): string | undefined => {
    return imageMap[symptom.id]?.[type];
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    console.warn('Image failed to load:', e.currentTarget.src);
    e.currentTarget.src = CRUST_AND_CRUMB_CONSTANTS.PLACEHOLDER_IMAGE;
  };

  return (
    <Card className="bg-stone-50 border-stone-200 shadow-sm hover:shadow-md transition-all duration-200">
      <Collapsible open={isOpen} onOpenChange={() => onToggle(symptom.id)}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-stone-100 transition-colors touch-manipulation">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CardTitle className="text-lg font-serif text-stone-800">
                  {formatSymptomTitle(symptom)}
                </CardTitle>
                <Badge variant="secondary" className="bg-amber-100 text-amber-800 text-xs">
                  {symptom.category}
                </Badge>
              </div>
              <motion.div
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown className="h-5 w-5 text-stone-600" />
              </motion.div>
            </div>
          </CardHeader>
        </CollapsibleTrigger>
        
        <AnimatePresence>
          {isOpen && (
            <CollapsibleContent forceMount>
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                style={{ overflow: 'hidden' }}
              >
                <CardContent className="pt-0 space-y-4">
                  {/* Quick Fix */}
                  <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-r">
                    <div className="flex items-center gap-2 mb-2">
                      <Lightbulb className="h-4 w-4 text-amber-600" />
                      <h4 className="font-semibold text-amber-800">Quick Fix</h4>
                      <div title="Immediate steps to solve this issue">
                        <Info className="h-3 w-3 text-amber-600" />
                      </div>
                    </div>
                    <p className="text-stone-700 text-sm leading-relaxed">{symptom.quickFix}</p>
                  </div>

                  {/* Deep Dive */}
                  <div className="bg-stone-100 p-4 rounded">
                    <div className="flex items-center gap-2 mb-2">
                      <Microscope className="h-4 w-4 text-stone-600" />
                      <h4 className="font-semibold text-stone-800">The Science</h4>
                      <div title="Understanding why this happens">
                        <Info className="h-3 w-3 text-stone-600" />
                      </div>
                    </div>
                    <p className="text-stone-700 text-sm leading-relaxed">{symptom.deepDive}</p>
                  </div>

                  {/* Images */}
                  {(getImageSrc('before') || getImageSrc('after')) && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {getImageSrc('before') && (
                        <div>
                          <h5 className="text-sm font-medium text-red-700 mb-2">Problem Example</h5>
                          <ResponsiveImage 
                            src={getImageSrc('before') || ''}
                            alt={`Problem example: ${formatSymptomTitle(symptom)}`}
                            className="w-full h-32 object-cover rounded border border-red-200"
                            loading="lazy"
                          />
                        </div>
                      )}
                      {getImageSrc('after') && (
                        <div>
                          <h5 className="text-sm font-medium text-green-700 mb-2">Solution Example</h5>
                          <ResponsiveImage 
                            src={getImageSrc('after') || ''}
                            alt={`Solution example: ${formatSymptomTitle(symptom)}`}
                            className="w-full h-32 object-cover rounded border border-green-200"
                            loading="lazy"
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {/* Related Keywords */}
                  {symptom.labels && symptom.labels.length > 1 && (
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
                  )}
                </CardContent>
              </motion.div>
            </CollapsibleContent>
          )}
        </AnimatePresence>
      </Collapsible>
    </Card>
  );
};

export default SymptomCard;