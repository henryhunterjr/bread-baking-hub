import { useEffect, useMemo, useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { haptic } from '@/utils/haptics';

interface CookingModeProps {
  title: string;
  steps: string[];
}

const CookingMode = ({ title, steps }: CookingModeProps) => {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const [wakeLock, setWakeLock] = useState<any>(null);

  const safeSteps = useMemo(() => steps?.filter(Boolean) || [], [steps]);

  useEffect(() => {
    const enableWakeLock = async () => {
      try {
        // @ts-ignore
        const lock = await navigator.wakeLock?.request?.('screen');
        setWakeLock(lock);
      } catch {}
    };
    if (open) enableWakeLock();
    return () => wakeLock?.release?.();
  }, [open]);

  const next = () => {
    haptic();
    setIndex((i) => Math.min(i + 1, safeSteps.length - 1));
  };
  const prev = () => {
    haptic();
    setIndex((i) => Math.max(i - 1, 0));
  };

  return (
    <>
      <Button variant="hero" size="sm" onClick={() => setOpen(true)} className="print:hidden">
        Start Cooking Mode
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl h-[90vh] flex flex-col">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">{title}</h2>
            <span className="text-sm text-muted-foreground">Step {index + 1} of {safeSteps.length}</span>
          </div>
          <div className="flex-1 mt-4 overflow-auto">
            <p className="text-2xl leading-relaxed">{safeSteps[index]}</p>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <Button onClick={prev} variant="outline" className="h-14 text-lg" disabled={index === 0}>
              Previous
            </Button>
            <Button onClick={next} variant="hero" className="h-14 text-lg" disabled={index === safeSteps.length - 1}>
              Next
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CookingMode;
