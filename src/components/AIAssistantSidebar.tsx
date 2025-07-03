import { useState, useRef, useEffect } from 'react';
import { Send, Mic, MicOff, Volume2, VolumeX, MessageCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface AIAssistantSidebarProps {
  recipeContext?: any;
  isOpen: boolean;
  onToggle: () => void;
}

type AssistantMode = 'general' | 'tips' | 'substitutions' | 'scaling' | 'troubleshooting';

export const AIAssistantSidebar = ({ recipeContext, isOpen, onToggle }: AIAssistantSidebarProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<AssistantMode>('general');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Initialize speech recognition using custom hook
  const speechRecognition = useSpeechRecognition({
    onResult: ({ transcript }) => {
      setInput(transcript);
    },
    onError: (error) => {
      toast({
        title: "Speech Recognition Error",
        description: "Could not recognize speech. Please try again.",
        variant: "destructive"
      });
    }
  });

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const getModeSystemMessage = (mode: AssistantMode) => {
    const baseMessage = "You are Baker's Helper, an expert baking assistant. Provide helpful, practical advice about baking.";
    
    switch (mode) {
      case 'tips':
        return baseMessage + " Focus on providing useful tips and techniques to improve baking results.";
      case 'substitutions':
        return baseMessage + " Focus on ingredient substitutions and alternatives for baking recipes.";
      case 'scaling':
        return baseMessage + " Focus on helping scale recipes up or down and adjusting baking times/temperatures.";
      case 'troubleshooting':
        return baseMessage + " Focus on diagnosing and solving common baking problems and issues.";
      default:
        return baseMessage + " Answer any baking-related questions with expertise and enthusiasm.";
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('bakers-helper', {
        body: {
          message: userMessage.content,
          recipeContext,
          mode,
          systemMessage: getModeSystemMessage(mode)
        }
      });

      if (error) throw error;

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error calling AI assistant:', error);
      toast({
        title: "Error",
        description: "Failed to get response from Baker's Helper. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isOpen) {
    return (
      <div className="fixed right-4 top-1/2 -translate-y-1/2 z-50">
        <Button
          onClick={onToggle}
          variant="hero"
          size="lg"
          className="rounded-full shadow-warm"
        >
          <MessageCircle className="h-5 w-5" />
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed right-0 top-0 h-full w-96 bg-background border-l border-border shadow-warm z-40">
      <Card className="h-full rounded-none border-0">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-primary flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              Baker's Helper
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onToggle}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <Select value={mode} onValueChange={(value: AssistantMode) => setMode(value)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select assistance mode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="general">General Help</SelectItem>
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
        </CardHeader>

        <CardContent className="flex flex-col h-[calc(100%-140px)] p-4">
          <ScrollArea className="flex-1 pr-4" ref={scrollAreaRef}>
            <div className="space-y-4">
              {messages.length === 0 && (
                <div className="text-center text-muted-foreground py-8">
                  <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Hello! I'm Baker's Helper. Ask me anything about baking!</p>
                  {recipeContext && (
                    <p className="text-sm mt-2">I can see your current recipe and provide specific advice.</p>
                  )}
                </div>
              )}
              
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    {message.role === 'assistant' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="mt-2 h-6 p-1"
                        onClick={() => handleSpeak(message.content)}
                      >
                        {isSpeaking ? (
                          <VolumeX className="h-3 w-3" />
                        ) : (
                          <Volume2 className="h-3 w-3" />
                        )}
                      </Button>
                    )}
                  </div>
                </div>
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

          <div className="flex gap-2 mt-4">
            <div className="flex-1 relative">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about baking..."
                disabled={isLoading}
                className="pr-12"
              />
              <Button
                variant="ghost"
                size="sm"
                className={`absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 ${
                  speechRecognition.isListening ? 'text-red-500' : ''
                }`}
                onClick={handleVoiceToggle}
                disabled={isLoading}
              >
                {speechRecognition.isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              </Button>
            </div>
            <Button 
              onClick={handleSend} 
              disabled={!input.trim() || isLoading}
              variant="hero"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};