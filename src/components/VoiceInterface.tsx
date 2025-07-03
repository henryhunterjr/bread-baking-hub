import { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { RealtimeChat } from '@/utils/RealtimeAudio';

interface VoiceInterfaceProps {
  onSpeakingChange: (speaking: boolean) => void;
  onMessage?: (message: any) => void;
  recipeContext?: any;
}

export const VoiceInterface = ({ onSpeakingChange, onMessage, recipeContext }: VoiceInterfaceProps) => {
  const { toast } = useToast();
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const chatRef = useRef<RealtimeChat | null>(null);

  const handleMessage = (message: any) => {
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
      <div className="fixed right-4 top-1/2 -translate-y-1/2 z-50">
        <Button
          onClick={startConversation}
          disabled={isLoading}
          variant="hero"
          size="lg"
          className="rounded-full shadow-warm h-16 w-16"
        >
          {isLoading ? (
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
          ) : (
            <Mic className="h-6 w-6" />
          )}
        </Button>
        <div className="text-center mt-2 text-xs text-muted-foreground">
          Talk to Baker's Buddy
        </div>
      </div>
    );
  }

  return (
    <div className="fixed right-4 top-1/2 -translate-y-1/2 z-50 flex flex-col items-center gap-2">
      <div className="bg-primary text-primary-foreground p-3 rounded-full shadow-warm">
        <Volume2 className="h-6 w-6 animate-pulse" />
      </div>
      <Button
        onClick={endConversation}
        variant="outline"
        size="sm"
        className="text-xs"
      >
        End Chat
      </Button>
    </div>
  );
};