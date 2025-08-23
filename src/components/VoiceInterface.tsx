import { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { RealtimeChat } from '@/utils/RealtimeAudio';
import type { VoiceMessage } from '@/types';
import type { FormattedRecipe } from '@/types/recipe-workspace';

interface VoiceInterfaceProps {
  onSpeakingChange: (speaking: boolean) => void;
  onMessage?: (message: VoiceMessage | string) => void;
  recipeContext?: FormattedRecipe;
}


export const VoiceInterface = ({ onSpeakingChange, onMessage, recipeContext }: VoiceInterfaceProps) => {
  const { toast } = useToast();
  const isOnline = useNetworkStatus();
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const chatRef = useRef<RealtimeChat | null>(null);

  const handleMessage = (message: VoiceMessage | string) => {
    console.log('Voice interface received message:', message);
    onMessage?.(message);
  };

  const startConversation = async () => {
    setIsLoading(true);
    try {
      console.log('🎤 Starting voice conversation...');
      
      // Request microphone permission first
      await navigator.mediaDevices.getUserMedia({ audio: true });
      console.log('🎤 Microphone access granted');
      
      // Create and start the realtime chat
      chatRef.current = new RealtimeChat(handleMessage, onSpeakingChange);
      await chatRef.current.init();
      
      // Force audio context resume with user interaction
      const testAudio = new AudioContext();
      if (testAudio.state === 'suspended') {
        await testAudio.resume();
        console.log('🔊 Audio context resumed after user interaction');
      }
      await testAudio.close();
      
      setIsConnected(true);
      
      console.log('✅ Voice conversation ready');
      toast({
        title: "Connected!",
        description: "Baker's Buddy is ready to chat. Start speaking!",
      });

      // Send recipe context if available
      if (recipeContext) {
        setTimeout(() => {
          chatRef.current?.sendMessage(`I'm looking at this recipe: ${recipeContext.title}. ${recipeContext.ingredients ? 'Ingredients: ' + JSON.stringify(recipeContext.ingredients) : ''}`);
        }, 1000);
      }
    } catch (error) {
      console.error('Error starting conversation:', error);
      toast({
        title: "Connection Error",
        description: error instanceof Error ? error.message : 'Failed to start voice conversation',
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const endConversation = () => {
    chatRef.current?.disconnect();
    setIsConnected(false);
    onSpeakingChange(false);
    
    toast({
      title: "Disconnected",
      description: "Voice conversation ended",
    });
  };

  useEffect(() => {
    return () => {
      chatRef.current?.disconnect();
    };
  }, []);

  if (!isConnected) {
    return (
      <div className="fixed right-4 bottom-4 z-50">
        <Button
          onClick={startConversation}
          disabled={isLoading || !isOnline}
          variant="hero"
          size="lg"
          className="rounded-full shadow-warm h-16 w-16"
          aria-label={isLoading ? "Connecting to voice assistant" : "Start voice conversation with Baker's Buddy"}
        >
          {isLoading ? (
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white" aria-hidden="true"></div>
          ) : (
            <Mic className="h-6 w-6" aria-hidden="true" />
          )}
        </Button>
        <div className="text-center mt-2 text-xs text-muted-foreground">
          {isOnline ? "Talk to Baker's Buddy" : "Voice disabled offline"}
        </div>
      </div>
    );
  }

  return (
    <div className="fixed right-4 bottom-4 z-50 flex flex-col items-center gap-2">
      <div className="bg-primary text-primary-foreground p-3 rounded-full shadow-warm" aria-label="Voice conversation active">
        <Volume2 className="h-6 w-6 animate-pulse" aria-hidden="true" />
      </div>
      <Button
        onClick={endConversation}
        variant="outline"
        size="sm"
        className="text-xs"
        aria-label="End voice conversation"
      >
        End Chat
      </Button>
    </div>
  );
};