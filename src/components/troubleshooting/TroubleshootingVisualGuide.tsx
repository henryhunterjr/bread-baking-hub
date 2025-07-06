import React from 'react';
import { Accordion } from '@/components/ui/accordion';
import ProofingProblemsSection from './ProofingProblemsSection';
import DoughDevelopmentSection from './DoughDevelopmentSection';
import QuickBreadsSection from './QuickBreadsSection';
import CrustBakingSection from './CrustBakingSection';
import CrumbStructureSection from './CrumbStructureSection';

export default function TroubleshootingVisualGuide() {
  return (
    <div className="mb-8">
      <Accordion type="single" collapsible>
        <ProofingProblemsSection />
        <DoughDevelopmentSection />
        <QuickBreadsSection />
        <CrustBakingSection />
        <CrumbStructureSection />
      </Accordion>
    </div>
  );
}