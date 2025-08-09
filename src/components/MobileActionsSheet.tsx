import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Share2, BookmarkPlus, BookOpenText, ExternalLink } from 'lucide-react';
import React from 'react';

interface MobileActionsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaveOffline: () => void;
  onShare: () => void;
  onOpenDetails: () => void;
  onOpenCookingMode: () => void;
}

export const MobileActionsSheet: React.FC<MobileActionsSheetProps> = ({
  open,
  onOpenChange,
  onSaveOffline,
  onShare,
  onOpenDetails,
  onOpenCookingMode,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden rounded-t-2xl sm:rounded-2xl sm:bottom-auto bottom-0 sm:translate-y-0 translate-y-0">
        <div className="p-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Button variant="secondary" className="h-14 gap-2" onClick={onSaveOffline}>
              <BookmarkPlus className="w-5 h-5" /> Save for Offline
            </Button>
            <Button variant="secondary" className="h-14 gap-2" onClick={onShare}>
              <Share2 className="w-5 h-5" /> Share
            </Button>
            <Button variant="outline" className="h-14 gap-2" onClick={onOpenDetails}>
              <ExternalLink className="w-5 h-5" /> Open Details
            </Button>
            <Button variant="hero" className="h-14 gap-2" onClick={onOpenCookingMode}>
              <BookOpenText className="w-5 h-5" /> Cooking Mode
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
