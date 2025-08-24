import { useState, useRef, useCallback, useEffect } from 'react';

// Speech recognition types
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
}

interface SpeechRecognitionStatic {
  new (): SpeechRecognition;
}

// Extend window interface for speech recognition
declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionStatic;
    webkitSpeechRecognition?: SpeechRecognitionStatic;
  }
}

interface SpeechRecognitionResult {
  transcript: string;
  confidence: number;
}

interface UseSpeechRecognitionOptions {
  onResult?: (result: SpeechRecognitionResult) => void;
  onError?: (error: string) => void;
  continuous?: boolean;
  interimResults?: boolean;
  lang?: string;
}

export const useSpeechRecognition = (options: UseSpeechRecognitionOptions = {}) => {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const [initialized, setInitialized] = useState(false);

  // Check support on mount and when options change
  const checkSupport = useCallback(() => {
    if (typeof window === 'undefined') {
      setIsSupported(false);
      return false;
    }

    // Check for HTTPS or localhost (required for speech recognition)
    const isSecureContext = window.location.protocol === 'https:' || 
                           window.location.hostname === 'localhost' ||
                           window.location.hostname === '127.0.0.1';

    if (!isSecureContext) {
      console.warn('Speech recognition requires HTTPS or localhost');
      setIsSupported(false);
      return false;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      setIsSupported(false);
      return false;
    }

    setIsSupported(true);
    return true;
  }, []);

  const initializeRecognition = useCallback(() => {
    if (!checkSupport()) return false;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = options.continuous ?? true;
      recognition.interimResults = options.interimResults ?? false;
      recognition.lang = options.lang ?? 'en-US';

      recognition.onresult = (event) => {
        const last = event.results.length - 1;
        const transcript = event.results[last][0].transcript;
        const confidence = event.results[last][0].confidence;
        
        options.onResult?.({ transcript, confidence });
      };

      recognition.onerror = (event) => {
        setIsListening(false);
        
        // Handle different error types appropriately
        switch (event.error) {
          case 'no-speech':
            // This is normal - user just wasn't speaking, don't show error
            if (import.meta.env.DEV) console.log('No speech detected, continuing to listen...');
            break;
          case 'aborted':
            // User manually stopped, don't show error
            if (import.meta.env.DEV) console.log('Speech recognition aborted by user');
            break;
          case 'audio-capture':
            console.error('Microphone access error:', event.error);
            options.onError?.('microphone-access');
            break;
          case 'not-allowed':
            console.error('Microphone permission denied:', event.error);
            options.onError?.('permission-denied');
            break;
          case 'network':
            console.error('Network error during speech recognition:', event.error);
            options.onError?.('network-error');
            break;
          default:
            console.error('Speech recognition error:', event.error);
            options.onError?.(event.error);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
        // Additional cleanup can be handled by the component using this hook
      };

      recognitionRef.current = recognition;
      setInitialized(true);
      return true;
    } catch (error) {
      console.error('Failed to initialize speech recognition:', error);
      setIsSupported(false);
      return false;
    }
  }, [options, checkSupport]);

  // Initialize on mount
  useEffect(() => {
    checkSupport();
  }, [checkSupport]);

  const startListening = useCallback(() => {
    if (!recognitionRef.current && !initializeRecognition()) {
      options.onError?.('Speech recognition not supported');
      return;
    }

    if (recognitionRef.current && !isListening) {
      recognitionRef.current.start();
      setIsListening(true);
    }
  }, [isListening, initializeRecognition, options]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  }, [isListening]);

  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isListening, startListening, stopListening]);

  return {
    isListening,
    isSupported,
    startListening,
    stopListening,
    toggleListening,
  };
};