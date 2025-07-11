import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { MousePointer, ExternalLink } from 'lucide-react';

interface ButtonInsertModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsert: (buttonText: string, buttonUrl: string, openInNewTab: boolean) => void;
}

const ButtonInsertModal = ({ isOpen, onClose, onInsert }: ButtonInsertModalProps) => {
  const [buttonText, setButtonText] = useState('');
  const [buttonUrl, setButtonUrl] = useState('');
  const [openInNewTab, setOpenInNewTab] = useState(true);

  useEffect(() => {
    if (isOpen) {
      // Reset form when modal opens
      setButtonText('');
      setButtonUrl('');
      setOpenInNewTab(true);
    }
  }, [isOpen]);

  const handleInsert = () => {
    console.log('Button Text:', buttonText, 'Button URL:', buttonUrl);
    console.log('Validation:', { 
      textValid: !!buttonText.trim(), 
      urlValid: !!buttonUrl.trim(),
      canInsert: !!(buttonText.trim() && buttonUrl.trim())
    });
    
    if (buttonText.trim() && buttonUrl.trim()) {
      onInsert(buttonText.trim(), buttonUrl.trim(), openInNewTab);
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && buttonText.trim() && buttonUrl.trim()) {
      handleInsert();
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MousePointer className="w-5 h-5" />
            Insert CTA Button
          </DialogTitle>
          <DialogDescription>
            Create a call-to-action button that will be inserted into your content at the cursor position.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="button-text">Button Text</Label>
            <Input
              id="button-text"
              value={buttonText}
              onChange={(e) => setButtonText(e.target.value)}
              placeholder="Shop Wire Monkey Tools"
              onKeyDown={handleKeyDown}
              autoFocus
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="button-url">Button URL</Label>
            <Input
              id="button-url"
              value={buttonUrl}
              onChange={(e) => setButtonUrl(e.target.value)}
              placeholder="https://wiremonkeyshop.com/?ref=bakinggreatbread"
              onKeyDown={handleKeyDown}
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox
              id="new-tab"
              checked={openInNewTab}
              onCheckedChange={(checked) => setOpenInNewTab(checked as boolean)}
            />
            <Label htmlFor="new-tab" className="flex items-center gap-2 text-sm font-normal">
              <ExternalLink className="w-4 h-4" />
              Open in new tab
            </Label>
          </div>
          
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              onClick={handleInsert} 
              disabled={!buttonText.trim() || !buttonUrl.trim()}
              className="bg-primary hover:bg-primary/90"
            >
              Insert Button
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ButtonInsertModal;