import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ResponsiveImage } from '@/components/ResponsiveImage';

export default function CrustBakingSection() {
  return (
    <AccordionItem value="crust-baking" className="border border-red-500/30 rounded-lg bg-red-50/50 dark:bg-red-900/10 mb-4">
      <AccordionTrigger className="px-6 py-4 text-lg font-semibold hover:bg-red-100/50 dark:hover:bg-red-900/20">
        🔥 Crust & Baking Temperature Issues
      </AccordionTrigger>
      <AccordionContent className="px-6 pb-6">
        <p className="text-muted-foreground mb-6 text-sm">
          Solve problems with burnt bottoms, pale crusts, and temperature control.
        </p>
        
        <div className="space-y-6">
          {/* Burnt Bottom */}
          <div>
            <h4 className="text-lg font-semibold text-primary mb-4">Burnt Bottom Issues</h4>
            <Card className="bg-background hover:shadow-lg transition-shadow cursor-pointer" onClick={() => window.open('/lovable-uploads/63142592-06a7-4148-a952-38bb2b6f6090.png', '_blank')}>
              <CardContent className="p-4">
                <ResponsiveImage 
                  src="/lovable-uploads/63142592-06a7-4148-a952-38bb2b6f6090.png" 
                  alt="Burnt bottom bread"
                  className="w-full h-48 object-cover rounded-lg mb-3"
                  loading="lazy"
                />
                <h5 className="font-semibold text-sm mb-2">Severely Burnt Bottom</h5>
                <p className="text-xs text-muted-foreground mb-2">Dark, charred bottom crust while top looks normal.</p>
                <p className="text-xs text-red-600 dark:text-red-400">Fix: Move to higher oven rack, use baking stone, lower temperature by 25°F.</p>
              </CardContent>
            </Card>
          </div>

          {/* Perfect Artisan Loaves */}
          <div>
            <h4 className="text-lg font-semibold text-primary mb-4">Well-Baked Examples</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="bg-background hover:shadow-lg transition-shadow cursor-pointer" onClick={() => window.open('/lovable-uploads/e87024c4-9b8d-4b03-b097-a63ed218970d.png', '_blank')}>
                <CardContent className="p-4">
                  <ResponsiveImage 
                    src="/lovable-uploads/e87024c4-9b8d-4b03-b097-a63ed218970d.png" 
                    alt="Perfect sourdough loaves"
                    className="w-full h-32 object-cover rounded-lg mb-3"
                    loading="lazy"
                  />
                  <h5 className="font-semibold text-sm mb-2">Perfect Artisan Loaves</h5>
                  <p className="text-xs text-muted-foreground mb-2">Beautiful golden crust, excellent oven spring, proper scoring.</p>
                  <p className="text-xs text-green-600 dark:text-green-400">Target: This is what well-baked sourdough should look like.</p>
                </CardContent>
              </Card>
              
              <Card className="bg-background hover:shadow-lg transition-shadow cursor-pointer" onClick={() => window.open('/lovable-uploads/9087fac4-9b4e-4823-928d-1d6231bbe8b7.png', '_blank')}>
                <CardContent className="p-4">
                  <ResponsiveImage 
                    src="/lovable-uploads/9087fac4-9b4e-4823-928d-1d6231bbe8b7.png" 
                    alt="Perfect sourdough crumb"
                    className="w-full h-32 object-cover rounded-lg mb-3"
                    loading="lazy"
                  />
                  <h5 className="font-semibold text-sm mb-2">Ideal Crumb Structure</h5>
                  <p className="text-xs text-muted-foreground mb-2">Open, airy crumb with even hole distribution and great texture.</p>
                  <p className="text-xs text-green-600 dark:text-green-400">Perfect: Even fermentation and proper baking achieved.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}