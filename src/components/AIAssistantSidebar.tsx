import { useState, useRef, useEffect } from 'react';
import { Send, MessageCircle, X, Mic, MicOff, Play, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useIsMobile } from '@/hooks/use-mobile';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { useAIChat } from '@/hooks/useAIChat';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';
import { useToast } from '@/hooks/use-toast';
import { ChatMessage } from './ChatMessage';
import { SafeImage } from '@/components/ui/SafeImage';

import { ResponsiveImage } from '@/components/ResponsiveImage';

interface AIAssistantSidebarProps {
  recipeContext?: any;
  isOpen: boolean;
  onToggle: () => void;
}

type AssistantMode = 'general' | 'tips' | 'substitutions' | 'scaling' | 'troubleshooting' | 'concierge';

export const AIAssistantSidebar = ({ recipeContext, isOpen, onToggle }: AIAssistantSidebarProps) => {
  const isMobile = useIsMobile();
  const isOnline = useNetworkStatus();
  const [input, setInput] = useState('');
  const [micEnabled, setMicEnabled] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [timeoutWarning, setTimeoutWarning] = useState(false);
  const [speechEnabled, setSpeechEnabled] = useState(true);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const warningTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastSpokenMessageRef = useRef<string | null>(null);
  const hasSpokenGreetingRef = useRef<boolean>(false);
  const { toast } = useToast();
  
  const { messages, isLoading, mode, setMode, sendMessage } = useAIChat({ recipeContext });
  const { speak, stop, isPlaying, showPlayButton, playPending } = useTextToSpeech();

  const speechRecognition = useSpeechRecognition({
    continuous: true,
    onResult: ({ transcript }) => {
      if (micEnabled) {
        setInput(transcript);
        // Auto-send in voice mode
        handleSend(transcript);
      } else {
        setInput(transcript);
      }
      clearTimeouts();
    },
    onError: (error) => {
      setIsListening(false);
      setMicEnabled(false);
      clearTimeouts();
      
      // Handle different error types with appropriate messages
      switch (error) {
        case 'microphone-access':
          toast({
            title: "Microphone Error",
            description: "Could not access microphone. Please check permissions.",
            variant: "destructive"
          });
          break;
        case 'permission-denied':
          toast({
            title: "Microphone Permission",
            description: "Microphone permission denied. Please allow access and try again.",
            variant: "destructive"
          });
          break;
        case 'network-error':
          toast({
            title: "Network Error", 
            description: "Speech recognition service unavailable. Check your connection.",
            variant: "destructive"
          });
          break;
        default:
          // Only show generic error for unexpected issues
          if (error && error !== 'no-speech' && error !== 'aborted') {
            toast({
              title: "Speech Recognition Error",
              description: "Could not recognize speech. Please try again.",
              variant: "destructive"
            });
          }
      }
    }
  });

  const clearTimeouts = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (warningTimeoutRef.current) {
      clearTimeout(warningTimeoutRef.current);
      warningTimeoutRef.current = null;
    }
    setTimeoutWarning(false);
  };

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  // Auto-play Krusty's responses and initial greeting
  useEffect(() => {
    if (!isOpen || !speechEnabled) {
      // Stop any current speech when sidebar closes or speech is disabled
      stop();
      return;
    }
    
    // Send initial greeting only once when sidebar opens for the first time
    if (messages.length === 0 && speechEnabled && !hasSpokenGreetingRef.current) {
      hasSpokenGreetingRef.current = true;
      setTimeout(() => {
        const greeting = "Hey there! I'm Krusty, your baking buddy! I'm speaking to you right now, but if you'd prefer to just read my responses, you can click the little speaker icon at the top of this chat to turn off my voice. Now, what can I help you bake today?";
        speak(greeting);
      }, 500);
      return; // Don't process other messages during greeting
    }
    
    const lastMessage = messages[messages.length - 1];
    if (lastMessage && 
        lastMessage.role === 'assistant' && 
        !isLoading && 
        lastMessage.id !== lastSpokenMessageRef.current) {
      lastSpokenMessageRef.current = lastMessage.id;
      speak(lastMessage.content);
    }
  }, [messages, isLoading, isOpen, speechEnabled, speak, stop]);

  // Monitor speech recognition state and cleanup when it stops
  useEffect(() => {
    if (!speechRecognition.isListening && micEnabled) {
      // Speech recognition ended, cleanup mic state
      setMicEnabled(false);
      setIsListening(false);
      clearTimeouts();
    }
  }, [speechRecognition.isListening, micEnabled]);

  const handleSend = async (message?: string) => {
    const textToSend = message || input;
    if (!textToSend.trim() || isLoading || !isOnline) return;
    
    await sendMessage(textToSend);
    setInput('');
  };

  const toggleMic = async () => {
    if (!speechRecognition.isSupported) {
      toast({
        title: "Voice Not Supported",
        description: "Speech recognition requires HTTPS and a supported browser.",
        variant: "destructive"
      });
      return;
    }

    try {
      if (!micEnabled) {
        // Request permission first
        await navigator.mediaDevices.getUserMedia({ audio: true });
        setMicEnabled(true);
        setIsListening(true);
        speechRecognition.startListening();
        
        // Set warning timeout (7 seconds)
        warningTimeoutRef.current = setTimeout(() => {
          setTimeoutWarning(true);
        }, 7000);
        
        // Set full timeout (15 seconds)
        timeoutRef.current = setTimeout(() => {
          setIsListening(false);
          setMicEnabled(false);
          speechRecognition.stopListening();
          clearTimeouts();
          toast({
            title: "Speech Timeout",
            description: "Mic turned off after 15 seconds of silence.",
          });
        }, 15000);
        
      } else {
        setMicEnabled(false);
        setIsListening(false);
        speechRecognition.stopListening();
        clearTimeouts();
      }
    } catch (error) {
      toast({
        title: "Microphone Error",
        description: "Could not access microphone. Please check permissions.",
        variant: "destructive"
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isOpen) {
    return (
      <div className="fixed right-4 bottom-4 z-50" style={{ paddingBottom: 'env(safe-area-inset-bottom)', paddingRight: 'env(safe-area-inset-right)' }}>
        <div 
          onClick={onToggle}
          className="relative w-20 h-20 cursor-pointer transform transition-transform duration-200 hover:scale-105 touch-manipulation"
        >
          {/* Circular window frame */}
          <div className="absolute inset-0 rounded-full border-4 border-primary bg-background shadow-warm"></div>
          
          {/* Avatar image */}
          <ResponsiveImage 
            src="/lovable-uploads/976b4e22-6b7f-44b0-bfc3-7643ff24b2bd.png"
            alt="👨🏽‍🍳 Krusty | Baking Guide"
            className="w-full h-full rounded-full object-cover relative z-10"
            loading="lazy"
          />
          
          {/* Enhanced fallback content */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center z-5 shadow-lg">
            <div className="text-center">
              <div className="text-2xl mb-1">👨🏽‍🍳</div>
              <div className="text-xs font-medium text-primary-foreground/90">Krusty</div>
            </div>
          </div>
          
          {/* Subtle glow effect */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-200 z-20"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`fixed ${isMobile ? 'inset-0' : 'right-0 top-0'} ${isMobile ? 'w-full h-full' : 'h-full w-96'} bg-background ${isMobile ? '' : 'border-l border-border'} shadow-warm z-50`}>
      <Card className="h-full rounded-none border-0">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Avatar in top-left */}
              <div className={`relative w-12 h-12 transition-all duration-300 ${(isListening || isPlaying) ? 'shadow-lg shadow-primary/30' : ''}`}>
                <SafeImage
                  src="/lovable-uploads/976b4e22-6b7f-44b0-bfc3-7643ff24b2bd.png"
                  alt="👨🏽‍🍳 Krusty"
                  width={48}
                  height={48}
                  fit="cover"
                  className={`rounded-full border-2 border-primary/30 transition-all duration-300 ${
                    (isListening || isPlaying) ? 'ring-2 ring-primary ring-opacity-50 animate-pulse' : ''
                  }`}
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    const fallback = document.createElement('div');
                    fallback.className = `w-full h-full rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white text-lg font-bold shadow-lg border-2 border-primary/30 transition-all duration-300 ${
                      (isListening || isPlaying) ? 'ring-2 ring-primary ring-opacity-50 animate-pulse' : ''
                    }`;
                    fallback.innerHTML = '👨🏽‍🍳';
                    e.currentTarget.parentElement?.appendChild(fallback);
                  }}
                />
              </div>
              <div>
                <CardTitle className="text-primary text-lg">
                  👨🏽‍🍳 Krusty | Baking Guide
                </CardTitle>
                {(isListening || isPlaying) && (
                  <p className="text-xs text-muted-foreground">
                    {isListening ? '🎙️ Listening...' : '🗣️ Speaking...'}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  stop(); // Stop any current speech
                  setSpeechEnabled(!speechEnabled);
                }}
                className={`touch-manipulation ${speechEnabled ? 'text-primary' : 'text-muted-foreground'}`}
                title={speechEnabled ? "Turn off voice responses" : "Turn on voice responses"}
              >
                {speechEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => {
                  stop(); // Stop any current speech
                  onToggle();
                }}
                className="touch-manipulation"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <Select value={mode} onValueChange={(value: AssistantMode) => setMode(value)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select assistance mode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="general">General Help</SelectItem>
              <SelectItem value="concierge">Concierge (Site & Blog)</SelectItem>
              <SelectItem value="tips">Tips & Techniques</SelectItem>
              <SelectItem value="substitutions">Substitutions</SelectItem>
              <SelectItem value="scaling">Recipe Scaling</SelectItem>
              <SelectItem value="troubleshooting">Troubleshooting</SelectItem>
            </SelectContent>
          </Select>

          {recipeContext && (
            <Badge variant="secondary" className="text-xs">
              Using current recipe context
            </Badge>
          )}

          {showPlayButton && (
            <Button 
              onClick={playPending}
              variant="outline" 
              size="sm" 
              className="w-full text-xs bg-amber-50 border-amber-200 hover:bg-amber-100 dark:bg-amber-950 dark:border-amber-800 dark:hover:bg-amber-900"
            >
              <Play className="h-3 w-3 mr-1" />
              Tap to play Krusty's voice
            </Button>
          )}
        </CardHeader>

        <CardContent className="flex flex-col h-[calc(100%-140px)] p-4">
          <ScrollArea className="flex-1 pr-4" ref={scrollAreaRef}>
            <div className="space-y-4">
              {messages.length === 0 && (
                <div className="text-center text-muted-foreground py-8">
                  <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Hello! I'm KRUSTY, your expert baking assistant. Ask me anything about baking!</p>
                  <div className="text-xs text-muted-foreground mt-2 space-y-1">
                    <p>• Need help diagnosing your loaf?</p>
                    <p>• Looking for a recipe or tool?</p>
                    <p>• Want to explore what this site can do?</p>
                  </div>
                  {recipeContext && (
                    <p className="text-sm mt-2">I can see your current recipe and provide specific advice.</p>
                  )}
                </div>
              )}
              
              {messages.map((message) => (
                <ChatMessage key={message.id} message={message} onShowMore={() => handleSend('show more')} />
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-muted rounded-lg p-3 max-w-[80%]">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          <div className="flex gap-2 mt-4 relative z-10">
            <div className="flex-1 relative">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={
                  !isOnline ? "Offline - AI disabled" :
                  micEnabled ? "Voice mode active - speak now!" :
                  "Ask about baking..."
                }
                disabled={isLoading || !isOnline}
                className="pr-24 relative z-10"
              />
              <div className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center gap-1 z-20">
                {timeoutWarning && (
                  <span className="text-xs text-amber-600 animate-pulse mr-1">
                    Still listening...
                  </span>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  className={`h-8 w-8 transition-colors relative z-20 ${
                    micEnabled ? 'text-red-500 hover:text-red-600' : 'text-muted-foreground hover:text-foreground'
                  }`}
                  onClick={toggleMic}
                  disabled={isLoading || !isOnline}
                  title={
                    micEnabled ? "Mic is live - click to turn off" : "Click to talk to Krusty"
                  }
                >
                  {micEnabled ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            {!micEnabled && (
              <Button 
                onClick={() => handleSend()} 
                disabled={!input.trim() || isLoading || !isOnline}
                variant="hero"
                className="touch-manipulation relative z-20"
              >
                <Send className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};