export const haptic = (pattern: number | number[] = 10) => {
  if (typeof window !== 'undefined' && 'vibrate' in navigator) {
    try {
      // Use small vibration for tap feedback; array supports patterns
      (navigator as any).vibrate?.(pattern);
    } catch {}
  }
};

export const hapticSuccess = () => haptic([10, 20, 10]);
export const hapticWarning = () => haptic([30]);
