import { useEffect, useMemo, useRef, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { haptic } from '@/utils/haptics';

interface CookingModeProps {
  title: string;
  steps: string[];
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  autoVoice?: boolean; // voice on by default
}

const CookingMode = ({ title, steps, open: controlledOpen, onOpenChange, autoVoice = true }: CookingModeProps) => {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const open = controlledOpen ?? uncontrolledOpen;
  const setOpen = onOpenChange ?? setUncontrolledOpen;

  const [index, setIndex] = useState(0);
  const [wakeLock, setWakeLock] = useState<any>(null);
  const [voiceEnabled, setVoiceEnabled] = useState(autoVoice);

  const [timerRemaining, setTimerRemaining] = useState<number>(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const intervalRef = useRef<number | null>(null);

  const recognitionRef = useRef<any>(null);

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

  useEffect(() => {
    if (!open) return;
    // Timer ticking
    if (timerRunning && timerRemaining > 0) {
      intervalRef.current = window.setInterval(() => {
        setTimerRemaining((t) => Math.max(0, t - 1));
      }, 1000);
    }
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    };
  }, [timerRunning, timerRemaining, open]);

  useEffect(() => {
    if (!open) return;
    if (!voiceEnabled) return;
    const SR: any = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) return;
    const rec = new SR();
    rec.lang = 'en-US';
    rec.continuous = true;
    rec.interimResults = false;
    rec.onresult = (e: any) => {
      const last = e.results[e.results.length - 1];
      const transcript = String(last[0].transcript || '').toLowerCase().trim();
      if (!transcript) return;
      if (transcript.includes('next')) next();
      if (transcript.includes('previous') || transcript.includes('back')) prev();
      const timerMatch = transcript.match(/start (?:a )?timer (for )?(\d+)(?:\s*)(second|seconds|minute|minutes|min|mins)?/);
      if (timerMatch) {
        const n = parseInt(timerMatch[2], 10) || 0;
        const unit = timerMatch[3] || 'seconds';
        const seconds = /min/.test(unit) || /minute/.test(unit) ? n * 60 : n;
        startTimer(seconds);
      }
      if (transcript.includes('stop timer') || transcript.includes('cancel timer')) stopTimer();
    };
    rec.onerror = () => {
      // Try to restart on errors (mobile speech sometimes stops)
      try { rec.stop(); } catch {}
      try { rec.start(); } catch {}
    };
    try { rec.start(); } catch {}
    recognitionRef.current = rec;
    return () => {
      try { rec.stop(); } catch {}
      recognitionRef.current = null;
    };
  }, [open, voiceEnabled]);

  const startTimer = (seconds: number) => {
    if (!seconds) return;
    setTimerRemaining(seconds);
    setTimerRunning(true);
  };
  const stopTimer = () => {
    setTimerRunning(false);
    setTimerRemaining(0);
  };

  useEffect(() => {
    if (timerRemaining === 0 && timerRunning) {
      setTimerRunning(false);
      // haptic + alert when timer ends
      haptic();
      try { (window.navigator as any).vibrate?.(200); } catch {}
      // optional: simple sound
      const beep = new Audio(
        'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAESsAACJWAAACABAAZGF0YQAAAAA='
      );
      beep.play?.().catch(() => {});
    }
  }, [timerRemaining, timerRunning]);

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
      {!controlledOpen && (
        <Button variant="hero" size="sm" onClick={() => setOpen(true)} className="print:hidden">
          Start Cooking Mode
        </Button>
      )}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">{title}</DialogTitle>
            <DialogDescription className="sr-only">
              Interactive cooking mode with step-by-step instructions, timer controls, and voice guidance for {title}
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">Step {index + 1} of {safeSteps.length}</span>
              <Button variant={voiceEnabled ? 'hero' : 'outline'} size="sm" onClick={() => setVoiceEnabled((v) => !v)}>
                {voiceEnabled ? 'Voice: On' : 'Voice: Off'}
              </Button>
            </div>
          </div>
          <div className="flex-1 mt-4 overflow-auto">
            <p className="text-2xl leading-relaxed">{safeSteps[index]}</p>
          </div>

          {/* Timer Controls */}
          <div className="mt-2 p-3 rounded-lg bg-muted/50">
            <div className="flex items-center justify-between">
              <div className="text-lg font-semibold">Timer: {Math.floor(timerRemaining/60).toString().padStart(2,'0')}
                :{(timerRemaining%60).toString().padStart(2,'0')}</div>
              <div className="flex gap-2">
                {!timerRunning ? (
                  <>
                    <Button size="sm" variant="outline" onClick={() => startTimer(30)}>30s</Button>
                    <Button size="sm" variant="outline" onClick={() => startTimer(60)}>1m</Button>
                    <Button size="sm" variant="outline" onClick={() => startTimer(300)}>5m</Button>
                  </>
                ) : (
                  <Button size="sm" variant="destructive" onClick={stopTimer}>Stop</Button>
                )}
              </div>
            </div>
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
