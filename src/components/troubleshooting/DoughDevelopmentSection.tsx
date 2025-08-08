import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ResponsiveImage } from '@/components/ResponsiveImage';

export default function DoughDevelopmentSection() {
  return (
    <AccordionItem value="dough-development" className="border border-blue-500/30 rounded-lg bg-blue-50/50 dark:bg-blue-900/10 mb-4">
      <AccordionTrigger className="px-6 py-4 text-lg font-semibold hover:bg-blue-100/50 dark:hover:bg-blue-900/20">
        🤲 Dough Development & Handling Issues
      </AccordionTrigger>
      <AccordionContent className="px-6 pb-6">
        <p className="text-muted-foreground mb-6 text-sm">
          Master proper dough development and handling techniques for better bread.
        </p>
        
        <div className="space-y-6">
          {/* Windowpane Test */}
          <div>
            <h4 className="text-lg font-semibold text-primary mb-4">Proper Gluten Development</h4>
            <Card className="bg-background hover:shadow-lg transition-shadow cursor-pointer" onClick={() => window.open('/lovable-uploads/b6b75cef-23c6-42c2-891e-f88243f68293.png', '_blank')}>
              <CardContent className="p-4">
                <ResponsiveImage 
                  src="/lovable-uploads/b6b75cef-23c6-42c2-891e-f88243f68293.png" 
                  alt="Windowpane test demonstration"
                  className="w-full h-48 object-cover rounded-lg mb-3"
                  loading="lazy"
                />
                <h5 className="font-semibold text-sm mb-2">The Windowpane Test</h5>
                <p className="text-xs text-muted-foreground mb-2">Well-developed dough should stretch thin enough to see through without tearing.</p>
                <p className="text-xs text-green-600 dark:text-green-400">Test: Stretch a small piece of dough - it should form a translucent membrane.</p>
              </CardContent>
            </Card>
          </div>

          {/* Fermentation Guide */}
          <div>
            <h4 className="text-lg font-semibold text-primary mb-4">Fermentation Stages</h4>
            <Card className="bg-background hover:shadow-lg transition-shadow cursor-pointer" onClick={() => window.open('/lovable-uploads/1311c737-acb9-42d7-8ad1-1a493f5f06de.png', '_blank')}>
              <CardContent className="p-4">
                <ResponsiveImage 
                  src="/lovable-uploads/1311c737-acb9-42d7-8ad1-1a493f5f06de.png" 
                  alt="Fermentation stages comparison"
                  className="w-full h-48 object-cover rounded-lg mb-3"
                  loading="lazy"
                />
                <h5 className="font-semibold text-sm mb-2">Complete Fermentation Guide</h5>
                <p className="text-xs text-muted-foreground mb-2">Visual guide showing perfect vs problematic fermentation stages.</p>
                <p className="text-xs text-blue-600 dark:text-blue-400">Reference: Use this to identify temperature, timing, and steam issues.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}