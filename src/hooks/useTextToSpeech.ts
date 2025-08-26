import { useState, useCallback, useRef, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export const useTextToSpeech = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  const [showPlayButton, setShowPlayButton] = useState(false);
  const [pendingText, setPendingText] = useState<string | null>(null);
  const currentAudioUrlRef = useRef<string | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const { toast } = useToast();

  // Initialize AudioContext on first user interaction
  const initAudioContext = useCallback(() => {
    if (!audioContextRef.current && typeof window !== 'undefined') {
      try {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      } catch (error) {
        console.warn('AudioContext not supported:', error);
      }
    }
  }, []);

  // Resume AudioContext for mobile
  const resumeAudioContext = useCallback(async () => {
    if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
      try {
        await audioContextRef.current.resume();
      } catch (error) {
        console.warn('Failed to resume AudioContext:', error);
      }
    }
  }, []);

  // Cleanup effect
  useEffect(() => {
    return () => {
      if (currentAudioUrlRef.current) {
        URL.revokeObjectURL(currentAudioUrlRef.current);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  const speak = useCallback(async (text: string) => {
    if (!text.trim()) return;

    initAudioContext();

    try {
      // Stop any currently playing audio
      if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
      }

      setIsPlaying(true);
      setShowPlayButton(false);
      setPendingText(null);

      // Call our ElevenLabs edge function with user's custom voice
      const { data, error } = await supabase.functions.invoke('text-to-speech', {
        body: { 
          text,
          voiceId: 'wAGzRVkxKEs8La0lmdrE' // User's preferred custom voice
        }
      });

      if (error) throw error;

      if (data.audioContent) {
        // Revoke old audio URL to prevent memory leaks
        if (currentAudioUrlRef.current) {
          URL.revokeObjectURL(currentAudioUrlRef.current);
        }

        // Convert base64 to audio blob
        const audioBlob = new Blob(
          [Uint8Array.from(atob(data.audioContent), c => c.charCodeAt(0))],
          { type: 'audio/mpeg' }
        );
        
        const audioUrl = URL.createObjectURL(audioBlob);
        currentAudioUrlRef.current = audioUrl;
        const audio = new Audio(audioUrl);
        
        audio.onended = () => {
          setIsPlaying(false);
          setCurrentAudio(null);
          if (currentAudioUrlRef.current) {
            URL.revokeObjectURL(currentAudioUrlRef.current);
            currentAudioUrlRef.current = null;
          }
        };

        audio.onerror = () => {
          setIsPlaying(false);
          setCurrentAudio(null);
          if (currentAudioUrlRef.current) {
            URL.revokeObjectURL(currentAudioUrlRef.current);
            currentAudioUrlRef.current = null;
          }
          toast({
            title: "Audio Error",
            description: "Failed to play audio response",
            variant: "destructive"
          });
        };

        setCurrentAudio(audio);
        
        try {
          await resumeAudioContext();
          await audio.play();
        } catch (playError: any) {
          // Handle mobile autoplay restrictions
          if (playError.name === 'NotAllowedError') {
            setIsPlaying(false);
            setShowPlayButton(true);
            setPendingText(text);
            // Don't show toast immediately, show the play button instead
          } else {
            throw playError;
          }
        }
      }
    } catch (error) {
      console.error('Text-to-speech error:', error);
      setIsPlaying(false);
      toast({
        title: "Voice Error",
        description: "Could not generate voice response. Please try again.",
        variant: "destructive"
      });
    }
  }, [currentAudio, toast, initAudioContext, resumeAudioContext]);

  const playPending = useCallback(async () => {
    if (pendingText && currentAudio) {
      try {
        await resumeAudioContext();
        await currentAudio.play();
        setShowPlayButton(false);
        setIsPlaying(true);
      } catch (error) {
        toast({
          title: "Audio Error",
          description: "Could not play audio. Please try again.",
          variant: "destructive"
        });
      }
    }
  }, [pendingText, currentAudio, resumeAudioContext, toast]);

  const stop = () => {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      setCurrentAudio(null);
    }
    setIsPlaying(false);
    setShowPlayButton(false);
    setPendingText(null);
  };

  return {
    speak,
    stop,
    playPending,
    isPlaying,
    showPlayButton
  };
};