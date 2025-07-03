import { useState } from 'react';
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';

interface VoiceControlsProps {
  onTranscript: (text: string) => void;
  disabled?: boolean;
}

export const VoiceControls = ({ onTranscript, disabled }: VoiceControlsProps) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const { toast } = useToast();

  const speechRecognition = useSpeechRecognition({
    onResult: ({ transcript }) => {
      onTranscript(transcript);
    },
    onError: (error) => {
      toast({
        title: "Speech Recognition Error",
        description: "Could not recognize speech. Please try again.",
        variant: "destructive"
      });
    }
  });

  const handleVoiceToggle = () => {
    if (!speechRecognition.isSupported) {
      const isSecureContext = window.location.protocol === 'https:' || 
                             window.location.hostname === 'localhost' ||
                             window.location.hostname === '127.0.0.1';
      
      let errorDescription = "Speech recognition is not available in your browser.";
      
      if (!isSecureContext) {
        errorDescription = "Speech recognition requires HTTPS. Please use a secure connection.";
      } else if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
        errorDescription = "Your browser doesn't support speech recognition. Try Chrome, Edge, or Safari.";
      }
      
      toast({
        title: "Voice Not Supported",
        description: errorDescription,
        variant: "destructive"
      });
      return;
    }

    speechRecognition.toggleListening();
  };

  const handleSpeak = (text: string) => {
    if ('speechSynthesis' in window) {
      if (isSpeaking) {
        speechSynthesis.cancel();
        setIsSpeaking(false);
        return;
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      
      speechSynthesis.speak(utterance);
    } else {
      toast({
        title: "Speech Not Supported",
        description: "Text-to-speech is not available in your browser.",
        variant: "destructive"
      });
    }
  };

  return {
    MicButton: (
      <Button
        variant="ghost"
        size="sm"
        className={`h-8 w-8 ${speechRecognition.isListening ? 'text-red-500' : ''}`}
        onClick={handleVoiceToggle}
        disabled={disabled}
      >
        {speechRecognition.isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
      </Button>
    ),
    SpeakButton: ({ text }: { text: string }) => (
      <Button
        variant="ghost"
        size="sm"
        className="mt-2 h-6 p-1"
        onClick={() => handleSpeak(text)}
      >
        {isSpeaking ? (
          <VolumeX className="h-3 w-3" />
        ) : (
          <Volume2 className="h-3 w-3" />
        )}
      </Button>
    )
  };
};