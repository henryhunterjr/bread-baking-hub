import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export default function CrumbStructureSection() {
  return (
    <AccordionItem value="crumb-structure" className="border border-green-500/30 rounded-lg bg-green-50/50 dark:bg-green-900/10 mb-4">
      <AccordionTrigger className="px-6 py-4 text-lg font-semibold hover:bg-green-100/50 dark:hover:bg-green-900/20">
        🍞 Crumb Structure & Texture Problems
      </AccordionTrigger>
      <AccordionContent className="px-6 pb-6">
        <p className="text-muted-foreground mb-6 text-sm">
          Diagnose and fix issues with crumb texture, hole distribution, and interior problems.
        </p>
        
        <div className="space-y-6">
          {/* Perfect Crumb Examples */}
          <div>
            <h4 className="text-lg font-semibold text-primary mb-4">Target Crumb Structure</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="bg-background hover:shadow-lg transition-shadow cursor-pointer" onClick={() => window.open('/lovable-uploads/df3b3be5-2c18-4db6-9ddc-b96a0f64584f.png', '_blank')}>
                <CardContent className="p-4">
                  <img 
                    src="/lovable-uploads/df3b3be5-2c18-4db6-9ddc-b96a0f64584f.png" 
                    alt="Perfect sourdough crumb"
                    className="w-full h-32 object-cover rounded-lg mb-3"
                  />
                  <h5 className="font-semibold text-sm mb-2">Excellent Sourdough Crumb</h5>
                  <p className="text-xs text-muted-foreground mb-2">Well-developed holes, good structure, proper fermentation.</p>
                  <p className="text-xs text-green-600 dark:text-green-400">Target: Aim for this open, even crumb structure.</p>
                </CardContent>
              </Card>
              
              <Card className="bg-background hover:shadow-lg transition-shadow cursor-pointer" onClick={() => window.open('/lovable-uploads/544551ff-397f-4f33-bf2f-daff4ddffe46.png', '_blank')}>
                <CardContent className="p-4">
                  <img 
                    src="/lovable-uploads/544551ff-397f-4f33-bf2f-daff4ddffe46.png" 
                    alt="Multiple bread loaves"
                    className="w-full h-32 object-cover rounded-lg mb-3"
                  />
                  <h5 className="font-semibold text-sm mb-2">Consistent Batch Results</h5>
                  <p className="text-xs text-muted-foreground mb-2">Multiple loaves showing consistent shaping and baking.</p>
                  <p className="text-xs text-blue-600 dark:text-blue-400">Goal: Achieve consistent results across multiple loaves.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}