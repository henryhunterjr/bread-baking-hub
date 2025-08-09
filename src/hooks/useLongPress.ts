import { useCallback, useRef } from 'react';

interface UseLongPressOptions {
  onLongPress: () => void;
  onClick?: () => void;
  threshold?: number; // ms
}

// Cross-platform long-press hook (touch + mouse)
export const useLongPress = ({ onLongPress, onClick, threshold = 450 }: UseLongPressOptions) => {
  const timerRef = useRef<number | null>(null);
  const longPressedRef = useRef(false);

  const start = useCallback(() => {
    longPressedRef.current = false;
    if (timerRef.current) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => {
      longPressedRef.current = true;
      onLongPress();
    }, threshold);
  }, [onLongPress, threshold]);

  const clear = useCallback(
    (triggerClick: boolean) => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      if (triggerClick && !longPressedRef.current) {
        onClick?.();
      }
    },
    [onClick]
  );

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button !== 0) return; // only left click
    start();
  }, [start]);

  const onMouseUp = useCallback(() => clear(true), [clear]);
  const onMouseLeave = useCallback(() => clear(false), [clear]);

  const onTouchStart = useCallback(() => start(), [start]);
  const onTouchEnd = useCallback(() => clear(true), [clear]);
  const onTouchMove = useCallback(() => clear(false), [clear]);

  return {
    onMouseDown,
    onMouseUp,
    onMouseLeave,
    onTouchStart,
    onTouchEnd,
    onTouchMove,
  } as const;
};
