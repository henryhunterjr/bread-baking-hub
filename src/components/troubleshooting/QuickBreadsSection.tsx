import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ResponsiveImage } from '@/components/ResponsiveImage';

export default function QuickBreadsSection() {
  return (
    <AccordionItem value="quick-breads" className="border border-purple-500/30 rounded-lg bg-purple-50/50 dark:bg-purple-900/10 mb-4">
      <AccordionTrigger className="px-6 py-4 text-lg font-semibold hover:bg-purple-100/50 dark:hover:bg-purple-900/20">
        🍞 Quick Breads & Baking Problems
      </AccordionTrigger>
      <AccordionContent className="px-6 pb-6">
        <p className="text-muted-foreground mb-6 text-sm">
          Fix common issues with banana bread, muffins, and other quick breads.
        </p>
        
        <div className="space-y-6">
          {/* Collapsed vs Perfect */}
          <div>
            <h4 className="text-lg font-semibold text-primary mb-4">Sunken Center Problems</h4>
            <Card className="bg-background hover:shadow-lg transition-shadow cursor-pointer" onClick={() => window.open('/lovable-uploads/ebf4f556-1844-41f4-9830-cef4720d68c3.png', '_blank')}>
              <CardContent className="p-4">
                <ResponsiveImage 
                  src="/lovable-uploads/ebf4f556-1844-41f4-9830-cef4720d68c3.png" 
                  alt="Sunken vs perfect quick bread"
                  className="w-full h-48 object-cover rounded-lg mb-3"
                  loading="lazy"
                />
                <h5 className="font-semibold text-sm mb-2">Quick Bread Collapse</h5>
                <p className="text-xs text-muted-foreground mb-2">Left: Sunken center from overmixing or underbaking. Right: Perfect dome from proper technique.</p>
                <p className="text-xs text-orange-600 dark:text-orange-400">Fix: Mix just until combined, don't overbake, check leavening freshness.</p>
              </CardContent>
            </Card>
          </div>

          {/* Dense Machine Bread */}
          <div>
            <h4 className="text-lg font-semibold text-primary mb-4">Dense & Collapsed Loaves</h4>
            <Card className="bg-background hover:shadow-lg transition-shadow cursor-pointer" onClick={() => window.open('/lovable-uploads/a3e88084-dbe5-4e9c-b53f-f65c6717ef37.png', '_blank')}>
              <CardContent className="p-4">
                <ResponsiveImage 
                  src="/lovable-uploads/a3e88084-dbe5-4e9c-b53f-f65c6717ef37.png" 
                  alt="Dense collapsed bread"
                  className="w-full h-48 object-cover rounded-lg mb-3"
                  loading="lazy"
                />
                <h5 className="font-semibold text-sm mb-2">Heavy, Dense Texture</h5>
                <p className="text-xs text-muted-foreground mb-2">Extremely dense crumb with poor rise - multiple issues at play.</p>
                <p className="text-xs text-red-600 dark:text-red-400">Fix: Check yeast activity, flour measurement, liquid ratios, and mixing time.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}