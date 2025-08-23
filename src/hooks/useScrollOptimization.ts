import { useEffect, useCallback, useRef } from 'react';
import { throttle, rafThrottle } from '@/utils/performanceUtils';

interface ScrollOptimizationOptions {
  throttleMs?: number;
  useRAF?: boolean;
  passive?: boolean;
}

export const useScrollOptimization = (
  callback: (event: Event) => void,
  options: ScrollOptimizationOptions = {}
) => {
  const {
    throttleMs = 16,
    useRAF = true,
    passive = true
  } = options;

  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  const optimizedCallback = useCallback(
    useRAF 
      ? rafThrottle((event: Event) => callbackRef.current(event))
      : throttle((event: Event) => callbackRef.current(event), throttleMs),
    [useRAF, throttleMs]
  );

  useEffect(() => {
    const eventOptions: AddEventListenerOptions = { passive };
    
    window.addEventListener('scroll', optimizedCallback, eventOptions);
    
    return () => {
      window.removeEventListener('scroll', optimizedCallback, eventOptions);
    };
  }, [optimizedCallback, passive]);
};

export const useResizeOptimization = (
  callback: (event: Event) => void,
  options: ScrollOptimizationOptions = {}
) => {
  const {
    throttleMs = 100,
    useRAF = true,
    passive = true
  } = options;

  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  const optimizedCallback = useCallback(
    useRAF 
      ? rafThrottle((event: Event) => callbackRef.current(event))
      : throttle((event: Event) => callbackRef.current(event), throttleMs),
    [useRAF, throttleMs]
  );

  useEffect(() => {
    const eventOptions: AddEventListenerOptions = { passive };
    
    window.addEventListener('resize', optimizedCallback, eventOptions);
    
    return () => {
      window.removeEventListener('resize', optimizedCallback, eventOptions);
    };
  }, [optimizedCallback, passive]);
};