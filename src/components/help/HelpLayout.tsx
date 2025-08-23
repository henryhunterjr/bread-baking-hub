import React from 'react';
import { useLocation } from 'react-router-dom';
import { HelpWidget } from './HelpWidget';
import { ContextualHelp } from './ContextualHelp';
import { getContextualHelp } from './ContextualHelpData';

interface HelpLayoutProps {
  children: React.ReactNode;
  showContextualHelp?: boolean;
  showHelpWidget?: boolean;
}

export const HelpLayout: React.FC<HelpLayoutProps> = ({ 
  children, 
  showContextualHelp = true,
  showHelpWidget = true 
}) => {
  const location = useLocation();
  const contextualTips = getContextualHelp(location.pathname);

  return (
    <>
      {children}
      
      {/* Contextual Help - appears at top of main content */}
      {showContextualHelp && contextualTips.length > 0 && (
        <div className="container mx-auto px-4 py-4">
          <ContextualHelp 
            tips={contextualTips}
            className="mb-6"
            showByDefault={false}
          />
        </div>
      )}

      {/* Floating Help Widget */}
      {showHelpWidget && (
        <HelpWidget currentPage={location.pathname} />
      )}
    </>
  );
};