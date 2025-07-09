import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export const useTextToSpeech = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  const speak = async (text: string) => {
    if (!text.trim()) return;

    try {
      // Stop any currently playing audio
      if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
      }

      setIsPlaying(true);

      // Call our ElevenLabs edge function
      const { data, error } = await supabase.functions.invoke('text-to-speech', {
        body: { text }
      });

      if (error) throw error;

      if (data.audioContent) {
        // Convert base64 to audio blob
        const audioBlob = new Blob(
          [Uint8Array.from(atob(data.audioContent), c => c.charCodeAt(0))],
          { type: 'audio/mpeg' }
        );
        
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        
        audio.onended = () => {
          setIsPlaying(false);
          setCurrentAudio(null);
          URL.revokeObjectURL(audioUrl);
        };

        audio.onerror = () => {
          setIsPlaying(false);
          setCurrentAudio(null);
          URL.revokeObjectURL(audioUrl);
          toast({
            title: "Audio Error",
            description: "Failed to play audio response",
            variant: "destructive"
          });
        };

        setCurrentAudio(audio);
        await audio.play();
      }
    } catch (error) {
      console.error('Text-to-speech error:', error);
      setIsPlaying(false);
      toast({
        title: "Voice Error",
        description: "Could not generate voice response. Please check your internet connection.",
        variant: "destructive"
      });
    }
  };

  const stop = () => {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      setCurrentAudio(null);
    }
    setIsPlaying(false);
  };

  return {
    speak,
    stop,
    isPlaying
  };
};