import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ResponsiveImage } from '@/components/ResponsiveImage';

export default function ProofingProblemsSection() {
  return (
    <AccordionItem value="proofing" className="border border-yellow-500/30 rounded-lg bg-yellow-50/50 dark:bg-yellow-900/10 mb-4">
      <AccordionTrigger className="px-6 py-4 text-lg font-semibold hover:bg-yellow-100/50 dark:hover:bg-yellow-900/20">
        🕒 Proofing Problems - Visual Diagnosis Guide
      </AccordionTrigger>
      <AccordionContent className="px-6 pb-6">
        <p className="text-muted-foreground mb-6 text-sm">
          Wondering if your dough is proofed just right? Compare your crumb to these real loaves.
        </p>
        
        <div className="space-y-8" data-section="real-photo-crumb-diagnosis">
          {/* Underproofed Section */}
          <div>
            <h4 className="text-lg font-semibold text-red-600 dark:text-red-400 mb-4">UNDERPROOFED</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card className="bg-background hover:shadow-lg transition-shadow cursor-pointer" onClick={() => window.open('/lovable-uploads/0ba59526-59a0-4dc4-ac14-27d171d6425e.png', '_blank')}>
                <CardContent className="p-4">
                  <ResponsiveImage 
                    src="/lovable-uploads/0ba59526-59a0-4dc4-ac14-27d171d6425e.png" 
                    alt="Slightly Underproofed bread crumb"
                    className="w-full h-32 object-cover rounded-lg mb-3"
                    loading="lazy"
                  />
                  <h5 className="font-semibold text-sm mb-2">Slightly Underproofed</h5>
                  <p className="text-xs text-muted-foreground mb-2">Dense crumb with smaller holes, dough didn't fully develop.</p>
                  <p className="text-xs text-blue-600 dark:text-blue-400">Fix: Allow longer bulk fermentation or final proof.</p>
                </CardContent>
              </Card>
              
              <Card className="bg-background hover:shadow-lg transition-shadow cursor-pointer" onClick={() => window.open('/lovable-uploads/9b10f418-f94f-420b-8126-409a16a4eace.png', '_blank')}>
                <CardContent className="p-4">
                  <ResponsiveImage 
                    src="/lovable-uploads/9b10f418-f94f-420b-8126-409a16a4eace.png" 
                    alt="Significantly Underproofed bread crumb"
                    className="w-full h-32 object-cover rounded-lg mb-3"
                    loading="lazy"
                  />
                  <h5 className="font-semibold text-sm mb-2">Significantly Underproofed</h5>
                  <p className="text-xs text-muted-foreground mb-2">Very dense, gummy crumb with large irregular holes.</p>
                  <p className="text-xs text-blue-600 dark:text-blue-400">Fix: Extend fermentation time and check dough temperature.</p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Well-Proofed Section */}
          <div>
            <h4 className="text-lg font-semibold text-green-600 dark:text-green-400 mb-4">WELL-PROOFED</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card className="bg-background hover:shadow-lg transition-shadow cursor-pointer" onClick={() => window.open('/lovable-uploads/71542cc4-5cca-4b79-9b32-f7550884b84e.png', '_blank')}>
                <CardContent className="p-4">
                  <ResponsiveImage 
                    src="/lovable-uploads/71542cc4-5cca-4b79-9b32-f7550884b84e.png" 
                    alt="Nicely Proofed bread crumb"
                    className="w-full h-32 object-cover rounded-lg mb-3"
                    loading="lazy"
                  />
                  <h5 className="font-semibold text-sm mb-2">Nicely Proofed</h5>
                  <p className="text-xs text-muted-foreground mb-2">Even, open crumb structure with good hole distribution.</p>
                  <p className="text-xs text-green-600 dark:text-green-400">Perfect! This is your target crumb structure.</p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Overproofed Section */}
          <div>
            <h4 className="text-lg font-semibold text-orange-600 dark:text-orange-400 mb-4">OVERPROOFED</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card className="bg-background hover:shadow-lg transition-shadow cursor-pointer" onClick={() => window.open('/lovable-uploads/a439508d-31d4-4791-997e-3fd30946ca10.png', '_blank')}>
                <CardContent className="p-4">
                  <ResponsiveImage 
                    src="/lovable-uploads/a439508d-31d4-4791-997e-3fd30946ca10.png" 
                    alt="Slightly Overproofed bread crumb"
                    className="w-full h-32 object-cover rounded-lg mb-3"
                    loading="lazy"
                  />
                  <h5 className="font-semibold text-sm mb-2">Slightly Overproofed</h5>
                  <p className="text-xs text-muted-foreground mb-2">Larger holes, structure still intact but losing some strength.</p>
                  <p className="text-xs text-orange-600 dark:text-orange-400">Fix: Reduce proofing time or lower temperature next time.</p>
                </CardContent>
              </Card>
              
              <Card className="bg-background hover:shadow-lg transition-shadow cursor-pointer" onClick={() => window.open('/lovable-uploads/e40cd78a-5af5-4ba1-9c1f-28b66e1d2495.png', '_blank')}>
                <CardContent className="p-4">
                  <ResponsiveImage 
                    src="/lovable-uploads/e40cd78a-5af5-4ba1-9c1f-28b66e1d2495.png" 
                    alt="Significantly Overproofed bread crumb"
                    className="w-full h-32 object-cover rounded-lg mb-3"
                    loading="lazy"
                  />
                  <h5 className="font-semibold text-sm mb-2">Significantly Overproofed</h5>
                  <p className="text-xs text-muted-foreground mb-2">Flat, dense crumb with loss of structure and shape.</p>
                  <p className="text-xs text-orange-600 dark:text-orange-400">Fix: Watch timing more carefully and test with poke test.</p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Comparison Grid */}
          <div className="mt-8 p-4 bg-muted/30 rounded-lg">
            <h4 className="text-lg font-semibold mb-4">Quick Reference Comparison</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <ResponsiveImage 
                src="/lovable-uploads/6576db00-103a-4cb4-93b3-2613f56d9e47.png" 
                alt="Bread crumb comparison grid"
                className="w-full rounded-lg cursor-pointer hover:shadow-lg transition-shadow"
                loading="lazy"
              />
              <ResponsiveImage 
                src="/lovable-uploads/2f9d94ed-1d8a-4e00-9ae0-45dfec7907ae.png" 
                alt="Proofing stages comparison"
                className="w-full rounded-lg cursor-pointer hover:shadow-lg transition-shadow"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}