import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronLeft, ChevronRight, MousePointer } from 'lucide-react';
import ButtonInsertModal from './ButtonInsertModal';

interface FloatingCTAPanelProps {
  onButtonInsert: (buttonText: string, buttonUrl: string, openInNewTab: boolean) => void;
}

const FloatingCTAPanel = ({ onButtonInsert }: FloatingCTAPanelProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleInsertButton = (buttonText: string, buttonUrl: string, openInNewTab: boolean) => {
    try {
      onButtonInsert(buttonText, buttonUrl, openInNewTab);
      setIsModalOpen(false);
    } catch (error) {
      console.warn('Modal insertion failed, falling back to prompts');
      
      // Fallback to window.prompt
      const text = window.prompt('Enter button text:');
      if (!text) return;
      
      const url = window.prompt('Enter button URL:');
      if (!url) return;
      
      const newTab = window.confirm('Open in new tab?');
      onButtonInsert(text, url, newTab);
    }
  };

  const openModal = () => {
    try {
      setIsModalOpen(true);
    } catch (error) {
      // Immediate fallback if modal fails to open
      const text = window.prompt('Enter button text:');
      if (!text) return;
      
      const url = window.prompt('Enter button URL:');
      if (!url) return;
      
      const newTab = window.confirm('Open in new tab?');
      onButtonInsert(text, url, newTab);
    }
  };

  return (
    <>
      <div className={`fixed right-4 top-1/2 -translate-y-1/2 z-50 transition-all duration-300 ${
        isCollapsed ? 'translate-x-[calc(100%-60px)]' : 'translate-x-0'
      }`}>
        <Card className="shadow-lg border-primary/20 bg-background/95 backdrop-blur">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center justify-between text-sm">
              {!isCollapsed && (
                <span className="flex items-center gap-2">
                  <MousePointer className="w-4 h-4" />
                  Insert CTA
                </span>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="p-1 h-6 w-6"
              >
                {isCollapsed ? (
                  <ChevronLeft className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </Button>
            </CardTitle>
          </CardHeader>
          
          {!isCollapsed && (
            <CardContent className="pt-0">
              <Button 
                onClick={openModal}
                className="w-full"
                size="sm"
              >
                <MousePointer className="w-4 h-4 mr-2" />
                Add Button
              </Button>
            </CardContent>
          )}
        </Card>
      </div>

      <ButtonInsertModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onInsert={handleInsertButton}
      />
    </>
  );
};

export default FloatingCTAPanel;